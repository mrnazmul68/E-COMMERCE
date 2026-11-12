import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import {
  CodeChallengeMethod,
  OAuth2Client,
  type Credentials,
} from "google-auth-library";
import { env } from "@config/env.js";
import { redis } from "@config/redis.js";
import { HTTP_STATUS } from "@shared/httpcode.js";
import { ApiError } from "@utils/apiError.js";
import type { GoogleProfile } from "@modules/auth/user/userAuth.types.js";

const GOOGLE_STATE_KEY_PREFIX = "oauth:google:state:";

export const GOOGLE_STATE_COOKIE_NAME = "google_oauth_state";
export const GOOGLE_STATE_COOKIE_PATH = "/api/v1/auth/google";
export const GOOGLE_STATE_TTL_SECONDS = 10 * 60;

const MAX_RETURN_TO_LENGTH = 500;

export type GoogleOAuthFailureReason =
  | "access_denied"
  | "state_invalid"
  | "email_unverified"
  | "account_conflict"
  | "account_blocked"
  | "google_auth_failed";

export class GoogleOAuthError extends ApiError {
  public readonly reason: GoogleOAuthFailureReason;

  constructor(
    reason: GoogleOAuthFailureReason,
    message: string,
    statusCode: number = HTTP_STATUS.BAD_REQUEST,
  ) {
    super(statusCode, message);
    this.reason = reason;
  }
}

interface GoogleOAuthState {
  codeVerifier: string;
  returnTo?: string;
}

//*oAuth client
const oauthClient = new OAuth2Client({
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: env.GOOGLE_CALLBACK_URL,
});

const safeEqual = (left: string, right: string): boolean => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
};

const isSafeReturnTo = (value: string): boolean =>
  value.length <= MAX_RETURN_TO_LENGTH &&
  value.startsWith("/") &&
  !value.startsWith("//") &&
  !value.startsWith("/auth/");

/*
 * Only allow same-site relative paths. This prevents the OAuth start endpoint
 * from becoming an open redirect.
 */
export const normalizeReturnTo = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();

  return isSafeReturnTo(trimmed) ? trimmed : undefined;
};

const isGoogleOAuthState = (value: unknown): value is GoogleOAuthState => {
  if (typeof value !== "object" || value === null) return false;

  return typeof (value as { codeVerifier?: unknown }).codeVerifier === "string";
};

const stateKey = (state: string): string => `${GOOGLE_STATE_KEY_PREFIX}${state}`;

//createGoogleAuthorizationUrl
export const createGoogleAuthorizationUrl = async (
  returnTo?: string,
): Promise<{ state: string; url: string }> => {
  const state = randomBytes(32).toString("hex");
  const { codeVerifier, codeChallenge } =
    await oauthClient.generateCodeVerifierAsync();

  /*
   * The library normally supplies an S256 challenge. Recompute it as a
   * fallback so PKCE is never silently downgraded.
   */
  const challenge =
    codeChallenge ??
    createHash("sha256").update(codeVerifier).digest("base64url");

  const stateData: GoogleOAuthState = {
    codeVerifier,
    ...(returnTo ? { returnTo } : {}),
  };

  await redis.set(stateKey(state), JSON.stringify(stateData), {
    ex: GOOGLE_STATE_TTL_SECONDS,
  });

  const url = oauthClient.generateAuthUrl({
    access_type: "online",
    scope: ["openid", "email", "profile"],
    state,
    prompt: "select_account",
    code_challenge: challenge,
    code_challenge_method: CodeChallengeMethod.S256,
  });

  return { state, url };
};

//consumeGoogleState
export const consumeGoogleState = async (
  stateFromQuery: string | undefined,
  stateFromCookie: string | undefined,
): Promise<GoogleOAuthState> => {
  if (
    !stateFromQuery ||
    !stateFromCookie ||
    !safeEqual(stateFromQuery, stateFromCookie)
  ) {
    throw new GoogleOAuthError(
      "state_invalid",
      "The Google sign-in request could not be verified",
    );
  }

  const key = stateKey(stateFromQuery);
  const stored = await redis.get<GoogleOAuthState | string>(key);

  // State is single use, even when parsing fails below.
  await redis.del(key);

  if (!stored) {
    throw new GoogleOAuthError(
      "state_invalid",
      "The Google sign-in request has expired",
    );
  }

  let stateData: unknown = stored;

  if (typeof stored === "string") {
    try {
      stateData = JSON.parse(stored);
    } catch {
      throw new GoogleOAuthError(
        "state_invalid",
        "The Google sign-in request is invalid",
      );
    }
  }

  if (!isGoogleOAuthState(stateData)) {
    throw new GoogleOAuthError(
      "state_invalid",
      "The Google sign-in request is invalid",
    );
  }

  return stateData;
};

export const exchangeGoogleCode = async (
  code: string,
  codeVerifier: string,
): Promise<GoogleProfile> => {
  let tokens: Credentials;

  try {
    const result = await oauthClient.getToken({
      code,
      codeVerifier,
      redirect_uri: env.GOOGLE_CALLBACK_URL,
    });

    tokens = result.tokens;
  } catch {
    throw new GoogleOAuthError(
      "google_auth_failed",
      "Google authorization code could not be exchanged",
    );
  }

  if (!tokens.id_token) {
    throw new GoogleOAuthError(
      "google_auth_failed",
      "Google did not return an identity token",
    );
  }

  try {
    const ticket = await oauthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      throw new GoogleOAuthError(
        "google_auth_failed",
        "Google did not return the required account information",
      );
    }

    if (payload.email_verified !== true) {
      throw new GoogleOAuthError(
        "email_unverified",
        "Your Google email address is not verified",
      );
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name?.trim() ?? "",
      ...(payload.picture ? { picture: payload.picture } : {}),
    };
  } catch (error) {
    if (error instanceof GoogleOAuthError) throw error;

    throw new GoogleOAuthError(
      "google_auth_failed",
      "Google identity could not be verified",
    );
  }
};

export const buildFrontendCallbackUrl = (
  params: Record<string, string | undefined>,
): string => {
  const base = env.FRONTEND_URL.replace(/\/+$/, "");
  const url = new URL(`${base}/auth/callback`);

  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  return url.toString();
};

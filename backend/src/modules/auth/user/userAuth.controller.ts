import { asyncHandler } from "@utils/asyncHandler.js";
import type { CookieOptions, Request, Response } from "express";
import { UserService } from "@modules/auth/user/userAuth.service.js";
import { ApiResponse } from "@utils/apiResponse.js";
import { HTTP_STATUS } from "@shared/httpcode.js";
import { ApiError } from "@utils/apiError.js";
import { env } from "@config/env.js";
import { logger } from "@utils/logger.js";
import {
  GOOGLE_STATE_COOKIE_NAME,
  GOOGLE_STATE_COOKIE_PATH,
  GOOGLE_STATE_TTL_SECONDS,
  GoogleOAuthError,
  buildFrontendCallbackUrl,
  consumeGoogleState,
  createGoogleAuthorizationUrl,
  exchangeGoogleCode,
  normalizeReturnTo,
  type GoogleOAuthFailureReason,
} from "@modules/auth/google/google.oauth.js";

const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_PATH = "/api/v1/auth";

//*Refresh cookie base options
const refreshCookieBaseOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.COOKIE_SAME_SITE,
  path: REFRESH_COOKIE_PATH,
  ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
};

//*Refresh cookie options
const refreshCookieOptions = (expiresAt: Date): CookieOptions => ({
  ...refreshCookieBaseOptions,
  maxAge: Math.max(0, expiresAt.getTime() - Date.now()),
});

//*User service
const userService = new UserService();

//*Get user ip and device information
const getSessionContext = (req: Request) => ({
  ip: req.ip,
  userAgent: req.get("user-agent"),
});

//*Set refresh token to cookie
const setRefreshCookie = (
  res: Response,
  token: string,
  expiresAt: Date,
): void => {
  res.cookie(REFRESH_COOKIE_NAME, token, refreshCookieOptions(expiresAt));
};

//*Clear refresh cookie
const clearRefreshCookie = (res: Response): void => {
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieBaseOptions);
};

/*
 * The OAuth state cookie is scoped to the Google endpoints and intentionally
 * uses SameSite=Lax. Google redirects back with a top-level GET, which Lax
 * allows while still blocking cross-site subrequests.
 */
const googleStateCookieBaseOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax",
  path: GOOGLE_STATE_COOKIE_PATH,
  ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
};

const googleStateCookieOptions = (): CookieOptions => ({
  ...googleStateCookieBaseOptions,
  maxAge: GOOGLE_STATE_TTL_SECONDS * 1000,
});

const clearGoogleStateCookie = (res: Response): void => {
  res.clearCookie(GOOGLE_STATE_COOKIE_NAME, googleStateCookieBaseOptions);
};

const googleFailureReason = (error: unknown): GoogleOAuthFailureReason => {
  if (error instanceof GoogleOAuthError) return error.reason;

  if (error instanceof ApiError) {
    if (error.statusCode === HTTP_STATUS.CONFLICT) return "account_conflict";
    if (error.statusCode === HTTP_STATUS.FORBIDDEN) return "account_blocked";
  }

  return "google_auth_failed";
};

//*No store
//Using this in router, so i can remove it if want
const noStore = (res: Response): void => {
  res.set("Cache-Control", "no-store");
};

//register User
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const { message } = await userService.register(
    { name, email, password },
    getSessionContext(req),
  );

  return new ApiResponse(HTTP_STATUS.CREATED, null, message).send(res);
});

//Start Google OAuth
export const googleStart = asyncHandler(async (req: Request, res: Response) => {
  const returnTo = normalizeReturnTo(req.query.returnTo);
  const { state, url } = await createGoogleAuthorizationUrl(returnTo);

  res.cookie(GOOGLE_STATE_COOKIE_NAME, state, googleStateCookieOptions());
  noStore(res);

  return res.redirect(url);
});

//Google OAuth callback
export const googleCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const stateFromQuery =
      typeof req.query.state === "string" ? req.query.state : undefined;
    const stateFromCookie = req.cookies?.[GOOGLE_STATE_COOKIE_NAME] as
      | string
      | undefined;
    const oauthError =
      typeof req.query.error === "string" ? req.query.error : undefined;

    if (oauthError) {
      clearGoogleStateCookie(res);

      const reason: GoogleOAuthFailureReason =
        oauthError === "access_denied" ? "access_denied" : "google_auth_failed";

      return res.redirect(buildFrontendCallbackUrl({ error: reason }));
    }

    let returnTo: string | undefined;

    try {
      const code =
        typeof req.query.code === "string" ? req.query.code : undefined;

      if (!code) {
        throw new GoogleOAuthError(
          "google_auth_failed",
          "Google authorization code is missing",
        );
      }

      const state = await consumeGoogleState(stateFromQuery, stateFromCookie);
      returnTo = state.returnTo;

      const profile = await exchangeGoogleCode(code, state.codeVerifier);
      const { refreshToken, refreshTokenExpiresAt } =
        await userService.loginWithGoogle(profile, getSessionContext(req));

      setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);
      clearGoogleStateCookie(res);
      noStore(res);

      return res.redirect(
        buildFrontendCallbackUrl(returnTo ? { returnTo } : {}),
      );
    } catch (error) {
      clearGoogleStateCookie(res);

      const reason = googleFailureReason(error);

      logger.warn({ err: error, reason }, "Google authentication failed");

      return res.redirect(
        buildFrontendCallbackUrl({
          error: reason,
          ...(returnTo ? { returnTo } : {}),
        }),
      );
    }
  },
);

//Verify register User
export const verifyRegisterUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;

    const { user, accessToken, refreshToken, refreshTokenExpiresAt } =
      await userService.verifyRegisterUser(
        token as string,
        getSessionContext(req),
      );

    setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);
    noStore(res);

    return new ApiResponse(
      HTTP_STATUS.CREATED,
      { user, accessToken },
      "User registered successfully",
    ).send(res);
  },
);

//Login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await userService.login(
    { email, password },
    getSessionContext(req),
  );

  if (result.requiresOtp) {
    return new ApiResponse(
      HTTP_STATUS.OK,
      { requiresOtp: true },
      result.message,
    ).send(res);
  }

  setRefreshCookie(res, result.refreshToken, result.refreshTokenExpiresAt);
  noStore(res);

  return new ApiResponse(
    HTTP_STATUS.OK,
    {
      requiresOtp: false,
      user: result.user,
      accessToken: result.accessToken,
    },
    "User logged in successfully",
  ).send(res);
});

//login verification
export const verifyLoginUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { otp, email } = req.body;

    const { user, accessToken, refreshToken, refreshTokenExpiresAt } =
      await userService.verifyLoginUser(otp, getSessionContext(req), email);

    setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);
    noStore(res);

    return new ApiResponse(
      HTTP_STATUS.OK,
      { user, accessToken },
      "User logged in successfully",
    ).send(res);
  },
);
//todo: refresh token
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies[REFRESH_COOKIE_NAME] as
      | string
      | undefined;

    try {
      const {
        user,
        accessToken,
        refreshToken: newRefreshToken,
        refreshTokenExpiresAt,
      } = await userService.refreshAccessToken(oldRefreshToken);

      setRefreshCookie(res, newRefreshToken, refreshTokenExpiresAt);
      noStore(res);

      return new ApiResponse(
        HTTP_STATUS.OK,
        { user, accessToken },
        "Access token refreshed successfully",
      ).send(res);
    } catch (error) {
      clearRefreshCookie(res);
      throw error;
    }
  },
);

//todo: profile
export const profile = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
  }

  noStore(res);

  return new ApiResponse(
    HTTP_STATUS.OK,
    user,
    "Profile fetched successfully",
  ).send(res);
});

//enableTwoFactor
export const enableTwoFactor = asyncHandler(
  async (req: Request, res: Response) => {
    const { message } = await userService.enableTwoFactor(
      req.user?.email!,
      getSessionContext(req),
    );
    return new ApiResponse(HTTP_STATUS.OK, null, message).send(res);
  },
);

//verify enableTwoFactor
export const verifyEnableTwoFactor = asyncHandler(
  async (req: Request, res: Response) => {
    const { otp, email } = req.body;
    const { message, data } = await userService.verifyEnableTwoFactor(
      email,
      otp,
    );
    return new ApiResponse(HTTP_STATUS.OK, data, message).send(res);
  },
);

//todo: log out current session
export const logout = asyncHandler(async (req: Request, res: Response) => {
  try {
    await userService.logout(
      req.cookies[REFRESH_COOKIE_NAME] as string | undefined,
    );
  } finally {
    clearRefreshCookie(res);
  }

  noStore(res);

  return new ApiResponse(
    HTTP_STATUS.OK,
    null,
    "User logged out successfully",
  ).send(res);
});

//todo: log out every device
export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
  }

  await userService.logoutAll(user._id.toString());
  clearRefreshCookie(res);
  noStore(res);

  return new ApiResponse(
    HTTP_STATUS.OK,
    null,
    "User logged out from all devices",
  ).send(res);
});

import { randomBytes, randomUUID } from "node:crypto";
import { Types } from "mongoose";
import bcrypt from "bcrypt";
import { env } from "@config/env.js";
import { UserRepository } from "@modules/auth/user/userAuth.repository.js";
import {
  SessionRepository,
  hashesEqual,
  hashToken,
} from "@modules/auth/user/session.repository.js";
import type { UserDocument } from "@modules/auth/models/auth.model.js";
import { HTTP_STATUS } from "@shared/httpcode.js";
import { ApiError } from "@utils/apiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  type RefreshTokenPayload,
} from "@utils/jwt.js";
import type {
  UserLoginInput,
  UserRegisterInput,
} from "./userAuth.validation.js";
import { redis } from "@config/redis.js";
import { sendMail } from "@config/sendMail.js";
import { getOtpHtml, getVerifyEmailHtml } from "@utils/html.js";
import { deleteCasheUser } from "@modules/auth/user/user.cashe.service.js";
import type { GoogleProfile } from "./userAuth.types.js";

//Refresh token expire time
const REFRESH_TOKEN_TTL_MS = env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  (error as { code?: unknown }).code === 11000;

export interface SessionContext {
  ip?: string;
  userAgent?: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

//user service class
export class UserService {
  constructor(
    private readonly userRepository = new UserRepository(),
    private readonly sessionRepository = new SessionRepository(),
  ) {}

  //Sanitize User
  private sanitizeUser(user: UserDocument) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled,
      createdAt: user.createdAt,
    };
  }

  //Normalize session context
  private normalizeSessionContext(context: SessionContext) {
    return {
      ip: (context.ip ?? "unknown").slice(0, 45),
      userAgent: (context.userAgent ?? "unknown").slice(0, 500),
    };
  }

  //Session create
  private async createSession(
    user: UserDocument,
    context: SessionContext,
  ): Promise<TokenPair> {
    const sessionId = new Types.ObjectId();
    const jti = randomUUID();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    const tokenVersion = user.tokenVersion ?? 0;

    const refreshToken = generateRefreshToken(
      user._id.toString(),
      user.role,
      tokenVersion,
      sessionId.toString(),
      jti,
    );

    const accessToken = generateAccessToken(
      user._id.toString(),
      user.role,
      tokenVersion,
    );

    await this.sessionRepository.createSession({
      _id: sessionId,
      user: user._id,
      currentTokenHash: hashToken(refreshToken),
      currentJti: jti,
      expiresAt,
      ...this.normalizeSessionContext(context),
    });

    return {
      accessToken,
      refreshToken,
      refreshTokenExpiresAt: expiresAt,
    };
  }

  // register user
  async register(userData: UserRegisterInput, context: SessionContext = {}) {
    const rateLimitingKey = `register_rate_limiter:${context.ip}:${userData.email}`;

    if (await redis.get(rateLimitingKey)) {
      throw new ApiError(
        HTTP_STATUS.TOO_MANY_REQUESTS,
        "Too many request. Try again later",
      );
    }
    //*user existance
    const existUser = await this.userRepository.findByEmail(userData.email);
    if (existUser) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        existUser.googleId
          ? "This email already has an account. Please sign in with Google"
          : "User already exists",
      );
    }
    //*hash passsword
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    //*verify token
    const verifyToken = randomBytes(32).toString("hex");
    const verifyKey = `verify_key:${verifyToken}`;
    const radisData = {
      ...userData,
      password: hashedPassword,
    };
    //*set payload to redis
    await redis.set(verifyKey, JSON.stringify(radisData), { ex: 300 });
    //*send email
    const subject = "Verify your email for accoutn creation";
    const html = getVerifyEmailHtml(userData.email, verifyToken);
    void sendMail(userData.email, subject, html);

    await redis.set(rateLimitingKey, "true", { ex: 60 });

    return {
      message: "Sent a verification link to your email",
    };
  }

  //Verify register user
  async verifyRegisterUser(token: string, context: SessionContext = {}) {
    if (!token) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Token not found");
    }
    const verifyKey = `verify_key:${token}`;
    const userData = await redis.get(verifyKey);

    if (!userData) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Verification lilnk is expired",
      );
    }

    await redis.del(verifyKey);

    const user = await this.userRepository.createUser(userData);
    const tokens = await this.createSession(user, context);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  //todo: login
  async login(userData: UserLoginInput, context: SessionContext = {}) {
    const rateLimiter = `login_rate_limit:${context.ip}:${userData.email}`;

    if (await redis.get(rateLimiter)) {
      throw new ApiError(
        HTTP_STATUS.TOO_MANY_REQUESTS,
        "Too many request, try again later",
      );
    }
    const user = await this.userRepository.findByEmail(userData.email);
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    /*
     * Accounts created through Google have no password. bcrypt.compare would
     * throw for them, so fail with a clear message instead.
     */
    if (!user.password) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "This account uses Google sign-in. Please continue with Google",
      );
    }

    const compare = await bcrypt.compare(userData.password, user.password);
    if (!compare) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    if (!user.twoFactorEnabled) {
      const tokens = await this.createSession(user, context);

      return {
        requiresOtp: false as const,
        user: this.sanitizeUser(user),
        ...tokens,
      };
    }

    //*create otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `login_otp:${userData.email}`;
    await redis.set(otpKey, JSON.stringify(otp), { ex: 120 });

    //*send email with otp
    const subject = "Verification otp";
    const html = getOtpHtml(userData.email, otp);
    void sendMail(userData.email, subject, html);

    await redis.set(rateLimiter, "true", { ex: 60 });

    return {
      requiresOtp: true as const,
      message: "Sent a otp to your email",
    };
  }

  //Verify login user
  async verifyLoginUser(otp: string, context: SessionContext, email: string) {
    if (!otp || !email) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Please provide all fields");
    }

    const otpKey = `login_otp:${email}`;
    const sotredOtp = await redis.get(otpKey);

    if (!sotredOtp) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Otp expired");
    }

    if (sotredOtp !== otp) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invalid Otp");
    }

    await redis.del(otpKey);
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User doesn't exists");
    }
    if (!user.twoFactorEnabled) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Two-factor authentication is not enabled for this account",
      );
    }

    const tokens = await this.createSession(user, context);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  //todo: login with Google
  async loginWithGoogle(profile: GoogleProfile, context: SessionContext = {}) {
    const email = profile.email.trim().toLowerCase();

    if (!email) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Google account email is missing",
      );
    }

    // Google's `sub` is stable even if the account email changes.
    let user = await this.userRepository.findByGoogleId(profile.googleId);

    if (!user) {
      const existing = await this.userRepository.findByEmail(email);

      if (!existing) {
        user = await this.createGoogleUser(profile, email);
      } else if (existing.googleId) {
        if (existing.googleId !== profile.googleId) {
          throw new ApiError(
            HTTP_STATUS.CONFLICT,
            "This email is already linked to another Google account",
          );
        }

        user = existing;
      } else {
        /*
         * Never auto-link an admin account. Admin emails are more likely to be
         * shared or role-based, so linking them must be an explicit action.
         */
        if (existing.role === "admin") {
          throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            "Google sign-in is not enabled for admin accounts. Please sign in with your password",
          );
        }

        const linked = await this.userRepository.linkGoogleId(
          existing._id.toString(),
          profile.googleId,
        );

        if (linked) {
          user = linked;
          await deleteCasheUser(existing._id.toString()).catch(() => undefined);
        } else {
          // Another concurrent request may have linked the account first.
          user = await this.userRepository.findByGoogleId(profile.googleId);

          if (!user) {
            throw new ApiError(
              HTTP_STATUS.CONFLICT,
              "This email is already linked to another Google account",
            );
          }
        }
      }
    }

    const tokens = await this.createSession(user, context);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  //Normalize Google display name to match the user schema constraints
  private googleDisplayName(name: string, email: string): string {
    const candidate = name.trim().slice(0, 50);

    if (candidate.length >= 2) return candidate;

    const localPart = email.split("@")[0]?.trim().slice(0, 50) ?? "";

    return localPart.length >= 2 ? localPart : "Customer";
  }

  //Create a password-less Google account
  private async createGoogleUser(
    profile: GoogleProfile,
    email: string,
  ): Promise<UserDocument> {
    try {
      return await this.userRepository.createUser({
        name: this.googleDisplayName(profile.name, email),
        email,
        googleId: profile.googleId,
        role: "customer",
      });
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error;

      // Two first-time logins can race. Return the winner if it is ours.
      const byGoogleId = await this.userRepository.findByGoogleId(
        profile.googleId,
      );

      if (byGoogleId) return byGoogleId;

      const byEmail = await this.userRepository.findByEmail(email);

      if (byEmail?.googleId) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          "This email is already linked to another Google account",
        );
      }

      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "This email already has an account. Please sign in with your password",
      );
    }
  }

  //todo: refresh token
  async refreshAccessToken(oldRefreshToken?: string) {
    if (!oldRefreshToken) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Refresh token is required");
    }

    let decoded: RefreshTokenPayload;

    try {
      decoded = verifyRefreshToken(oldRefreshToken);
    } catch {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid or expired refresh token",
      );
    }

    if (!decoded._id || !decoded.sid || !decoded.jti) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    }

    const session = await this.sessionRepository.findById(decoded.sid);

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() <= Date.now()
    ) {
      if (session && !session.revokedAt) {
        await this.sessionRepository.revokeSession(session._id.toString());
      }
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid or expired refresh token",
      );
    }

    if (session.user.toString() !== decoded._id) {
      await this.sessionRepository.revokeSession(session._id.toString());
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    }

    const oldHash = hashToken(oldRefreshToken);
    const currentHash = session.currentTokenHash;

    if (!currentHash || !hashesEqual(currentHash, oldHash)) {
      /*
       * A validly signed token that is no longer the current token is either
       * a replay of an already rotated token or a stolen token. Revoke the
       * whole session family so both the attacker and the victim must log in
       * again.
       */
      if (
        session.previousTokenHash &&
        hashesEqual(session.previousTokenHash, oldHash)
      ) {
        await this.sessionRepository.revokeSession(session._id.toString());
      }

      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    }

    const user = await this.userRepository.findById(decoded._id);
    if (!user) {
      await this.sessionRepository.revokeSession(session._id.toString());
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User no longer exists");
    }

    const tokenVersion = user.tokenVersion ?? 0;
    if ((decoded.tokenVersion ?? 0) !== tokenVersion) {
      await this.sessionRepository.revokeSession(session._id.toString());
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Session is no longer valid. Please log in again",
      );
    }

    const newJti = randomUUID();
    const refreshToken = generateRefreshToken(
      user._id.toString(),
      user.role,
      tokenVersion,
      session._id.toString(),
      newJti,
    );

    const rotated = await this.sessionRepository.rotate({
      sessionId: session._id.toString(),
      oldHash,
      oldJti: decoded.jti,
      newHash: hashToken(refreshToken),
      newJti,
      now: new Date(),
    });

    if (!rotated) {
      await this.sessionRepository.revokeSession(session._id.toString());
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Refresh token already used",
      );
    }

    const accessToken = generateAccessToken(
      user._id.toString(),
      user.role,
      tokenVersion,
    );

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
      refreshTokenExpiresAt: session.expiresAt,
    };
  }

  //enableTwoFactor
  async enableTwoFactor(email: string, context: SessionContext) {
    const rateLimiter = `two_factor_otp:${context.ip}:${email}`;

    if (await redis.get(rateLimiter)) {
      throw new ApiError(
        HTTP_STATUS.TOO_MANY_REQUESTS,
        "Too many request, try again later",
      );
    }
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    //*create otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `two_factor_otp_code:${email}`;
    await redis.set(otpKey, JSON.stringify(otp), { ex: 120 });

    //*send email with otp
    const subject = "Verification otp";
    const html = getOtpHtml(email, otp);
    void sendMail(email, subject, html);

    await redis.set(rateLimiter, "true", { ex: 60 });

    return {
      message: "Sent a otp to your email",
    };
  }

  //Verify 2FA otp
  async verifyEnableTwoFactor(email: string, otp: string) {
    if (!otp || !email) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Please provide all fields");
    }

    const otpKey = `two_factor_otp_code:${email}`;
    const sotredOtp = await redis.get(otpKey);

    if (!sotredOtp) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Otp expired");
    }

    if (sotredOtp !== otp) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invalid Otp");
    }

    await redis.del(otpKey);
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User doesn't exists");
    }
    await deleteCasheUser(user.id);
    user.twoFactorEnabled = user.twoFactorEnabled ? false : true;
    await user.save();
    const data = user.twoFactorEnabled;
    const message = user.twoFactorEnabled ? "2FA enabled" : "2FA disabled";
    return {
      data,
      message,
    };
  }
  //todo: logout current session
  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) return;

    let decoded: RefreshTokenPayload;

    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      return;
    }

    if (decoded.sid) {
      await this.sessionRepository.revokeSession(decoded.sid);
    }
  }

  //todo: logout every device/session
  async logoutAll(userId: string): Promise<void> {
    await this.sessionRepository.revokeAllForUser(userId);
    await this.userRepository.incrementTokenVersion(userId);
  }
}

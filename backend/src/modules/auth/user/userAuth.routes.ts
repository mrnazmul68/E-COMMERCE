import { Router } from "express";
import {
  enableTwoFactor,
  googleCallback,
  googleStart,
  login,
  logout,
  logoutAll,
  profile,
  refreshToken,
  register,
  verifyEnableTwoFactor,
  verifyLoginUser,
  verifyRegisterUser,
} from "@modules/auth/user/userAuth.controller.js";
import { validate } from "@middlewares/validation.middleware.js";
import {
  USER_LOGIN_VALIDATION,
  USER_REGISTER_VALIDATION,
} from "@modules/auth/user/userAuth.validation.js";
import { protect } from "@middlewares/protect.middleware.js";
import { verifyOrigin } from "@middlewares/verifyOrigin.middleware.js";
import {
  authLimiter,
  googleAuthLimiter,
  refreshLimiter,
} from "@middlewares/rateLimit.middleware.js";

export const userRoute = Router();

// Never let browsers or proxies cache auth responses, including failures.
userRoute.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

/*
 * Google OAuth deliberately does NOT use verifyOrigin. Both routes are
 * top-level browser navigations; Google's callback arrives without an Origin
 * header and with Sec-Fetch-Site: cross-site, which verifyOrigin blocks.
 * Protection comes from a single-use state value bound to an httpOnly cookie
 * plus an explicit rate limiter.
 */
userRoute.get("/google", googleAuthLimiter, googleStart);
userRoute.get("/google/callback", googleAuthLimiter, googleCallback);

//@route POST /api/v1/auth/register
//@desc Register user
//@access Public
userRoute.post(
  "/register",
  verifyOrigin,
  authLimiter,
  validate(USER_REGISTER_VALIDATION),
  register,
);

//@route POST /api/v1/auth/register/verify-user/:token
//@desc Verify registered user email
//@access Public
userRoute.post(
  "/register/verify-user/:token",
  verifyOrigin,
  authLimiter,
  verifyRegisterUser,
);

//@route POST /api/v1/auth/login
//@desc Login user
//@access Public
userRoute.post(
  "/login",
  verifyOrigin,
  authLimiter,
  validate(USER_LOGIN_VALIDATION),
  login,
);

//@route POST /api/v1/auth/login/verify-user
//@desc Login user
//@access Public
userRoute.post(
  "/login/verify-user",
  verifyOrigin,
  authLimiter,
  verifyLoginUser,
);

//@route GET /api/v1/auth/profile
//@desc Get current user profile
//@access Private
userRoute.get("/profile", protect, profile);

//@route POST /api/v1/auth/2fa/enable/request
//@desc sent otp
//@access Private
userRoute.post("/2fa/enable/request", protect, enableTwoFactor);

//@route POST /api/v1/auth/2fa/enable/verify
//@desc Verify 2FA otp
//@access Private
userRoute.post("/2fa/enable/verify", protect, verifyEnableTwoFactor);


//@route POST /api/v1/auth/refresh
//@desc Rotate refresh token and issue a new access token
//@access Public (refresh cookie)
userRoute.post("/refresh", verifyOrigin, refreshLimiter, refreshToken);

//@route POST /api/v1/auth/logout
//@desc Revoke current refresh session
//@access Public (refresh cookie)
userRoute.post("/logout", verifyOrigin, logout);

//@route POST /api/v1/auth/logout-all
//@desc Revoke every refresh session and invalidate access tokens
//@access Private
userRoute.post("/logout-all", protect, verifyOrigin, logoutAll);

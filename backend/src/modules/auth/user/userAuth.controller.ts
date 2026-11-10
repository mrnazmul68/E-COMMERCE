import { asyncHandler } from "@utils/asyncHandler.js";
import type { CookieOptions, Request, Response } from "express";
import { UserService } from "@modules/auth/user/userAuth.service.js";
import { ApiResponse } from "@utils/apiResponse.js";
import { HTTP_STATUS } from "@shared/httpcode.js";
import { ApiError } from "@utils/apiError.js";
import { env } from "@config/env.js";

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

  const { message } = await userService.login(
    { email, password },
    getSessionContext(req),
  );

  return new ApiResponse(HTTP_STATUS.OK, null, message).send(res);
});

//todo: login verification
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

import { asyncHandler } from "@utils/asyncHandler.js";
import type { Request, Response } from "express";
import { UserService } from "@modules/auth/user/userAuth.service.js";
import { ApiResponse } from "@utils/apiResponse.js";
import { HTTP_STATUS } from "@shared/httpcode.js";
import { ApiError } from "@utils/apiError.js";
import { env } from "@config/env.js";

const REFRESH_TOKEN_MAX_AGE = 15 * 24 * 60 * 60 * 1000;

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: env.isProduction,
  maxAge: REFRESH_TOKEN_MAX_AGE,
};

const userService = new UserService();

//todo: register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const { user, accessToken, refreshToken } = await userService.register({
    name,
    email,
    password,
  });

  //set cookie
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  return new ApiResponse(
    HTTP_STATUS.CREATED,
    { user, accessToken },
    "User registered successfully",
  ).send(res);
});

//todo: login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await userService.login({
    email,
    password,
  });
  //set cookie
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  return new ApiResponse(
    HTTP_STATUS.OK,
    { user, accessToken },
    "User logged in successfully",
  ).send(res);
});

//todo: profile
export const profile = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "User not found");
  }
  return new ApiResponse(
    HTTP_STATUS.OK,
    user,
    "Profile fetched successfully",
  ).send(res);
});

//todo:refresh token
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies.refreshToken;

    const { accessToken, refreshToken } =
      await userService.refreshAccessToken(oldRefreshToken);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return new ApiResponse(
      HTTP_STATUS.OK,
      { accessToken },
      "Access token refreshed successfully",
    ).send(res);
  },
);

//todo: log out
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Refresh token not found");
  }

  if (!req.user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
  }

  await userService.logout(refreshToken, req.user._id.toString());
  res.clearCookie("refreshToken", refreshCookieOptions);

  return new ApiResponse(
    HTTP_STATUS.OK,
    null,
    "User logged out successfully",
  ).send(res);
});

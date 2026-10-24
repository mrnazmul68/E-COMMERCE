import { asyncHandler } from "@utils/asyncHandler.js";
import type { Request, Response } from "express";
import { AdminService } from "@modules/auth/admin/adminAuth.service.js";
import { ApiResponse } from "@utils/apiResponse.js";
import { HTTP_STATUS } from "@shared/httpcode.js";
import { env } from "@config/env.js";
import { ApiError } from "@utils/apiError.js";

const REFRESH_TOKEN_MAX_AGE = 15 * 24 * 60 * 60 * 1000;
const adminService = new AdminService();

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: env.isProduction,
  maxAge: REFRESH_TOKEN_MAX_AGE,
};

//todo: admin login
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { admin, accessToken, refreshToken } = await adminService.login(
    req.body,
    {
      ip: req.ip ?? "unknown",
      userAgent: req.get("user-agent") ?? "unknown",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: env.isProduction,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });

  return new ApiResponse(
    HTTP_STATUS.OK,
    { admin, accessToken },
    "Admin logged in successfully",
  ).send(res);
});

//todo: admin logout
export const adminLogout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "Admin access required");
  }

  if (!req.sessionId) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid admin session");
  }

  await adminService.logout(req.sessionId, req.user._id.toString());
  res.clearCookie("refreshToken", refreshCookieOptions);

  return new ApiResponse(
    HTTP_STATUS.OK,
    null,
    "Admin logged out successfully",
  ).send(res);
});

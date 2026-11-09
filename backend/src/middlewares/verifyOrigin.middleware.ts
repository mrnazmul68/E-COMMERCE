import type { RequestHandler } from "express";
import { env } from "@config/env.js";
import { HTTP_STATUS } from "@shared/httpcode.js";
import { ApiError } from "@utils/apiError.js";

/*
 * CORS protects response reading, not request sending. Cookie-authenticated
 * endpoints therefore need an explicit Origin check as CSRF defence in depth.
 */
export const verifyOrigin: RequestHandler = (req, _res, next) => {
  const origin = req.get("origin");

  if (origin) {
    if (!env.CORS_ORIGINS.includes(origin)) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "Invalid request origin");
    }

    return next();
  }

  if (req.get("sec-fetch-site") === "cross-site") {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "Cross-site request blocked");
  }

  next();
};

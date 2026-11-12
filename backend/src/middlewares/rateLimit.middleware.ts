import { rateLimit } from "express-rate-limit";
import { HTTP_STATUS } from "@shared/httpcode.js";

/*
 * The default MemoryStore is per-process. When the API runs on more than one
 * instance, point express-rate-limit at a shared Redis store instead.
 */
const rateLimitResponse = {
  success: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  data: null,
  message: "Too many requests. Please try again later.",
};

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: rateLimitResponse,
});


export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitResponse,
});

/*
 * OAuth routes respond with redirects on both success and failure, so the
 * default `skipSuccessfulRequests` behaviour of `authLimiter` would never
 * count failed attempts. Keep every hit in the window.
 */
export const googleAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitResponse,
});

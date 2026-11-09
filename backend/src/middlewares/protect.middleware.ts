import { HTTP_STATUS } from "@shared/httpcode.js";
import { ApiError } from "@utils/apiError.js";
import { asyncHandler } from "@utils/asyncHandler.js";
import { verifyAccessToken, type AccessTokenPayload } from "@utils/jwt.js";
import { UserRepository } from "@modules/auth/user/userAuth.repository.js";
import { redis } from "@config/redis.js";
import { getUserWithCache } from "@modules/auth/user/user.cashe.service.js";

const userRepository = new UserRepository();

//protect middleware
export const protect = asyncHandler(async (req, _res, next) => {
  let token: string | undefined;

  const authorization = req.headers.authorization;

  if (authorization?.startsWith("Bearer ")) {
    token = authorization.split(" ")[1];
  }

  /*
   * Access tokens are intentionally accepted only from the Authorization
   * header. Accepting them from a cookie would make every protected endpoint
   * CSRF-able.
   */
  if (!token) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Access denied. No token provided",
    );
  }

  let decoded: AccessTokenPayload;

  try {
    decoded = verifyAccessToken(token);
  } catch {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid or expired access token",
    );
  }

  if (!decoded?._id || !decoded?.role) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Malformed token payload");
  }

  const user = await getUserWithCache(decoded._id);
  if (!user) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "User belonging to this token no longer exists",
    );
  }

  /*
   * Incremented by logout-all/password-change flows. This makes existing
   * access tokens invalid immediately instead of waiting for their TTL.
   */
  if ((decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Session is no longer valid. Please log in again",
    );
  }

  req.user = user;
  next();
});

//Middleware to check role as admin
export const admin = asyncHandler(async (req, _res, next) => {
  const user = req.user;

  if (!user || user.role !== "admin") {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "Not authorize as Admin");
  }

  next();
});

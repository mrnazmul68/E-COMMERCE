import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUS } from "@shared/httpcode.js";
import { ApiError } from "@utils/apiError.js";
import { asyncHandler } from "@utils/asyncHandler.js";
import { verifyAccessToken } from "@utils/jwt.js";
import { UserRepository } from "@modules/auth/user/userAuth.repository.js";

const userRepository = new UserRepository();

interface TokenPayload extends JwtPayload {
  _id: string;
  sessionId: string;
}

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1. Get token from Authorization header (Bearer <token>)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2. Or fallback to cookies if present
    else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Access denied. No token provided",
      );
    }

    // 3. Verify token
    let decoded: TokenPayload;
    try {
      decoded = verifyAccessToken(token) as TokenPayload;
    } catch {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid or expired access token",
      );
    }

    if (!decoded?._id || !decoded.sessionId) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Malformed token payload");
    }

    const session = await userRepository.findActiveSessionById(
      decoded.sessionId,
    );
    if (!session || session.user.toString() !== decoded._id) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Session is revoked or no longer exists",
      );
    }

    // 4. Check if user still exists in database
    const user = await userRepository.findById(decoded._id);
    if (!user) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "User belonging to this token no longer exists",
      );
    }

    // 5. Attach user to request object
    req.user = user;
    req.sessionId = decoded.sessionId;
    next();
  },
);

import { env } from "@config/env.js";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

export interface AccessTokenPayload extends JwtPayload {
  _id: string;
  role: string;
  tokenVersion?: number;
}

export interface RefreshTokenPayload extends AccessTokenPayload {
  sid: string;
  jti: string;
}

const ACCESS_TOKEN_TTL = env.JWT_ACCESS_TTL as SignOptions["expiresIn"];
const REFRESH_TOKEN_TTL =
  `${env.REFRESH_TOKEN_TTL_DAYS}d` as SignOptions["expiresIn"];

export const generateAccessToken = (
  userId: string,
  userRole: string,
  tokenVersion = 0,
) => {
  return jwt.sign(
    { _id: userId, role: userRole, tokenVersion },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: ACCESS_TOKEN_TTL,
      algorithm: "HS256",
    },
  );
};

export const generateRefreshToken = (
  userId: string,
  userRole: string,
  tokenVersion: number,
  sessionId: string,
  jti: string,
) => {
  return jwt.sign(
    {
      _id: userId,
      role: userRole,
      tokenVersion,
      sid: sessionId,
      jti,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: REFRESH_TOKEN_TTL,
      algorithm: "HS256",
    },
  );
};

const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret, {
    algorithms: ["HS256"],
  }) as JwtPayload;
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return verifyToken(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return verifyToken(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
};

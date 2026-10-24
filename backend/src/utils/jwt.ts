import { env } from "@config/env.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface TokenPlayload extends JwtPayload {
  _id: string;
}

export const generateAccessToken = (userId: string, sessionId: string) => {
  return jwt.sign(
    { _id: userId, sessionId: sessionId },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15d",
    },
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ _id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: "15d",
  });
};

export const verifyAccessToken = (token: string): TokenPlayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPlayload;
};

export const verifyRefreshToken = (token: string): TokenPlayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPlayload;
};

//todo: generate token pair


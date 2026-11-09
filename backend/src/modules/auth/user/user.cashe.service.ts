import { redis } from "@config/redis.js";
import { UserRepository } from "./userAuth.repository.js";
import { ApiError } from "@utils/apiError.js";
import { HTTP_STATUS } from "@shared/httpcode.js";
import type { CasheUserType } from "./userAuth.types.js";
import type { UserDocument } from "../models/auth.model.js";

const USER_CACHE_TTL = 600;

// Get user with cashe
export const getUserWithCache = async (
  userId: string,
): Promise<UserDocument> => {
  const userKey = `user:${userId}`;

  //* Check Redis Cache
  const cashedUser = await redis.get<UserDocument>(userKey);

  if (cashedUser) {
    return cashedUser;
  }

  //* Cache Miss: Fetch from MongoDB
  const dbUser = await new UserRepository().findById(userId);

  if (!dbUser) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  //* Store in Redis
  await redis.set(userKey, dbUser, {
    ex: USER_CACHE_TTL,
  });
  return dbUser;
};

//Delete user from cashe
export const deleteCasheUser = async (userId: string) => {
  await redis.del(`user:${userId}`);
};

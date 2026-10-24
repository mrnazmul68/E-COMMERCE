import { z } from "zod";

import { VALIDATION } from "@shared/constants.js";

export const USER_VALIDATION = {
  NAME: z
    .string({
      error: VALIDATION.NAME.REQUIRED_MESSAGE,
    })
    .trim()
    .min(VALIDATION.NAME.MIN_LENGTH, VALIDATION.NAME.MIN_LENGTH_MESSAGE)
    .max(VALIDATION.NAME.MAX_LENGTH, VALIDATION.NAME.MAX_LENGTH_MESSAGE),

  EMAIL: z
    .string({
      error: VALIDATION.EMAIL.REQUIRED_MESSAGE,
    })
    .trim()
    .lowercase()
    .email(VALIDATION.EMAIL.INVALID_MESSAGE)
    .max(VALIDATION.EMAIL.MAX_LENGTH, VALIDATION.EMAIL.MAX_LENGTH_MESSAGE),

  PASSWORD: z
    .string({
      error: VALIDATION.PASSWORD.REQUIRED_MESSAGE,
    })
    .min(VALIDATION.PASSWORD.MIN_LENGTH, VALIDATION.PASSWORD.MIN_LENGTH_MESSAGE)
    .max(
      VALIDATION.PASSWORD.MAX_LENGTH,
      VALIDATION.PASSWORD.MAX_LENGTH_MESSAGE,
    ),

  AVATAR: z
    .url(VALIDATION.AVATAR.INVALID_MESSAGE)
    .max(VALIDATION.AVATAR.MAX_LENGTH, VALIDATION.AVATAR.MAX_LENGTH_MESSAGE)
    .nullable()
    .optional(),

  ROLE: z.enum(VALIDATION.ROLE.VALUES, {
    error: VALIDATION.ROLE.INVALID_MESSAGE,
  }),
} as const;

//todo: user register validation
export const USER_REGISTER_VALIDATION = z.object({
  body: z.object({
    firstName: USER_VALIDATION.NAME,
    email: USER_VALIDATION.EMAIL,
    password: USER_VALIDATION.PASSWORD,
  }),
});

//todo: user login validation
export const USER_LOGIN_VALIDATION = z.object({
  body: z.object({
    email: USER_VALIDATION.EMAIL,
    password: USER_VALIDATION.PASSWORD,
  }),
});

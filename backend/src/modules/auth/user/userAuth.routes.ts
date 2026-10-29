import { Router } from "express";
import {
  login,
  logout,
  profile,
  refreshToken,
  register,
} from "@modules/auth/user/userAuth.controller.js";
import { validate } from "@middlewares/validation.middleware.js";
import {
  USER_LOGIN_VALIDATION,
  USER_REGISTER_VALIDATION,
} from "@modules/auth/user/userAuth.validation.js";
import { protect } from "@middlewares/protect.middleware.js";

export const userRoute = Router();

//@route POST /api/v1/auth/register
//@desc Register user
//@access Public
userRoute.post("/register", validate(USER_REGISTER_VALIDATION), register);
//@route POST /api/v1/auth/login
//@desc Login user
//@access Public
userRoute.post("/login", validate(USER_LOGIN_VALIDATION), login);
//@route POST /api/v1/auth/progile/:id
//@desc user profile
//@access Private
userRoute.get("/profile/", protect, profile);
userRoute.get("/refresh-token", refreshToken);
userRoute.post("/logout", protect, logout);

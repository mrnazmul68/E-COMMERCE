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

userRoute.post("/register", validate(USER_REGISTER_VALIDATION), register);
userRoute.post("/login", validate(USER_LOGIN_VALIDATION), login);
userRoute.get("/profile/:id", protect, profile);
userRoute.get("/refresh-token", refreshToken);
userRoute.post("/logout", protect, logout);

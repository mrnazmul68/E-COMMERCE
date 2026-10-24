import { Router } from "express";
import {
  adminLogin,
  adminLogout,
} from "@modules/auth/admin/adminAuth.controller.js";
import { ADMIN_LOGIN_VALIDATION } from "@modules/auth/admin/adminAuth.schema.js";
import { validate } from "@middlewares/validation.middleware.js";
import { protect } from "@middlewares/protect.middleware.js";

export const adminRoute = Router();

adminRoute.post("/login", validate(ADMIN_LOGIN_VALIDATION), adminLogin);
adminRoute.post("/logout", protect, adminLogout);

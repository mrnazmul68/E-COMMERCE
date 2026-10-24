import { userRoute } from "@modules/auth/user/userAuth.routes.js";
import { productRoute } from "@modules/product/routes/product.route.js";
import { Router } from "express";
import { adminRoute } from "@modules/auth/admin/adminAuth.routes.js";


export const router = Router();



router.use("/auth", userRoute);
router.use("/admin", adminRoute);
router.use("/product", productRoute)

import { userRoute } from "@modules/auth/user/userAuth.routes.js";
import { productRoute } from "@modules/product/routes/product.route.js";
import { Router } from "express";


export const router = Router();



router.use("/auth", userRoute);
router.use("/product", productRoute)

import { userRoute } from "@modules/auth/user/userAuth.routes.js";
import { cartRoute } from "@modules/cart/cart.route.js";
import { productRoute } from "@modules/product/product.route.js";
import { Router } from "express";

export const router = Router();

router.use("/auth", userRoute);
router.use("/product", productRoute);
router.use("/cart", cartRoute);

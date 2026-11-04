import { Router } from "express";
import { addToCart } from "./cart.controller.js";
import { validate } from "@middlewares/validation.middleware.js";
import { cartValidation } from "./cart.validation.js";

export const cartRoute = Router();

cartRoute.post("/", validate(cartValidation), addToCart);

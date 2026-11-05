import { Router } from "express";
import { addToCart } from "./cart.controller.js";
import { validate } from "@middlewares/validation.middleware.js";
import { cartItemValidation } from "./cart.validation.js";

export const cartRoute = Router();

cartRoute.post("/", validate(cartItemValidation), addToCart);

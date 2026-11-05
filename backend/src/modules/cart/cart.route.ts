import { Router } from "express";
import {
  addToCart,
  deleteCartItem,
  getCartItems,
  mergeCartItems,
  updateCartItem,
} from "./cart.controller.js";
import { validate } from "@middlewares/validation.middleware.js";
import {
  cartItemDeleteValidation,
  cartItemGetValidation,
  cartItemUpdateValidation,
  cartItemValidation,
} from "./cart.validation.js";
import { protect } from "@middlewares/protect.middleware.js";

export const cartRoute = Router();

//@router POST /api/cart
//desc Add an item to the cart
//access Public
cartRoute.post("/", validate(cartItemValidation), addToCart);

//@router PUT /api/cart/update
//desc Update an item in the cart
//access Public
cartRoute.put("/update", validate(cartItemUpdateValidation), updateCartItem);

//@router DELETE /api/cart/delete
//desc Delete an item from the cart
//access Public
cartRoute.delete("/delete", validate(cartItemDeleteValidation), deleteCartItem);

//@router GET /api/cart/get
//desc Get  items from the cart
//access Public
cartRoute.get("/get", getCartItems);

//@router POST /api/cart/merge
//desc Merge cart items for a user and guest
//access Public
cartRoute.post("/merge", protect, mergeCartItems);

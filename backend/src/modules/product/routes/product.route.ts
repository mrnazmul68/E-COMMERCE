import { Router } from "express";
import { validate } from "@middlewares/validation.middleware.js";
import { admin, protect } from "@middlewares/protect.middleware.js";
import {
  addProduct,
  deleteProduct,
  listProduct,
  singleProduct,
  updateProduct,
} from "@modules/product/controller/product.controller.js";
import { PRODUCT_CREATE_VALIDATION, PRODUCT_UPDATE_VALIDATION } from "../validation/product.validation.js";

export const productRoute = Router();

//@route POST /api/v1/product/add
//@desc Add a new product
//@access Privae (Admin)
productRoute.post(
  "/add",
  protect,
  admin,
  validate(PRODUCT_CREATE_VALIDATION),
  addProduct,
);
//@route PUT /api/v1/product/update
//@desc Update a product
//@access Privae (Admin)
productRoute.put("/update/:id", protect, admin, validate(PRODUCT_UPDATE_VALIDATION),updateProduct);
//@route DELETE /api/v1/product/delete
//@desc Delete a product
//@access Privae (Admin)
productRoute.delete("/delete/:id", protect, admin, deleteProduct);
productRoute.get("/list", listProduct);
productRoute.get("/single-product/:id", singleProduct);

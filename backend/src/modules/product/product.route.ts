import { Router } from "express";
import { validate } from "@middlewares/validation.middleware.js";
import { admin, protect } from "@middlewares/protect.middleware.js";
import {
  addProduct,
  bestSellerProducts,
  deleteProduct,
  getSimilarProducts,
  listProduct,
  newArrivalProducts,
  singleProduct,
  updateProduct,
} from "@modules/product/product.controller.js";
import { PRODUCT_CREATE_VALIDATION, PRODUCT_QUERY_VALIDATION, PRODUCT_UPDATE_VALIDATION } from "./product.validation.js";


export const productRoute = Router();

//@route POST /api/v1/product/add
//@desc Add a new product
//@access Private (Admin)
productRoute.post(
  "/add",
  protect,
  admin,
  validate(PRODUCT_CREATE_VALIDATION),
  addProduct,
);

//@route GET /api/v1/best-seller
//@desc Get best-selling products
//@access Public
productRoute.get("/best-seller", bestSellerProducts);

//@route GET /api/v1/product/new-arrivals
//@desc Get new arrival products
//@access Public
productRoute.get("/new-arrivals", newArrivalProducts);
//@route PUT /api/v1/product/update
//@desc Update a product
//@access Private (Admin)
productRoute.put(
  "/update/:id",
  protect,
  admin,
  validate(PRODUCT_UPDATE_VALIDATION),
  updateProduct,
);
//@route GET /api/v1/product
//@desc Get all products with optional quary and filters
//@access Public
productRoute.get("/", validate(PRODUCT_QUERY_VALIDATION), listProduct);
//@route DELETE /api/v1/product/delete
//@desc Delete a product
//@access Private (Admin)
productRoute.delete("/delete/:id", protect, admin, deleteProduct);
//@route GET /api/v1/product/:id
//@desc Find a single product with id
//@access Public
productRoute.get("/:id", singleProduct);
//@route GET /api/v1/product/similar/:id
//@desc Get similar products based on ID
//@access Public
productRoute.get("/similar/:id", getSimilarProducts);

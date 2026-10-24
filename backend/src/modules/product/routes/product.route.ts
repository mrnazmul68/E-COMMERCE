import { Router } from "express";
import { upload } from "@middlewares/multer.js";
import { UPLOAD_CONSTANTS } from "@shared/constants.js";
import { validate } from "@middlewares/validation.middleware.js";
import { createProductSchema } from "@modules/product/validation/product.validation.js";
import { protect } from "@middlewares/protect.middleware.js";
import { addProduct, listProduct, removeProduct, singleProduct } from "@modules/product/controller/product.controller.js";

export const productRoute = Router();

productRoute.post(
  "/add",
  protect,
  upload.array("images", UPLOAD_CONSTANTS.MAX_FILES),
  validate(createProductSchema),
  addProduct,
);
productRoute.get("/remove/:id",protect, removeProduct);
productRoute.get("/list", listProduct);
productRoute.get("/single-product/:id", singleProduct);

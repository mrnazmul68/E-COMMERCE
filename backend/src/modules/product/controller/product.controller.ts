import { asyncHandler } from "@utils/asyncHandler.js";
import type { Request, Response } from "express";
import { ProductService } from "@modules/product/service/product.service.js";
import { ApiError } from "@utils/apiError.js";
import { ApiResponse } from "@utils/apiResponse.js";
import { HTTP_STATUS } from "@shared/httpcode.js";

const productService = new ProductService();

//todo: add products
export const addProduct = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "Admin access is required");
  }

  const files = Array.isArray(req.files) ? req.files : [];
  if (files.length === 0) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "At least one product image is required",
    );
  }

  const product = await productService.createProduct(req.body, files);

  return new ApiResponse(
    HTTP_STATUS.CREATED,
    product,
    "Product created successfully",
  ).send(res);
});

//todo: remove products
export const removeProduct = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
    }

    if (req.user.role !== "admin") {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "Admin access is required");
    }

    const productId = req.params?.id;
    if (!productId || typeof productId !== "string") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product id not found");
    }
    const removeProduct = await productService.removeProduct(productId);

    return new ApiResponse(
      HTTP_STATUS.CREATED,
      removeProduct,
      "Product removed successfully",
    ).send(res);
  },
);

//todo: list product
export const listProduct = asyncHandler(async (req: Request, res: Response) => {
  const list = await productService.listProduct();

  return new ApiResponse(
    HTTP_STATUS.CREATED,
    list,
    "Product fetch successfully",
  ).send(res);
});

//todo: single product
export const singleProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params?.id;
    if (!productId || typeof productId !== "string") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product id not found");
    }
    const singleProduct = await productService.singleProduct(productId);
    return new ApiResponse(
      HTTP_STATUS.CREATED,
      singleProduct,
      "Product fetched successfully",
    ).send(res);
  },
);

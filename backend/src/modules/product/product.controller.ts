import type { Request, Response } from "express";

import { asyncHandler } from "@utils/asyncHandler.js";
import { ApiError } from "@utils/apiError.js";
import { ApiResponse } from "@utils/apiResponse.js";

import { HTTP_STATUS } from "@shared/httpcode.js";
import type { ProductQuaryInput } from "./product.validation.js";
import { ProductService } from "./product.service.js";

const productService = new ProductService();

// Add product
export const addProduct = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
  }

  const {
    name,
    description,
    price,
    discountPrice,
    countInStock,
    sku,
    category,
    brand,
    sizes,
    colors,
    collections,
    material,
    gender,
    images,
    tags,
    metaTitle,
    metaDescription,
    metaKeywords,
    dimensions,
    weight,
  } = req.body;

  const product = await productService.createProduct({
    name,
    description,
    price,
    discountPrice,
    countInStock,
    sku,
    category,
    brand,
    sizes,
    colors,
    collections,
    material,
    gender,
    images,
    tags,
    metaTitle,
    metaDescription,
    metaKeywords,
    dimensions,
    weight,
    isFeatured: false,
    isPublished: false,
    user: req.user._id,
  });

  return new ApiResponse(
    HTTP_STATUS.CREATED,
    product,
    "Product created successfully",
  ).send(res);
});

//Update a product
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const productData = req.body;
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid product ID");
    }
    const product = await productService.updateProduct(productData, id);

    return new ApiResponse(
      HTTP_STATUS.OK,
      product,
      "Product updated successfully",
    ).send(res);
  },
);
//todo: Delete products
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
    }

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product id not found");
    }
    const removeProduct = await productService.removeProduct(id);

    return new ApiResponse(
      HTTP_STATUS.CREATED,
      removeProduct,
      "Product removed successfully",
    ).send(res);
  },
);

//todo: list product and filter
export const listProduct = asyncHandler(async (req: Request, res: Response) => {
  const queryData = req.query as unknown as ProductQuaryInput;

  const result = await productService.listProduct(queryData);

  return new ApiResponse(
    HTTP_STATUS.OK,
    result,
    "Products fetched successfully",
  ).send(res);
});

//todo: single product
export const singleProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params?.id;
    if (!id || typeof id !== "string") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product id not found");
    }
    const singleProduct = await productService.singleProduct(id);
    return new ApiResponse(
      HTTP_STATUS.CREATED,
      singleProduct,
      "Product fetched successfully",
    ).send(res);
  },
);

// todo: get similar products with gender, category
export const getSimilarProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product id not found");
    }

    const currentProduct = await productService.singleProduct(id);

    const result = await productService.findSimilarProducts({
      id: currentProduct._id,
      category: currentProduct.category,
      gender: currentProduct.gender,
    });

    return new ApiResponse(
      HTTP_STATUS.OK,
      result,
      "Similar products fetched successfully",
    ).send(res);
  },
);

// todo: get best-selling products with rating
export const bestSellerProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const bestSellerProducts = await productService.bestSellerProducts();

    return new ApiResponse(
      HTTP_STATUS.OK,
      bestSellerProducts,
      "Best-selling products fetched successfully",
    ).send(res);
  },
);

//New arraival products
export const newArrivalProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const newArrivalProducts = await productService.newArrivalProducts();

    return new ApiResponse(
      HTTP_STATUS.OK,
      newArrivalProducts,
      "New arrival products fetched successfully",
    ).send(res);
  },
);

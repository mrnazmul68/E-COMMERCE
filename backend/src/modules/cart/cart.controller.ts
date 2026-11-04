import { HTTP_STATUS } from "@shared/httpcode.js";
import { ApiError } from "@utils/apiError.js";
import { ApiResponse } from "@utils/apiResponse.js";
import { asyncHandler } from "@utils/asyncHandler.js";
import type { Request, Response } from "express";
import { CartService } from "./cart.service.js";

const cartService = new CartService();

export const addToCart = asyncHandler(
  async (req: Request, res: Response) => {
    const cartItem = req.body;

    const respone = await cartService.addToCart(cartItem);

  },
);

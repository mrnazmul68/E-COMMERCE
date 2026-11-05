import { HTTP_STATUS } from "@shared/httpcode.js";
import { ApiResponse } from "@utils/apiResponse.js";
import { asyncHandler } from "@utils/asyncHandler.js";
import type { Request, Response } from "express";
import { CartService } from "./cart.service.js";

const cartService = new CartService();

// Add an item to the cart
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const cartItem = req.body;

  const respone = await cartService.addToCart(cartItem);

  return new ApiResponse(HTTP_STATUS.OK, respone, "Added to cart").send(res);
});

// Update an item in the cart
export const updateCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const cartItem = req.body;

    const response = await cartService.updateCartItem(cartItem);
    return new ApiResponse(HTTP_STATUS.OK, response, "Cart item updated").send(
      res,
    );
  },
);

// Delete an item from the cart
export const deleteCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const cartItem = req.body;

    const response = await cartService.deleteCartItem(cartItem);
    return new ApiResponse(HTTP_STATUS.OK, response, "Cart item deleted").send(
      res,
    );
  },
);

// Get items from the cart
export const getCartItems = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, guestId } = req.query;

    const response = await cartService.getCartItems(
      userId as string,
      guestId as string,
    );
    return new ApiResponse(
      HTTP_STATUS.OK,
      response,
      "Cart items retrieved",
    ).send(res);
  },
);

// Merge cart items for a user and guest
export const mergeCartItems = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, guestId } = req.body;

    const response = await cartService.mergeCartItems(userId, guestId);
    return new ApiResponse(HTTP_STATUS.OK, response, "Cart items merged").send(
      res,
    );
  },
);

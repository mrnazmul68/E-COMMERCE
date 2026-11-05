import { ApiError } from "@utils/apiError.js";
import { CartRepository } from "./cart.repository.js";
import { HTTP_STATUS } from "@shared/httpcode.js";
import { ProductRepository } from "@modules/product/product.repository.js";
import type { CartItemInput } from "./cart.validation.js";
import { Types } from "mongoose";

export class CartService {
  constructor(
    private readonly cartRepository = new CartRepository(),
    private readonly productRepository = new ProductRepository(),
  ) {}

  //Get item helper static method
  private async getItem(userId?: string, guestId?: string) {
    if (userId) {
      return await this.cartRepository.findCartByUserId(userId);
    } else if (guestId) {
      return await this.cartRepository.findCartByGuestId(guestId);
    }
    return null;
  }

  // Add an item to the cart
  async addToCart(cartItem: CartItemInput) {
    const { productId, userId, guestId, color, size, quantity } = cartItem;
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product not found");
    }

    let cart = await this.getItem(userId, guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.color === color &&
          p.size === size,
      );

      if (productIndex !== -1) {
        cart.products[productIndex]!.quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          price: product.price,
          image: product.images[0]?.url,
          size,
          color,
          quantity,
        });
      }

      //Recalculate the total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      return await cart.save();
    } else {
      //create a new cart
      const products = [
        {
          productId,
          name: product.name,
          price: product.price,
          image: product.images[0]!.url,
          size,
          color,
          quantity,
        },
      ];
      const totalPrice = product.price * quantity;
      const newCart = await this.cartRepository.createCart({
        userId,
        guestId: guestId ? guestId : "guest_" + Date.now().toString(),
        products,
        totalPrice,
      });

      return newCart;
    }
  }

  //Update an item in the cart
  async updateCartItem(cartItem: CartItemInput) {
    const { productId, userId, guestId, color, size, quantity } = cartItem;

    let cart = await this.getItem(userId, guestId);

    if (!cart) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Cart not found");
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.color === color &&
        p.size === size,
    );

    if (productIndex > -1) {
      //Update the quantity of the existing product
      if (quantity > 0) {
        cart.products[productIndex]!.quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1); //Remove the product from the cart if quantity is 0 or less
      }
    }

    //Recalculate the total price
    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    return await cart.save();
  }

  //Remove an item from the cart
  async deleteCartItem(cartItem: CartItemInput) {
    const { productId, userId, guestId, color, size } = cartItem;

    let cart = await this.getItem(userId, guestId);

    if (!cart) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Cart not found");
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.color === color &&
        p.size === size,
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1); //Remove the product from the cart
    }

    //Recalculate the total price
    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    return await cart.save();
  }

  //Get items from the cart
  async getCartItems(userId?: string, guestId?: string) {
    const cart = await this.getItem(userId, guestId);

    if (!cart) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Cart not found");
    }

    return cart;
  }

  // Merge cart items for a user and guest
  async mergeCartItems(userId: string, guestId: string) {
    const guestCart = await this.cartRepository.findCartByGuestId(guestId);
    const userCart = await this.cartRepository.findCartByUserId(userId);

    // CHANGED: Guest cart না থাকলে existing user cart return করব
    if (!guestCart) {
      if (userCart) return userCart;

      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "No cart found for the specified user or guest",
      );
    }

    // CHANGED: Empty guest cart হলে existing user cart return করব
    if (guestCart.products.length === 0) {
      if (userCart) return userCart;

      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Guest cart is empty");
    }

    // If user cart doesn't exist, assign guest cart to the user
    if (!userCart) {
      guestCart.userId = new Types.ObjectId(userId);
      guestCart.guestId = undefined;

      // CHANGED: Recalculate total price before saving
      guestCart.totalPrice = guestCart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      await guestCart.save();

      // CHANGED: Return the updated cart
      return guestCart;
    }

    // Merge guest cart items into user cart
    guestCart.products.forEach((guestItem) => {
      const productIndex = userCart.products.findIndex(
        (item) =>
          item.productId.toString() === guestItem.productId.toString() &&
          item.size === guestItem.size &&
          item.color === guestItem.color,
      );

      if (productIndex > -1) {
        // If item exists, update its quantity
        userCart.products[productIndex]!.quantity += guestItem.quantity;
      } else {
        // CHANGED: Create a new subdocument instead of reusing
        // the guest cart's Mongoose subdocument and its _id
        userCart.products.push({
          productId: guestItem.productId,
          size: guestItem.size,
          color: guestItem.color,
          price: guestItem.price,
          quantity: guestItem.quantity,
        });
      }
    });

    // Recalculate total price
    userCart.totalPrice = userCart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    await userCart.save();

    // Delete guest cart after successful merge
    await this.cartRepository.deleteCartByGuestId(guestId);

    // CHANGED: Return the updated user cart consistently
    return userCart;
  }
}

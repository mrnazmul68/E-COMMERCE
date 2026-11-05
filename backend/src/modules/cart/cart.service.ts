import { ApiError } from "@utils/apiError.js";
import { CartRepository } from "./cart.repository.js";
import { HTTP_STATUS } from "@shared/httpcode.js";
import { ProductRepository } from "@modules/product/product.repository.js";
import type { CartItemInput } from "./cart.validation.js";

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

  //Merge cart items for a user and guest
  // async mergeCartItems(userId: string, guestId: string) {
  //   const userCart = await this.cartRepository.findCartByUserId(userId);
  //   const guestCart = await this.cartRepository.findCartByGuestId(guestId);

  //   if (!guestCart) {
  //     throw new ApiError(HTTP_STATUS.NOT_FOUND, "Guest cart not found");
  //   }

  //   if (userCart) {
  //     // Merge guest cart items into user cart
  //     for (const guestItem of guestCart.products) {
  //       const existingItemIndex = userCart.products.findIndex(
  //         (item) =>
  //           item.productId.toString() === guestItem.productId.toString() &&
  //           item.color === guestItem.color &&
  //           item.size === guestItem.size,
  //       );

  //       if (existingItemIndex > -1) {
  //         // If the item already exists in the user cart, update the quantity
  //         userCart.products[existingItemIndex]!.quantity += guestItem.quantity;
  //       } else {
  //         // If the item doesn't exist in the user cart, add it
  //         userCart.products.push(guestItem);
  //       }
  //     }

  //     // Recalculate the total price for the user cart
  //     userCart.totalPrice = userCart.products.reduce(
  //       (acc, item) => acc + item.price * item.quantity,
  //       0,
  //     );

  //     await userCart.save();
  //   } else {
  //     // If the user cart doesn't exist, create a new one with guest cart items
  //     const newUserCart = await this.cartRepository.createCart({
  //       userId,
  //       products: guestCart.products,
  //       totalPrice: guestCart.totalPrice,
  //     });

  //     await newUserCart.save();
  //   }

  //   // Delete the guest cart after merging
  //   await this.cartRepository.deleteCartByGuestId(guestId);

  //   return { message: "Carts merged successfully" };
  // }
}

I was here
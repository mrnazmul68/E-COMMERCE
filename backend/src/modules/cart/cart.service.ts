import { ApiError } from "@utils/apiError.js";
import { CartRepository } from "./cart.repository.js";
import type { CartCreateInput } from "./cart.validation.js";
import { HTTP_STATUS } from "@shared/httpcode.js";
import { ProductRepository } from "@modules/product/product.repository.js";
import type { CartDocument } from "./cart.model.js";

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
  async addToCart(cartItem: CartCreateInput) {
    const { productId, userId, guestId, color, size } = cartItem;
    const existingCart = await this.productRepository.findById(productId);

    if (!existingCart) {
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

      if (productIndex) {
      }
    }
  }
}

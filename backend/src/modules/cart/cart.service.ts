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
}

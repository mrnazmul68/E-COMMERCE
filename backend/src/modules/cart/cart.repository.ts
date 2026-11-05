import { Cart } from "./cart.model.js";
import type { CartCreateInput } from "./cart.validation.js";

export class CartRepository {
  constructor(private readonly cartModel = Cart) {}

  // Create a new cart
  async createCart(cartData: CartCreateInput) {
    return this.cartModel.create(cartData);
  }

  // Find a cart by user ID
  async findCartByUserId(userId: string) {
    return this.cartModel.findOne({ userId });
  }

  // Find a cart by guest ID
  async findCartByGuestId(guestId: string) {
    return this.cartModel.findOne({ guestId });
  }
}

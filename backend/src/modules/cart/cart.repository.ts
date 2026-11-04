import { Cart } from "./cart.model.js";

export class CartRepository {
  constructor(private readonly cartModel = Cart) {}

  // Create a new cart
  async createCart(cartData: any) {
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

  // Update a cart by user ID
  async updateCartByUserId(userId: string, cartData: any) {
    return this.cartModel.findOneAndUpdate({ userId }, cartData, { new: true });
  }

  // Remove a cart by user ID
  async removeCartByUserId(userId: string) {
    return this.cartModel.deleteOne({ userId });
  }
}

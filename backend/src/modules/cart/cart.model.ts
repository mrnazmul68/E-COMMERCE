import mongoose, { Schema, type InferSchemaType } from "mongoose";

// Cart item schema
const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  { _id: false, timestamps: true },
);

// Cart schema
const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    guestId: {
      type: String,
    },
    products: [cartItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

export type CartDocument = InferSchemaType<typeof cartSchema>;
export const Cart = mongoose.model("Cart", cartSchema);

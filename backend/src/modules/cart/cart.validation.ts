import z from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

// Cart Item Validation
export const cartItemValidation = z.object({
  body: z.object({
    productId: objectIdSchema,
    userId: objectIdSchema.optional(),
    guestId: z.string().optional(),
    size: z.string().min(1),
    color: z.string().min(1),
    quantity: z.number().int().min(1),
  }),
});

export const cartValidation = z.object({
  body: z.object({
    userId: objectIdSchema.optional(),
    guestId: z.string().optional(),
    products: z
      .array(
        z.object({
          productId: objectIdSchema,
          name: z.string().min(1),
          image: z.string().min(1),
          price: z.number().min(0),
          size: z.string().min(1),
          color: z.string().min(1),
          quantity: z.number().int().min(1),
        }),
      )
      .default([]),

    totalPrice: z.number().min(0).default(0),
  }),
});

// Types
export type CartItemInput = z.infer<typeof cartItemValidation.shape.body>;

export type CartCreateInput = z.infer<typeof cartValidation.shape.body>;

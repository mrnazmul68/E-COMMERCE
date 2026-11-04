import z from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const cartValidation = z.object({
  body: z.object({
    productId: objectIdSchema,
    quantity: z.number().int().min(1),
    size: z.string(),
    color: z.string(),
    guestId: z.string().uuid().optional(),
    userId: objectIdSchema.optional(),
  }),
});

export type CartCreateInput = z.infer<typeof cartValidation.shape.body>;

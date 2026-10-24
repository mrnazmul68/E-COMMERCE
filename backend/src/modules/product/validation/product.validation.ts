import { z } from "zod";

const PRODUCT_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 150,

  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 2000,

  PRICE_MIN: 0,

  IMAGE_MIN: 1,
  IMAGE_MAX: 10,

  CATEGORY_MAX: 100,
  SUB_CATEGORY_MAX: 100,

  SIZE_MAX: 50,
} as const;

const GENDERS = ["men", "women", "kids", "unisex"] as const;

//todo: create product
export const createProductSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          error: "Product name is required",
        })
        .trim()
        .min(2, "Product name must be at least 2 characters")
        .max(150, "Product name cannot exceed 150 characters"),

      description: z
        .string({
          error: "Product description is required",
        })
        .trim()
        .min(10, "Product description must be at least 10 characters")
        .max(2000, "Product description cannot exceed 2000 characters"),

      price: z
        .string({
          error: "Product price is required",
        })
        .trim()
        .min(1, "Product price is required")
        .transform(Number)
        .refine(Number.isFinite, {
          message: "Product price must be a valid number",
        })
        .refine((value) => value >= 0, {
          message: "Product price cannot be negative",
        }),

      discountPrice: z
        .string()
        .trim()
        .optional()
        .transform((value) =>
          value === undefined || value === "" ? undefined : Number(value),
        )
        .refine((value) => value === undefined || Number.isFinite(value), {
          message: "Discount price must be a valid number",
        })
        .refine((value) => value === undefined || value >= 0, {
          message: "Discount price cannot be negative",
        }),

      stock: z
        .string({
          error: "Product stock is required",
        })
        .trim()
        .min(1, "Product stock is required")
        .transform(Number)
        .refine(Number.isFinite, {
          message: "Product stock must be a valid number",
        })
        .refine((value) => value >= 0, {
          message: "Product stock cannot be negative",
        }),

      category: z
        .string({
          error: "Product category is required",
        })
        .trim()
        .min(1, "Product category cannot be empty")
        .max(100, "Product category cannot exceed 100 characters"),

      subCategory: z
        .string({
          error: "Product sub-category is required",
        })
        .trim()
        .min(1, "Product sub-category cannot be empty")
        .max(100, "Product sub-category cannot exceed 100 characters"),

      gender: z.enum(GENDERS, {
        error: `Gender must be one of: ${GENDERS.join(", ")}`,
      }),

      sizes: z
        .array(
          z
            .string()
            .trim()
            .min(1, "Product size cannot be empty")
            .max(50, "Product size cannot exceed 50 characters"),
        )
        .min(1, "At least one product size is required"),

      bestseller: z.preprocess((value) => {
        if (value === undefined) return false;

        if (value === "true") return true;
        if (value === "false") return false;

        return value;
      }, z.boolean()),
    })
    .refine(
      (data) =>
        data.discountPrice === undefined || data.discountPrice < data.price,
      {
        message: "Discount price must be less than the regular price",
        path: ["discountPrice"],
      },
    ),
});

//todo: product image
export const productImageSchema = z
  .array(z.string().url("Invalid product image URL"))
  .min(PRODUCT_LIMITS.IMAGE_MIN, "At least one product image is required")
  .max(
    PRODUCT_LIMITS.IMAGE_MAX,
    `Product cannot have more than ${PRODUCT_LIMITS.IMAGE_MAX} images`,
  );

export type CreateProductInput = z.infer<typeof createProductSchema>;

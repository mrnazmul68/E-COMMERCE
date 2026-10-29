import mongoose from "mongoose";
import { z } from "zod";

// Reusable product field validations
export const PRODUCT_VALIDATION = {
  NAME: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(150, "Product name cannot exceed 150 characters"),

  DESCRIPTION: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(10000, "Description cannot exceed 10000 characters"),

  PRICE: z
    .number()
    .finite("Price must be a finite number")
    .min(0, "Price cannot be negative"),

  DISCOUNT_PRICE: z
    .number()
    .finite("Discount price must be a finite number")
    .min(0, "Discount price cannot be negative"),

  COUNT_IN_STOCK: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .default(0),

  SKU: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(64, "SKU cannot exceed 64 characters")
    .transform((value) => value.toUpperCase()),

  CATEGORY: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(100, "Category cannot exceed 100 characters"),

  BRAND: z
    .string()
    .trim()
    .max(100, "Brand cannot exceed 100 characters")
    .optional(),

  SIZES: z
    .array(z.string().trim().min(1, "Size cannot be empty"))
    .refine((values) => new Set(values).size === values.length, {
      message: "Sizes must be unique",
    })
    .default([]),

  COLORS: z
    .array(z.string().trim().min(1, "Color cannot be empty"))
    .refine((values) => new Set(values).size === values.length, {
      message: "Colors must be unique",
    })
    .default([]),

  COLLECTIONS: z
    .string()
    .trim()
    .min(1, "Collection is required")
    .max(100, "Collection cannot exceed 100 characters"),

  MATERIAL: z
    .string()
    .trim()
    .max(100, "Material cannot exceed 100 characters")
    .optional(),

  GENDER: z.enum(["Men", "Women", "Unisex"]),

  IMAGE: z.object({
    url: z.string().trim().min(1, "Image URL is required"),
    altText: z.string().trim().optional(),
  }),

  IMAGES: z
    .array(
      z.object({
        url: z.string().trim().min(1, "Image URL is required"),
        altText: z.string().trim().optional(),
      }),
    )
    .min(1, "At least one product image is required"),

  META_TITLE: z
    .string()
    .trim()
    .max(70, "Meta title cannot exceed 70 characters")
    .optional(),

  META_DESCRIPTION: z
    .string()
    .trim()
    .max(170, "Meta description cannot exceed 170 characters")
    .optional(),

  META_KEYWORDS: z.string().optional(),

  DIMENSIONS: z
    .object({
      length: z.number().finite().min(0),
      width: z.number().finite().min(0),
      height: z.number().finite().min(0),
    })
    .optional(),

  WEIGHT: z
    .number()
    .finite("Weight must be a finite number")
    .min(0, "Weight cannot be negative")
    .optional(),

  TAGS: z.array(z.string().trim().min(1, "Tag cannot be empty")).default([]),
} as const;
// Product base schema
const productBaseSchema = z
  .object({
    name: PRODUCT_VALIDATION.NAME,
    description: PRODUCT_VALIDATION.DESCRIPTION,
    price: PRODUCT_VALIDATION.PRICE,
    discountPrice: PRODUCT_VALIDATION.DISCOUNT_PRICE.optional(),
    countInStock: PRODUCT_VALIDATION.COUNT_IN_STOCK,
    sku: PRODUCT_VALIDATION.SKU,
    category: PRODUCT_VALIDATION.CATEGORY,
    brand: PRODUCT_VALIDATION.BRAND,
    sizes: PRODUCT_VALIDATION.SIZES,
    colors: PRODUCT_VALIDATION.COLORS,
    collections: PRODUCT_VALIDATION.COLLECTIONS,
    material: PRODUCT_VALIDATION.MATERIAL,
    gender: PRODUCT_VALIDATION.GENDER,
    images: PRODUCT_VALIDATION.IMAGES,
    tags: PRODUCT_VALIDATION.TAGS,
    metaTitle: PRODUCT_VALIDATION.META_TITLE,
    metaDescription: PRODUCT_VALIDATION.META_DESCRIPTION,
    metaKeywords: PRODUCT_VALIDATION.META_KEYWORDS,
    dimensions: PRODUCT_VALIDATION.DIMENSIONS,
    weight: PRODUCT_VALIDATION.WEIGHT,
  })
  .strict();

// ২. Create Validation (সব ফিল্ড required + discount চেক)
export const PRODUCT_CREATE_VALIDATION = z.object({
  body: productBaseSchema.refine(
    (data) =>
      data.discountPrice === undefined || data.discountPrice <= data.price,
    {
      message: "Discount price cannot exceed regular price",
      path: ["discountPrice"],
    },
  ),
});

// ৩. Update Validation (সব ফিল্ড optional + discount চেক)
export const PRODUCT_UPDATE_VALIDATION = z.object({
  body: productBaseSchema
    .partial() // এখন যেকোনো ফিল্ড অপশনাল
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required for update",
    })
    .refine(
      (data) =>
        data.discountPrice === undefined ||
        data.price === undefined ||
        data.discountPrice <= data.price,
      {
        message:
          "Discount price cannot exceed regular price when both prices are provided",
        path: ["discountPrice"],
      },
    ),
});
// Inferred types
export type ProductCreateInput = z.infer<
  typeof PRODUCT_CREATE_VALIDATION.shape.body
>;

export type ProductUpdateInput = z.infer<
  typeof PRODUCT_UPDATE_VALIDATION.shape.body
>;

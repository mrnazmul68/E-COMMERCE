import mongoose, { Schema } from "mongoose";

export type ProductGender = "Men" | "Women" | "Unisex";

export const PRODUCT_GENDER_VALUES = [
  "Men",
  "Women",
  "Unisex",
] as const satisfies readonly ProductGender[];

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [10000, "Description cannot exceed 10000 characters"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      validate: {
        validator(this: { price?: number }, value: number | undefined) {
          return value == null || this.price == null || value <= this.price;
        },
        message: "Discount price cannot exceed regular price",
      },
    },

    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be an integer",
      },
    },

    sku: {
      type: String,
      required: [true, "SKU is required"],
      trim: true,
      uppercase: true,
      maxlength: [64, "SKU cannot exceed 64 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: [100, "Category cannot exceed 100 characters"],
    },

    brand: {
      type: String,
      trim: true,
      maxlength: [100, "Brand cannot exceed 100 characters"],
    },

    sizes: {
      type: [String],
      required: true,
      default: [],
      validate: {
        validator: (values: string[]) =>
          values.every(Boolean) && new Set(values).size === values.length,
        message: "Sizes must be non-empty and unique",
      },
    },

    colors: {
      type: [String],
      required: true,
      default: [],
      validate: {
        validator: (values: string[]) =>
          values.every(Boolean) && new Set(values).size === values.length,
        message: "Colors must be non-empty and unique",
      },
    },

    collections: {
      type: String,
      required: [true, "Collection is required"],
      trim: true,
      maxlength: [100, "Collection cannot exceed 100 characters"],
    },

    material: {
      type: String,
      trim: true,
      maxlength: [100, "Material cannot exceed 100 characters"],
    },

    gender: {
      type: String,
      enum: {
        values: PRODUCT_GENDER_VALUES,
        message: "Gender must be Men, Women, or Unisex",
      },
      required: true,
    },

    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          altText: {
            type: String,
          },
        },
      ],
      required: true,
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
      min: [0, "Ratings cannot be below 0"],
      max: [5, "Ratings cannot exceed 5"],
    },

    numReviews: {
      type: Number,
      default: 0,
      min: [0, "Review count cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Review count must be an integer",
      },
    },

    tags: [String],

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product creator is required"],
      index: true,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70, "Meta title cannot exceed 70 characters"],
    },

    metaDescription: {
      type: String,
      trim: true,
      maxlength: [170, "Meta description cannot exceed 170 characters"],
    },

    metaKeywords: {
      type: String,
    },

    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Product = mongoose.model("Product", productSchema);

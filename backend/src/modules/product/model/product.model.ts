import mongoose, {
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from "mongoose";

const productSchema = new mongoose.Schema(
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
      minlength: [10, "Product description must be at least 10 characters"],
      maxlength: [2000, "Product description cannot exceed 2000 characters"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock can't be negative"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price cannot be negative"],
    },

    image: {
      type: [String],
      required: [true, "Product image is required"],
      validate: {
        validator: (images: string[]) => images.length > 0,
        message: "At least one product image is required",
      },
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },

    subCategory: {
      type: String,
      required: [true, "Product sub-category is required"],
      trim: true,
    },

    sizes: {
      type: [String],
      required: [true, "Product sizes are required"],
    },

    bestseller: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["men", "women", "kids", "unisex"],
      required: [true, "Gender is required"],
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type Product = InferSchemaType<typeof productSchema>;

export type ProductDocument = HydratedDocument<Product>;

export type ProductModel = Model<ProductDocument>;

export const ProductModel = mongoose.model<Product>("Product", productSchema);

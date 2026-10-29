import { VALIDATION } from "@shared/constants.js";
import mongoose, {
  type HydratedDocumentFromSchema,
  type InferSchemaType,
} from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, VALIDATION.NAME.REQUIRED_MESSAGE],
      trim: true,

      minlength: [
        VALIDATION.NAME.MIN_LENGTH,
        VALIDATION.NAME.MIN_LENGTH_MESSAGE,
      ],

      maxlength: [
        VALIDATION.NAME.MAX_LENGTH,
        VALIDATION.NAME.MAX_LENGTH_MESSAGE,
      ],
    },

    email: {
      type: String,
      required: [true, VALIDATION.EMAIL.REQUIRED_MESSAGE],
      unique: true,
      lowercase: true,
      trim: true,

      maxlength: [
        VALIDATION.EMAIL.MAX_LENGTH,
        VALIDATION.EMAIL.MAX_LENGTH_MESSAGE,
      ],

      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, VALIDATION.EMAIL.INVALID_MESSAGE],
    },

    password: {
      type: String,
      required: [true, VALIDATION.PASSWORD.REQUIRED_MESSAGE],
      select: false,

      minlength: [
        VALIDATION.PASSWORD.MIN_LENGTH,
        VALIDATION.PASSWORD.MIN_LENGTH_MESSAGE,
      ],

      maxlength: [
        VALIDATION.PASSWORD.MAX_LENGTH,
        VALIDATION.PASSWORD.MAX_LENGTH_MESSAGE,
      ],
    },

    role: {
      type: String,

      enum: {
        values: VALIDATION.ROLE.VALUES,
        message: VALIDATION.ROLE.INVALID_MESSAGE,
      },

      default: "customer",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ role: 1 });

export type UserType = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocumentFromSchema<typeof userSchema>;
export const User = mongoose.model("User", userSchema);

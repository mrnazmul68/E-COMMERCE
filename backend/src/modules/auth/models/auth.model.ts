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

    /*
     * Google's `sub` claim. It is intentionally absent for password accounts;
     * do not give it a default value, otherwise the sparse unique index would
     * treat every password account as a duplicate `null`.
     */
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      maxlength: [255, "Google id cannot exceed 255 characters"],
    },

    password: {
      type: String,
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

    tokenVersion: {
      type: Number,
      default: 0,
      min: 0,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ role: 1 });

/*
 * Google-only accounts authenticate through Google and intentionally have no
 * password. Every other account (including linked accounts) must still have
 * one.
 */
userSchema.pre("validate", function () {
  /*
   * Only enforce this for new documents. Existing documents are often loaded
   * without the password field because it is `select: false`; validating them
   * again would incorrectly fail unrelated updates.
   */
  if (this.isNew && !this.googleId && !this.password) {
    this.invalidate("password", VALIDATION.PASSWORD.REQUIRED_MESSAGE);
  }
});

export type UserType = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocumentFromSchema<typeof userSchema>;

export const User = mongoose.model("User", userSchema);

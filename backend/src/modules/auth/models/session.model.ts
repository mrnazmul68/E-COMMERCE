import { SESSION_CONSTANTS, SESSION_VALIDATION } from "@shared/constants.js";
import mongoose, {
  type HydratedDocumentFromSchema,
  type InferSchemaType,
  type Model,
} from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, SESSION_VALIDATION.USER_REQUIRED],
    },

    refreshTokenHash: {
      type: String,
      required: [true, SESSION_VALIDATION.REFRESH_TOKEN_HASH_REQUIRED],
      minlength: [32, SESSION_VALIDATION.REFRESH_TOKEN_HASH_MIN_LENGTH],
      maxlength: [
        SESSION_CONSTANTS.REFRESH_TOKEN_HASH_MAX_LENGTH,
        SESSION_VALIDATION.REFRESH_TOKEN_HASH_MAX_LENGTH,
      ],
      trim: true,
      select: false,
    },

    ip: {
      type: String,
      required: [true, SESSION_VALIDATION.IP_REQUIRED],
      maxlength: [
        SESSION_CONSTANTS.IP_MAX_LENGTH,
        SESSION_VALIDATION.IP_MAX_LENGTH,
      ],
      trim: true,
    },

    userAgent: {
      type: String,
      required: [true, SESSION_VALIDATION.USER_AGENT_REQUIRED],
      maxlength: [
        SESSION_CONSTANTS.USER_AGENT_MAX_LENGTH,
        SESSION_VALIDATION.USER_AGENT_MAX_LENGTH,
      ],
      trim: true,
    },

    revoked: {
      type: Boolean,
      default: SESSION_CONSTANTS.DEFAULT_REVOKED,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: SESSION_CONSTANTS.COLLECTION_NAME,
  },
);

// Indexes
sessionSchema.index({ user: 1, revoked: 1 });
sessionSchema.index({ createdAt: 1 });

// Types inferred directly from schema
export type SessionType = InferSchemaType<typeof sessionSchema>;

export type SessionDocument = HydratedDocumentFromSchema<typeof sessionSchema>;

// Model
export const SessionModel: Model<SessionType> = mongoose.model<SessionType>(
  "sessions",
  sessionSchema,
);

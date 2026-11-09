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
      ref: "User",
      required: [true, SESSION_VALIDATION.USER_REQUIRED],
      index: true,
    },

    currentTokenHash: {
      type: String,
      required: [true, SESSION_VALIDATION.REFRESH_TOKEN_HASH_REQUIRED],
      minlength: [32, SESSION_VALIDATION.REFRESH_TOKEN_HASH_MIN_LENGTH],
      maxlength: [
        SESSION_CONSTANTS.REFRESH_TOKEN_HASH_MAX_LENGTH,
        SESSION_VALIDATION.REFRESH_TOKEN_HASH_MAX_LENGTH,
      ],
      select: false,
    },

    previousTokenHash: {
      type: String,
      default: null,
      maxlength: [
        SESSION_CONSTANTS.REFRESH_TOKEN_HASH_MAX_LENGTH,
        SESSION_VALIDATION.REFRESH_TOKEN_HASH_MAX_LENGTH,
      ],
      select: false,
    },

    currentJti: {
      type: String,
      required: true,
    },

    previousJti: {
      type: String,
      default: null,
    },

    rotatedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    ip: {
      type: String,
      default: "unknown",
      maxlength: [
        SESSION_CONSTANTS.IP_MAX_LENGTH,
        SESSION_VALIDATION.IP_MAX_LENGTH,
      ],
      trim: true,
    },

    userAgent: {
      type: String,
      default: "unknown",
      maxlength: [
        SESSION_CONSTANTS.USER_AGENT_MAX_LENGTH,
        SESSION_VALIDATION.USER_AGENT_MAX_LENGTH,
      ],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: SESSION_CONSTANTS.COLLECTION_NAME,
  },
);

sessionSchema.index({ user: 1, revokedAt: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type SessionType = InferSchemaType<typeof sessionSchema>;

export type SessionDocument = HydratedDocumentFromSchema<typeof sessionSchema>;

export const SessionModel: Model<SessionType> = mongoose.model<SessionType>(
  "Session",
  sessionSchema,
);

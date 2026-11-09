import { z } from "zod";

import { integerFromEnv } from "@config/env/primitives.js";

const PORT_BOUNDS = { min: 1, max: 65535 } as const;

export const envSchema = z.object({
  PORT: integerFromEnv(5000, PORT_BOUNDS),

  NODE_ENV: z.enum(["development", "production"]).default("development"),

  CORS_ORIGINS: z
    .string()
    .trim()
    .default("http://localhost:5173,http://127.0.0.1:5173")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),

  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),

  COOKIE_DOMAIN: z.string().trim().optional(),

  JWT_ACCESS_TTL: z
    .string()
    .trim()
    .regex(/^\d+[smhd]$/, "Use a duration such as 15m, 1h, or 7d")
    .default("15m"),

  REFRESH_TOKEN_TTL_DAYS: integerFromEnv(30, { min: 1, max: 90 }),

  TRUST_PROXY_HOPS: integerFromEnv(0, { min: 0, max: 10 }),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .optional(),

  MONGODB_URI: z
    .string()
    .trim()
    .min(1, "Mongodb uri is required")
    .max(500, "MongoDB URI cannot exceed 500 characters")
    .startsWith("mongodb", {
      message: "MongoDB uri must start with mongodb",
    }),

  JWT_ACCESS_SECRET: z
    .string()
    .trim()
    .min(32, "JWT access secret must be at least 32 characters")
    .regex(
      /^[0-9a-f]+$/i,
      "JWT access secret must contain only hexadecimal characters",
    ),

  JWT_REFRESH_SECRET: z
    .string()
    .trim()
    .min(32, "JWT refresh secret must be at least 32 characters")
    .regex(
      /^[0-9a-f]+$/i,
      "JWT refresh secret must contain only hexadecimal characters",
    ),

  ADMIN_EMAIL: z
    .string()
    .trim()
    .email("Admin email must be valid")
    .default("admin@example.com"),

  ADMIN_PASSWORD: z
    .string()
    .min(8, "Admin password must be at least 8 characters")
    .default("Admin@12345"),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z
    .string()
    .trim()
    .min(1, "Cloudinary cloud name is required")
    .max(100, "Cloudinary cloud name cannot exceed 100 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Cloudinary cloud name contains invalid characters",
    ),

  CLOUDINARY_API_KEY: z
    .string()
    .trim()
    .min(1, "Cloudinary API key is required")
    .regex(/^\d+$/, "Cloudinary API key must contain only numbers"),

  CLOUDINARY_API_SECRET: z
    .string()
    .trim()
    .min(1, "Cloudinary API secret is required")
    .max(500, "Cloudinary API secret cannot exceed 500 characters"),
    
});

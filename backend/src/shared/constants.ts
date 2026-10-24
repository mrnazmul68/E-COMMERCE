export const VALIDATION = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    MIN_LENGTH_MESSAGE: "Name must be at least 2 characters long",
    MAX_LENGTH_MESSAGE: "Name cannot exceed 50 characters",
    REQUIRED_MESSAGE: "Name is required",
  },

  EMAIL: {
    MAX_LENGTH: 255,
    REQUIRED_MESSAGE: "Email is required",
    INVALID_MESSAGE: "Please provide a valid email address",
    MAX_LENGTH_MESSAGE: "Email cannot exceed 255 characters",
  },

  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRED_MESSAGE: "Password is required",
    MIN_LENGTH_MESSAGE: "Password must be at least 8 characters long",
    MAX_LENGTH_MESSAGE: "Password cannot exceed 128 characters",
  },

  AVATAR: {
    MAX_LENGTH: 500,

    INVALID_MESSAGE: "Avatar must be a valid URL",

    MAX_LENGTH_MESSAGE: "Avatar URL cannot exceed 500 characters",
  },

  ROLE: {
    VALUES: ["user", "admin"],
    INVALID_MESSAGE: "Role must be either user or admin",
  },
} as const;

export const SESSION_VALIDATION = {
  USER_REQUIRED: "User is required",

  REFRESH_TOKEN_HASH_REQUIRED: "Refresh token hash is required",
  REFRESH_TOKEN_HASH_MIN_LENGTH:
    "Refresh token hash must be at least 32 characters",
  REFRESH_TOKEN_HASH_MAX_LENGTH:
    "Refresh token hash must not exceed 255 characters",

  IP_REQUIRED: "IP address is required",
  IP_MAX_LENGTH: "IP address must not exceed 45 characters",

  USER_AGENT_REQUIRED: "User agent is required",
  USER_AGENT_MAX_LENGTH: "User agent must not exceed 500 characters",
} as const;

export const SESSION_CONSTANTS = {
  COLLECTION_NAME: "sessions",

  REFRESH_TOKEN_HASH_MAX_LENGTH: 255,

  IP_MAX_LENGTH: 45,

  USER_AGENT_MAX_LENGTH: 500,

  DEFAULT_REVOKED: false,
} as const;

export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5 MB

  MAX_FILES: 10,

  ALLOWED_MIME_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ],
} as const;
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";

import mongoose from "mongoose";
import multer from "multer";
import { ZodError } from "zod";

import { HTTP_STATUS } from "@shared/httpcode.js";
import type { FieldError } from "@shared/http/envelope.js";
import { ApiResponse } from "@utils/apiResponse.js";
import { ApiError } from "@utils/apiError.js";

interface ErrorLike {
  name?: string;
  code?: number | string;
  statusCode?: number;
  status?: number;
  expose?: boolean;
  message?: string;
  errors?: Record<string, { path?: string; message?: string }> | unknown[];
  path?: string;
  type?: string;
  stack?: string;
  issues?: Array<{
    path: PropertyKey[];
    message: string;
  }>;
}

interface NormalizedError {
  statusCode: number;
  message: string;
  errors?: readonly FieldError[];
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isErrorLike = (value: unknown): value is ErrorLike => isObject(value);

const getErrorMessage = (err: ErrorLike): string =>
  typeof err.message === "string" && err.message.length > 0
    ? err.message
    : "Internal server error";

const normalizeZodError = (err: ZodError): NormalizedError => {
  const errors: FieldError[] = err.issues.map((issue) => ({
    field: issue.path.length ? issue.path.map(String).join(".") : "unknown",
    message: issue.message,
  }));

  return {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    message: "Validation error",
    errors,
  };
};

const normalizeMongooseValidationError = (
  err: mongoose.Error.ValidationError,
): NormalizedError => {
  const errors: FieldError[] = Object.values(err.errors).map((error) => ({
    field: error.path,
    message: error.message,
  }));

  return {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    message: "Validation error",
    errors,
  };
};

const normalizeMongooseCastError = (
  err: mongoose.Error.CastError,
): NormalizedError => ({
  statusCode: HTTP_STATUS.BAD_REQUEST,
  message: `Invalid value for ${err.path}`,
  errors: [
    {
      field: err.path,
      message: `Invalid ${err.path}`,
    },
  ],
});

const normalizeDuplicateKeyError = (err: ErrorLike): NormalizedError => {
  const fields: FieldError[] = [];

  if (isObject(err)) {
    const keyValue = err.keyValue;

    if (isObject(keyValue)) {
      for (const [field, value] of Object.entries(keyValue)) {
        fields.push({
          field,
          message: `${field} already exists`,
        });
      }
    }
  }

  return {
    statusCode: HTTP_STATUS.CONFLICT,
    message: "Duplicate resource",
    errors: fields.length ? fields : undefined,
  };
};

const normalizeError = (err: unknown): NormalizedError => {
  if (err instanceof multer.MulterError) {
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message:
        err.field ||
        (err.code === "LIMIT_FILE_SIZE"
          ? "Product image must be 5 MB or smaller"
          : "Invalid product image upload"),
    };
  }

  /*
   * 1. Zod validation error
   */
  if (err instanceof ZodError) {
    return normalizeZodError(err);
  }

  /*
   * 2. Mongoose validation error
   */
  if (err instanceof mongoose.Error.ValidationError) {
    return normalizeMongooseValidationError(err);
  }

  /*
   * 3. Mongoose invalid ObjectId / CastError
   */
  if (err instanceof mongoose.Error.CastError) {
    return normalizeMongooseCastError(err);
  }

  /*
   * 4. Our custom ApiError
   */
  if (err instanceof ApiError) {
    return {
      statusCode: err.statusCode,
      message: err.message,
    };
  }

  /*
   * 5. Unknown object-like error
   */
  if (isErrorLike(err)) {
    /*
     * MongoDB duplicate key error
     *
     * MongoDB duplicate key error normally has:
     * code: 11000
     */
    if (err.code === 11000) {
      return normalizeDuplicateKeyError(err);
    }

    /*
     * Generic HTTP-style errors
     */
    const statusCode =
      typeof err.statusCode === "number"
        ? err.statusCode
        : typeof err.status === "number"
          ? err.status
          : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    /*
     * Never expose internal server error details
     * to the client in production.
     */
    const isServerError = statusCode >= 500;

    return {
      statusCode,
      message: isServerError ? "Internal server error" : getErrorMessage(err),
    };
  }

  /*
   * 6. Normal JavaScript Error
   */
  if (err instanceof Error) {
    return {
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    };
  }

  /*
   * 7. Completely unknown error
   */
  return {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: "Internal server error",
  };
};

export const errorMiddleware: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  /*
   * Express error middleware must have 4 arguments.
   * `next` is intentionally available even if not normally needed.
   */
  void next;

  const normalized = normalizeError(err);

  /*
   * Don't send another response if headers
   * have already been sent.
   */
  if (res.headersSent) {
    return;
  }

  /*
   * Log the original error.
   *
   * Replace console.error with your project logger
   * (Pino/Winston) later.
   */
  console.error({
    error: err,
    method: req.method,
    url: req.originalUrl,
    statusCode: normalized.statusCode,
  });

  /*
   * Don't expose internal error details.
   */
  const response = new ApiResponse(
    normalized.statusCode,
    normalized.errors ? { errors: normalized.errors } : null,
    normalized.message,
  );

  response.send(res);
};

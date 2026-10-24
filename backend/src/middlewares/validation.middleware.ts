import { HTTP_STATUS } from "@shared/httpcode.js";
import { ApiResponse } from "@utils/apiResponse.js";

import type { NextFunction, Request, RequestHandler, Response } from "express";

import { ZodError, type ZodType } from "zod";

interface ValidatedRequestParts {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

export const validate =
  (schema: ZodType<ValidatedRequestParts>): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body !== undefined) {
        Object.defineProperty(req, "body", {
          value: parsed.body,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }

      if (parsed.query !== undefined) {
        Object.defineProperty(req, "query", {
          value: parsed.query,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }

      if (parsed.params !== undefined) {
        Object.defineProperty(req, "params", {
          value: parsed.params,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }

      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.length ? issue.path.join(".") : "unknown",
          message: issue.message,
        }));

        new ApiResponse(
          HTTP_STATUS.BAD_REQUEST,
          { errors },
          "Validation error",
        ).send(res);

        return;
      }

      next(error);
    }
  };

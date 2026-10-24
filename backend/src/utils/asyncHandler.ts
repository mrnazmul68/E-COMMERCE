import type { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncHandler =
  (reqHandler: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(reqHandler(req, res, next)).catch(next);
  };

import type { UserDocument } from "@modules/auth/models/auth.model.ts";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      sessionId?: string;
    }
  }
}

export {};


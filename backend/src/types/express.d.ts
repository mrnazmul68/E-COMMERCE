import type { UserDocument } from "@modules/auth/models/auth.model.ts";
import type { CasheUserType } from "@modules/auth/user/userAuth.types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument | CasheUserType;
      sessionId?: string;
    }
  }
}

export {};


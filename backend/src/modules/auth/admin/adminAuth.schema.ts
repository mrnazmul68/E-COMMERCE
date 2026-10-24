import { z } from "zod";

export const ADMIN_LOGIN_VALIDATION = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email("Admin email must be valid"),
    password: z.string().min(8, "Admin password must be at least 8 characters"),
  }),
});

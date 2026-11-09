import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "@middlewares/error.middleware.js";
import { router } from "@routes/routes.js";
import type { Request, Response } from "express";
import { env } from "@config/env.js";

export const app = express();

if (env.TRUST_PROXY_HOPS > 0) {
  app.set("trust proxy", env.TRUST_PROXY_HOPS);
}

app.disable("x-powered-by");
app.use(
  helmet({
    hsts: env.isProduction,
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    optionsSuccessStatus: 204,
    maxAge: 86_400,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

export const API_TIMEOUT = 15_000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.use("/api/v1", router);

app.use(errorMiddleware);

import express from "express";
import cors from "cors";
import { errorMiddleware } from "@middlewares/error.middleware.js";
import { router } from "@routes/routes.js";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";

export const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

export const API_TIMEOUT = 15_000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.use("/api/v1", router);

app.use(errorMiddleware);

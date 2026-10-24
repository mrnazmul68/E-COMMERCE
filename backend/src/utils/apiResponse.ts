import type { Response } from "express";

export class ApiResponse<T = unknown> {
  public success: boolean;
  public statusCode: number;
  public data: T;
  public message: string;

  constructor(statusCode: number, data: T, message: string = "Successfull") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  send(res: Response): Response {
    return res.status(this.statusCode).json(this);
  }
}

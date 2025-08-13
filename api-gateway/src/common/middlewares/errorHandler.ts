import { Request, Response, NextFunction } from "express";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = error.status || 500;
  const isProduction = process.env.NODE_ENV === "production";
  const message =
    statusCode === 500 && isProduction
      ? "Internal Server Error"
      : error.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    error: isProduction ? error.message : error,
    stack: isProduction ? null : error.stack,
  });

  next();
}

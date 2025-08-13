import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../types";
import { env } from "../config/env";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({
      message: "Access token required",
      error: "Unauthorized",
      success: false,
    });
  }

  const jwtSecret = env.ACCESS_TOKEN_SECRET as string;
  if (!jwtSecret) {
    return res.status(500).json({
      message: "JWT secret not configured",
      error: "Internal server error",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded as JWTPayload;
    return next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
      success: false,
    });
  }
}

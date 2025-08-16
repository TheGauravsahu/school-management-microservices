import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload; // Attach user info to request
    }
  }
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  PARENT = "PARENT",
  ADMIN = "ADMIN",
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LEAVE = "LEAVE",
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload extends JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
  exp: number; // Expiration time
  iat: number; // Issued at
}

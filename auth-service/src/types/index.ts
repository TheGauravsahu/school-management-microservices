import { Request } from "express";
import { UserRole, JWTPayload } from "../../../shared/types";

declare global {
  namespace Express {
    export interface Request {
      user?: JWTPayload;
    }
  }
}

export interface UserData {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterUserRequest extends Request {
  body: UserData;
}

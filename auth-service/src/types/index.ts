import { Request } from "express";
import { UserRole } from "../common/types";

export interface UserData {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterUserRequest extends Request {
  body: UserData;
}

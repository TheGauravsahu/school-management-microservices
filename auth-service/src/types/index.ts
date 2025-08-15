import { Request } from "express";
import { UserRole } from "../common/types";

export interface UserData {
  name: string;
  email: string;
  password: string | null;
  role: UserRole;
  externalId: string;
}

export interface RegisterUserRequest extends Request {
  body: UserData;
}

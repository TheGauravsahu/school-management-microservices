import mongoose from "mongoose";
import "fastify";
import { JWTPayload } from "../common/types";

declare module "fastify" {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}

export interface IParent extends mongoose.Document {
  userId: string; // auth-service
  studentIds: string[]; // student-service
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  aadharNumber: string;
  address: {
    village: string;
    post: string;
    block: string;
    district: string;
    state: string;
    zipCode: string;
  };
}

export interface ParentQueryFilters {
  page?: number;
  limit?: number;
  skip?: number;
  exportMode?: boolean;
}

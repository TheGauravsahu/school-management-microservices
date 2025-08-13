import { Document } from "mongoose";
import { JWTPayload } from "../common/types";

declare module "fastify" {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}

export interface ITeacher extends Document {
  userId: string; // from auth-service\

  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;

  aadharNumber: string;
  mobileNumber: string;
  email: string;

  dateOfBirth: string;
  experience: string;
  gender: GENDER_ENUM;
  subject: SUBJECTS_ENUM;

  address: {
    village: string;
    post: string;
    block: string;
    district: string;
    state: string;
    zipCode: string;
  };
}

export enum GENDER_ENUM {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "other",
}

export enum SUBJECTS_ENUM {
  MATHS = "Maths",
  SCIENCE = "Science",
  ENGLISH = "English",
  SOCIAL_STUDIES = "Social_Studies",
  COMPUTER = "Computer",
  GENERAL_KNOWLEDGE = "General_Knowledge",
}

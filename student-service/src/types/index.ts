import mongoose from "mongoose";
import {
  RELIGION_ENUM,
  BLOOD_GROUP_ENUM,
  CATEGORY_ENUM,
  NATIONALITY_ENUM,
  GENDER_ENUM,
} from "../models/consonants";

export interface IStudent extends mongoose.Document {
  userId: string; // from auth-service
  parentId: string; // from parent-service

  email: string;
  mobileNumber: string;
  aadhaarNumber: string;
  profilePicture?: string;

  bloodGroup: (typeof BLOOD_GROUP_ENUM)[number];
  religion: (typeof RELIGION_ENUM)[number];
  category: (typeof CATEGORY_ENUM)[number];
  nationality: (typeof NATIONALITY_ENUM)[number];

  dateOfBirth: Date;
  firstName: string;
  lastName: string;
  gender: (typeof GENDER_ENUM)[number];
  age: number;
  class: number;
  section: string;
  rollNumber: number;

  fatherName: string;
  motherName: string;
  address: {
    village: string;
    post: string;
    block: string;
    district: string;
    state: string;
    zipCode: string;
  };
}

export interface StudentQueryFilters {
  classNumber?: number;
  section?: string;
  gender?: string;
  parentId?: string;
  page?: number;
  limit?: number;
  skip?: number;
  exportMode?: boolean;
}

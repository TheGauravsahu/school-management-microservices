import mongoose from "mongoose";
import { GENDER_ENUM, ITeacher, SUBJECTS_ENUM } from "../types";

const teacherSchema = new mongoose.Schema<ITeacher>({
  userId: { type: String, required: true },

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },

  aadharNumber: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },

  dateOfBirth: { type: String, required: true },
  experience: { type: String, required: true },
  gender: { type: String, enum: Object.values(GENDER_ENUM), required: true },
  subject: { type: String, enum: Object.values(SUBJECTS_ENUM), required: true },

  address: {
    village: { type: String, required: true },
    post: { type: String, required: true },
    block: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
});

export const teacherModel = mongoose.model<ITeacher>("teachers", teacherSchema);

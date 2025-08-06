import mongoose from "mongoose";
import logger from "../config/logger";
import { generateProfilePicture } from "../utils/profilePicGeneration";

export interface IStudent extends mongoose.Document {
  userId: string; // from auth-service
  parentId: string; // from parent-service
  email: string;
  mobileNumber: string;
  adharNumber: string;
  profilePicture: string;
  dateOfBirth: Date;
  firstName: string;
  lastName: string;
  age: number;
  class: string;
  section: string;
  rollNumber: string;
  fathrerName: string;
  mothersName: string;
  address: {
    village: string;
    post: string;
    district: string;
    state: string;
    zipCode: string;
  };
}

const studentSchema = new mongoose.Schema<IStudent>(
  {
    userId: { type: String, required: true },
    parentId: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    mobileNumber: { type: String, required: true, unique: true },
    adharNumber: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    dateOfBirth: { type: Date, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1 },
    class: { type: String, required: true },
    section: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    fathrerName: { type: String, required: true },
    mothersName: { type: String, required: true },
    address: {
      village: { type: String, required: true },
      post: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.pre("save", async function (next) {
  if (
    this.isNew ||
    this.isModified("firstName") ||
    this.isModified("lastName") ||
    !this.profilePicture
  ) {
    if (this.firstName && this.lastName) {
      const profilePicUrl = await generateProfilePicture(
        this.firstName,
        this.lastName,
        this.userId
      );
      if (profilePicUrl) {
        this.profilePicture = profilePicUrl;
        logger.info(
          "Generated profile picture for",
          this.firstName,
          this.lastName
        );
      }
    } else {
      logger.warn(
        "Cannot generate avatar: required data (firstName, lastName, or userId) missing for student.",
        {
          studentId: this._id,
          email: this.email,
        }
      );
    }
  }
  next();
});

export const studentModel = mongoose.model<IStudent>("students", studentSchema);

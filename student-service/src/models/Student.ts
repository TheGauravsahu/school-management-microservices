import mongoose from "mongoose";
import logger from "../config/logger";
import { generateProfilePicture } from "../utils/profilePicGeneration";
import { IStudent } from "../types";
import {
  RELIGION_ENUM,
  BLOOD_GROUP_ENUM,
  CATEGORY_ENUM,
  NATIONALITY_ENUM,
  GENDER_ENUM,
} from "./consonants";


const studentSchema = new mongoose.Schema<IStudent>(
  {
    userId: { type: String, required: true },
    parentId: { type: String, required: true },

    email: { type: String, required: true, unique: true, trim: true },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/,
    },
    aadhaarNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{12}$/,
    },
    profilePicture: { type: String, required: false },

    bloodGroup: { type: String, enum: BLOOD_GROUP_ENUM, required: true },
    religion: { type: String, enum: RELIGION_ENUM, required: true },
    category: { type: String, enum: CATEGORY_ENUM, required: true },
    nationality: { type: String, enum: NATIONALITY_ENUM, required: true },

    dateOfBirth: { type: Date, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: GENDER_ENUM },
    age: { type: Number, required: true, min: 1 },
    class: { type: Number, required: true },
    section: { type: String, required: true },
    rollNumber: { type: Number, required: true, unique: true },

    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    address: {
      village: { type: String, required: true },
      post: { type: String, required: true },
      block: { type: String, required: true },
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

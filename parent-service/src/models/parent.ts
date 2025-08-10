import { IParent } from "./../types";
import mongoose from "mongoose";

const parentSchema = new mongoose.Schema<IParent>({
  userId: { type: String, required: true },
  studentIds: [{ type: String, requied: true }],
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  address: {
    village: { type: String, required: true },
    post: { type: String, required: true },
    block: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
});

export const parentModel = mongoose.model<IParent>("parents", parentSchema);

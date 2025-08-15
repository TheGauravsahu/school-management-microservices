import { checkSchema } from "express-validator";

export default checkSchema({
  name: {
    trim: true,
    errorMessage: "Name is required!",
    notEmpty: true,
  },
  email: {
    trim: true,
    errorMessage: "Email is required!",
    notEmpty: true,
    isEmail: {
      errorMessage: "Email should be a valid email",
    },
  },
  password: {
    trim: true,
    errorMessage: "Last name is required!",
    notEmpty: true,
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: "Password length should be at least 8 chars!",
    },
  },
  role: {
    errorMessage: "Role is required!",
    notEmpty: true,
    trim: true,
  },
  externalId: {
    trim: true,
    errorMessage: "External Id is required!",
    notEmpty: true,
  },
});

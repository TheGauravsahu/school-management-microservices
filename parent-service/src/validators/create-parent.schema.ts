import { FastifySchema } from "fastify";

const createParentSchema: FastifySchema = {
  body: {
    type: "object",
    required: [
      "firstName",
      "lastName",
      "email",
      "mobileNumber",
      "aadharNumber",
      "address",
    ],
    properties: {
      firstName: {
        type: "string",
        minLength: 2,
        maxLength: 50,
        errorMessage: "First name must be 2–50 characters",
      },
      lastName: {
        type: "string",
        minLength: 2,
        maxLength: 50,
        errorMessage: "Last name must be 2–50 characters",
      },
      email: {
        type: "string",
        format: "email",
        errorMessage: "Invalid email format",
      },
      mobileNumber: {
        type: "string",
        pattern: "^\\d{10}$",
        errorMessage: "Mobile number must be 10 digits",
      },
      aadharNumber: {
        type: "string",
        pattern: "^\\d{12}$",
        errorMessage: "Aadhar number must be 12 digits",
      },
      address: {
        type: "object",
        required: ["village", "post", "block", "district", "state", "zipCode"],
        properties: {
          village: {
            type: "string",
            maxLength: 100,
            errorMessage: "Village is too long",
          },
          post: { type: "string", maxLength: 100 },
          block: { type: "string", maxLength: 100 },
          district: { type: "string", maxLength: 100 },
          state: { type: "string", maxLength: 100 },
          zipCode: {
            type: "string",
            pattern: "^\\d{6}$",
            errorMessage: "Zip code must be 6 digits",
          },
        },
        errorMessage: {
          required: {
            village: "Village is required",
            post: "Post is required",
            block: "Block is required",
            district: "District is required",
            state: "State is required",
            zipCode: "Zip code is required",
          },
        },
      },
    },
    errorMessage: {
      required: {
        userId: "User ID is required",
        firstName: "First name is required",
        lastName: "Last name is required",
        email: "Email is required",
        mobileNumber: "Mobile number is required",
        aadharNumber: "Aadhar number is required",
        address: "Address is required",
      },
    },
  },
};

export default createParentSchema;

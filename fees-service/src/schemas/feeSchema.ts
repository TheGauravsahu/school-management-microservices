export const createFeeSchema = {
  body: {
    type: "object",
    required: ["classNumber", "developmentFee", "tutionFee", "transportFee"],
    properties: {
      classNumber: { type: "integer", minimum: 1 },
      tutionFee: { type: "number", minimum: 0 },
      transportFee: { type: "number", minimum: 0 },
      developmentFee: { type: "number", minimum: 0 },
    },
    errorMessage: {
      required: {
        classNumber: "Class number is required",
        transportFee: "Admission fee is required",
        tutionFee: "Tuition fee is required",
        developmentFee: "Other fee is required",
      },
      properties: {
        classNumber: "Class number must be an integer greater than 0",
        transportFee: "Admission fee must be a positive number",
        tutionFee: "Tuition fee must be a positive number",
        developmentFee: "Other fee must be a positive number",
      },
    },
  },
} as const;

export const updateFeeSchema = {
  body: {
    type: "object",
    properties: {
      transportFee: { type: "number", minimum: 0 },
      tutionFee: { type: "number", minimum: 0 },
      developmentFee: { type: "number", minimum: 0 },
    },
    errorMessage: {
      properties: {
        transportFee: "Admission fee must be a positive number",
        tutionFee: "Tuition fee must be a positive number",
        developmentFee: "Other fee must be a positive number",
      },
    },
  },
} as const;

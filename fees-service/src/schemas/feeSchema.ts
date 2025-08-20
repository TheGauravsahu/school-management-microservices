
export const createFeeSchema = {
  body: {
    type: "object",
    required: ["classNumber", "admissionFee", "tuitionFee", "otherFee"],
    properties: {
      classNumber: { type: "integer", minimum: 1 },
      admissionFee: { type: "number", minimum: 0 },
      tuitionFee: { type: "number", minimum: 0 },
      otherFee: { type: "number", minimum: 0 },
    },
  },
} as const;


export const updateFeeSchema = {
  body: {
    type: "object",
    properties: {
      admissionFee: { type: "number", minimum: 0 },
      tuitionFee: { type: "number", minimum: 0 },
      otherFee: { type: "number", minimum: 0 },
    },
  },
} as const;

export const createInvoiceSchema = {
  body: {
    type: "object",
    required: ["studentId", "studentEmail", "feeStructureId", "dueDate"],
    properties: {
      studentId: { type: "string", errorMessage: "Student ID is required" },
      studentEmail: {
        type: "string",
        format: "email",
        errorMessage: {
          type: "Student email must be a string",
          format: "Must be a valid email address",
        },
      },
      feeStructureId: {
        type: "string",
        format: "uuid",
        errorMessage: "A valid Fee Structure ID is required",
      },
      dueDate: {
        type: "string",
        format: "date-time",
        errorMessage: "Due date must be a valid ISO date-time",
      },
    },
    additionalProperties: false,
    errorMessage: {
      required: {
        studentId: "Student ID is required",
        studentEmail: "Student email is required",
        feeStructureId: "Fee Structure ID is required",
        dueDate: "Due date is required",
      },
    },
  },
} as const;

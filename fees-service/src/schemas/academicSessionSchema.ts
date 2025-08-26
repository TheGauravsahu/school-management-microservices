export const createAcademicSessionSchema = {
  body: {
    type: "object",
    required: ["name", "startDate", "endDate"],
    properties: {
      name: { type: "string", minimum: 1 },
      startDate: {
        type: "string",
        format: "date-time",
        errorMessage: "Due date must be a valid ISO date-time",
      },
      endDate: {
        type: "string",
        format: "date-time",
        errorMessage: "Due date must be a valid ISO date-time",
      },
    },
    errorMessage: {
      required: {
        name: "Session name is required",
        startDate: "Start Date is required",
        endDate: "End Date is required",
      },
    },
  },
} as const;

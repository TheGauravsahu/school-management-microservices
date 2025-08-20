
export const createInvoiceSchema = {
  body: {
    type: "object",
    required: ["studentId", "total"],
    properties: {
      studentId: { type: "string", format: "uuid" },
      total: { type: "number", minimum: 1 },
      dueDate: { type: "string", format: "date-time" },
    },
  },
} as const;


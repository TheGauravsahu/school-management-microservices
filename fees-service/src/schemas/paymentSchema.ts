export const createPaymentSchema = {
  body: {
    type: "object",
    required: ["invoiceId", "amount", "method"],
    properties: {
      invoiceId: { type: "string", format: "uuid" },
      amount: { type: "number", minimum: 1 },
      method: { type: "string", enum: ["CASH", "CARD", "ONLINE"] },
    },
    errorMessage: {
      required: {
        invoiceId: "Invoice ID is required",
        amount: "Amount is required",
        method: "Payment method is required",
      },
      properties: {
        invoiceId: "Invoice ID must be a valid UUID",
        amount: "Amount must be at least 1",
        method: "Payment method must be either CASH, CARD, or ONLINE",
      },
    },
  },
} as const;

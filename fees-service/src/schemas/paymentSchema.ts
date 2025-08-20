
export const createPaymentSchema = {
  body: {
    type: "object",
    required: ["invoiceId", "amount", "method"],
    properties: {
      invoiceId: { type: "string", format: "uuid" },
      amount: { type: "number", minimum: 1 },
      method: { type: "string", enum: ["CASH", "CARD", "ONLINE"] },
    },
  },
} as const;


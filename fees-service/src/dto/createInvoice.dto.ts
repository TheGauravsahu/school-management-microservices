import { InvoiceStatus } from "@prisma/client";

export interface createInvoiceDto {
  studentId: string;
  sessionId: string;
  total: number;
  dueDate: Date;
  status: InvoiceStatus;
}

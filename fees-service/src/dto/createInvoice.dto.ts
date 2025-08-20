import { InvoiceStatus } from "@prisma/client";

export interface createInvoiceDto {
  studentId: string;
  studentEmail: string;
  feeStructureId: string;
  dueDate: Date;
  status: InvoiceStatus;
}

import { Logger } from "winston";
import { InvoiceRepository } from "../repository/invoiceRepository";
import createHttpError from "http-errors";
import { InvoiceStatus, Prisma } from "@prisma/client";

export class InvoiceService {
  constructor(
    private logger: Logger,
    private invoiceRepository: InvoiceRepository
  ) {}

  async createInvoice(data: Prisma.InvoiceCreateInput) {
    try {
      this.logger.info("Creating invoice", { studentId: data.studentId });
      return await this.invoiceRepository.create(data);
    } catch (err: any) {
      this.logger.error("Error creating invoice", { error: err.message });
      throw createHttpError(500, "Failed to create invoice");
    }
  }

  async getInvoiceById(id: string) {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      this.logger.warn("Invoice not found", { id });
      throw createHttpError(404, "Invoice not found");
    }
    return invoice;
  }

  async getInvoiceByStudentId(studentId: string) {
    const invoice = await this.invoiceRepository.findByStudentId(studentId);
    if (!invoice) {
      this.logger.warn("Invoice not found for student", { studentId });
      throw createHttpError(404, "Invoice not found");
    }
    return invoice;
  }

  async markInvoicePaid(id: string) {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      throw createHttpError(404, "Invoice not found");
    }
    if (invoice.status === InvoiceStatus.PAID) {
      throw createHttpError(400, "Invoice is already paid");
    }

    return this.invoiceRepository.markPaid(id);
  }
}

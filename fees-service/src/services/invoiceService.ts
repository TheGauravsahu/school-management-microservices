import { Logger } from "winston";
import { InvoiceRepository } from "../repository/invoiceRepository";
import createHttpError from "http-errors";
import { InvoiceStatus } from "@prisma/client";
import { createInvoiceDto } from "../dto/createInvoice.dto";

export class InvoiceService {
  constructor(
    private logger: Logger,
    private invoiceRepository: InvoiceRepository
  ) {}

  async createInvoice(data: createInvoiceDto) {
    try {
      this.logger.info("Creating invoice", { studentId: data.studentId });

      const invoice = await this.invoiceRepository.create({
        dueDate: data.dueDate,
        status: data.status || InvoiceStatus.PENDING,
        total: data.total,
        student: {
          connect: { id: data.studentId },
        },
        session: {
          connect: { id: data.sessionId },
        },
      });

      for (const item of invoice.items) {
        await this.invoiceRepository.createItem(invoice.id, {
          feeStructure: {
            connect: { id: item.feeStructureId },
          },
          invoice: {
            connect: { id: item.invoiceId },
          },
          amount: item.amount,
          month: item.month,
          year: item.year,
          pending: item.amount,
        });
      }

      const invoiceWithItems = await this.getInvoiceById(
        invoice.id
      );

      return invoiceWithItems;
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

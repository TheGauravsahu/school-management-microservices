import { Logger } from "winston";
import { InvoiceRepository } from "../repository/invoiceRepository";
import createHttpError from "http-errors";
import { InvoiceStatus, Prisma } from "@prisma/client";
import { FeesRepository } from "../repository/feesRepository";
import { createInvoiceDto } from "../dto/createInvoice.dto";

export class InvoiceService {
  constructor(
    private logger: Logger,
    private invoiceRepository: InvoiceRepository,
    private feeRepository: FeesRepository
  ) {}

  async createInvoice(data: createInvoiceDto) {
    try {
      this.logger.info("Creating invoice", { studentId: data.studentId });

      // get fee strucutre
      const feeStructure = await this.feeRepository.findById(
        data.feeStructureId
      );
      if (!feeStructure) {
        throw createHttpError(404, "Fee structure not found");
      }

      // calculate total
      const total =
        feeStructure.tutionFee +
        (feeStructure.transportFee || 0) +
        feeStructure.developmentFee +
        (feeStructure.misc || 0);

      const invoice = await this.invoiceRepository.create({
        studentId: data.studentId,
        studentEmail: data.studentEmail,
        dueDate: data.dueDate,
        status: data.status,
        total,
        feeStructure: {
          connect: { id: data.feeStructureId },
        },
      });

      return invoice;
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

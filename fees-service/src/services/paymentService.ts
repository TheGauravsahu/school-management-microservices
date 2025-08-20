import { Logger } from "winston";
import { PaymentRepository } from "../repository/paymentRepository";
import { Payment } from "@prisma/client";
import { InvoiceRepository } from "../repository/invoiceRepository";
import createHttpError from "http-errors";

export interface createPaymentDto {
  invoiceId: string;
  amount: number;
  method: string;
}

export class PaymentService {
  constructor(
    private logger: Logger,
    private paymentRepository: PaymentRepository,
    private invoiceRepository: InvoiceRepository
  ) {}

  async createPayment(data: createPaymentDto) {
    const invoice = await this.invoiceRepository.findById(data.invoiceId);
    if (!invoice) {
      this.logger.warn("Invoice not found for payment", {
        invoiceId: data.invoiceId,
      });
      throw createHttpError(404, "Invoice not found");
    }

    //creating payment
    this.logger.info("Creating payment", {
      invoiceId: data.invoiceId,
      amount: data.amount,
    });
    const payment = await this.paymentRepository.create(data as any);

    // update invoice status after payment
    const totalPaid =
      invoice.payments.reduce((sum: number, p: Payment) => sum + p.amount, 0) +
      data.amount;
    if (totalPaid >= invoice.total) {
      await this.invoiceRepository.markPaid(invoice.id);
    }

    return payment;
  }

  async getPaymentById(id: string) {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw createHttpError(404, "Payment not found");
    }
    return payment;
  }

  async getAllPayments() {
    return this.paymentRepository.findAll();
  }
}

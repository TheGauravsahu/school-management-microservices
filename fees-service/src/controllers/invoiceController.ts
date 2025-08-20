import { Prisma } from "@prisma/client";
import { Logger } from "winston";
import { FastifyReply, FastifyRequest } from "fastify";
import { InvoiceService } from "../services/invoiceService";

const SERVICE_NAME = "FEES_SERVICE";

export class InvoiceController {
  constructor(private logger: Logger, private invoiceService: InvoiceService) {}

  async createInvoice(
    req: FastifyRequest<{ Body: Prisma.InvoiceCreateInput }>,
    reply: FastifyReply
  ) {
    this.logger.info("A new request recieved for creating invoice.", req.body);
    const invoice = await this.invoiceService.createInvoice(req.body);
    return reply.code(201).send({
      success: true,
      message: "Invoice created successfully.",
      data: invoice,
      data_from: SERVICE_NAME,
    });
  }

  async getInvoiceById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const invoice = await this.invoiceService.getInvoiceById(req.params.id);
    return reply.code(200).send({
      success: true,
      message: "Invoice fetched successfully.",
      data: invoice,
      data_from: SERVICE_NAME,
    });
  }

  async getInvoiceByStudent(
    req: FastifyRequest<{ Params: { studentId: string } }>,
    reply: FastifyReply
  ) {
    const invoice = await this.invoiceService.getInvoiceByStudentId(
      req.params.studentId
    );
    return reply.code(200).send({
      success: true,
      message: "Invoice fetched successfully For Student.",
      data: invoice,
      data_from: SERVICE_NAME,
    });
  }

  async markInvoicePaid(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const invoice = await this.invoiceService.markInvoicePaid(req.params.id);
    return reply.code(200).send({
      success: true,
      message: "Invoice Marked Paid successfully.",
      data: invoice,
      data_from: SERVICE_NAME,
    });
  }
}

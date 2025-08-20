import { Logger } from "winston";
import { FastifyReply, FastifyRequest } from "fastify";
import { InvoiceService } from "../services/invoiceService";
import { RabbitMQ } from "../common/config/rabbitmq";
import { Events } from "../common/config/rabbitmq/events";
import { createInvoiceDto } from "../dto/createInvoice.dto";

const SERVICE_NAME = "FEES_SERVICE";

export class InvoiceController {
  constructor(
    private logger: Logger,
    private invoiceService: InvoiceService,
    private rabbitMQ: RabbitMQ
  ) {}

  async createInvoice(
    req: FastifyRequest<{ Body: createInvoiceDto }>,
    reply: FastifyReply
  ) {
    this.logger.info("A new request recieved for creating invoice.", req.body);
    const invoice = await this.invoiceService.createInvoice(req.body);

    // publish invoice.created
    await this.rabbitMQ.publish<Events.INVOICE_CREATED>(
      Events.INVOICE_CREATED,
      {
        id: invoice.id,
        studentId: invoice.studentId,
        feeStructure: invoice.feeStructure,
        total: invoice.total,
        dueDate: invoice.dueDate.toISOString(),
        email: invoice.studentEmail,
      }
    );

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
    req: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    const invoice = await this.invoiceService.markInvoicePaid(req.params.id);

    // publish invoice.paid
    await this.rabbitMQ.publish<Events.INVOICE_PAID>(Events.INVOICE_PAID, {
      id: invoice.id,
      studentId: invoice.studentId,
      feeStructure: invoice.feeStructure,
      total: invoice.total,
      email: invoice.studentEmail,
    });

    return reply.code(200).send({
      success: true,
      message: "Invoice Marked Paid successfully.",
      data: invoice,
      data_from: SERVICE_NAME,
    });
  }
}

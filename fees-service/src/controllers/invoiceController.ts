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
    this.logger.info("A new request received for creating invoice.", req.body);

    const invoice = await this.invoiceService.createInvoice(req.body);

    // publish invoice.created
    await this.rabbitMQ.publish<Events.INVOICE_CREATED>(
      Events.INVOICE_CREATED,
      {
        invoiceId: invoice.id,
        dueDate: invoice.dueDate.toISOString(),
        student: {
          id: invoice.student.id,
          name: invoice.student.name,
          email: invoice.student.email,
          mobileNumber: invoice.student.mobileNumber,
          rollNo: invoice.student.rollNo,
          class: invoice.student.class,
        },
        session: {
          id: invoice.session.id,
          name: invoice.session.name,
        },
        total: invoice.total,
        items: invoice.items.map((i) => ({
          feeName: i.feeStructure.name,
          amount: i.amount,
          month: i.month ?? undefined,
          year: i.year ?? undefined,
        })),
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
    // await this.rabbitMQ.publish<Events.INVOICE_PAID>(Events.INVOICE_PAID, {
    //   id: invoice.id,
    //   studentId: invoice.studentId,
    //   feeStructure: invoice.,
    //   total: invoice.total,
    //   email: invoice.student,
    // });

    return reply.code(200).send({
      success: true,
      message: "Invoice Marked Paid successfully.",
      data: invoice,
      data_from: SERVICE_NAME,
    });
  }
}

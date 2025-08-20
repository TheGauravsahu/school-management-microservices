import { Logger } from "winston";
import { createPaymentDto, PaymentService } from "../services/paymentService";
import { FastifyReply, FastifyRequest } from "fastify";

const SERVICE_NAME = "FEES_SERVICE";

export class PaymentController {
  constructor(private logger: Logger, private paymentService: PaymentService) {}

  async createPayment(
    req: FastifyRequest<{ Body: createPaymentDto }>,
    reply: FastifyReply
  ) {
    this.logger.info("A new request recieved for creating payment.", req.body);
    const payment = await this.paymentService.createPayment(req.body);
    return reply.code(201).send({
      success: true,
      message: "Payement created successfully.",
      data: payment,
      data_from: SERVICE_NAME,
    });
  }

  async getPaymentById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const payment = await this.paymentService.getPaymentById(req.params.id);
    return reply.code(200).send({
      success: true,
      message: "Payement fetched successfully.",
      data: payment,
      data_from: SERVICE_NAME,
    });
  }

  async getAllPayments(_req: FastifyRequest, reply: FastifyReply) {
    const payments = await this.paymentService.getAllPayments();
    return reply.code(200).send({
      success: true,
      message: "Payement fetched successfully.",
      data: payments,
      data_from: SERVICE_NAME,
    });
  }
}

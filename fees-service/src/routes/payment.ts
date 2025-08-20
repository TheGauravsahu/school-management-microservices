import { FastifyInstance } from "fastify";
import { PaymentController } from "../controllers/paymentController";
import { PaymentService } from "../services/paymentService";
import { PaymentRepository } from "../repository/paymentRepository";
import { InvoiceRepository } from "../repository/invoiceRepository";
import { db } from "../common/config/db";
import logger from "../common/config/logger";
import { createPaymentSchema } from "../schemas/paymentSchema";

const paymentRepository = new PaymentRepository(db, logger);
const invoiceRepository = new InvoiceRepository(db, logger);
const paymentService = new PaymentService(
  logger,
  paymentRepository,
  invoiceRepository
);
const paymentController = new PaymentController(logger, paymentService);

export default async function paymentRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    { schema: createPaymentSchema },
    paymentController.createPayment.bind(paymentController)
  );
  fastify.get("/:id", paymentController.getPaymentById.bind(paymentController));
  fastify.get("/", paymentController.getAllPayments.bind(paymentController));
}

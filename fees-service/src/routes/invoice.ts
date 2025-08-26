import { FastifyInstance } from "fastify";
import { authenticateToken } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { UserRole } from "../common/types";
import { createInvoiceSchema } from "../schemas/invoiceSchema";
import { InvoiceRepository } from "../repository/invoiceRepository";
import { db } from "../common/config/db";
import logger from "../common/config/logger";
import { InvoiceService } from "../services/invoiceService";
import { InvoiceController } from "../controllers/invoiceController";
import { RabbitMQ } from "../common/config/rabbitmq";

const rabbitMQ = new RabbitMQ();
const invoiceRepository = new InvoiceRepository(db, logger);
const invoiceService = new InvoiceService(
  logger,
  invoiceRepository,
);
const invoiceController = new InvoiceController(
  logger,
  invoiceService,
  rabbitMQ
);

export default async function invoiceRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticateToken);
  fastify.addHook("preHandler", authorizeRoles([UserRole.ADMIN]));

  fastify.post(
    "/",
    { schema: createInvoiceSchema },
    invoiceController.createInvoice.bind(invoiceController)
  );
  fastify.get("/:id", invoiceController.getInvoiceById.bind(invoiceController));
  fastify.get(
    "/student/:studentId",
    invoiceController.getInvoiceByStudent.bind(invoiceController)
  );
  fastify.patch(
    "/:id/pay",
    invoiceController.markInvoicePaid.bind(invoiceController)
  );
}

import { FastifyInstance } from "fastify";
import { FeesController } from "../controllers/feesController";
import { createFeeSchema, updateFeeSchema } from "../schemas/feeSchema";
import { authenticateToken } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { UserRole } from "../common/types";
import { FeesRepository } from "../repository/feesRepository";
import { db } from "../common/config/db";
import { FeesService } from "../services/feesService";
import logger from "../common/config/logger";

const feesRepository = new FeesRepository(db, logger);
const feesService = new FeesService(logger, feesRepository);
const feesController = new FeesController(logger, feesService);

export default async function feesRoutes(fastify: FastifyInstance) {
  // fastify.addHook("preHandler", authenticateToken);
  // fastify.addHook("preHandler", authorizeRoles([UserRole.ADMIN]));

  fastify.post(
    "/",
    { schema: createFeeSchema },
    feesController.createFee.bind(feesController)
  );
  fastify.get(
    "/:classNumber",
    feesController.getFeeByClass.bind(feesController)
  );
  fastify.put(
    "/:id",
    { schema: updateFeeSchema },
    feesController.updateFee.bind(feesController)
  );
  fastify.delete("/:id", feesController.deleteFee.bind(feesController));
}

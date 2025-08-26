import { FastifyInstance } from "fastify";
import { authenticateToken } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { UserRole } from "../common/types";
import { FeeStructureRepository } from "../repository/feeStructureRepository";
import { FeeStructureService } from "../services/feeStructureService";
import logger from "../common/config/logger";
import { db } from "../common/config/db";
import { FeeStructureController } from "../controllers/feeStructureController";

const feeStructureRepository = new FeeStructureRepository(db);
const feeStructureService = new FeeStructureService(
  logger,
  feeStructureRepository
);
const feeStructureController = new FeeStructureController(
  logger,
  feeStructureService
);

function feeStructureRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticateToken);
  fastify.addHook("preHandler", authorizeRoles([UserRole.ADMIN]));

  fastify.post(
    "/",
    feeStructureController.createFeeStructure.bind(feeStructureController)
  );
  fastify.get(
    "/",
    feeStructureController.findAllFeeStructure.bind(feeStructureController)
  );
  fastify.get(
    "/:id",
    feeStructureController.findFeeStructureById.bind(feeStructureController)
  );
  fastify.put(
    "/:id",
    feeStructureController.updateFeeStructure.bind(feeStructureController)
  );
  fastify.delete(
    "/:id",
    feeStructureController.deleteFeeStructure.bind(feeStructureController)
  );
}

export default feeStructureRoutes;

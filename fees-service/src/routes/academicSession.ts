import { FastifyInstance } from "fastify";
import { authenticateToken } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { UserRole } from "../common/types";
import { db } from "../common/config/db";
import logger from "../common/config/logger";
import { AcademicSessionService } from "../services/academicSessionService";
import { AcademicSessionRepository } from "../repository/academicSessionRepository";
import { AcademincSessionController } from "../controllers/academicSessionController";
import { createAcademicSessionSchema } from "../schemas/academicSessionSchema";

const academicSessionRepository = new AcademicSessionRepository(logger, db);
const academicSessionService = new AcademicSessionService(
  academicSessionRepository
);
const academincSessionController = new AcademincSessionController(
  logger,
  academicSessionService
);

export default async function academicSessionRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticateToken);
  fastify.addHook("preHandler", authorizeRoles([UserRole.ADMIN]));

  fastify.post(
    "/",
    { schema: createAcademicSessionSchema },
    academincSessionController.createSession.bind(academincSessionController)
  );
  fastify.get(
    "/",
    academincSessionController.getllSessions.bind(academincSessionController)
  );
  fastify.get(
    "/:id",
    academincSessionController.getSessionById.bind(academincSessionController)
  );
  fastify.put(
    "/:id",
    { schema: createAcademicSessionSchema },
    academincSessionController.updateSession.bind(academincSessionController)
  );
}

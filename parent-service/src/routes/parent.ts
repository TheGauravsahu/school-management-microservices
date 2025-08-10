import { FastifyInstance } from "fastify";
import { ParentController } from "../controllers/parentConroller";
import { ParentService } from "../services/parentService";
import { ParentRepository } from "../repository/parentRepository";
import createParentSchema from "../validators/create-parent.schema";
import logger from "../config/logger";
import { authenticateToken } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { UserRole } from "../../../shared/types";
import { IParent, ParentQueryFilters } from "../types";
import { getParentsQuerySchema } from "../validators/get-parents.schema";

const parentRepository = new ParentRepository(logger);
const parentService = new ParentService(parentRepository, logger);
const parentController = new ParentController(parentService, logger);

async function parentRouter(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticateToken);

  fastify.post<{ Body: IParent }>(
    "/",
    {
      schema: createParentSchema,
      preHandler: [authorizeRoles([UserRole.ADMIN])],
    },
    parentController.createParent.bind(parentController)
  );

  fastify.get<{ Querystring: ParentQueryFilters }>(
    "/",
    {
      schema: getParentsQuerySchema,
      preHandler: [authorizeRoles([UserRole.ADMIN, UserRole.TEACHER])],
    },
    parentController.getAllParents.bind(parentController)
  );

  fastify.get<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authorizeRoles([UserRole.ADMIN, UserRole.TEACHER])],
    },
    parentController.getParentById.bind(parentController)
  );

  fastify.put<{ Params: { id: string }; Body: Partial<IParent> }>(
    "/:id",
    {
      preHandler: [authorizeRoles([UserRole.ADMIN])],
    },
    parentController.updateParent.bind(parentController)
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authorizeRoles([UserRole.ADMIN])],
    },
    parentController.deleteParent.bind(parentController)
  );
}

export default parentRouter;

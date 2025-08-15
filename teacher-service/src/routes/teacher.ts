import { FastifyInstance } from "fastify";
import logger from "../common/config/logger";
import { TeacherController } from "../controllers/teacherController";
import { TeacherRepository } from "../repositories/teacheRepository";
import { TeacherService } from "../services/teacherService";
import { authenticateToken } from "../middlewares/auth";
import createTeacherSchema from "../validators/create-teacher.schema";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { UserRole } from "../common/types";
import { ITeacher } from "../types";
import { RabbitMQ } from "../common/config/rabbitmq";

const teacherRepository = new TeacherRepository(logger);
const teacherService = new TeacherService(logger, teacherRepository);
const rabbitMQ = new RabbitMQ();
const teacherController = new TeacherController(
  logger,
  teacherService,
  rabbitMQ
);

async function teacherRouter(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticateToken);

  fastify.post<{ Body: ITeacher }>(
    "/",
    {
      schema: createTeacherSchema,
      preHandler: [authorizeRoles([UserRole.ADMIN])],
    },
    teacherController.createTeacher.bind(teacherController)
  );

  fastify.get(
    "/",
    {
      preHandler: [authorizeRoles([UserRole.ADMIN])],
    },
    teacherController.getAllTeachers.bind(teacherController)
  );

  fastify.get(
    "/me",
    {
      preHandler: [authorizeRoles([UserRole.ADMIN, UserRole.TEACHER])],
    },
    teacherController.getMyProfile.bind(teacherController)
  );

  fastify.get<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authorizeRoles([UserRole.ADMIN])],
    },
    teacherController.getTeacherById.bind(teacherController)
  );

  fastify.put<{ Params: { id: string }; Body: Partial<ITeacher> }>(
    "/:id",
    {
      schema: createTeacherSchema,
      preHandler: [authorizeRoles([UserRole.ADMIN])],
    },
    teacherController.updateTeacher.bind(teacherController)
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authorizeRoles([UserRole.ADMIN])],
    },
    teacherController.deleteTeacher.bind(teacherController)
  );
}

export default teacherRouter;

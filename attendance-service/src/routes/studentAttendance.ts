import { StudentAttendance } from "../entity/StudentAttendance";
import { AppDataSource } from "../common/config/data-source";
import logger from "../common/config/logger";
import { FastifyInstance } from "fastify";
import { StudentAttendanceService } from "../services/studentAttendanceService";
import { StudentAttendanceController } from "../controller/studentAttendanceContoller";
import {
  MarkStudentAttendanceDto,
  MarkStudentsAttendanceDto,
} from "../dto/MarkStudentAttendanceDto";
import { authenticateToken } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { UserRole } from "../common/types";
import { RabbitMQ } from "../common/config/rabbitmq";
import { createStudentsAttendanceSchema } from "../validators/studentsAttendance.validator";

const studentAttendanceRepository =
  AppDataSource.getRepository(StudentAttendance);
const rabbitMQ = new RabbitMQ();
const studentAttendanceService = new StudentAttendanceService(
  logger,
  studentAttendanceRepository,
  rabbitMQ
);
const studentAttendanceController = new StudentAttendanceController(
  logger,
  studentAttendanceService
);

async function studentAttendanceRouter(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticateToken);
  fastify.addHook(
    "preHandler",
    authorizeRoles([UserRole.TEACHER, UserRole.ADMIN])
  );

  fastify.post<{ Body: MarkStudentAttendanceDto }>(
    "/",
    studentAttendanceController.markAttendance.bind(studentAttendanceController)
  );

  fastify.post<{ Body: MarkStudentsAttendanceDto }>(
    "/all",
    { schema: createStudentsAttendanceSchema },
    studentAttendanceController.markAttendaces.bind(studentAttendanceController)
  );

  fastify.get<{ Querystring: { classNumber: number; date: string } }>(
    "/date",
    studentAttendanceController.getAttendanceByClassAndDate.bind(
      studentAttendanceController
    )
  );

  fastify.get<{
    Params: { studentId: string };
    Querystring: { month?: number; year?: number };
  }>(
    "/student/:studentId",
    studentAttendanceController.getAttendanceForStudent.bind(
      studentAttendanceController
    )
  );

  fastify.put<{ Params: { id: string }; Body: { status: string } }>(
    "/:id",
    studentAttendanceController.updateAttedance.bind(
      studentAttendanceController
    )
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    studentAttendanceController.deleteAttendance.bind(
      studentAttendanceController
    )
  );
}

export default studentAttendanceRouter;

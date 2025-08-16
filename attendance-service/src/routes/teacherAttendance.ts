import { authenticateToken } from "../middlewares/auth";
import { AppDataSource } from "../common/config/data-source";
import logger from "../common/config/logger";
import { TeacherAttendanceController } from "../controller/teacherAttendanceController";
import { TeacherAttendance } from "../entity/TeacherAttendance";
import {
  MarkTeacherAttendanceDto,
  TeacherAttendanceService,
} from "../services/teacherAttendanceService";
import { FastifyInstance } from "fastify";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { UserRole } from "../common/types";
import { createTeacherAttendanceSchema } from "../validators/teacherAttendance.validator";

const teacherAttendanceRepository =
  AppDataSource.getRepository(TeacherAttendance);
const teacherAttendanceService = new TeacherAttendanceService(
  logger,
  teacherAttendanceRepository
);
const teacherAttendanceController = new TeacherAttendanceController(
  logger,
  teacherAttendanceService
);

async function teacherAttendanceRouter(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticateToken);
  fastify.addHook(
    "preHandler",
    authorizeRoles([UserRole.TEACHER, UserRole.ADMIN])
  );

  fastify.post<{ Body: MarkTeacherAttendanceDto }>(
    "/",
    { schema: createTeacherAttendanceSchema },
    teacherAttendanceController.markAttendance.bind(teacherAttendanceController)
  );

  fastify.get<{ Querystring: { date: string } }>(
    "/date",
    teacherAttendanceController.getAttendanceDate.bind(
      teacherAttendanceController
    )
  );

  fastify.get<{
    Params: { teacherId: string };
    Querystring: { month?: number; year?: number };
  }>(
    "/:teacherId",
    teacherAttendanceController.getAttendanceForTeacher.bind(
      teacherAttendanceController
    )
  );

  fastify.put<{ Params: { id: string }; Body: { status: string } }>(
    "/:id",
    teacherAttendanceController.updateAttedance.bind(
      teacherAttendanceController
    )
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    teacherAttendanceController.deleteAttendance.bind(
      teacherAttendanceController
    )
  );
}

export default teacherAttendanceRouter;

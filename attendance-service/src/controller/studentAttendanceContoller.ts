import {
  MarkStudentAttendanceDto,
  MarkStudentsAttendanceDto,
} from "../dto/MarkStudentAttendanceDto";
import { StudentAttendanceService } from "../services/studentAttendanceService";
import { FastifyReply, FastifyRequest } from "fastify";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { AttendanceStatus } from "../common/types";

const SERVICE_NAME = "ATTENDANCE_SERVICE";

export class StudentAttendanceController {
  constructor(
    private logger: Logger,
    private studentAttendanceService: StudentAttendanceService
  ) {}

  async markAttendance(
    req: FastifyRequest<{ Body: MarkStudentAttendanceDto }>,
    reply: FastifyReply
  ) {
    this.logger.info("Request for marking student attendace", req.body);
    const record = await this.studentAttendanceService.markAttendance(req.body);
    reply.code(201).send({
      success: true,
      message: "Attendance marked successfully.",
      data: record,
      data_from: SERVICE_NAME,
    });
  }

  async markAttendaces(
    req: FastifyRequest<{ Body: MarkStudentsAttendanceDto }>,
    reply: FastifyReply
  ) {
    this.logger.info("Request for marking students attendace", req.body);
    const record = await this.studentAttendanceService.markBulkAttendance(
      req.body
    );
    reply.code(201).send({
      success: true,
      message: "Attendance marked successfully.",
      data: record,
      data_from: SERVICE_NAME,
    });
  }

  async getAttendanceByClassAndDate(
    req: FastifyRequest<{ Querystring: { classNumber: number; date: string } }>,
    reply: FastifyReply
  ) {
    const { classNumber, date } = req.query;
    if (!classNumber || !date) {
      throw createHttpError(400, "No attendance records found.");
    }
    const result =
      await this.studentAttendanceService.getAttendanceByClassAndDate(
        classNumber,
        date
      );

    reply.code(200).send({
      success: true,
      message: "Attendance marked successfully.",
      data: result,
      data_from: SERVICE_NAME,
    });
  }

  async getAttendanceForStudent(
    req: FastifyRequest<{
      Params: { studentId: string };
      Querystring: { month?: number; year?: number };
    }>,
    reply: FastifyReply
  ) {
    const { studentId } = req.params;
    const { month, year } = req.query;
    const results = await this.studentAttendanceService.getAttendanceForStudent(
      studentId,
      month,
      year
    );
    reply.code(200).send({
      success: true,
      message: "Attendance fetched successfully.",
      data: results,
      data_from: SERVICE_NAME,
    });
  }

  async updateAttedance(
    req: FastifyRequest<{
      Params: { id: string };
      Body: { status: AttendanceStatus };
    }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;
    const { status } = req.body;
    const result = await this.studentAttendanceService.updateAttendance(
      id,
      status
    );

    reply.code(200).send({
      success: true,
      message: "Attendance updated successfully.",
      data: result,
      data_from: SERVICE_NAME,
    });
  }

  async deleteAttendance(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;
    const result = await this.studentAttendanceService.deleteAttendance(id);

    reply.code(200).send({
      success: true,
      message: "Attendance deleted successfully.",
      data: result,
      data_from: SERVICE_NAME,
    });
  }
}

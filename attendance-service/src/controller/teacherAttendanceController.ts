import {
  MarkTeacherAttendanceDto,
  TeacherAttendanceService,
} from "../services/teacherAttendanceService";
import { FastifyReply, FastifyRequest } from "fastify";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { AttendanceStatus } from "../common/types";

const SERVICE_NAME = "ATTENDANCE_SERVICE";

export class TeacherAttendanceController {
  constructor(
    private logger: Logger,
    private teacherAttendanceService: TeacherAttendanceService
  ) {}

  async markAttendance(
    req: FastifyRequest<{ Body: MarkTeacherAttendanceDto }>,
    reply: FastifyReply
  ) {
    this.logger.info("Request for marking teacher attendace", req.body);
    const record = await this.teacherAttendanceService.markAttendance(req.body);
    reply.code(201).send({
      success: true,
      message: "Attendance marked successfully.",
      data: record,
      data_from: SERVICE_NAME,
    });
  }

  async getAttendanceDate(
    req: FastifyRequest<{ Querystring: { date: string } }>,
    reply: FastifyReply
  ) {
    const { date } = req.query;
    if (!date) {
      throw createHttpError(400, "No attendance records found.");
    }
    const result = await this.teacherAttendanceService.getAttendanceByDate(
      date
    );

    reply.code(200).send({
      success: true,
      message: "Attendance fetched successfully.",
      data: result,
      data_from: SERVICE_NAME,
    });
  }

  async getAttendanceForTeacher(
    req: FastifyRequest<{
      Params: { teacherId: string };
      Querystring: { month?: number; year?: number };
    }>,
    reply: FastifyReply
  ) {
    const { teacherId } = req.params;
    const { month, year } = req.query;
    const results = await this.teacherAttendanceService.getAttendanceForTeacher(
      teacherId,
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
    const result = await this.teacherAttendanceService.updateAttendance(
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
    const result = await this.teacherAttendanceService.deleteAttendance(id);

    reply.code(200).send({
      success: true,
      message: "Attendance deleted successfully.",
      data: result,
      data_from: SERVICE_NAME,
    });
  }
}

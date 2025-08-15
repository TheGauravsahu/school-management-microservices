import { FastifyRequest, FastifyReply } from "fastify";
import { TeacherService } from "../services/teacherService";
import { Logger } from "winston";
import { ITeacher } from "../types";
import { UserRole } from "../common/types";
import { RabbitMQ } from "../common/config/rabbitmq";
import { Events } from "../common/config/rabbitmq/events";

const SERVICE_NAME = "TEACHER_SERVICE";

export class TeacherController {
  constructor(
    private logger: Logger,
    private teacherService: TeacherService,
    private rabbitMQ: RabbitMQ
  ) {}

  async createTeacher(
    req: FastifyRequest<{ Body: ITeacher }>,
    reply: FastifyReply
  ) {
    try {
      const teacher = await this.teacherService.createTeacher(
        req.body as ITeacher
      );

      // publish event to rabbitMQ
      await this.rabbitMQ.publish<Events.TEACHER_CREATED>(
        Events.TEACHER_CREATED,
        {
          teacherId: teacher._id as string,
          email: teacher.email,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
        }
      );

      this.logger.info("Published event", Events.TEACHER_CREATED);
      
      reply.status(201).send({
        success: true,
        message: "Teacher created successfully.",
        data: { teacher },
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      this.logger.error("Error in createTeacher controller", error);
      throw error;
    }
  }

  async getAllTeachers(req: FastifyRequest, reply: FastifyReply) {
    try {
      const teachers = await this.teacherService.getAllTeachers();
      reply.status(200).send({
        success: true,
        message: "Teachers retrieved successfully.",
        data: { teachers },
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      this.logger.error("Error in getAllTeachers controller", error);
      throw error;
    }
  }

  async getMyProfile(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = req?.user?.userId as string;
      const teacher = await this.teacherService.getTeacherByUserId(userId);
      reply.status(200).send({
        success: true,
        message: "Teachers retrieved successfully.",
        data: { teacher },
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      this.logger.error("Error in getMyProfile controller", error);
      throw error;
    }
  }

  async getTeacherById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const teacher = await this.teacherService.getTeacherById(req.params.id);
      reply.status(200).send({
        success: true,
        message: "Teacher retrieved successfully.",
        data: { teacher },
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      this.logger.error("Error in getTeacherById controller", error);
      throw error;
    }
  }

  async updateTeacher(
    req: FastifyRequest<{ Params: { id: string }; Body: Partial<ITeacher> }>,
    reply: FastifyReply
  ) {
    try {
      const updatedTeacher = await this.teacherService.updateTeacher(
        req.params.id,
        req.body
      );
      reply.status(200).send({
        success: true,
        message: "Teacher updated successfully.",
        data: { updatedTeacher },
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      this.logger.error("Error in updateTeacher controller", error);
      throw error;
    }
  }

  async deleteTeacher(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const deletedTeacher = await this.teacherService.deleteTeacher(
        req.params.id
      );
      reply.status(200).send({
        success: true,
        message: "Teacher deleted successfully.",
        data: { deletedTeacher },
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      this.logger.error("Error in deleteTeacher controller", error);
      throw error;
    }
  }
}

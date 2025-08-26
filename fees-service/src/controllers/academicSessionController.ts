import { Logger } from "winston";
import { AcademicSessionService } from "../services/academicSessionService";
import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import createHttpError from "http-errors";

const SERVICE_NAME = "FEES_SERVICE";

export class AcademincSessionController {
  constructor(
    private logger: Logger,
    private academicSessionService: AcademicSessionService
  ) {}

  async createSession(
    req: FastifyRequest<{ Body: Prisma.AcademicSessionCreateInput }>,
    reply: FastifyReply
  ) {
    this.logger.info(
      "A new request recieved for creating academic session.",
      req.body.name
    );
    const session = this.academicSessionService.createSession(req.body);
    return reply.code(201).send({
      success: true,
      message: "Academic session created successfully.",
      data: session,
      data_from: SERVICE_NAME,
    });
  }

  async getllSessions(req: FastifyRequest, reply: FastifyReply) {
    const sessions = this.academicSessionService.findAllSessions();
    return reply.code(200).send({
      success: true,
      message: "Academic sessions fetched successfully.",
      data: sessions,
      data_from: SERVICE_NAME,
    });
  }

  async getSessionById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;
    if (!id) throw createHttpError(400, "Session Id is required.");
    const session = await this.academicSessionService.findSessionById(id);
    return reply.code(200).send({
      success: true,
      message: "Academic session fetched by Id successfully.",
      data: session,
      data_from: SERVICE_NAME,
    });
  }

  async updateSession(
    req: FastifyRequest<{
      Params: { id: string };
      Body: Prisma.AcademicSessionCreateInput;
    }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;
    if (!id) throw createHttpError(400, "Session Id is required.");

    const session = await this.academicSessionService.findSessionById(id);
    if (!session) throw createHttpError(404, "Session with this Id not found.");

    const updated = await this.academicSessionService.updateSession(
      id,
      req.body
    );

    return reply.code(200).send({
      success: true,
      message: "Academic session updated successfully.",
      data: updated,
      data_from: SERVICE_NAME,
    });
  }
}

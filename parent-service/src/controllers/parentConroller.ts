import { FastifyReply, FastifyRequest } from "fastify";
import { ParentService } from "../services/parentService";
import { IParent, ParentQueryFilters } from "../types";
import { Logger } from "winston";

const SERVICE_NAME = "PARENT_SERVICE";

export class ParentController {
  constructor(private parentService: ParentService, private logger: Logger) {}

  async createParent(
    req: FastifyRequest<{ Body: IParent }>,
    reply: FastifyReply
  ) {
    this.logger.info("Request for creating parent", req.body);
    const parent = await this.parentService.createParent(req.body);
    reply.code(201).send({
      success: true,
      message: "Parent created successfully.",
      data: parent,
      data_from: SERVICE_NAME,
    });
  }

  async getAllParents(
    req: FastifyRequest<{ Querystring: ParentQueryFilters }>,
    reply: FastifyReply
  ) {
    try {
      const query = req.query;
      const filters: ParentQueryFilters = {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
      };

      this.logger.info("Querying all parents with filters", filters);
      const { parents, total } = await this.parentService.getAllParents(
        filters
      );

      return reply.code(200).send({
        success: true,
        message: "All parents fetched successfully",
        data: parents,
        pagination: {
          total,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(total / filters?.limit!),
        },
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      throw error;
    }
  }

  async getParentById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      this.logger.info("Fetching parent by ID", { id });
      const parent = await this.parentService.getParentById(id);
      reply.code(200).send({
        success: true,
        message: "Parent fetched successfully.",
        data: parent,
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateParent(
    req: FastifyRequest<{ Params: { id: string }; Body: Partial<IParent> }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      const data = req.body;
      this.logger.info("Updating parent", { id, data });
      const updatedParent = await this.parentService.updateParent(id, data);
      reply.code(200).send({
        success: true,
        message: "Parent updated successfully.",
        data: updatedParent,
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteParent(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      this.logger.info("Deleting parent", { id });
      const deletedParent = await this.parentService.deleteParent(id);
      reply.code(200).send({
        success: true,
        message: "Parent deleted successfully.",
        data: deletedParent,
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      throw error;
    }
  }
}

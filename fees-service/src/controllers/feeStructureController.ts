import { Prisma } from "@prisma/client";
import { Logger } from "winston";
import { FeeStructureService } from "../services/feeStructureService";
import { FastifyReply, FastifyRequest } from "fastify";

const SERVICE_NAME = "FEES_SERVICE";

export class FeeStructureController {
  constructor(
    private logger: Logger,
    private feeStructureService: FeeStructureService
  ) {}

  async createFeeStructure(
    req: FastifyRequest<{ Body: Prisma.FeeStructureCreateInput }>,
    reply: FastifyReply
  ) {
    this.logger.info("Recived a request for creating a new fee structure");
    const feeStructure = await this.feeStructureService.createFeeStructure(
      req.body
    );
    return reply.code(201).send({
      success: true,
      message: "Fee structure created successfully.",
      data: feeStructure,
      data_from: SERVICE_NAME,
    });
  }

  async findAllFeeStructure(
    req: FastifyRequest<{ Querystring: { feeType: Prisma.EnumFeeTypeFilter } }>,
    reply: FastifyReply
  ) {
    const { feeType } = req.query;
    let feeStructures;

    if (feeType) {
      feeStructures = await this.feeStructureService.findFeeStructureByFeeType(
        feeType
      );
    } else {
      feeStructures = await this.feeStructureService.findAllFeeStructure();
    }
    return reply.code(200).send({
      success: true,
      message: "Fee structure fetched successfully.",
      data: feeStructures,
      data_from: SERVICE_NAME,
    });
  }

  async findFeeStructureById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;
    const feeStructure = await this.feeStructureService.findFeeStructureById(
      id
    );
    return reply.code(200).send({
      success: true,
      message: "Fee structure by Id fetched successfully.",
      data: feeStructure,
      data_from: SERVICE_NAME,
    });
  }

  async updateFeeStructure(
    req: FastifyRequest<{
      Params: { id: string };
      Body: Prisma.FeeStructureUpdateInput;
    }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;
    this.logger.info("Updating fee structure", req.body);
    const feeStructure = await this.feeStructureService.updateFeeStructure(
      id,
      req.body
    );
    return reply.code(201).send({
      success: true,
      message: "Fee structure created successfully.",
      data: feeStructure,
      data_from: SERVICE_NAME,
    });
  }

  async deleteFeeStructure(
    req: FastifyRequest<{
      Body: Prisma.FeeStructureCreateInput;
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;
    const feeStructure = await this.feeStructureService.deleteFeeStructure(id);
    return reply.code(201).send({
      success: true,
      message: "Fee structure created successfully.",
      data: feeStructure,
      data_from: SERVICE_NAME,
    });
  }
}

import { Prisma } from "@prisma/client";
import { Logger } from "winston";
import { FeesService } from "../services/feesService";
import { FastifyReply, FastifyRequest } from "fastify";

const SERVICE_NAME = "FEES_SERVICE";

export class FeesController {
  constructor(private logger: Logger, private feesService: FeesService) {}

  async createFee(
    req: FastifyRequest<{ Body: Prisma.FeeStructureCreateInput }>,
    reply: FastifyReply
  ) {
    this.logger.info(
      "A new request recieved for creating fee structure.",
      req.body
    );
    const fee = await this.feesService.createFeeStructure(req.body);
    return reply.code(201).send({
      success: true,
      message: "Fees Structure created successfully.",
      data: fee,
      data_from: SERVICE_NAME,
    });
  }

  async getFeeByClass(
    req: FastifyRequest<{ Params: { classNumber: number } }>,
    reply: FastifyReply
  ) {
    const fee = await this.feesService.getFeeByClass(
      Number(req.params.classNumber)
    );
    return reply.code(200).send({
      success: true,
      message: `Fees Structure for class ${fee.classNumber} fetched successfully.`,
      data: fee,
      data_from: SERVICE_NAME,
    });
  }

  async updateFee(
    req: FastifyRequest<{
      Params: { id: string };
      Body: Prisma.FeeStructureUpdateInput;
    }>,
    reply: FastifyReply
  ) {
    this.logger.info(
      "A request recieved for updaing fee structure.",
      req.params.id,
      req.body
    );
    const fee = await this.feesService.updateFee(req.params.id, req.body);
    return reply.code(200).send({
      success: true,
      message: "Fees Structure updated successfully.",
      data: fee,
      data_from: SERVICE_NAME,
    });
  }

  async deleteFee(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    this.logger.info(
      "A request recieved for deleting fee structure.",
      req.params.id
    );
    await this.feesService.deleteFee(req.params.id);
    return reply.code(200).send({
      success: true,
      message: "Fees Structure deleted successfully.",
      data: {},
      data_from: SERVICE_NAME,
    });
  }
}

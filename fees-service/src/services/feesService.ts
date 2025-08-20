import { Logger } from "winston";
import { FeesRepository } from "../repository/feesRepository";
import { Prisma } from "@prisma/client";
import createHttpError from "http-errors";

export class FeesService {
  constructor(private logger: Logger, private feesRepository: FeesRepository) {}

  async createFeeStructure(data: Prisma.FeeStructureCreateInput) {
    try {
      this.logger.info("Creating fee structure for class", {
        classNumber: data.classNumber,
      });
      return await this.feesRepository.create(data);
    } catch (error) {
      this.logger.error("Error creating fee structure", { error });
      throw createHttpError(500, "Failed to create fee structure");
    }
  }

  async getFeeByClass(classNumber: number) {
    const fee = await this.feesRepository.findByClass(classNumber);
    if (!fee) {
      this.logger.warn("Fee structure not found", { classNumber });
      throw createHttpError(404, "Fee structure not found");
    }
    return fee;
  }

  async updateFee(id: string, data: Prisma.FeeStructureUpdateInput) {
    try {
      return await this.feesRepository.update(id, data);
    } catch (err: any) {
      this.logger.error("Error updating fee structure", {
        id,
        error: err.message,
      });
      throw createHttpError(404, "Fee structure not found");
    }
  }

  async deleteFee(id: string) {
    try {
      return await this.feesRepository.delete(id);
    } catch (err: any) {
      this.logger.error("Error deleting fee structure", {
        id,
        error: err.message,
      });
      throw createHttpError(404, "Fee structure not found");
    }
  }
}

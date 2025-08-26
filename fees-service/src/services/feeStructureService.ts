import { Prisma } from "@prisma/client";
import { Logger } from "winston";
import { FeeStructureRepository } from "../repository/feeStructureRepository";
import createHttpError from "http-errors";

export class FeeStructureService {
  constructor(
    private logger: Logger,
    private feeStructureRepository: FeeStructureRepository
  ) {}

  async createFeeStructure(data: Prisma.FeeStructureCreateInput) {
    this.logger.info("Creating a new structure", data);
    return await this.feeStructureRepository.create(data);
  }

  async findAllFeeStructure() {
    return await this.feeStructureRepository.findAll();
  }

  async findFeeStructureByFeeType(feeType: Prisma.EnumFeeTypeFilter) {
    this.logger.info("Querying fee structure: ", feeType);
    return await this.feeStructureRepository.findByFeeType(feeType);
  }

  async findFeeStructureById(id: string) {
    return await this.feeStructureRepository.findById(id);
  }

  async updateFeeStructure(id: string, data: Prisma.FeeStructureUpdateInput) {
    const isExist = await this.feeStructureRepository.findById(id);
    if (!isExist) {
      throw createHttpError(404, "Fee structure not found.");
    }
    this.logger.info("Updating fee structure", data);
    return await this.feeStructureRepository.update(id, data);
  }

  async deleteFeeStructure(id: string) {
    this.logger.info("Deleting fee structure", id);
    return await this.feeStructureRepository.delete(id);
  }
}

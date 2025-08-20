import { Logger } from "winston";
import { Prisma, PrismaClient } from "@prisma/client";

export class FeesRepository {
  constructor(private db: PrismaClient, private logger: Logger) {}

  async create(data: Prisma.FeeStructureCreateInput) {
    return await this.db.feeStructure.create({ data });
  }

  async findById(id: string) {
    return await this.db.feeStructure.findUnique({
      where: { id },
    });
  }

  async findByClass(classNumber: number) {
    this.logger.info("Querying feeStructure", classNumber);
    return await this.db.feeStructure.findUnique({
      where: { classNumber },
    });
  }

  async update(id: string, data: Prisma.FeeStructureUpdateInput) {
    this.logger.info("Querying feeStructure", id, data);
    return this.db.feeStructure.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.db.feeStructure.delete({
      where: { id },
    });
  }
}

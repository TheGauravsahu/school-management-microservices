import { Prisma, PrismaClient } from "@prisma/client";

export class FeeStructureRepository {
  constructor(private db: PrismaClient) {}

  async create(data: Prisma.FeeStructureCreateInput) {
    return await this.db.feeStructure.create({ data, include: { session: true } });
  }

  async findAll() {
    return await this.db.feeStructure.findMany({ include: { session: true } });
  }

  async findByFeeType(feeType: Prisma.EnumFeeTypeFilter) {
    return await this.db.feeStructure.findMany({
      where: { feeType },
      include: { session: true },
    });
  }

  async findById(id: string) {
    return await this.db.feeStructure.findFirst({
      where: { id },
      include: { session: true },
    });
  }

  async update(id: string, data: Prisma.FeeStructureUpdateInput) {
    return await this.db.feeStructure.update({
      where: { id },
      data,
      include: { session: true },
    });
  }

  async delete(id: string) {
    return await this.db.feeStructure.delete({
      where: { id },
    });
  }
}

import { Logger } from "winston";
import { Prisma, PrismaClient } from "@prisma/client";

export class PaymentRepository {
  constructor(private db: PrismaClient, private logger: Logger) {}

  async create(data: Prisma.PaymentCreateInput) {
    return await this.db.payment.create({ data });
  }

  async findById(id: string) {
    return this.db.payment.findUnique({
      where: { id },
      include: { invoice: true },
    });
  }

  async findAll() {
    return this.db.payment.findMany({
      include: { invoice: true },
    });
  }
}

import { Logger } from "winston";
import { InvoiceStatus, PrismaClient, Prisma } from "@prisma/client";

export class InvoiceRepository {
  constructor(private db: PrismaClient, private logger: Logger) {}

  async create(data: Prisma.InvoiceCreateInput) {
    return await this.db.invoice.create({
      data,
      include: { feeStructure: true },
    });
  }

  async findByStudentId(studentId: string) {
    this.logger.info("Querying invoice", studentId);
    return await this.db.invoice.findUnique({
      where: { studentId },
    });
  }

  async findById(id: string) {
    return await this.db.invoice.findUnique({
      where: { id },
      include: { payments: true },
    });
  }

  async markPaid(id: string) {
    return await this.db.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.PAID },
      include: { feeStructure: true },
    });
  }
}

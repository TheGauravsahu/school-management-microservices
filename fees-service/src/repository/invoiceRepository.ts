import { Logger } from "winston";
import { InvoiceStatus, PrismaClient, Prisma } from "@prisma/client";

export class InvoiceRepository {
  constructor(private db: PrismaClient, private logger: Logger) {}

  async create(data: Prisma.InvoiceCreateInput) {
    return await this.db.invoice.create({
      data,
      include: {
        items: true,
      },
    });
  }

  async createItem(invoiceId: string, data: Prisma.InvoiceItemCreateInput) {
    return await this.db.invoiceItem.create({
      data: {
        invoice: { connect: { id: invoiceId } },
        feeStructure: data.feeStructure,
        amount: data.amount,
        month: data.month,
        year: data.year,
        pending: data.pending ?? data.amount,
        paid: 0,
        waiver: 0,
      },
    });
  }

  async findById(id: string) {
    return await this.db.invoice.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            feeStructure: true,
          },
        },
        payments: true,
        student: true,
        session: true,
      },
    });
  }

  async findByStudentId(studentId: string) {
    return await this.db.invoice.findMany({
      where: { studentId },
      include: { session: true },
    });
  }
  async update(id: string, data: Prisma.FeeStructureUpdateInput) {
    this.logger.info("Updating FeeStructure", { id, ...data });
    return await this.db.feeStructure.update({
      where: { id },
      data,
      include: { session: true },
    });
  }

  async delete(id: string) {
    this.logger.info("Deleting FeeStructure", id);
    return await this.db.feeStructure.delete({
      where: { id },
    });
  }

  async findBySession(sessionId: string) {
    this.logger.info("Fetching FeeStructures for session", sessionId);
    return await this.db.feeStructure.findMany({
      where: { sessionId },
      include: { invoiceItems: true },
    });
  }

  async markPaid(id: string) {
    return await this.db.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.PAID },
      include: { session: true },
    });
  }
}

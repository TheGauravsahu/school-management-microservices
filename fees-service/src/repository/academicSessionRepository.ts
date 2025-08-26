import { Prisma, PrismaClient } from "@prisma/client";
import { Logger } from "winston";

export class AcademicSessionRepository {
  constructor(private logger: Logger, private db: PrismaClient) {}

  async create(data: Prisma.AcademicSessionCreateInput) {
    this.logger.info("Creating academinc session: ", data);
    return this.db.academicSession.create({ data });
  }

  async findAll() {
    return this.db.academicSession.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return this.db.academicSession.findFirst({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.AcademicSessionUpdateInput) {
    this.logger.info("Updating academinc session: ", data.name);
    return this.db.academicSession.update({
      where: { id },
      data,
    });
  }
}

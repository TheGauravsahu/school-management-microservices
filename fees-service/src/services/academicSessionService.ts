import { Prisma } from "@prisma/client";
import { AcademicSessionRepository } from "../repository/academicSessionRepository";

export class AcademicSessionService {
  constructor(
    private academicSessionRepository: AcademicSessionRepository
  ) {}

  async createSession(data: Prisma.AcademicSessionCreateInput) {
    return this.academicSessionRepository.create(data);
  }

  async findAllSessions() {
    return this.academicSessionRepository.findAll();
  }

  async findSessionById(id: string) {
    return this.academicSessionRepository.findById(id);
  }

  async updateSession(id: string, data: Prisma.AcademicSessionUpdateInput) {
    return this.academicSessionRepository.update(id, data);
  }
}

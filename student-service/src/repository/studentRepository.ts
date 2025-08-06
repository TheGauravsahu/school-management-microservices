import { Logger } from "winston";

export class StudentRepostory {
  constructor(private logger: Logger) {}

  async create() {}

  async findAll() {}

  async findById(id: string) {}

  async findByEmail(email: string) {}

  async findByUserID(userId: string) {}

  async update() {}

  async delete(id: string) {}
}

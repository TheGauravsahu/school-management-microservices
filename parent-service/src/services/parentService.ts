import { Logger } from "winston";
import { ParentRepository } from "../repository/parentRepository";
import { IParent, ParentQueryFilters } from "../types";
import createHttpError from "http-errors";

export class ParentService {
  constructor(
    private parentRepository: ParentRepository,
    private logger: Logger
  ) {}

  async createParent(data: IParent) {
    const existing = await this.parentRepository.findByEmail(data.email);
    if (existing) {
      this.logger.warn("Parent with this email already exists", {
        email: data.email,
      });
      throw createHttpError(400, "Parent with this email already exists.");
    }
    const parent = await this.parentRepository.create(data);
    this.logger.info("Parent created successfully", { email: data.email });
    return parent;
  }

  async getAllParents(filters: ParentQueryFilters) {
    const skip = ((filters.page ?? 1) - 1) * (filters.limit ?? 10);
    filters.skip = skip;

    const [parents, total] = await Promise.all([
      this.parentRepository.findAll(filters),
      this.parentRepository.countAll(),
    ]);

    if ((filters.page ?? 1) > Math.ceil(total / (filters.limit ?? 10))) {
      throw createHttpError(400, "Page number exceeds total pages");
    }

    if (!parents || parents.length === 0) {
      this.logger.warn("No parents found", { filters });
      return { parents: [], total };
    }
    this.logger.info("Fetched parents successfully", { total });
    return { parents, total };
  }

  async getParentById(id: string) {
    const parent = await this.parentRepository.findById(id);
    if (!parent) {
      this.logger.warn("No parent found with this ID", { id });
      throw createHttpError(404, "No parent found with this ID.");
    }
    this.logger.info("Fetched parent successfully", { id });
    return parent;
  }

  async updateParent(id: string, data: Partial<IParent>) {
    const parent = await this.parentRepository.findById(id);
    if (!parent) {
      this.logger.warn("No parent found for update", { id });
      throw createHttpError(404, "No parent found for update.");
    }
    const updatedParent = await this.parentRepository.update(id, data);
    this.logger.info("Parent updated successfully", { id, data });
    return updatedParent;
  }

  async deleteParent(id: string) {
    const parent = await this.parentRepository.findById(id);
    if (!parent) {
      this.logger.warn("No parent found for deletion", { id });
      throw createHttpError(404, "No parent found for deletion.");
    }
    const deletedParent = await this.parentRepository.delete(id);
    this.logger.info("Parent deleted successfully", { id });
    return deletedParent;
  }
}

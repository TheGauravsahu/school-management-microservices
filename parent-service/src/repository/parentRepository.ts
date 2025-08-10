import { Logger } from "winston";
import { parentModel } from "../models/parent";
import { IParent, ParentQueryFilters } from "../types";
import createHttpError from "http-errors";

export class ParentRepository {
  constructor(private logger: Logger) {}

  async create(data: IParent) {
    try {
      const result = await parentModel.create(data);
      this.logger.info("Parent created successfully", { data });
      return result;
    } catch (error) {
      this.logger.error("Error creating parent", { error, data });
      throw createHttpError(500, "Failed to create parent");
    }
  }

  async findByEmail(email: string) {
    try {
      const result = await parentModel.findOne({ email });
      if (!result) {
        this.logger.warn("Parent not found by email", { email });
      }
      return result;
    } catch (error) {
      this.logger.error("Error finding parent by email", { error, email });
      throw createHttpError(500, "Failed to find parent by email");
    }
  }

  async findById(id: string) {
    try {
      const result = await parentModel.findById(id);
      if (!result) {
        this.logger.warn("Parent not found by ID", { id });
        throw createHttpError(404, "Parent not found by ID");
      }
      return result;
    } catch (error) {
      this.logger.error("Error finding parent by ID", { error, id });
      throw createHttpError(500, "Failed to find parent by ID");
    }
  }

  async findByUserId(userId: string) {
    try {
      const result = await parentModel.findOne({ userId });
      if (!result) {
        this.logger.warn("Parent not found by user ID", { userId });
        throw createHttpError(404, "Parent not found by user ID");
      }
      return result;
    } catch (error) {
      this.logger.error("Error finding parent by user ID", { error, userId });
      throw createHttpError(500, "Failed to find parent by user ID");
    }
  }

  async findAll(filters: ParentQueryFilters) {
    try {
      const query: any = {};
      const mongooseQuery = parentModel.find(query);
      if (!filters.exportMode) {
        mongooseQuery.skip(filters.skip ?? 0).limit(filters.limit ?? 10);
      }
      const result = await mongooseQuery.sort({ createdAt: -1 });
      this.logger.info("Fetched parents successfully", { filters });
      return result;
    } catch (error) {
      this.logger.error("Error fetching parents", { error, filters });
      throw createHttpError(500, "Failed to fetch parents");
    }
  }

  async countAll() {
    try {
      const count = await parentModel.countDocuments();
      this.logger.info("Counted parents successfully", { count });
      return count;
    } catch (error) {
      this.logger.error("Error counting parents", { error });
      throw createHttpError(500, "Failed to count parents");
    }
  }

  async update(id: string, data: Partial<IParent>) {
    try {
      const result = await parentModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      if (!result) {
        this.logger.warn("Parent not found for update", { id });
        throw createHttpError(404, "Parent not found for update");
      }
      this.logger.info("Parent updated successfully", { id, data });
      return result;
    } catch (error) {
      this.logger.error("Error updating parent", { error, id, data });
      throw createHttpError(500, "Failed to update parent");
    }
  }

  async delete(id: string) {
    try {
      const result = await parentModel.findByIdAndDelete(id);
      if (!result) {
        this.logger.warn("Parent not found for deletion", { id });
        throw createHttpError(404, "Parent not found for deletion");
      }
      this.logger.info("Parent deleted successfully", { id });
      return result;
    } catch (error) {
      this.logger.error("Error deleting parent", { error, id });
      throw createHttpError(500, "Failed to delete parent");
    }
  }
}

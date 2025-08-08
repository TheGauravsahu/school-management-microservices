import { Logger } from "winston";
import {  studentModel } from "../models/Student";
import { IStudent, StudentQueryFilters } from "../types";

export class StudentRepostory {
  constructor(private logger: Logger) {}

  async create(data: IStudent) {
    try {
      return await studentModel.create(data);
    } catch (error) {
      this.logger.error("Error creating student", error);
      throw new Error("Failed to create student");
    }
  }

  async findAll(filters: StudentQueryFilters) {
    const query: any = {};

    if (filters.classNumber) query.class = filters.classNumber;
    if (filters.section) query.section = filters.section;
    if (filters.gender) query.gender = filters.gender;
    if (filters.parentId) query.parentId = filters.parentId;

    const mongooseQuery = studentModel.find(query);

    if (!filters.exportMode) {
      mongooseQuery.skip(filters.skip ?? 0).limit(filters.limit ?? 10);
    }

    return await mongooseQuery.sort({ createdAt: -1 });
  }

  async findById(id: string) {
    try {
      const student = await studentModel.findById(id);
      if (!student) {
        throw new Error("Student not found");
      }
      return student;
    } catch (error) {
      this.logger.error("Error fetching student by ID", error);
      throw new Error("Failed to fetch student by ID");
    }
  }

  async findByEmail(email: string) {
    try {
      const student = await studentModel.findOne({ email });
      if (!student) {
        throw new Error("Student not found with the provided email");
      }
      return student;
    } catch (error) {
      this.logger.error("Error fetching student by email", error);
      throw new Error("Failed to fetch student by email");
    }
  }

  async findByUserID(userId: string) {
    try {
      const student = await studentModel.findOne({ userId });
      return student;
    } catch (error) {
      this.logger.error("Error fetching student by user ID", error);
      throw new Error("Failed to fetch student by user ID");
    }
  }

  async findByParentId(parentId: string) {
    try {
      const student = await studentModel.find({ parentId });
      return student;
    } catch (error) {
      this.logger.error("Error fetching student by parent ID", error);
      throw new Error("Failed to fetch student by parent ID");
    }
  }

  async countAll(filters: StudentQueryFilters): Promise<number> {
    const query: any = {};

    if (filters.classNumber) query.class = filters.classNumber;
    if (filters.section) query.section = filters.section;
    if (filters.gender) query.gender = filters.gender;
    if (filters.parentId) query.parentId = filters.parentId;

    return await studentModel.countDocuments(query);
  }

  async update(id: string, data: Partial<IStudent>) {
    return studentModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    try {
      const result = await studentModel.findByIdAndDelete(id);
      if (!result) {
        throw new Error("Student not found for deletion");
      }
      return result;
    } catch (error) {
      this.logger.error("Error deleting student", error);
      throw new Error("Failed to delete student");
    }
  }
}

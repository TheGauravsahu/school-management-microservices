import { Logger } from "winston";
import { IStudent, studentModel } from "../models/Student";

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

  async findAll(skip: number, limit: number) {
    try {
      return await studentModel.find().skip(skip).limit(limit);
    } catch (error) {
      this.logger.error("Error fetching students", error);
      throw new Error("Failed to fetch students");
    }
  }

  async findByClassAndSection(
    classNumber: number,
    section: string,
    skip: number,
    limit: number
  ) {
    try {
      return await studentModel
        .find({ class: classNumber, section })
        .skip(skip)
        .limit(limit);
    } catch (error) {
      this.logger.error("Error fetching students by class and section", error);
      throw new Error("Failed to fetch students by class and section");
    }
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

  async countAll() {
    return studentModel.countDocuments();
  }

  async countByClassAndSection(classNumber: number, section: string) {
    return studentModel.countDocuments({
      class: classNumber,
      section,
    });
  }

  async update() {}

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

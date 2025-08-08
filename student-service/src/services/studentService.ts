import createHttpError from "http-errors";
import { Logger } from "winston";
import { StudentRepostory } from "../repository/studentRepository";
import { IStudent, StudentQueryFilters } from "../types";
import { UpdateStudentInput } from "../validators/student.validator";

export class StudentService {
  constructor(
    private studentRepository: StudentRepostory,
    private logger: Logger
  ) {}

  async createStudent(data: IStudent) {
    const isExistingStudent = await this.studentRepository.findByUserID(
      data.userId
    );
    if (isExistingStudent) {
      this.logger.error("Student with this user ID already exists");
      throw createHttpError(400, "Student with this user ID already exists");
    }
    const student = await this.studentRepository.create(data);
    this.logger.info("Student created successfully");
    return student;
  }

  async getAllStudentsWithFilters(filters: StudentQueryFilters) {
    const skip = ((filters.page ?? 1) - 1) * (filters.limit ?? 10);
    filters.skip = skip;

    const [students, total] = await Promise.all([
      this.studentRepository.findAll(filters),
      this.studentRepository.countAll(filters),
    ]);

    if (!students || students.length === 0) {
      this.logger.warn("No students found.");
      throw createHttpError(
        404,
        "No students found."
      );
    }
    this.logger.info("Fetched students successfully");
    return { students, total };
  }

  async getStudentById(studentId: string) {
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      this.logger.warn(`Student with ID ${studentId} not found`);
      throw createHttpError(404, `Student with ID ${studentId} not found`);
    }
    this.logger.info(`Fetched student with ID ${studentId} successfully`);
    return student;
  }

  async getStudentByUserId(userId: string) {
    const student = await this.studentRepository.findByUserID(userId);
    if (!student) {
      this.logger.warn(`Student with user ID ${userId} not found`);
      throw createHttpError(404, `Student with user ID ${userId} not found`);
    }
    this.logger.info(`Fetched student with user ID ${userId} successfully`);
    return student;
  }

  async getStudentsByParentId(parentId: string) {
    const students = await this.studentRepository.findByParentId(parentId);
    if (!students || students.length === 0) {
      this.logger.warn(`No students found for parent ID ${parentId}`);
      throw createHttpError(404, `No students found for parent ID ${parentId}`);
    }
    this.logger.info(`Fetched students for parent ID ${parentId} successfully`);
    return students;
  }

  async updateStudent(studentId: string, data: UpdateStudentInput) {
    await this.getStudentById(studentId);

    const updatedStudent = await this.studentRepository.update(studentId, data);
    this.logger.info(`Updated student with ID ${studentId} successfully`);
    return updatedStudent;
  }

  async deleteStudent(studentId: string) {
    await this.getStudentById(studentId);

    await this.studentRepository.delete(studentId);
    this.logger.info(`Deleted student with ID ${studentId} successfully`);
  }
}

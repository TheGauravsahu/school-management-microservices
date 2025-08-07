import createHttpError from "http-errors";
import { Logger } from "winston";
import { StudentRepostory } from "../repository/studentRepository";
import { IStudent } from "../models/Student";

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

  async getAllStudentsByClassAndSection(
    classNumber: number,
    section: string,
    page: number,
    limit: number
  ) {
    const skip = (page - 1) * limit;
    const [students, total] = await Promise.all([
      this.studentRepository.findByClassAndSection(
        classNumber,
        section,
        skip,
        limit
      ),
      this.studentRepository.countByClassAndSection(classNumber, section),
    ]);

    if (!students || students.length === 0) {
      this.logger.warn("No students found for the given class and section");
      throw createHttpError(
        404,
        "No students found for the given class and section"
      );
    }
    this.logger.info("Fetched students by class and section successfully");
    return { students, total };
  }

  async getAllStudents(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [students, total] = await Promise.all([
      this.studentRepository.findAll(skip, limit),
      this.studentRepository.countAll(),
    ]);

    if (!students || students.length === 0) {
      this.logger.warn("No students found");
      throw createHttpError(404, "No students found");
    }
    this.logger.info("Fetched all students successfully");
    return { students, total };
  }
}

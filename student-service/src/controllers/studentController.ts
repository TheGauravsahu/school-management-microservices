import { Logger } from "winston";
import { StudentService } from "../services/studentService";
import { Request, Response, NextFunction } from "express";
import { studentQuerySchema } from "../validators/student.validator";
import z from "zod";

export class StudentController {
  constructor(private studentService: StudentService, private logger: Logger) {}

  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const studentData = req.body;
      const newStudent = await this.studentService.createStudent(studentData);
      res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: newStudent,
      });
    } catch (error) {
      this.logger.error("Error creating student", error);
      next(error);
    }
  }

  async getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = studentQuerySchema.parse(req.query);

      const classNumber = parsed.classNumber as number;
      const section = parsed.section as string;
      const page = parsed.page ?? 1;
      const limit = parsed.limit ?? 10;

      let students;
      let total;

      if (classNumber || section) {
        ({ students, total } =
          await this.studentService.getAllStudentsByClassAndSection(
            classNumber,
            section,
            page,
            limit
          ));
      } else {
        ({ students, total } = await this.studentService.getAllStudents(
          page,
          limit
        ));
      }

      return res.status(200).json({
        success: true,
        message: "All students fetched successfully",
        data: students,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation errror",
          errors: error.issues,
        });
      }
      this.logger.error("Error fetching students", error);
      next(error);
    }
  }
}

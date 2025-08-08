import { Logger } from "winston";
import { StudentService } from "../services/studentService";
import { Request, Response, NextFunction } from "express";
import {
  studentQuerySchema,
  UpdateStudentInput,
} from "../validators/student.validator";
import z from "zod";
import { StudentQueryFilters } from "../types";
import { PDFService } from "../services/pdfService";
import { Parser } from "json2csv";
import { generateExportFileName } from "../utils/fileNameGenerator";

const SERVICE_NAME = "STUDENT_SERVICE";

export class StudentController {
  constructor(
    private studentService: StudentService,
    private pdfService: PDFService,
    private logger: Logger
  ) {}

  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const studentData = req.body;
      const newStudent = await this.studentService.createStudent(studentData);
      res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: newStudent,
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      this.logger.error("Error creating student", error);
      next(error);
    }
  }

  async getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = studentQuerySchema.parse(req.query);

      const filters: StudentQueryFilters = {
        classNumber: parsed.classNumber,
        section: parsed.section,
        gender: parsed.gender,
        page: parsed.page ?? 1,
        limit: parsed.limit ?? 10,
      };

      const { students, total } =
        await this.studentService.getAllStudentsWithFilters(filters);

      return res.status(200).json({
        success: true,
        message: "All students fetched successfully",
        data: students,
        pagination: {
          total,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(total / filters?.limit!),
        },
        data_from: SERVICE_NAME,
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

  async getStudentById(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.id;
      const student = await this.studentService.getStudentById(studentId);
      return res.status(200).json({
        success: true,
        message: `Student with ID ${studentId} fetched successfully`,
        data: student,
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      this.logger.error("Error fetching student by ID", error);
      next(error);
    }
  }

  async getStudentByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?.userId as string;
      const student = await this.studentService.getStudentByUserId(userId);
      return res.status(200).json({
        success: true,
        message: `Student with user ID ${userId} fetched successfully`,
        data: student,
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      this.logger.error("Error fetching student by user ID", error);
      next(error);
    }
  }

  async getStudentsByParentId(req: Request, res: Response, next: NextFunction) {
    try {
      const parentId = req.params.parentId;
      const students = await this.studentService.getStudentsByParentId(
        parentId
      );
      return res.status(200).json({
        success: true,
        message: `Students for parent ID ${parentId} fetched successfully`,
        data: students,
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      this.logger.error("Error fetching students by parent ID", error);
      next(error);
    }
  }

  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.id;
      const studentData: UpdateStudentInput = req.body;
      const updatedStudent = await this.studentService.updateStudent(
        studentId,
        studentData
      );
      return res.status(200).json({
        success: true,
        message: `Student with ID ${studentId} updated successfully`,
        data: updatedStudent,
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      this.logger.error("Error updating student", error);
      next(error);
    }
  }

  async deleteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.id;
      await this.studentService.deleteStudent(studentId);
      return res.status(200).json({
        success: true,
        message: `Student with ID ${studentId} deleted successfully`,
        data_from: SERVICE_NAME,
      });
    } catch (error) {
      this.logger.error("Error deleting student", error);
      next(error);
    }
  }

  async exportStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = studentQuerySchema.parse(req.query);

      const filters: StudentQueryFilters = {
        classNumber: parsed.classNumber,
        section: parsed.section,
        gender: parsed.gender,
        exportMode: true,
      };

      // Fetch students with the applied filters
      const { students } = await this.studentService.getAllStudentsWithFilters(
        filters
      );

      const format = (req.query.format as string)?.toLowerCase() || "csv";
      const fileName = generateExportFileName({
        classNumber: filters.classNumber,
        section: filters.section,
        gender: filters.gender,
        extension: format,
      });

      if (format === "pdf") {
        const pdfBuffer = await this.pdfService.exportStudentsToPDF(students);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );
        return res.send(pdfBuffer);
      }

      // CSV fallback
      const parser = new Parser();
      const studentsData = students.map((student) => ({
        name: `${student.firstName} ${student.lastName}`,
        classNumber: student.class,
        section: student.section,
        rollNumber: student.rollNumber,
        mobileNumber: student.mobileNumber,
        email: student.email,
      }));

      const csv = parser.parse(studentsData);
      res.header("Content-Type", "text/csv");
      res.attachment(fileName);
      res.send(csv);
    } catch (error) {
      this.logger.error("Error exporting students", error);
      next(error);
    }
  }
}

import { FastifySchema } from "fastify";
import { AttendanceStatus } from "../common/types";

export const createStudentAttendanceSchema: FastifySchema = {
  body: {
    type: "object",
    required: [
      "teacherId",
      "student",
      "studentId",
      "date",
      "classNumber",
      "status",
    ],
    properties: {
      teacherId: {
        type: "string",
        format: "uuid",
        errorMessage: {
          type: "Teacher ID must be a string",
          format: "Teacher ID must be a valid UUID",
        },
      },
      studentId: {
        type: "string",
        format: "uuid",
        errorMessage: {
          type: "Student ID must be a string",
          format: "Student ID must be a valid UUID",
        },
      },
      student: {
        type: "object",
        required: ["id", "name", "email", "parentId", "parentEmail"],
        properties: {
          id: {
            type: "string",
            format: "uuid",
            errorMessage: "Student ID must be a valid UUID",
          },
          name: {
            type: "string",
            errorMessage: "Student name must be a string",
          },
          email: {
            type: "string",
            format: "email",
            errorMessage: "Student email must be a valid email",
          },
          rollNumber: {
            type: "number",
            errorMessage: "Roll number must be a number",
          },
          parentId: {
            type: "string",
            format: "uuid",
            errorMessage: "Parent ID must be a valid UUID",
          },
          parentEmail: {
            type: "string",
            format: "email",
            errorMessage: "Parent email must be a valid email",
          },
        },
        errorMessage: {
          required: {
            id: "Student ID is required",
            name: "Student name is required",
            email: "Student email is required",
            parentId: "Parent ID is required",
            parentEmail: "Parent email is required",
          },
        },
      },
      date: {
        type: "string",
        format: "date",
        errorMessage: "Date must be in YYYY-MM-DD format",
      },
      classNumber: {
        type: "number",
        errorMessage: "Class number must be a number",
      },
      status: {
        type: "string",
        enum: Object.values(AttendanceStatus),
        errorMessage: {
          enum: `Status must be one of: ${Object.values(AttendanceStatus).join(
            ", "
          )}`,
        },
      },
      remarks: {
        type: "string",
        errorMessage: "Remarks must be a string",
      },
    },
    errorMessage: {
      required: {
        teacherId: "Teacher ID is required",
        studentId: "Student ID is required",
        student: "Student details are required",
        date: "Date is required",
        classNumber: "Class number is required",
        status: "Attendance status is required",
      },
    },
  },
};

import { FastifySchema } from "fastify";
import { AttendanceStatus } from "../common/types";

export const createStudentsAttendanceSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["teacherId", "students", "date", "classNumber"],
    properties: {
      teacherId: {
        type: "string",
        errorMessage: {
          type: "Teacher ID must be a string",
        },
      },
      students: {
        type: "array",
        minItems: 1,
        errorMessage: {
          type: "Students must be an array",
          minItems: "At least one student record is required",
        },
        items: {
          type: "object",
          required: [
            "id",
            "name",
            "email",
            "parentId",
            "parentEmail",
            "status",
          ],
          properties: {
            id: {
              type: "string",
              errorMessage: {
                type: "Student ID must be a string",
              },
            },
            name: {
              type: "string",
              errorMessage: {
                type: "Student name must be a string",
              },
            },
            email: {
              type: "string",
              format: "email",
              errorMessage: {
                format: "Invalid student email format",
              },
            },

            rollNumber: {
              type: "number",
              errorMessage: {
                type: "Roll number must be a number",
              },
            },
            parentId: {
              type: "string",
              format: "uuid",
              errorMessage: {
                format: "Parent ID must be a valid UUID",
              },
            },
            parentEmail: {
              type: "string",
              format: "email",
              errorMessage: {
                format: "Invalid parent email format",
              },
            },
            status: {
              type: "string",
              enum: Object.values(AttendanceStatus),
              errorMessage: {
                enum: `Status must be one of: ${Object.values(
                  AttendanceStatus
                ).join(", ")}`,
              },
            },
            remarks: {
              type: "string",
              errorMessage: {
                type: "Remarks must be a string",
              },
            },
          },
          errorMessage: {
            required: {
              name: "Student name is required",
              email: "Student email is required",
              parentId: "Parent ID is required",
              parentEmail: "Parent email is required",
              status: "Attendance status is required",
            },
          },
        },
      },
      date: {
        type: "string",
        format: "date",
        errorMessage: {
          format: "Date must be in YYYY-MM-DD format",
        },
      },
      classNumber: {
        type: "number",
        errorMessage: {
          type: "Class number must be a number",
        },
      },
    },
    errorMessage: {
      required: {
        teacherId: "Teacher ID is required",
        students: "Students list is required",
        date: "Date is required",
        classNumber: "Class number is required",
      },
    },
  },
};

import { FastifySchema } from "fastify";
import { AttendanceStatus } from "../common/types";

export const createTeacherAttendanceSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["teacher", "date", "status"],
    properties: {
      teacher: {
        type: "object",
        required: ["id", "name", "email"],
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
            minLength: 1,
            errorMessage: "Teacher name is required",
          },
          email: {
            type: "string",
            format: "email",
            errorMessage: "Teacher email must be valid",
          },
        },
        additionalProperties: false,
        errorMessage: {
          required: {
            id: "Teacher ID is required",
            name: "Teacher name is required",
            email: "Teacher email is required",
          },
        },
      },
      date: {
        type: "string",
        format: "date",
        errorMessage: "Date must be in YYYY-MM-DD format",
      },
      status: {
        type: "string",
        enum: Object.values(AttendanceStatus),
        errorMessage: `Status must be one of: ${Object.values(
          AttendanceStatus
        ).join(", ")}`,
      },
      remarks: { type: "string" },
    },
    additionalProperties: false,
    errorMessage: {
      required: {
        teacher: "Teacher details are required",
        date: "Date is required",
        status: "Attendance status is required",
      },
    },
  },
};

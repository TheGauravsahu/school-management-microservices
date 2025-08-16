import { AttendanceStatus } from "../common/types";

export interface MarkStudentAttendanceDto {
  teacherId: string;
  student: StudentData;
  date: string; // YYYY-MM-DD
  classNumber: number;
}

export interface MarkStudentsAttendanceDto {
  teacherId: string;
  students: StudentData[];
  date: string; // YYYY-MM-DD
  classNumber: number;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  rollNumber?: number;
  parentId: string;
  parentEmail: string;
  remarks?: string;
  status: AttendanceStatus;
}

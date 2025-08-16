import { AttendanceStatus } from "../common/types";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("student_attendance")
@Index(["student", "classNumber", "date"], { unique: true })
export class StudentAttendance {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  teacherId: string;

  @Column({ type: "jsonb", nullable: false })
  student: {
    id: string;
    name: string;
    email: string;
    rollNumber?: number;
    parentId: string;
    parentEmail: string;
  };

  @Column({ type: "date" })
  date: string; // YYY-MM-DD

  @Column({ nullable: false })
  classNumber: number;

  @Column({ type: "enum", enum: AttendanceStatus })
  status: AttendanceStatus;

  @Column({ type: "text", nullable: true })
  remarks?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

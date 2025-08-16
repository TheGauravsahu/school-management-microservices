import { AttendanceStatus } from "../common/types";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("teacher_attendance")
@Index(["teacher", "date"], { unique: true })
export class TeacherAttendance {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "jsonb", nullable: false })
  teacher: {
    id: string;
    name: string;
    email: string;
  };

  @Column({ type: "date" })
  date: string; // YYY-MM-DD

  @Column({ type: "enum", enum: AttendanceStatus })
  status: AttendanceStatus;

  @Column({ type: "text", nullable: true })
  remarks?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

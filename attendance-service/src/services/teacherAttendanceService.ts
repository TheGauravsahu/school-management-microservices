import { AttendanceStatus } from "../common/types";
import { TeacherAttendance } from "../entity/TeacherAttendance";
import { Repository } from "typeorm";
import { Logger } from "winston";
import createHttpError from "http-errors";

export interface MarkTeacherAttendanceDto {
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  date: string; // YYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
}

export class TeacherAttendanceService {
  constructor(
    private logger: Logger,
    private teacherAttendanceRepository: Repository<TeacherAttendance>
  ) {}

  async markAttendance(dto: MarkTeacherAttendanceDto) {
    const existing = await this.teacherAttendanceRepository.findOne({
      where: {
        date: dto.date,
        teacher: {
          id: dto.teacher.id,
        },
      },
    });
    if (existing) {
      this.logger.info(
        `Attendance already marked for teacher ${dto.teacher.id} on ${dto.date}`
      );
      throw createHttpError(400, "Attendance already marked for the teaher");
    }

    const attendance = this.teacherAttendanceRepository.create({
      teacher: dto.teacher,
      date: dto.date,
      status: dto.status,
      remarks: dto.remarks,
    });
    return this.teacherAttendanceRepository.save(attendance);
  }

  async getAttendanceByDate(date: string) {
    return await this.teacherAttendanceRepository.find({
      where: { date },
    });
  }

  async getAttendanceForTeacher(
    teacherId: string,
    month?: number,
    year?: number
  ) {
    const qb =
      this.teacherAttendanceRepository.createQueryBuilder("attendance");

    qb.where("attendance.teacher->>'id' = :teacherId", { teacherId });

    if (month && year) {
      qb.andWhere("EXTRACT(MONTH FROM attendance.date) = :month", { month });
      qb.andWhere("EXTRACT(YEAR FROM attendance.date) = :year", { year });
    } else if (year) {
      qb.andWhere("EXTRACT(YEAR FROM attendance.date) = :year", { year });
    }

    return await qb.getMany();
  }

  async updateAttendance(id: string, status: AttendanceStatus) {
    const record = await this.teacherAttendanceRepository.findOne({
      where: { id },
    });
    if (!record) throw createHttpError(404, "Attendance record not found.");

    record.status = status;
    await this.teacherAttendanceRepository.save(record);

    return record;
  }

  async deleteAttendance(id: string) {
    const record = await this.teacherAttendanceRepository.findOne({
      where: { id },
    });
    if (!record) throw createHttpError(404, "Attendance record not found.");

    await this.teacherAttendanceRepository.remove(record);
    return true;
  }
}

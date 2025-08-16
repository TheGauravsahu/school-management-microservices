import { AttendanceStatus } from "../common/types";
import {
  MarkStudentAttendanceDto,
  MarkStudentsAttendanceDto,
} from "../dto/MarkStudentAttendanceDto";
import { StudentAttendance } from "../entity/StudentAttendance";
import createHttpError from "http-errors";
import { Repository } from "typeorm";
import { Logger } from "winston";

export class StudentAttendanceService {
  constructor(
    private logger: Logger,
    private studentAttendanceRepository: Repository<StudentAttendance>
  ) {}

  async findAttendanceForStudent(
    classNumber: number,
    date: string,
    studentId: string
  ) {
    return await this.studentAttendanceRepository.findOne({
      where: {
        classNumber,
        date,
        student: {
          id: studentId,
        },
      },
    });
  }

  async markAttendance(dto: MarkStudentAttendanceDto) {
    const existing = await this.findAttendanceForStudent(
      dto.classNumber,
      dto.date,
      dto.student.id
    );
    if (existing) {
      this.logger.info(
        `Attendance already marked for student ${dto.student.id} on ${dto.date}`
      );
      throw createHttpError(
        400,
        "Attendance already marked for this class & date"
      );
    }

    const attendance = this.studentAttendanceRepository.create({
      teacherId: dto.teacherId,
      student: dto.student,
      date: dto.date,
      classNumber: dto.classNumber,
      status: dto.student.status,
      remarks: dto.student.remarks,
    });
    return this.studentAttendanceRepository.save(attendance);
  }

  async markBulkAttendance(dto: MarkStudentsAttendanceDto) {
    const records = [];

    for (const student of dto.students) {
      const existing = await this.findAttendanceForStudent(
        dto.classNumber,
        dto.date,
        student.id
      );
      if (existing) {
        existing.status = student.status;
        existing.remarks = student.remarks;
        await this.studentAttendanceRepository.save(existing);
        continue;
      }

      const attendance = this.studentAttendanceRepository.create({
        teacherId: dto.teacherId,
        student,
        date: dto.date,
        classNumber: dto.classNumber,
        status: student.status,
        remarks: student.remarks,
      });

      records.push(attendance);
    }

    if (records.length > 0) {
      await this.studentAttendanceRepository.save(records);
    }

    return { count: records.length };
  }

  async getAttendanceByClassAndDate(classNumber: number, date: string) {
    return await this.studentAttendanceRepository.find({
      where: { classNumber, date },
    });
  }

  async getAttendanceForStudent(
    studentId: string,
    month?: number,
    year?: number
  ) {
    const qb =
      this.studentAttendanceRepository.createQueryBuilder("attendance");

    qb.where("attendance.student->>'id' = :studentId", { studentId });

    if (month && year) {
      qb.andWhere("EXTRACT(MONTH FROM attendance.date) = :month", { month });
      qb.andWhere("EXTRACT(YEAR FROM attendance.date) = :year", { year });
    } else if (year) {
      qb.andWhere("EXTRACT(YEAR FROM attendance.date) = :year", { year });
    }

    return await qb.getMany();
  }

  async updateAttendance(id: string, status: AttendanceStatus) {
    const record = await this.studentAttendanceRepository.findOne({
      where: { id },
    });
    if (!record) throw createHttpError(404, "Attendance record not found.");

    record.status = status;
    await this.studentAttendanceRepository.save(record);

    return record;
  }

  async deleteAttendance(id: string) {
    const record = await this.studentAttendanceRepository.findOne({
      where: { id },
    });
    if (!record) throw createHttpError(404, "Attendance record not found.");

    await this.studentAttendanceRepository.remove(record);
    return { deleted: true };
  }
}

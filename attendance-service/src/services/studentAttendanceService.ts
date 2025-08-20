import { Events } from "../common/config/rabbitmq/events";
import { RabbitMQ } from "../common/config/rabbitmq";
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
    private studentAttendanceRepository: Repository<StudentAttendance>,
    private rabbitMQ: RabbitMQ
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
        studentId,
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
    try {
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

          // 🔔 If absent, publish event
          if (student.status === AttendanceStatus.ABSENT) {
            await this.rabbitMQ.publish<Events.STUDENT_ABSENT>(
              Events.STUDENT_ABSENT,
              {
                studentId: student.id,
                name: student.name,
                email: student.email,
                parentEmail: student.parentEmail,
                date: dto.date,
                classNumber: dto.classNumber,
              }
            );
          }
          continue;
        }

        const attendance = this.studentAttendanceRepository.create({
          teacherId: dto.teacherId,
          studentId: student.id,
          student: {
            name: student.name,
            email: student.email,
            rollNumber: student.rollNumber,
            parentId: student.parentId,
            parentEmail: student.parentEmail,
          },
          date: dto.date,
          classNumber: dto.classNumber,
          status: student.status,
          remarks: student.remarks,
        });

        records.push(attendance);

        // 🔔 Publish absent notification if new record is absent
        if (student.status === AttendanceStatus.ABSENT) {
          await this.rabbitMQ.publish(Events.STUDENT_ABSENT, {
            studentId: student.id,
            email: student.email,
            parentEmail: student.parentEmail,
            name: student.name,
            date: dto.date,
            classNumber: dto.classNumber,
          });
        }
      }

      if (records.length > 0) {
        await this.studentAttendanceRepository.save(records);
      }

      return { count: records.length };
    } catch (error) {
      this.logger.error("Error marking students attedace", error);
      throw createHttpError(
        error.message || "Error marking students attendace"
      );
    }
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

    qb.where("attendance.studentId = :studentId", { studentId });

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

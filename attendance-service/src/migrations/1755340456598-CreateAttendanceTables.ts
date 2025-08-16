import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAttendanceTables1755340456598 implements MigrationInterface {
    name = 'CreateAttendanceTables1755340456598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."teacher_attendance_status_enum" RENAME TO "teacher_attendance_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."teacher_attendance_status_enum" AS ENUM('PRESENT', 'ABSENT', 'LEAVE')`);
        await queryRunner.query(`ALTER TABLE "teacher_attendance" ALTER COLUMN "status" TYPE "public"."teacher_attendance_status_enum" USING "status"::"text"::"public"."teacher_attendance_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."teacher_attendance_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."student_attendance_status_enum" RENAME TO "student_attendance_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."student_attendance_status_enum" AS ENUM('PRESENT', 'ABSENT', 'LEAVE')`);
        await queryRunner.query(`ALTER TABLE "student_attendance" ALTER COLUMN "status" TYPE "public"."student_attendance_status_enum" USING "status"::"text"::"public"."student_attendance_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."student_attendance_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."student_attendance_status_enum_old" AS ENUM('PRESNT', 'ABSENT', 'LEAVE')`);
        await queryRunner.query(`ALTER TABLE "student_attendance" ALTER COLUMN "status" TYPE "public"."student_attendance_status_enum_old" USING "status"::"text"::"public"."student_attendance_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."student_attendance_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."student_attendance_status_enum_old" RENAME TO "student_attendance_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."teacher_attendance_status_enum_old" AS ENUM('PRESNT', 'ABSENT', 'LEAVE')`);
        await queryRunner.query(`ALTER TABLE "teacher_attendance" ALTER COLUMN "status" TYPE "public"."teacher_attendance_status_enum_old" USING "status"::"text"::"public"."teacher_attendance_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."teacher_attendance_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."teacher_attendance_status_enum_old" RENAME TO "teacher_attendance_status_enum"`);
    }

}

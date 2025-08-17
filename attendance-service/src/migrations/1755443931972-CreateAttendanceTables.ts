import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAttendanceTables1755443931972 implements MigrationInterface {
    name = 'CreateAttendanceTables1755443931972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."teacher_attendance_status_enum" AS ENUM('PRESENT', 'ABSENT', 'LEAVE')`);
        await queryRunner.query(`CREATE TABLE "teacher_attendance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teacherId" character varying NOT NULL, "teacher" jsonb NOT NULL, "date" date NOT NULL, "status" "public"."teacher_attendance_status_enum" NOT NULL, "remarks" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_db5e32ed63fac67b9709ad3be1a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fc5ee3cc4e4a1fd30444081ebf" ON "teacher_attendance" ("teacherId", "date") `);
        await queryRunner.query(`CREATE TYPE "public"."student_attendance_status_enum" AS ENUM('PRESENT', 'ABSENT', 'LEAVE')`);
        await queryRunner.query(`CREATE TABLE "student_attendance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teacherId" character varying NOT NULL, "student" jsonb NOT NULL, "date" date NOT NULL, "classNumber" integer NOT NULL, "status" "public"."student_attendance_status_enum" NOT NULL, "remarks" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_432904873d2981c3443763ef49d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ba04a7b4282b2e9e227c170d7d" ON "student_attendance" ("classNumber", "date") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ba04a7b4282b2e9e227c170d7d"`);
        await queryRunner.query(`DROP TABLE "student_attendance"`);
        await queryRunner.query(`DROP TYPE "public"."student_attendance_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fc5ee3cc4e4a1fd30444081ebf"`);
        await queryRunner.query(`DROP TABLE "teacher_attendance"`);
        await queryRunner.query(`DROP TYPE "public"."teacher_attendance_status_enum"`);
    }

}

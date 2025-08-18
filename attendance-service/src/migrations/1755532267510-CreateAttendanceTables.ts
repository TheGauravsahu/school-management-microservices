import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAttendanceTables1755532267510 implements MigrationInterface {
    name = 'CreateAttendanceTables1755532267510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ba04a7b4282b2e9e227c170d7d"`);
        await queryRunner.query(`ALTER TABLE "student_attendance" ADD "studentId" character varying NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_578b8351da3ffadee62035b562" ON "student_attendance" ("studentId", "classNumber", "date") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_578b8351da3ffadee62035b562"`);
        await queryRunner.query(`ALTER TABLE "student_attendance" DROP COLUMN "studentId"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ba04a7b4282b2e9e227c170d7d" ON "student_attendance" ("classNumber", "date") `);
    }

}

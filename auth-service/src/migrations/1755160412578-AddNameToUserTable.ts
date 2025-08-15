import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToUserTable1755160412578 implements MigrationInterface {
    name = 'AddNameToUserTable1755160412578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    }

}

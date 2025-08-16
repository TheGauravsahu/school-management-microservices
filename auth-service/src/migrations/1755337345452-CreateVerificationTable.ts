import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVerificationTable1755337345452 implements MigrationInterface {
    name = 'CreateVerificationTable1755337345452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`);
        await queryRunner.query(`CREATE TABLE "verificationTokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "used" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "PK_74de12832b9c398da39bb6e1308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2580ce07e8713da054ef51bd76" ON "verificationTokens" ("token") `);
        await queryRunner.query(`ALTER TABLE "refreshTokens" ADD "revoked" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isActivated" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "externalId" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verificationTokens" ADD CONSTRAINT "FK_9e0f7494f9f90a0d9f40df3fe36" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verificationTokens" DROP CONSTRAINT "FK_9e0f7494f9f90a0d9f40df3fe36"`);
        await queryRunner.query(`ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "externalId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActivated"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "refreshTokens" DROP COLUMN "revoked"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2580ce07e8713da054ef51bd76"`);
        await queryRunner.query(`DROP TABLE "verificationTokens"`);
        await queryRunner.query(`ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

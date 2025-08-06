import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRefreshTokenTable1753195386637 implements MigrationInterface {
    name = 'CreateRefreshTokenTable1753195386637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refreshTokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expiresAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_c4a0078b846c2c4508473680625" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`);
        await queryRunner.query(`DROP TABLE "refreshTokens"`);
    }

}

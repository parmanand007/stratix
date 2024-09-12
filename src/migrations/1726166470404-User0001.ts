import { MigrationInterface, QueryRunner } from "typeorm";

export class User00011726166470404 implements MigrationInterface {
    name = 'User00011726166470404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" RENAME COLUMN "email" TO "domain"`);
        await queryRunner.query(`ALTER TABLE "organization" RENAME CONSTRAINT "UQ_5d06de67ef6ab02cbd938988bb1" TO "UQ_8fda796a2b3388e30c01d5fa5ee"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "organization" uuid NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_f5bf944a7be1b67426a1367a3a3" FOREIGN KEY ("organization") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f5bf944a7be1b67426a1367a3a3"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "organization" RENAME CONSTRAINT "UQ_8fda796a2b3388e30c01d5fa5ee" TO "UQ_5d06de67ef6ab02cbd938988bb1"`);
        await queryRunner.query(`ALTER TABLE "organization" RENAME COLUMN "domain" TO "email"`);
    }

}

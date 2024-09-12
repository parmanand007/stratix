import { MigrationInterface, QueryRunner } from "typeorm";

export class Organization0011726161288475 implements MigrationInterface {
    name = 'Organization0011726161288475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "PK_472c1f99a32def1b0abb219cd67"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "PK_472c1f99a32def1b0abb219cd67"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id")`);
    }

}

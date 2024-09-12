import { MigrationInterface, QueryRunner } from "typeorm";

export class User00021726168014229 implements MigrationInterface {
    name = 'User00021726168014229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f5bf944a7be1b67426a1367a3a3"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "organization" TO "organizationId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "organizationId" TO "organization"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_f5bf944a7be1b67426a1367a3a3" FOREIGN KEY ("organization") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

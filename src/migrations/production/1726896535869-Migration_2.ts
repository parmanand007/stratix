import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration21726896535869 implements MigrationInterface {
    name = 'Migration21726896535869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "UQ_59f940b5775a9ccf5c2f094c8af" UNIQUE ("uuid")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_a95e949168be7b7ece1a2382fed" UNIQUE ("uuid")`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "PK_472c1f99a32def1b0abb219cd67"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "organizationId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "organizationId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "PK_472c1f99a32def1b0abb219cd67"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_a95e949168be7b7ece1a2382fed"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "uuid"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "UQ_59f940b5775a9ccf5c2f094c8af"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "uuid"`);
    }

}

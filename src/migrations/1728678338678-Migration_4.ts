import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration41728678338678 implements MigrationInterface {
    name = 'Migration41728678338678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization_address" ("id" SERIAL NOT NULL, "street" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "postalCode" character varying NOT NULL, "country" character varying NOT NULL, CONSTRAINT "PK_0f31fe3925535afb5462326d7d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "addressId" integer`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "UQ_63c0d3f228775d613e037b94e25" UNIQUE ("addressId")`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_63c0d3f228775d613e037b94e25" FOREIGN KEY ("addressId") REFERENCES "organization_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_63c0d3f228775d613e037b94e25"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "UQ_63c0d3f228775d613e037b94e25"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "addressId"`);
        await queryRunner.query(`DROP TABLE "organization_address"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration51728679884741 implements MigrationInterface {
    name = 'Migration51728679884741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization_address" ALTER COLUMN "country" SET DEFAULT 'INDIA'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization_address" ALTER COLUMN "country" DROP DEFAULT`);
    }

}

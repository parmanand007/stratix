import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration31727548311672 implements MigrationInterface {
    name = 'Migration31727548311672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "parentId" integer, CONSTRAINT "UQ_cb73208f151aa71cdd78f662d70" UNIQUE ("slug"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."product_condition_enum" AS ENUM('new', 'used')`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "condition" "public"."product_condition_enum" NOT NULL, "imageUrl" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "categoryId" integer, "organizationId" integer, CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224" UNIQUE ("slug"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_32a4bdd261ec81f4ca6b3abe262" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_32a4bdd261ec81f4ca6b3abe262"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_329b8ae12068b23da547d3b4798"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TYPE "public"."product_condition_enum"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}

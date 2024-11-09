import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration61731160762382 implements MigrationInterface {
    name = 'Migration61731160762382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_room" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'private', CONSTRAINT "PK_8aa3a52cf74c96469f0ef9fbe3e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_message" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "chatRoomId" integer, "userId" integer, CONSTRAINT "PK_3cc0d85193aade457d3077dd06b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_room_participants_user" ("chatRoomId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_f4d47b6834439f670e93db2e3e9" PRIMARY KEY ("chatRoomId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fd0350d006a2fcb072030ae8a0" ON "chat_room_participants_user" ("chatRoomId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16f2408eb656d0b12245241dcb" ON "chat_room_participants_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD CONSTRAINT "FK_14b26a0944a258f4035a55d5020" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD CONSTRAINT "FK_a44ec486210e6f8b4591776d6f3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_room_participants_user" ADD CONSTRAINT "FK_fd0350d006a2fcb072030ae8a07" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_room_participants_user" ADD CONSTRAINT "FK_16f2408eb656d0b12245241dcb9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_room_participants_user" DROP CONSTRAINT "FK_16f2408eb656d0b12245241dcb9"`);
        await queryRunner.query(`ALTER TABLE "chat_room_participants_user" DROP CONSTRAINT "FK_fd0350d006a2fcb072030ae8a07"`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP CONSTRAINT "FK_a44ec486210e6f8b4591776d6f3"`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP CONSTRAINT "FK_14b26a0944a258f4035a55d5020"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16f2408eb656d0b12245241dcb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd0350d006a2fcb072030ae8a0"`);
        await queryRunner.query(`DROP TABLE "chat_room_participants_user"`);
        await queryRunner.query(`DROP TABLE "chat_message"`);
        await queryRunner.query(`DROP TABLE "chat_room"`);
    }

}

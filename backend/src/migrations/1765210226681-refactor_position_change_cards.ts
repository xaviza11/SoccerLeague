import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorPositionChangeCards1765210226681 implements MigrationInterface {
    name = 'RefactorPositionChangeCards1765210226681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "position_change_card" DROP CONSTRAINT "FK_79bcac6518d10d808155f8f4c94"`);
        await queryRunner.query(`ALTER TABLE "position_change_card" DROP COLUMN "storageId"`);
        await queryRunner.query(`CREATE TYPE "public"."position_change_card_new_position_enum" AS ENUM('Goalkeeper', 'Defender', 'Left_Back', 'Right_Back', 'Defensive_Midfield', 'Midfielder', 'Left_Midfield', 'Right_Midfield', 'Attacking_Midfield', 'Left_Wing', 'Right_Wing', 'Striker')`);
        await queryRunner.query(`ALTER TABLE "position_change_card" ADD "new_position" "public"."position_change_card_new_position_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "position_change_card" ADD "storage_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "position_change_card" ADD CONSTRAINT "FK_880c64bac6a2fdcf7e6c845032e" FOREIGN KEY ("storage_id") REFERENCES "storage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "position_change_card" DROP CONSTRAINT "FK_880c64bac6a2fdcf7e6c845032e"`);
        await queryRunner.query(`ALTER TABLE "position_change_card" DROP COLUMN "storage_id"`);
        await queryRunner.query(`ALTER TABLE "position_change_card" DROP COLUMN "new_position"`);
        await queryRunner.query(`DROP TYPE "public"."position_change_card_new_position_enum"`);
        await queryRunner.query(`ALTER TABLE "position_change_card" ADD "storageId" uuid`);
        await queryRunner.query(`ALTER TABLE "position_change_card" ADD CONSTRAINT "FK_79bcac6518d10d808155f8f4c94" FOREIGN KEY ("storageId") REFERENCES "storage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

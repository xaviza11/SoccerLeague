import { MigrationInterface, QueryRunner } from "typeorm";

export class DeletePlayerInstructionsFields1765984093234 implements MigrationInterface {
  name = "DeletePlayerInstructionsFields1765984093234";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "games" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "player_one_id" uuid NOT NULL, "player_two_id" uuid, "is_ai_game" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "instructionsPenalty_kicker"`);
    await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "instructionsCorner_kicker"`);
    await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "instructionsFree_kick_kicker"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player" ADD "instructionsFree_kick_kicker" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "player" ADD "instructionsCorner_kicker" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "player" ADD "instructionsPenalty_kicker" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`DROP TABLE "games"`);
  }
}

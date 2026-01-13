import { MigrationInterface, QueryRunner } from "typeorm";

export class FinishFirstVersion1765491495202 implements MigrationInterface {
  name = "FinishFirstVersion1765491495202";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "games" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "player_one_id" uuid NOT NULL, "player_two_id" uuid, "is_ai_game" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "games"`);
  }
}

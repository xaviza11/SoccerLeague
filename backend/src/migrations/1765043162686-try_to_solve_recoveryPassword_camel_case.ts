import { MigrationInterface, QueryRunner } from "typeorm";

export class TryToSolveRecoveryPasswordCamelCase1765043162686 implements MigrationInterface {
    name = 'TryToSolveRecoveryPasswordCamelCase1765043162686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "storage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" uuid, CONSTRAINT "REL_9ee60b9a60980630926a91e717" UNIQUE ("teamId"), CONSTRAINT "PK_f9b67a9921474d86492aad2e027" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_stats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "elo" integer NOT NULL, "money" integer NOT NULL, "total_games" integer NOT NULL, CONSTRAINT "PK_f55fb5b508e96b05303efae93e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_userstats_elo" ON "user_stats" ("elo") `);
        await queryRunner.query(`CREATE TABLE "team" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "position_change_card" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "storageId" uuid, CONSTRAINT "PK_61889d614a6b34fe58bd78c2589" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."card_name_enum" AS ENUM('Sniper', 'Commandant', 'Magician', 'Wall', 'Titan', 'Cheetah', 'Horse', 'Visionary', 'Quarterback', 'Killer', 'Fighter', 'Lion', 'General', 'Magnet', 'FastHands', 'Guardian', 'Rocket', 'NONE')`);
        await queryRunner.query(`CREATE TABLE "card" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."card_name_enum" NOT NULL DEFAULT 'NONE', "storageId" uuid, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."player_country_enum" AS ENUM('Spain', 'Mexico', 'Argentina', 'Colombia', 'Peru', 'Venezuela', 'Chile', 'Ecuador', 'Guatemala', 'Cuba', 'Bolivia', 'Dominican Republic', 'Honduras', 'Paraguay', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Uruguay', 'Panama', 'Puerto Rico', 'Brazil', 'Portugal', 'Croatia', 'Germany', 'Denmark', 'Sweden', 'Norway', 'Finland', 'Netherlands', 'England', 'Romania', 'Hungary', 'Italy', 'Belgium', 'Switzerland', 'Austria', 'Poland', 'Czech Republic', 'Slovakia', 'Slovenia', 'Serbia', 'French')`);
        await queryRunner.query(`CREATE TYPE "public"."player_position_enum" AS ENUM('Goalkeeper', 'Defender', 'Left_Back', 'Right_Back', 'Defensive_Midfield', 'Midfielder', 'Left_Midfield', 'Right_Midfield', 'Attacking_Midfield', 'Left_Wing', 'Right_Wing', 'Striker')`);
        await queryRunner.query(`CREATE TYPE "public"."player_current_position_enum" AS ENUM('Goalkeeper', 'Defender', 'Left_Back', 'Right_Back', 'Defensive_Midfield', 'Midfielder', 'Left_Midfield', 'Right_Midfield', 'Attacking_Midfield', 'Left_Wing', 'Right_Wing', 'Striker')`);
        await queryRunner.query(`CREATE TYPE "public"."player_original_position_enum" AS ENUM('Goalkeeper', 'Defender', 'Left_Back', 'Right_Back', 'Defensive_Midfield', 'Midfielder', 'Left_Midfield', 'Right_Midfield', 'Attacking_Midfield', 'Left_Wing', 'Right_Wing', 'Striker')`);
        await queryRunner.query(`CREATE TYPE "public"."player_instructionsoffensive_enum" AS ENUM('Shoot', 'Pass', 'Dribble', 'Cross', 'LongBall')`);
        await queryRunner.query(`CREATE TYPE "public"."player_instructionsdefensive_enum" AS ENUM('Destroy', 'Normal', 'Passive', 'Offside')`);
        await queryRunner.query(`CREATE TABLE "player" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "country" "public"."player_country_enum" NOT NULL, "position" "public"."player_position_enum" NOT NULL, "current_position" "public"."player_current_position_enum" NOT NULL, "original_position" "public"."player_original_position_enum" NOT NULL, "max_skill_level" integer NOT NULL, "height_cm" integer NOT NULL, "image" character varying, "number" integer NOT NULL, "cardId" uuid, "teamId" uuid NOT NULL, "skillsShooting" integer NOT NULL DEFAULT '0', "skillsPassing" integer NOT NULL DEFAULT '0', "skillsDribbling" integer NOT NULL DEFAULT '0', "skillsDefense" integer NOT NULL DEFAULT '0', "skillsPhysical" integer NOT NULL DEFAULT '0', "skillsSpeed" integer NOT NULL DEFAULT '0', "skillsStamina" integer NOT NULL DEFAULT '0', "skillsVision" integer NOT NULL DEFAULT '0', "skillsCrossing" integer NOT NULL DEFAULT '0', "skillsFinishing" integer NOT NULL DEFAULT '0', "skillsAggression" integer NOT NULL DEFAULT '0', "skillsComposure" integer NOT NULL DEFAULT '0', "skillsControl" integer NOT NULL DEFAULT '0', "skillsIntuition" integer NOT NULL DEFAULT '0', "skillsHandling" integer NOT NULL DEFAULT '0', "skillsKicking" integer NOT NULL DEFAULT '0', "skillsReflexes" integer NOT NULL DEFAULT '0', "statusAge" integer NOT NULL, "statusIs_active" boolean NOT NULL DEFAULT true, "statusInjured_until" character varying, "statusRetirement_age" integer NOT NULL, "instructionsPenalty_kicker" integer NOT NULL DEFAULT '0', "instructionsCorner_kicker" integer NOT NULL DEFAULT '0', "instructionsFree_kick_kicker" integer NOT NULL DEFAULT '0', "instructionsOffensive" "public"."player_instructionsoffensive_enum" array NOT NULL DEFAULT '{}', "instructionsDefensive" "public"."player_instructionsdefensive_enum" array NOT NULL DEFAULT '{}', "statsGoals" integer NOT NULL DEFAULT '0', "statsTotal_shots" integer NOT NULL DEFAULT '0', "statsTotal_passes" integer NOT NULL DEFAULT '0', "statsFaults" integer NOT NULL DEFAULT '0', "statsAssists" integer NOT NULL DEFAULT '0', "statsRed_cards" integer NOT NULL DEFAULT '0', "statsYellow_cards" integer NOT NULL DEFAULT '0', "statsTotal_games" integer NOT NULL DEFAULT '0', CONSTRAINT "REL_09a296f1e27421242b5b70473e" UNIQUE ("cardId"), CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "recoveryPassword"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "recovery_password" character varying NOT NULL DEFAULT ' '`);
        await queryRunner.query(`ALTER TABLE "user" ADD "storageId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_c8cd27bd98e7b2a7c46daaf254a" UNIQUE ("storageId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "statsId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_79bb3ba7b87fbfdf3772c96fd87" UNIQUE ("statsId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c8cd27bd98e7b2a7c46daaf254a" FOREIGN KEY ("storageId") REFERENCES "storage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_79bb3ba7b87fbfdf3772c96fd87" FOREIGN KEY ("statsId") REFERENCES "user_stats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "storage" ADD CONSTRAINT "FK_9ee60b9a60980630926a91e717c" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "position_change_card" ADD CONSTRAINT "FK_79bcac6518d10d808155f8f4c94" FOREIGN KEY ("storageId") REFERENCES "storage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_15fe322da9576242b9e934e59dd" FOREIGN KEY ("storageId") REFERENCES "storage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_09a296f1e27421242b5b70473e0" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_e85150e7e8a80bee7f2be3adab0" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_e85150e7e8a80bee7f2be3adab0"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_09a296f1e27421242b5b70473e0"`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_15fe322da9576242b9e934e59dd"`);
        await queryRunner.query(`ALTER TABLE "position_change_card" DROP CONSTRAINT "FK_79bcac6518d10d808155f8f4c94"`);
        await queryRunner.query(`ALTER TABLE "storage" DROP CONSTRAINT "FK_9ee60b9a60980630926a91e717c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_79bb3ba7b87fbfdf3772c96fd87"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c8cd27bd98e7b2a7c46daaf254a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_79bb3ba7b87fbfdf3772c96fd87"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "statsId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_c8cd27bd98e7b2a7c46daaf254a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "storageId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "recovery_password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "recoveryPassword" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "player"`);
        await queryRunner.query(`DROP TYPE "public"."player_instructionsdefensive_enum"`);
        await queryRunner.query(`DROP TYPE "public"."player_instructionsoffensive_enum"`);
        await queryRunner.query(`DROP TYPE "public"."player_original_position_enum"`);
        await queryRunner.query(`DROP TYPE "public"."player_current_position_enum"`);
        await queryRunner.query(`DROP TYPE "public"."player_position_enum"`);
        await queryRunner.query(`DROP TYPE "public"."player_country_enum"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`DROP TYPE "public"."card_name_enum"`);
        await queryRunner.query(`DROP TABLE "position_change_card"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`DROP INDEX "public"."idx_userstats_elo"`);
        await queryRunner.query(`DROP TABLE "user_stats"`);
        await queryRunner.query(`DROP TABLE "storage"`);
    }

}

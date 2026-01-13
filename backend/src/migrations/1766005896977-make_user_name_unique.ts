import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeUserNameUnique1766005896977 implements MigrationInterface {
  name = "MakeUserNameUnique1766005896977";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "recovery_password" character varying NOT NULL DEFAULT ' ', "has_game" boolean NOT NULL DEFAULT false, "storageId" uuid, "statsId" uuid, CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_c8cd27bd98e7b2a7c46daaf254" UNIQUE ("storageId"), CONSTRAINT "REL_79bb3ba7b87fbfdf3772c96fd8" UNIQUE ("statsId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "storage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" uuid, CONSTRAINT "REL_9ee60b9a60980630926a91e717" UNIQUE ("teamId"), CONSTRAINT "PK_f9b67a9921474d86492aad2e027" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_stats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "elo" integer NOT NULL, "money" integer NOT NULL, "total_games" integer NOT NULL, CONSTRAINT "PK_f55fb5b508e96b05303efae93e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "idx_userstats_elo" ON "user_stats" ("elo") `);
    await queryRunner.query(
      `CREATE TABLE "team" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."position_change_card_new_position_enum" AS ENUM('Goalkeeper', 'Defender', 'Left_Back', 'Right_Back', 'Defensive_Midfield', 'Midfielder', 'Left_Midfield', 'Right_Midfield', 'Attacking_Midfield', 'Left_Wing', 'Right_Wing', 'Striker')`,
    );
    await queryRunner.query(
      `CREATE TABLE "position_change_card" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "new_position" "public"."position_change_card_new_position_enum" NOT NULL, "storage_id" uuid NOT NULL, CONSTRAINT "PK_61889d614a6b34fe58bd78c2589" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."card_name_enum" AS ENUM('Sniper', 'Commandant', 'Magician', 'Wall', 'Titan', 'Cheetah', 'Horse', 'Visionary', 'Quarterback', 'Killer', 'Fighter', 'Lion', 'General', 'Magnet', 'FastHands', 'Guardian', 'Rocket', 'NONE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "card" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."card_name_enum" NOT NULL DEFAULT 'NONE', "storage_id" uuid NOT NULL, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."player_country_enum" AS ENUM('Spain', 'Mexico', 'Argentina', 'Colombia', 'Peru', 'Venezuela', 'Chile', 'Ecuador', 'Guatemala', 'Cuba', 'Bolivia', 'Dominican Republic', 'Honduras', 'Paraguay', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Uruguay', 'Panama', 'Puerto Rico', 'Brazil', 'Portugal', 'Croatia', 'Germany', 'Denmark', 'Sweden', 'Norway', 'Finland', 'Netherlands', 'England', 'Romania', 'Hungary', 'Italy', 'Belgium', 'Switzerland', 'Austria', 'Poland', 'Czech Republic', 'Slovakia', 'Slovenia', 'Serbia', 'French')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."player_position_enum" AS ENUM('Goalkeeper', 'Defender', 'Left_Back', 'Right_Back', 'Defensive_Midfield', 'Midfielder', 'Left_Midfield', 'Right_Midfield', 'Attacking_Midfield', 'Left_Wing', 'Right_Wing', 'Striker')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."player_current_position_enum" AS ENUM('Goalkeeper', 'Defender', 'Left_Back', 'Right_Back', 'Defensive_Midfield', 'Midfielder', 'Left_Midfield', 'Right_Midfield', 'Attacking_Midfield', 'Left_Wing', 'Right_Wing', 'Striker')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."player_original_position_enum" AS ENUM('Goalkeeper', 'Defender', 'Left_Back', 'Right_Back', 'Defensive_Midfield', 'Midfielder', 'Left_Midfield', 'Right_Midfield', 'Attacking_Midfield', 'Left_Wing', 'Right_Wing', 'Striker')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."player_instructionsoffensive_enum" AS ENUM('Shoot', 'Pass', 'Dribble', 'Cross', 'LongBall')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."player_instructionsdefensive_enum" AS ENUM('Destroy', 'Normal', 'Passive', 'Offside')`,
    );
    await queryRunner.query(
      `CREATE TABLE "player" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "country" "public"."player_country_enum" NOT NULL, "position" "public"."player_position_enum" NOT NULL, "current_position" "public"."player_current_position_enum" NOT NULL, "original_position" "public"."player_original_position_enum" NOT NULL, "max_skill_level" integer NOT NULL, "height_cm" integer NOT NULL, "image" character varying, "number" integer NOT NULL, "isBench" boolean NOT NULL DEFAULT true, "cardId" uuid, "teamId" uuid NOT NULL, "skillsShooting" integer NOT NULL DEFAULT '0', "skillsPassing" integer NOT NULL DEFAULT '0', "skillsDribbling" integer NOT NULL DEFAULT '0', "skillsDefense" integer NOT NULL DEFAULT '0', "skillsPhysical" integer NOT NULL DEFAULT '0', "skillsSpeed" integer NOT NULL DEFAULT '0', "skillsStamina" integer NOT NULL DEFAULT '0', "skillsVision" integer NOT NULL DEFAULT '0', "skillsCrossing" integer NOT NULL DEFAULT '0', "skillsFinishing" integer NOT NULL DEFAULT '0', "skillsAggression" integer NOT NULL DEFAULT '0', "skillsComposure" integer NOT NULL DEFAULT '0', "skillsControl" integer NOT NULL DEFAULT '0', "skillsIntuition" integer NOT NULL DEFAULT '0', "skillsHandling" integer NOT NULL DEFAULT '0', "skillsKicking" integer NOT NULL DEFAULT '0', "skillsReflexes" integer NOT NULL DEFAULT '0', "statusAge" integer NOT NULL, "statusIs_active" boolean NOT NULL DEFAULT true, "statusInjured_until" character varying, "statusRetirement_age" integer NOT NULL, "instructionsOffensive" "public"."player_instructionsoffensive_enum" array NOT NULL DEFAULT '{}', "instructionsDefensive" "public"."player_instructionsdefensive_enum" array NOT NULL DEFAULT '{}', "statsGoals" integer NOT NULL DEFAULT '0', "statsTotal_shots" integer NOT NULL DEFAULT '0', "statsTotal_passes" integer NOT NULL DEFAULT '0', "statsFaults" integer NOT NULL DEFAULT '0', "statsAssists" integer NOT NULL DEFAULT '0', "statsRed_cards" integer NOT NULL DEFAULT '0', "statsYellow_cards" integer NOT NULL DEFAULT '0', "statsTotal_games" integer NOT NULL DEFAULT '0', CONSTRAINT "REL_09a296f1e27421242b5b70473e" UNIQUE ("cardId"), CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."aura_name_enum" AS ENUM('None', 'Shooting', 'Passing', 'Dribbling', 'Defense', 'Physical', 'Speed', 'Stamina', 'Vision', 'Crossing', 'Finishing', 'Aggression', 'Composure', 'Control', 'Handling', 'Reflexes', 'Kicking', 'Intuition')`,
    );
    await queryRunner.query(
      `CREATE TABLE "aura" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."aura_name_enum" NOT NULL DEFAULT 'None', "storage_id" uuid NOT NULL, CONSTRAINT "PK_b7d5619bd284fd8a909a09bd3bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "games" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "player_one_id" uuid NOT NULL, "player_two_id" uuid, "is_ai_game" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "market_auras" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "aura_id" uuid NOT NULL, "seller_id" uuid NOT NULL, "price" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_73104083d878b53a2efe6494ad" UNIQUE ("aura_id"), CONSTRAINT "PK_eac843200cd665a6dacd56edd33" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "market_cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "card_id" uuid NOT NULL, "seller_id" uuid NOT NULL, "price" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_8472496754172c85a0d25db5e3" UNIQUE ("card_id"), CONSTRAINT "PK_ade2a7cef37cdc01e7091695e21" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "market_players" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "player_id" uuid NOT NULL, "seller_id" uuid NOT NULL, "price" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_ec99751eecf3576b493cc464f0" UNIQUE ("player_id"), CONSTRAINT "PK_bc67a49ef3754b106991799ec87" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "market_position_change_cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position_change_card_id" uuid NOT NULL, "seller_id" uuid NOT NULL, "price" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_3e3ad4ecbd169fc5e49a36e8ba" UNIQUE ("position_change_card_id"), CONSTRAINT "PK_fcb5d050917fdd9815386525232" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c8cd27bd98e7b2a7c46daaf254a" FOREIGN KEY ("storageId") REFERENCES "storage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_79bb3ba7b87fbfdf3772c96fd87" FOREIGN KEY ("statsId") REFERENCES "user_stats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage" ADD CONSTRAINT "FK_9ee60b9a60980630926a91e717c" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "position_change_card" ADD CONSTRAINT "FK_880c64bac6a2fdcf7e6c845032e" FOREIGN KEY ("storage_id") REFERENCES "storage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "card" ADD CONSTRAINT "FK_75b756647a0f5175f920cdb2f98" FOREIGN KEY ("storage_id") REFERENCES "storage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player" ADD CONSTRAINT "FK_09a296f1e27421242b5b70473e0" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player" ADD CONSTRAINT "FK_e85150e7e8a80bee7f2be3adab0" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "aura" ADD CONSTRAINT "FK_c80f70cb05db523abd356164f14" FOREIGN KEY ("storage_id") REFERENCES "storage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "market_auras" ADD CONSTRAINT "FK_73104083d878b53a2efe6494adf" FOREIGN KEY ("aura_id") REFERENCES "aura"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "market_cards" ADD CONSTRAINT "FK_8472496754172c85a0d25db5e3e" FOREIGN KEY ("card_id") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "market_players" ADD CONSTRAINT "FK_ec99751eecf3576b493cc464f0e" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "market_position_change_cards" ADD CONSTRAINT "FK_3e3ad4ecbd169fc5e49a36e8baf" FOREIGN KEY ("position_change_card_id") REFERENCES "position_change_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "market_position_change_cards" DROP CONSTRAINT "FK_3e3ad4ecbd169fc5e49a36e8baf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "market_players" DROP CONSTRAINT "FK_ec99751eecf3576b493cc464f0e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "market_cards" DROP CONSTRAINT "FK_8472496754172c85a0d25db5e3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "market_auras" DROP CONSTRAINT "FK_73104083d878b53a2efe6494adf"`,
    );
    await queryRunner.query(`ALTER TABLE "aura" DROP CONSTRAINT "FK_c80f70cb05db523abd356164f14"`);
    await queryRunner.query(
      `ALTER TABLE "player" DROP CONSTRAINT "FK_e85150e7e8a80bee7f2be3adab0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player" DROP CONSTRAINT "FK_09a296f1e27421242b5b70473e0"`,
    );
    await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_75b756647a0f5175f920cdb2f98"`);
    await queryRunner.query(
      `ALTER TABLE "position_change_card" DROP CONSTRAINT "FK_880c64bac6a2fdcf7e6c845032e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage" DROP CONSTRAINT "FK_9ee60b9a60980630926a91e717c"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_79bb3ba7b87fbfdf3772c96fd87"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c8cd27bd98e7b2a7c46daaf254a"`);
    await queryRunner.query(`DROP TABLE "market_position_change_cards"`);
    await queryRunner.query(`DROP TABLE "market_players"`);
    await queryRunner.query(`DROP TABLE "market_cards"`);
    await queryRunner.query(`DROP TABLE "market_auras"`);
    await queryRunner.query(`DROP TABLE "games"`);
    await queryRunner.query(`DROP TABLE "aura"`);
    await queryRunner.query(`DROP TYPE "public"."aura_name_enum"`);
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
    await queryRunner.query(`DROP TYPE "public"."position_change_card_new_position_enum"`);
    await queryRunner.query(`DROP TABLE "team"`);
    await queryRunner.query(`DROP INDEX "public"."idx_userstats_elo"`);
    await queryRunner.query(`DROP TABLE "user_stats"`);
    await queryRunner.query(`DROP TABLE "storage"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}

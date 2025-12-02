import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersStoreAndStats1764705508595 implements MigrationInterface {
    name = 'AddUsersStoreAndStats1764705508595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "storage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" uuid, CONSTRAINT "REL_9ee60b9a60980630926a91e717" UNIQUE ("teamId"), CONSTRAINT "PK_f9b67a9921474d86492aad2e027" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_stats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "elo" integer NOT NULL, "money" integer NOT NULL, "total_games" integer NOT NULL, CONSTRAINT "PK_f55fb5b508e96b05303efae93e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "position_change_card" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "storageId" uuid, CONSTRAINT "PK_61889d614a6b34fe58bd78c2589" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "card" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "storageId" uuid, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "recoveryPassword"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "recovery_password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "storageId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_c8cd27bd98e7b2a7c46daaf254a" UNIQUE ("storageId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "statsId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_79bb3ba7b87fbfdf3772c96fd87" UNIQUE ("statsId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c8cd27bd98e7b2a7c46daaf254a" FOREIGN KEY ("storageId") REFERENCES "storage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_79bb3ba7b87fbfdf3772c96fd87" FOREIGN KEY ("statsId") REFERENCES "user_stats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "storage" ADD CONSTRAINT "FK_9ee60b9a60980630926a91e717c" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "position_change_card" ADD CONSTRAINT "FK_79bcac6518d10d808155f8f4c94" FOREIGN KEY ("storageId") REFERENCES "storage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_15fe322da9576242b9e934e59dd" FOREIGN KEY ("storageId") REFERENCES "storage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`DROP TABLE "position_change_card"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`DROP TABLE "user_stats"`);
        await queryRunner.query(`DROP TABLE "storage"`);
    }

}

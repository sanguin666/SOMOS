import { MigrationInterface, QueryRunner } from "typeorm";

export class PushNotifications1791100000000 implements MigrationInterface {
    name = 'PushNotifications1791100000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "push_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "token" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid NOT NULL,
                CONSTRAINT "UQ_869b4a9ba2c9e030aafc4b7dc7a" UNIQUE ("token"),
                CONSTRAINT "PK_32734e87f299c29ca3878861f4f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "user_pois"
            ADD "notify_news" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            ALTER TABLE "user_pois"
            ADD "notify_requests" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            ALTER TABLE "user_pois"
            ADD "notify_events" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            ALTER TABLE "user_pois"
            ADD "notify_live" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            ALTER TABLE "push_tokens"
            ADD CONSTRAINT "FK_94c371aff70dedeb89dae39f440" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "push_tokens" DROP CONSTRAINT "FK_94c371aff70dedeb89dae39f440"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_pois" DROP COLUMN "notify_live"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_pois" DROP COLUMN "notify_events"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_pois" DROP COLUMN "notify_requests"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_pois" DROP COLUMN "notify_news"
        `);
        await queryRunner.query(`
            DROP TABLE "push_tokens"
        `);
    }

}

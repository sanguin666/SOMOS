import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationTriggers1791200000000 implements MigrationInterface {
    name = 'NotificationTriggers1791200000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "event_reminders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "reminded_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid NOT NULL,
                "event_id" uuid NOT NULL,
                CONSTRAINT "PK_52bc63640f4068b3f2b9fd55af9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_4fa2088e8fb9cd47350966f623" ON "event_reminders" ("user_id", "event_id")
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."push_tokens_language_enum" AS ENUM('en', 'es', 'fr')
        `);
        await queryRunner.query(`
            ALTER TABLE "push_tokens"
            ADD "language" "public"."push_tokens_language_enum" NOT NULL DEFAULT 'en'
        `);
        await queryRunner.query(`
            ALTER TABLE "push_tokens"
            ADD "time_zone" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "event_reminders"
            ADD CONSTRAINT "FK_3cc060151d30c30c8ac9465030f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "event_reminders"
            ADD CONSTRAINT "FK_3e2431a78a7d6ae9f601e02208b" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "event_reminders" DROP CONSTRAINT "FK_3e2431a78a7d6ae9f601e02208b"
        `);
        await queryRunner.query(`
            ALTER TABLE "event_reminders" DROP CONSTRAINT "FK_3cc060151d30c30c8ac9465030f"
        `);
        await queryRunner.query(`
            ALTER TABLE "push_tokens" DROP COLUMN "time_zone"
        `);
        await queryRunner.query(`
            ALTER TABLE "push_tokens" DROP COLUMN "language"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."push_tokens_language_enum"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_4fa2088e8fb9cd47350966f623"
        `);
        await queryRunner.query(`
            DROP TABLE "event_reminders"
        `);
    }

}

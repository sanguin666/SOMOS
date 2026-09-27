import { MigrationInterface, QueryRunner } from "typeorm";

export class RecurringEventReminders1791500000000 implements MigrationInterface {
    name = 'RecurringEventReminders1791500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "event_reminders"
            ADD "only_date" character varying(10)
        `);
        await queryRunner.query(`
            ALTER TABLE "event_reminders"
            ADD "reminded_for" TIMESTAMP WITH TIME ZONE
        `);
        // Reminders already sent were for their event's one start.
        await queryRunner.query(`
            UPDATE "event_reminders" r SET "reminded_for" = e."starts_at"
            FROM "events" e WHERE r."event_id" = e."id" AND r."reminded_at" IS NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "event_reminders" DROP COLUMN "reminded_for"
        `);
        await queryRunner.query(`
            ALTER TABLE "event_reminders" DROP COLUMN "only_date"
        `);
    }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class EventRepeatRules1790800000000 implements MigrationInterface {
    name = 'EventRepeatRules1790800000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "events"
            ADD "repeat_days" smallint array NOT NULL DEFAULT '{}'
        `);
        await queryRunner.query(`
            ALTER TABLE "events"
            ADD "monthly_week" smallint
        `);
        await queryRunner.query(`
            ALTER TABLE "events"
            ADD "monthly_weekday" smallint
        `);
        await queryRunner.query(`
            ALTER TABLE "events"
            ADD "monthly_day" smallint
        `);
        await queryRunner.query(`
            ALTER TABLE "events"
            ADD "exceptions" jsonb NOT NULL DEFAULT '[]'
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."events_recurrence_enum"
            ADD VALUE 'monthly'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."events_recurrence_enum_old" AS ENUM('none', 'weekly')
        `);
        await queryRunner.query(`
            ALTER TABLE "events"
            ALTER COLUMN "recurrence" TYPE "public"."events_recurrence_enum_old" USING "recurrence"::"text"::"public"."events_recurrence_enum_old"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."events_recurrence_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."events_recurrence_enum_old"
            RENAME TO "events_recurrence_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "events" DROP COLUMN "exceptions"
        `);
        await queryRunner.query(`
            ALTER TABLE "events" DROP COLUMN "monthly_day"
        `);
        await queryRunner.query(`
            ALTER TABLE "events" DROP COLUMN "monthly_weekday"
        `);
        await queryRunner.query(`
            ALTER TABLE "events" DROP COLUMN "monthly_week"
        `);
        await queryRunner.query(`
            ALTER TABLE "events" DROP COLUMN "repeat_days"
        `);
    }

}

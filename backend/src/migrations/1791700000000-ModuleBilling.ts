import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Paid modules (Seb, 30 Sep 2026). Every community that exists before this
 * runs keeps what it has at no charge ("Offert"), so switching billing on
 * turns nothing off for the demos.
 */
export class ModuleBilling1791700000000 implements MigrationInterface {
    name = 'ModuleBilling1791700000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."pois_billing_interval_enum" AS ENUM('monthly', 'yearly')
        `);
        await queryRunner.query(`
            ALTER TABLE "pois"
            ADD "billing_interval" "public"."pois_billing_interval_enum" NOT NULL DEFAULT 'monthly'
        `);
        await queryRunner.query(`
            ALTER TABLE "pois"
            ADD "billing_comped" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "pois"
            ADD "payment_method_label" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "pois"
            ADD "billing_renews_at" TIMESTAMP WITH TIME ZONE
        `);
        await queryRunner.query(`
            UPDATE "pois" SET "billing_comped" = true
        `);
        await queryRunner.query(`
            ALTER TABLE "active_modules"
            ADD "trial_ends_at" TIMESTAMP WITH TIME ZONE
        `);
        await queryRunner.query(`
            ALTER TABLE "active_modules"
            ADD "paid_until" TIMESTAMP WITH TIME ZONE
        `);
        await queryRunner.query(`
            ALTER TABLE "active_modules"
            ADD "cancel_at_period_end" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            CREATE TABLE "billing_invoices" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "issued_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "amount" numeric(10,2) NOT NULL,
                "lines" jsonb NOT NULL DEFAULT '[]',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "poi_id" uuid,
                CONSTRAINT "PK_9dbe3b4ca302c61707224bf3835" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_09eccec38e9dbde81568760d9d" ON "billing_invoices" ("poi_id", "issued_at")
        `);
        await queryRunner.query(`
            ALTER TABLE "billing_invoices"
            ADD CONSTRAINT "FK_53b0f98a7e2c2d02e6405d4d42c" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "billing_invoices" DROP CONSTRAINT "FK_53b0f98a7e2c2d02e6405d4d42c"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_09eccec38e9dbde81568760d9d"
        `);
        await queryRunner.query(`
            DROP TABLE "billing_invoices"
        `);
        await queryRunner.query(`
            ALTER TABLE "active_modules" DROP COLUMN "cancel_at_period_end"
        `);
        await queryRunner.query(`
            ALTER TABLE "active_modules" DROP COLUMN "paid_until"
        `);
        await queryRunner.query(`
            ALTER TABLE "active_modules" DROP COLUMN "trial_ends_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "pois" DROP COLUMN "billing_renews_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "pois" DROP COLUMN "payment_method_label"
        `);
        await queryRunner.query(`
            ALTER TABLE "pois" DROP COLUMN "billing_comped"
        `);
        await queryRunner.query(`
            ALTER TABLE "pois" DROP COLUMN "billing_interval"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."pois_billing_interval_enum"
        `);
    }
}

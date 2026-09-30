import { MigrationInterface, QueryRunner } from "typeorm";

export class DailyReadings1791600000000 implements MigrationInterface {
    name = 'DailyReadings1791600000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "daily_readings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "date" character varying(10) NOT NULL,
                "word" text,
                "sections" jsonb NOT NULL DEFAULT '[]',
                "published" boolean NOT NULL DEFAULT false,
                "notify_at" character varying(5),
                "notified_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "poi_id" uuid,
                CONSTRAINT "PK_7bd02b70516cc3e4747639485d5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_aa8bc7ca9b031cbd1ed6fc0465" ON "daily_readings" ("poi_id", "date")
        `);
        await queryRunner.query(`
            ALTER TABLE "pois"
            ADD "readings_link_url" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "user_pois"
            ADD "notify_readings" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_23c4e717610c49881e8939c216"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."active_modules_module_type_enum"
            ADD VALUE 'daily_readings'
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."poi_badges_link_module_enum"
            ADD VALUE 'daily_readings'
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_23c4e717610c49881e8939c216" ON "active_modules" ("poi_id", "module_type")
        `);
        await queryRunner.query(`
            ALTER TABLE "daily_readings"
            ADD CONSTRAINT "FK_39c9221548d787ad47795aca6a4" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "daily_readings" DROP CONSTRAINT "FK_39c9221548d787ad47795aca6a4"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_23c4e717610c49881e8939c216"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."poi_badges_link_module_enum_old" AS ENUM(
                'donations',
                'events',
                'announcements',
                'prayer_requests',
                'livestreams',
                'community',
                'requests',
                'mass_intentions'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "poi_badges"
            ALTER COLUMN "link_module" TYPE "public"."poi_badges_link_module_enum_old" USING "link_module"::"text"::"public"."poi_badges_link_module_enum_old"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."poi_badges_link_module_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."poi_badges_link_module_enum_old"
            RENAME TO "poi_badges_link_module_enum"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."active_modules_module_type_enum_old" AS ENUM(
                'donations',
                'events',
                'announcements',
                'prayer_requests',
                'livestreams',
                'community',
                'requests',
                'mass_intentions'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "active_modules"
            ALTER COLUMN "module_type" TYPE "public"."active_modules_module_type_enum_old" USING "module_type"::"text"::"public"."active_modules_module_type_enum_old"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."active_modules_module_type_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."active_modules_module_type_enum_old"
            RENAME TO "active_modules_module_type_enum"
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_23c4e717610c49881e8939c216" ON "active_modules" USING btree ("module_type", "poi_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "user_pois" DROP COLUMN "notify_readings"
        `);
        await queryRunner.query(`
            ALTER TABLE "pois" DROP COLUMN "readings_link_url"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_aa8bc7ca9b031cbd1ed6fc0465"
        `);
        await queryRunner.query(`
            DROP TABLE "daily_readings"
        `);
    }

}

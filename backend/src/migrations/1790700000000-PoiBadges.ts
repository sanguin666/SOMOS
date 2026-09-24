import { MigrationInterface, QueryRunner } from "typeorm";

export class PoiBadges1790700000000 implements MigrationInterface {
    name = 'PoiBadges1790700000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."poi_badges_kind_enum" AS ENUM(
                'message',
                'next_mass',
                'office_hours',
                'next_confession',
                'campaign'
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."poi_badges_link_module_enum" AS ENUM(
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
            CREATE TABLE "poi_badges" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "kind" "public"."poi_badges_kind_enum" NOT NULL,
                "position" integer NOT NULL,
                "enabled" boolean NOT NULL DEFAULT true,
                "text" character varying(40),
                "important" boolean NOT NULL DEFAULT false,
                "link_module" "public"."poi_badges_link_module_enum",
                "campaign_id" uuid,
                "show_until" date,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "poi_id" uuid,
                CONSTRAINT "PK_6fc0ebd648caa42439d825ca9c0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "poi_badges"
            ADD CONSTRAINT "FK_49cf972c4152d706e00206ef524" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "poi_badges" DROP CONSTRAINT "FK_49cf972c4152d706e00206ef524"
        `);
        await queryRunner.query(`
            DROP TABLE "poi_badges"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."poi_badges_link_module_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."poi_badges_kind_enum"
        `);
    }

}

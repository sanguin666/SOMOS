import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1790068146296 implements MigrationInterface {
    name = 'InitialSchema1790068146296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."active_modules_module_type_enum" AS ENUM(
                'donations',
                'events',
                'announcements',
                'prayer_requests',
                'livestreams',
                'community'
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."active_modules_status_enum" AS ENUM('trial', 'active', 'expired', 'cancelled')
        `);
        await queryRunner.query(`
            CREATE TABLE "active_modules" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "module_type" "public"."active_modules_module_type_enum" NOT NULL,
                "status" "public"."active_modules_status_enum" NOT NULL DEFAULT 'trial',
                "start_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "expiration_date" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "poi_id" uuid,
                CONSTRAINT "PK_8248f03dc1623d32e8bd3481e58" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_23c4e717610c49881e8939c216" ON "active_modules" ("poi_id", "module_type")
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."pois_type_enum" AS ENUM('church')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."pois_language_enum" AS ENUM('en', 'es', 'fr')
        `);
        await queryRunner.query(`
            CREATE TABLE "pois" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "type" "public"."pois_type_enum" NOT NULL DEFAULT 'church',
                "language" "public"."pois_language_enum" NOT NULL DEFAULT 'en',
                "description" text,
                "picture_url" character varying,
                "qr_flyer_headline" character varying,
                "qr_flyer_subtext" text,
                "menu_order" text array NOT NULL DEFAULT '{}',
                "address" character varying,
                "city" character varying,
                "postal_code" character varying,
                "qr_code_token" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_c279307267f29d7feea28ebc71a" UNIQUE ("qr_code_token"),
                CONSTRAINT "PK_99443c840638a5ab1359e8a6145" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_pois_role_enum" AS ENUM('member', 'admin')
        `);
        await queryRunner.query(`
            CREATE TABLE "user_pois" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "role" "public"."user_pois_role_enum" NOT NULL DEFAULT 'member',
                "joined_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                "poi_id" uuid,
                CONSTRAINT "PK_b28c796e1c3c1653aa95d00ef20" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_afb7165e6e62bd0345dcb83a80" ON "user_pois" ("user_id", "poi_id")
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."users_language_enum" AS ENUM('en', 'es', 'fr')
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "phone" character varying,
                "email" character varying,
                "password_hash" character varying,
                "first_name" character varying,
                "last_name" character varying,
                "language" "public"."users_language_enum" NOT NULL DEFAULT 'en',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "announcements" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "body" text,
                "audio_url" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "poi_id" uuid,
                CONSTRAINT "PK_b3ad760876ff2e19d58e05dc8b0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "events" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "starts_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "location" character varying,
                "description" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "poi_id" uuid,
                CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "prayer_requests" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "author_name" character varying,
                "message" text NOT NULL,
                "prayer_count" integer NOT NULL DEFAULT '0',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "poi_id" uuid,
                "author_id" uuid,
                CONSTRAINT "PK_000f6743347f872383f59655a52" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."livestreams_status_enum" AS ENUM('upcoming', 'live', 'ended')
        `);
        await queryRunner.query(`
            CREATE TABLE "livestreams" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "url" character varying NOT NULL,
                "scheduled_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "status" "public"."livestreams_status_enum" NOT NULL DEFAULT 'upcoming',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "poi_id" uuid,
                CONSTRAINT "PK_cdbd6bfb129b1c2553fc6ed98b7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "community_posts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "author_name" character varying,
                "message" text NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "poi_id" uuid,
                "author_id" uuid,
                CONSTRAINT "PK_af0c0b33e03b933e3e48119f2e3" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "community_comments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "author_name" character varying,
                "message" text NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "post_id" uuid,
                "author_id" uuid,
                CONSTRAINT "PK_bddaf18297fe4a6d1cd539586b3" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "donations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "amount" numeric(10, 2) NOT NULL,
                "currency" character varying NOT NULL DEFAULT 'eur',
                "status" character varying NOT NULL DEFAULT 'completed',
                "stripe_session_id" character varying,
                "stripe_payment_intent_id" character varying,
                "donor_name" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "poi_id" uuid,
                CONSTRAINT "PK_c01355d6f6f50fc6d1b4a946abf" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "phone_verification_codes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "phone" character varying NOT NULL,
                "code_hash" character varying NOT NULL,
                "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "attempts" integer NOT NULL DEFAULT '0',
                "consumed_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_b279f888c7b835cd371d69d95fa" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_344356702027c0fab48ada4b7f" ON "phone_verification_codes" ("phone")
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."poi_page_blocks_type_enum" AS ENUM(
                'text',
                'image',
                'next_events',
                'past_events',
                'latest_announcements',
                'next_livestream',
                'donate'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "poi_page_blocks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" "public"."poi_page_blocks_type_enum" NOT NULL,
                "position" integer NOT NULL,
                "title" character varying,
                "body" text,
                "image_url" character varying,
                "item_count" integer NOT NULL DEFAULT '3',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "poi_id" uuid,
                CONSTRAINT "PK_9fe6db6a82f86abd005db7633cd" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "active_modules"
            ADD CONSTRAINT "FK_e3ff0f30fc7a338c95adef827c0" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_pois"
            ADD CONSTRAINT "FK_5cf8756040cc32a7ef67a8c6790" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_pois"
            ADD CONSTRAINT "FK_6beed330a793ceb7ae5409527bf" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "announcements"
            ADD CONSTRAINT "FK_a4485786a747db31f6a688002dc" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "events"
            ADD CONSTRAINT "FK_4555417a3b9d611685092245d90" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "prayer_requests"
            ADD CONSTRAINT "FK_2d80a1c65fe475490f35d64554b" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "prayer_requests"
            ADD CONSTRAINT "FK_2d9cf364a405858fbba37672b53" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "livestreams"
            ADD CONSTRAINT "FK_6a99141c3b083f7a776794358e2" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "community_posts"
            ADD CONSTRAINT "FK_d4d6cb2bba40a33c3a6deb039ba" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "community_posts"
            ADD CONSTRAINT "FK_26f27bba71bb08c85b3d10d0c82" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "community_comments"
            ADD CONSTRAINT "FK_a33d7ff95c8e9cffddc6ec8452d" FOREIGN KEY ("post_id") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "community_comments"
            ADD CONSTRAINT "FK_8c8f025c07b8ab29abef7a7b955" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD CONSTRAINT "FK_47d2dac5a6c64315e64ffa37db1" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "poi_page_blocks"
            ADD CONSTRAINT "FK_d2fa76e14d8ca55d8c7af146b7b" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "poi_page_blocks" DROP CONSTRAINT "FK_d2fa76e14d8ca55d8c7af146b7b"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP CONSTRAINT "FK_47d2dac5a6c64315e64ffa37db1"
        `);
        await queryRunner.query(`
            ALTER TABLE "community_comments" DROP CONSTRAINT "FK_8c8f025c07b8ab29abef7a7b955"
        `);
        await queryRunner.query(`
            ALTER TABLE "community_comments" DROP CONSTRAINT "FK_a33d7ff95c8e9cffddc6ec8452d"
        `);
        await queryRunner.query(`
            ALTER TABLE "community_posts" DROP CONSTRAINT "FK_26f27bba71bb08c85b3d10d0c82"
        `);
        await queryRunner.query(`
            ALTER TABLE "community_posts" DROP CONSTRAINT "FK_d4d6cb2bba40a33c3a6deb039ba"
        `);
        await queryRunner.query(`
            ALTER TABLE "livestreams" DROP CONSTRAINT "FK_6a99141c3b083f7a776794358e2"
        `);
        await queryRunner.query(`
            ALTER TABLE "prayer_requests" DROP CONSTRAINT "FK_2d9cf364a405858fbba37672b53"
        `);
        await queryRunner.query(`
            ALTER TABLE "prayer_requests" DROP CONSTRAINT "FK_2d80a1c65fe475490f35d64554b"
        `);
        await queryRunner.query(`
            ALTER TABLE "events" DROP CONSTRAINT "FK_4555417a3b9d611685092245d90"
        `);
        await queryRunner.query(`
            ALTER TABLE "announcements" DROP CONSTRAINT "FK_a4485786a747db31f6a688002dc"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_pois" DROP CONSTRAINT "FK_6beed330a793ceb7ae5409527bf"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_pois" DROP CONSTRAINT "FK_5cf8756040cc32a7ef67a8c6790"
        `);
        await queryRunner.query(`
            ALTER TABLE "active_modules" DROP CONSTRAINT "FK_e3ff0f30fc7a338c95adef827c0"
        `);
        await queryRunner.query(`
            DROP TABLE "poi_page_blocks"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."poi_page_blocks_type_enum"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_344356702027c0fab48ada4b7f"
        `);
        await queryRunner.query(`
            DROP TABLE "phone_verification_codes"
        `);
        await queryRunner.query(`
            DROP TABLE "donations"
        `);
        await queryRunner.query(`
            DROP TABLE "community_comments"
        `);
        await queryRunner.query(`
            DROP TABLE "community_posts"
        `);
        await queryRunner.query(`
            DROP TABLE "livestreams"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."livestreams_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "prayer_requests"
        `);
        await queryRunner.query(`
            DROP TABLE "events"
        `);
        await queryRunner.query(`
            DROP TABLE "announcements"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_language_enum"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_afb7165e6e62bd0345dcb83a80"
        `);
        await queryRunner.query(`
            DROP TABLE "user_pois"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_pois_role_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "pois"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."pois_language_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."pois_type_enum"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_23c4e717610c49881e8939c216"
        `);
        await queryRunner.query(`
            DROP TABLE "active_modules"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."active_modules_status_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."active_modules_module_type_enum"
        `);
    }

}

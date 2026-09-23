import { MigrationInterface, QueryRunner } from "typeorm";

export class ChurchModules1790600000000 implements MigrationInterface {
    name = 'ChurchModules1790600000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "donation_campaigns" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" text,
                "goal_amount" numeric(10, 2),
                "ends_at" TIMESTAMP WITH TIME ZONE,
                "active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "poi_id" uuid,
                CONSTRAINT "PK_d592dfa0964d30ef0095c66b45a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "service_request_messages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "from_staff" boolean NOT NULL DEFAULT false,
                "body" text,
                "attachment_path" character varying,
                "attachment_name" character varying,
                "attachment_mime" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "request_id" uuid,
                "author_id" uuid,
                CONSTRAINT "PK_d32b54bb9413cf0da255726430a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "service_request_documents" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "label" character varying NOT NULL,
                "note" text,
                "file_path" character varying,
                "file_name" character varying,
                "file_mime" character varying,
                "received_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "request_id" uuid,
                CONSTRAINT "PK_cf1202e05c52169aca555305fe6" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."service_requests_type_enum" AS ENUM(
                'baptism',
                'wedding',
                'funeral',
                'first_communion',
                'confirmation',
                'certificate',
                'meeting',
                'blessing',
                'sick_visit',
                'other'
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."service_requests_status_enum" AS ENUM(
                'received',
                'in_progress',
                'appointment_set',
                'completed',
                'cancelled'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "service_requests" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" "public"."service_requests_type_enum" NOT NULL,
                "status" "public"."service_requests_status_enum" NOT NULL DEFAULT 'received',
                "contact_name" character varying NOT NULL,
                "contact_phone" character varying,
                "details" text NOT NULL,
                "preferred_date" character varying,
                "appointment_at" TIMESTAMP WITH TIME ZONE,
                "appointment_place" character varying,
                "last_member_activity_at" TIMESTAMP WITH TIME ZONE,
                "last_staff_activity_at" TIMESTAMP WITH TIME ZONE,
                "member_seen_at" TIMESTAMP WITH TIME ZONE,
                "staff_seen_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "poi_id" uuid,
                "requester_id" uuid,
                CONSTRAINT "PK_ee60bcd826b7e130bfbd97daf66" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."mass_intentions_status_enum" AS ENUM(
                'pending_payment',
                'confirmed',
                'celebrated',
                'cancelled'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "mass_intentions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "intention" text NOT NULL,
                "requester_name" character varying NOT NULL,
                "requester_contact" character varying,
                "celebration_at" TIMESTAMP WITH TIME ZONE,
                "event_id" uuid,
                "celebration_title" character varying,
                "offering_amount" numeric(10, 2),
                "status" "public"."mass_intentions_status_enum" NOT NULL DEFAULT 'confirmed',
                "from_office" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "poi_id" uuid,
                "requester_id" uuid,
                "donation_id" uuid,
                CONSTRAINT "PK_232a70ad460dbd9aefbdba57f48" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "pois"
            ADD "mass_intention_offering" numeric(10, 2)
        `);
        await queryRunner.query(`
            ALTER TABLE "pois"
            ADD "legal_name" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "pois"
            ADD "legal_tax_id" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "pois"
            ADD "legal_address" text
        `);
        await queryRunner.query(`
            ALTER TABLE "pois"
            ADD "receipt_signatory" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "events"
            ADD "ends_at" TIMESTAMP WITH TIME ZONE
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."events_category_enum" AS ENUM(
                'mass',
                'confession',
                'adoration',
                'prayer',
                'office_hours',
                'other'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "events"
            ADD "category" "public"."events_category_enum" NOT NULL DEFAULT 'other'
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."events_recurrence_enum" AS ENUM('none', 'weekly')
        `);
        await queryRunner.query(`
            ALTER TABLE "events"
            ADD "recurrence" "public"."events_recurrence_enum" NOT NULL DEFAULT 'none'
        `);
        await queryRunner.query(`
            ALTER TABLE "events"
            ADD "repeat_until" TIMESTAMP WITH TIME ZONE
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."donations_purpose_enum" AS ENUM(
                'general',
                'collection',
                'campaign',
                'mass_intention'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD "purpose" "public"."donations_purpose_enum" NOT NULL DEFAULT 'general'
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD "recurring" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD "recurring_parent_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD "stripe_subscription_id" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD "stripe_invoice_id" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD CONSTRAINT "UQ_d53f389ded0d0dcec4d2ec0efa6" UNIQUE ("stripe_invoice_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD "recurring_cancelled_at" TIMESTAMP WITH TIME ZONE
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD "wants_receipt" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD "donor_address" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD "donor_postal_code" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD "donor_city" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD "donor_tax_id" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD "campaign_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD "donor_id" uuid
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_23c4e717610c49881e8939c216"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."active_modules_module_type_enum"
            ADD VALUE 'requests'
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."active_modules_module_type_enum"
            ADD VALUE 'mass_intentions'
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."poi_page_blocks_type_enum"
            ADD VALUE 'celebration_times'
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_23c4e717610c49881e8939c216" ON "active_modules" ("poi_id", "module_type")
        `);
        await queryRunner.query(`
            ALTER TABLE "donation_campaigns"
            ADD CONSTRAINT "FK_4586ae0a18b98e2188102f4bcfa" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD CONSTRAINT "FK_6ad4405f42816956aa8a89bc9fb" FOREIGN KEY ("campaign_id") REFERENCES "donation_campaigns"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "donations"
            ADD CONSTRAINT "FK_6d627a82b263d4ad02bd2255930" FOREIGN KEY ("donor_id") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "service_request_messages"
            ADD CONSTRAINT "FK_bed25fcd21d307b7215e771b094" FOREIGN KEY ("request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "service_request_messages"
            ADD CONSTRAINT "FK_dc9707b324ac8fb9678a14d2c16" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "service_request_documents"
            ADD CONSTRAINT "FK_d753eedb28e03c9d2f412ef488b" FOREIGN KEY ("request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "service_requests"
            ADD CONSTRAINT "FK_ccb32d93af51a069e0ad6ebe0a3" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "service_requests"
            ADD CONSTRAINT "FK_cd172d0e17e8aa32aa6ecff03c4" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "mass_intentions"
            ADD CONSTRAINT "FK_60c30b85707e68db4eece1f8fe0" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "mass_intentions"
            ADD CONSTRAINT "FK_bfba10ab7406e8c87db7037b75f" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "mass_intentions"
            ADD CONSTRAINT "FK_afd44f582fe6e373b33554eab95" FOREIGN KEY ("donation_id") REFERENCES "donations"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "mass_intentions" DROP CONSTRAINT "FK_afd44f582fe6e373b33554eab95"
        `);
        await queryRunner.query(`
            ALTER TABLE "mass_intentions" DROP CONSTRAINT "FK_bfba10ab7406e8c87db7037b75f"
        `);
        await queryRunner.query(`
            ALTER TABLE "mass_intentions" DROP CONSTRAINT "FK_60c30b85707e68db4eece1f8fe0"
        `);
        await queryRunner.query(`
            ALTER TABLE "service_requests" DROP CONSTRAINT "FK_cd172d0e17e8aa32aa6ecff03c4"
        `);
        await queryRunner.query(`
            ALTER TABLE "service_requests" DROP CONSTRAINT "FK_ccb32d93af51a069e0ad6ebe0a3"
        `);
        await queryRunner.query(`
            ALTER TABLE "service_request_documents" DROP CONSTRAINT "FK_d753eedb28e03c9d2f412ef488b"
        `);
        await queryRunner.query(`
            ALTER TABLE "service_request_messages" DROP CONSTRAINT "FK_dc9707b324ac8fb9678a14d2c16"
        `);
        await queryRunner.query(`
            ALTER TABLE "service_request_messages" DROP CONSTRAINT "FK_bed25fcd21d307b7215e771b094"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP CONSTRAINT "FK_6d627a82b263d4ad02bd2255930"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP CONSTRAINT "FK_6ad4405f42816956aa8a89bc9fb"
        `);
        await queryRunner.query(`
            ALTER TABLE "donation_campaigns" DROP CONSTRAINT "FK_4586ae0a18b98e2188102f4bcfa"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_23c4e717610c49881e8939c216"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."poi_page_blocks_type_enum_old" AS ENUM(
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
            ALTER TABLE "poi_page_blocks"
            ALTER COLUMN "type" TYPE "public"."poi_page_blocks_type_enum_old" USING "type"::"text"::"public"."poi_page_blocks_type_enum_old"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."poi_page_blocks_type_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."poi_page_blocks_type_enum_old"
            RENAME TO "poi_page_blocks_type_enum"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."active_modules_module_type_enum_old" AS ENUM(
                'donations',
                'events',
                'announcements',
                'prayer_requests',
                'livestreams',
                'community'
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
            ALTER TABLE "donations" DROP COLUMN "donor_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP COLUMN "campaign_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP COLUMN "donor_tax_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP COLUMN "donor_city"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP COLUMN "donor_postal_code"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP COLUMN "donor_address"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP COLUMN "wants_receipt"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP COLUMN "recurring_cancelled_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP CONSTRAINT "UQ_d53f389ded0d0dcec4d2ec0efa6"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP COLUMN "stripe_invoice_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP COLUMN "stripe_subscription_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP COLUMN "recurring_parent_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP COLUMN "recurring"
        `);
        await queryRunner.query(`
            ALTER TABLE "donations" DROP COLUMN "purpose"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."donations_purpose_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "events" DROP COLUMN "repeat_until"
        `);
        await queryRunner.query(`
            ALTER TABLE "events" DROP COLUMN "recurrence"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."events_recurrence_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "events" DROP COLUMN "category"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."events_category_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "events" DROP COLUMN "ends_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "pois" DROP COLUMN "receipt_signatory"
        `);
        await queryRunner.query(`
            ALTER TABLE "pois" DROP COLUMN "legal_address"
        `);
        await queryRunner.query(`
            ALTER TABLE "pois" DROP COLUMN "legal_tax_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "pois" DROP COLUMN "legal_name"
        `);
        await queryRunner.query(`
            ALTER TABLE "pois" DROP COLUMN "mass_intention_offering"
        `);
        await queryRunner.query(`
            DROP TABLE "mass_intentions"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."mass_intentions_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "service_requests"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."service_requests_status_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."service_requests_type_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "service_request_documents"
        `);
        await queryRunner.query(`
            DROP TABLE "service_request_messages"
        `);
        await queryRunner.query(`
            DROP TABLE "donation_campaigns"
        `);
    }

}

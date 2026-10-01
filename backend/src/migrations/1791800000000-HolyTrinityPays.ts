import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Seb, 1 Oct 2026: the Holy Trinity Chapel demo shows the Modules page a
 * paying community sees. It stops being "Offert" and keeps only the free
 * Événements switched on; its other modules can be tried from scratch.
 * Its content (news, requests…) stays and comes back with each module.
 */
export class HolyTrinityPays1791800000000 implements MigrationInterface {
    name = 'HolyTrinityPays1791800000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "active_modules"
            WHERE "module_type" <> 'events'
              AND "poi_id" IN (SELECT "id" FROM "pois" WHERE "qr_code_token" = 'DEMO-HOLYTRINITY')
        `);
        await queryRunner.query(`
            UPDATE "pois" SET "billing_comped" = false, "billing_renews_at" = NULL
            WHERE "qr_code_token" = 'DEMO-HOLYTRINITY'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "pois" SET "billing_comped" = true WHERE "qr_code_token" = 'DEMO-HOLYTRINITY'
        `);
    }
}

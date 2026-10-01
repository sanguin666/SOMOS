import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Seb, 1 Oct 2026: both older demos, St. Mary's and Holy Trinity, show
 * the Modules page a paying community sees: no longer "Offert", only the
 * free Événements switched on. Matched by QR token or by name, since a
 * database seeded long ago may hold other tokens. Carmen stays Offert.
 * Their content stays and comes back with each module.
 */
const DEMOS = `
    SELECT "id" FROM "pois"
    WHERE ("qr_code_token" IN ('DEMO-STMARYS', 'DEMO-HOLYTRINITY')
        OR "name" IN ('St. Mary''s Community', 'St. Mary''s Parish', 'Holy Trinity Chapel'))
      AND "qr_code_token" <> 'DEMO-CARMEN'
`;

export class DemoCommunitiesPay1791900000000 implements MigrationInterface {
    name = 'DemoCommunitiesPay1791900000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "active_modules"
            WHERE "module_type" <> 'events' AND "poi_id" IN (${DEMOS})
        `);
        await queryRunner.query(`
            UPDATE "pois" SET "billing_comped" = false, "billing_renews_at" = NULL
            WHERE "id" IN (${DEMOS})
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "pois" SET "billing_comped" = true WHERE "id" IN (${DEMOS})
        `);
    }
}

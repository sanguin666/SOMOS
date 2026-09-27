import { MigrationInterface, QueryRunner } from "typeorm";

export class GalicianPortugueseLanguages1791400000000 implements MigrationInterface {
    name = 'GalicianPortugueseLanguages1791400000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        for (const table of ['pois', 'users', 'push_tokens']) {
            await queryRunner.query(`ALTER TYPE "public"."${table}_language_enum" ADD VALUE IF NOT EXISTS 'gl'`);
            await queryRunner.query(`ALTER TYPE "public"."${table}_language_enum" ADD VALUE IF NOT EXISTS 'pt'`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Postgres cannot drop an enum value. Move Galician rows to Spanish and
        // Portuguese rows to English so the older code can still read them.
        for (const table of ['pois', 'users', 'push_tokens']) {
            await queryRunner.query(`UPDATE "${table}" SET "language" = 'es' WHERE "language" = 'gl'`);
            await queryRunner.query(`UPDATE "${table}" SET "language" = 'en' WHERE "language" = 'pt'`);
        }
    }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class ValencianLanguage1791300000000 implements MigrationInterface {
    name = 'ValencianLanguage1791300000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."pois_language_enum" ADD VALUE IF NOT EXISTS 'va'`);
        await queryRunner.query(`ALTER TYPE "public"."users_language_enum" ADD VALUE IF NOT EXISTS 'va'`);
        await queryRunner.query(`ALTER TYPE "public"."push_tokens_language_enum" ADD VALUE IF NOT EXISTS 'va'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Postgres cannot drop an enum value. Move Valencian rows to Spanish
        // so the older code, which does not know 'va', can still read them.
        await queryRunner.query(`UPDATE "pois" SET "language" = 'es' WHERE "language" = 'va'`);
        await queryRunner.query(`UPDATE "users" SET "language" = 'es' WHERE "language" = 'va'`);
        await queryRunner.query(`UPDATE "push_tokens" SET "language" = 'es' WHERE "language" = 'va'`);
    }
}

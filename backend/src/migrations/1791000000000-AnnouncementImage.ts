import { MigrationInterface, QueryRunner } from "typeorm";

export class AnnouncementImage1791000000000 implements MigrationInterface {
    name = 'AnnouncementImage1791000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "announcements"
            ADD "image_url" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "announcements"
            ADD "important" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "announcements" DROP COLUMN "important"
        `);
        await queryRunner.query(`
            ALTER TABLE "announcements" DROP COLUMN "image_url"
        `);
    }

}

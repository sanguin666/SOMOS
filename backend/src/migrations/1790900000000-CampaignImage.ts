import { MigrationInterface, QueryRunner } from "typeorm";

export class CampaignImage1790900000000 implements MigrationInterface {
    name = 'CampaignImage1790900000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "donation_campaigns"
            ADD "image_url" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "donation_campaigns" DROP COLUMN "image_url"
        `);
    }

}

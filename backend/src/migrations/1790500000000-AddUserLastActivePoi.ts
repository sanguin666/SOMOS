import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserLastActivePoi1790500000000 implements MigrationInterface {
    name = 'AddUserLastActivePoi1790500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "last_active_poi_id" uuid
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "last_active_poi_id"
        `);
    }
}

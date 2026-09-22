import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAvatar1790400000000 implements MigrationInterface {
    name = 'AddUserAvatar1790400000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "avatar_url" text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "avatar_url"
        `);
    }
}

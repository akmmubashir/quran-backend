import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeLanguageIdToInteger1705998500000 implements MigrationInterface {
  name = 'ChangeLanguageIdToInteger1705998500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Delete existing data as we're changing the data type
    await queryRunner.query(`DELETE FROM "ayah_info"`);
    await queryRunner.query(`DELETE FROM "ayah_tafsir"`);
    await queryRunner.query(`DELETE FROM "ayah_translation"`);

    // Change language_id column type from varchar to integer
    await queryRunner.query(
      `ALTER TABLE "ayah_info" ALTER COLUMN "language_id" TYPE integer USING 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "ayah_tafsir" ALTER COLUMN "language_id" TYPE integer USING 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "ayah_translation" ALTER COLUMN "language_id" TYPE integer USING 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete data before reverting type
    await queryRunner.query(`DELETE FROM "ayah_info"`);
    await queryRunner.query(`DELETE FROM "ayah_tafsir"`);
    await queryRunner.query(`DELETE FROM "ayah_translation"`);

    // Revert back to varchar
    await queryRunner.query(
      `ALTER TABLE "ayah_info" ALTER COLUMN "language_id" TYPE varchar(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "ayah_tafsir" ALTER COLUMN "language_id" TYPE varchar(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "ayah_translation" ALTER COLUMN "language_id" TYPE varchar(10)`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameLanguageCodeToLanguageId1705998400000 implements MigrationInterface {
  name = 'RenameLanguageCodeToLanguageId1705998400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing indexes
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_ayah_info_ayah_group_id_language_code"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_ayah_info_language_code"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_ayah_tafsir_ayah_group_id_language_code"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_ayah_tafsir_language_code"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_ayah_translation_ayah_group_id_language_code"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_ayah_translation_language_code"`);

    // Rename columns
    await queryRunner.query(
      `ALTER TABLE "ayah_info" RENAME COLUMN "language_code" TO "language_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ayah_tafsir" RENAME COLUMN "language_code" TO "language_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ayah_translation" RENAME COLUMN "language_code" TO "language_id"`,
    );

    // Recreate indexes with new column names
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ayah_info_ayah_group_id_language_id" ON "ayah_info" ("ayah_group_id", "language_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ayah_info_language_id" ON "ayah_info" ("language_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ayah_tafsir_ayah_group_id_language_id" ON "ayah_tafsir" ("ayah_group_id", "language_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ayah_tafsir_language_id" ON "ayah_tafsir" ("language_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ayah_translation_ayah_group_id_language_id" ON "ayah_translation" ("ayah_group_id", "language_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ayah_translation_language_id" ON "ayah_translation" ("language_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop new indexes
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_ayah_info_ayah_group_id_language_id"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_ayah_info_language_id"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_ayah_tafsir_ayah_group_id_language_id"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_ayah_tafsir_language_id"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_ayah_translation_ayah_group_id_language_id"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_ayah_translation_language_id"`);

    // Rename columns back
    await queryRunner.query(
      `ALTER TABLE "ayah_info" RENAME COLUMN "language_id" TO "language_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ayah_tafsir" RENAME COLUMN "language_id" TO "language_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ayah_translation" RENAME COLUMN "language_id" TO "language_code"`,
    );

    // Recreate old indexes
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ayah_info_ayah_group_id_language_code" ON "ayah_info" ("ayah_group_id", "language_code")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ayah_info_language_code" ON "ayah_info" ("language_code")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ayah_tafsir_ayah_group_id_language_code" ON "ayah_tafsir" ("ayah_group_id", "language_code")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ayah_tafsir_language_code" ON "ayah_tafsir" ("language_code")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ayah_translation_ayah_group_id_language_code" ON "ayah_translation" ("ayah_group_id", "language_code")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ayah_translation_language_code" ON "ayah_translation" ("language_code")`,
    );
  }
}

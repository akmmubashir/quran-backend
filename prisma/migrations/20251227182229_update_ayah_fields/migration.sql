/*
  Warnings:

  - You are about to drop the column `ayah_number` on the `Ayah` table. All the data in the column will be lost.
  - You are about to drop the column `hizb_number` on the `Ayah` table. All the data in the column will be lost.
  - You are about to drop the column `juz_number` on the `Ayah` table. All the data in the column will be lost.
  - You are about to drop the column `page_number` on the `Ayah` table. All the data in the column will be lost.
  - You are about to drop the column `rub_el_hizb_number` on the `Ayah` table. All the data in the column will be lost.
  - You are about to drop the column `sajdah` on the `Ayah` table. All the data in the column will be lost.
  - You are about to drop the column `sajdah_type` on the `Ayah` table. All the data in the column will be lost.
  - You are about to drop the column `text_ar` on the `Ayah` table. All the data in the column will be lost.
  - You are about to drop the column `text_indopak` on the `Ayah` table. All the data in the column will be lost.
  - You are about to drop the column `text_uthmani_simple` on the `Ayah` table. All the data in the column will be lost.
  - You are about to drop the column `text_uthmani_tajweed` on the `Ayah` table. All the data in the column will be lost.
  - You are about to drop the column `verse_key` on the `Ayah` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Ayah_juz_number_idx";

-- DropIndex
DROP INDEX "Ayah_page_number_idx";

-- DropIndex
DROP INDEX "Ayah_surahId_ayah_number_key";

-- DropIndex
DROP INDEX "Ayah_verse_key_idx";

-- AlterTable
ALTER TABLE "Ayah" 
ADD COLUMN     "ayahInfo" TEXT,
ADD COLUMN     "ayahKey" TEXT,
ADD COLUMN     "ayahNumber" INTEGER,
ADD COLUMN     "hizbNumber" INTEGER,
ADD COLUMN     "juzNumber" INTEGER,
ADD COLUMN     "pageNumber" INTEGER,
ADD COLUMN     "rubElHizbNumber" INTEGER,
ADD COLUMN     "textImlaei_new" TEXT,
ADD COLUMN     "textUthmani_new" TEXT;

-- Migrate existing data
UPDATE "Ayah" 
SET 
  "ayahNumber" = "ayah_number",
  "ayahKey" = "verse_key",
  "pageNumber" = "page_number",
  "juzNumber" = "juz_number",
  "hizbNumber" = "hizb_number",
  "rubElHizbNumber" = "rub_el_hizb_number",
  "textImlaei_new" = "text_imlaei",
  "textUthmani_new" = "text_uthmani";

-- Make columns NOT NULL
ALTER TABLE "Ayah" 
ALTER COLUMN "ayahNumber" SET NOT NULL,
ALTER COLUMN "ayahKey" SET NOT NULL;

-- Drop old columns
ALTER TABLE "Ayah" DROP COLUMN "ayah_number",
DROP COLUMN "hizb_number",
DROP COLUMN "juz_number",
DROP COLUMN "page_number",
DROP COLUMN "rub_el_hizb_number",
DROP COLUMN "sajdah",
DROP COLUMN "sajdah_type",
DROP COLUMN "text_ar",
DROP COLUMN "text_imlaei",
DROP COLUMN "text_indopak",
DROP COLUMN "text_uthmani",
DROP COLUMN "text_uthmani_simple",
DROP COLUMN "text_uthmani_tajweed",
DROP COLUMN "verse_key";

-- Rename temporary columns
ALTER TABLE "Ayah" RENAME COLUMN "textImlaei_new" TO "textImlaei";
ALTER TABLE "Ayah" RENAME COLUMN "textUthmani_new" TO "textUthmani";

-- CreateIndex
CREATE INDEX "Ayah_ayahKey_idx" ON "Ayah"("ayahKey");

-- CreateIndex
CREATE INDEX "Ayah_juzNumber_idx" ON "Ayah"("juzNumber");

-- CreateIndex
CREATE INDEX "Ayah_pageNumber_idx" ON "Ayah"("pageNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Ayah_surahId_ayahNumber_key" ON "Ayah"("surahId", "ayahNumber");


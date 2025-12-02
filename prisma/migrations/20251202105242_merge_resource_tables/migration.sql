/*
  Warnings:

  - You are about to drop the column `resourceId` on the `Tafsir` table. All the data in the column will be lost.
  - You are about to drop the column `scholar` on the `Tafsir` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Tafsir` table. All the data in the column will be lost.
  - You are about to drop the column `resourceId` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the column `translator` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the `TafsirResource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TranslationResource` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `language_name` to the `Tafsir` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Tafsir` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Tafsir` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_name` to the `Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Translation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tafsir" DROP CONSTRAINT "Tafsir_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_resourceId_fkey";

-- DropIndex
DROP INDEX "Tafsir_resourceId_idx";

-- DropIndex
DROP INDEX "Translation_resourceId_idx";

-- AlterTable: Add new columns with defaults, copy data from old columns
ALTER TABLE "Tafsir" 
ADD COLUMN     "author_name" TEXT,
ADD COLUMN     "info" TEXT,
ADD COLUMN     "language_name" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Unknown Tafsir',
ADD COLUMN     "slug" TEXT NOT NULL DEFAULT 'unknown';

-- Update Tafsir: Copy scholar to author_name, set language_name from language_code
UPDATE "Tafsir" SET "author_name" = "scholar" WHERE "scholar" IS NOT NULL;
UPDATE "Tafsir" SET "language_name" = CASE 
  WHEN "language_code" = 'en' THEN 'English'
  WHEN "language_code" = 'ar' THEN 'Arabic'
  WHEN "language_code" = 'ur' THEN 'Urdu'
  WHEN "language_code" = 'id' THEN 'Indonesian'
  ELSE "language_code"
END;
UPDATE "Tafsir" SET "name" = COALESCE("scholar", 'Tafsir ' || "language_code");
UPDATE "Tafsir" SET "slug" = 'tafsir-' || "id";
UPDATE "Tafsir" SET "info" = "source" WHERE "source" IS NOT NULL;

-- Drop old Tafsir columns
ALTER TABLE "Tafsir" 
DROP COLUMN "resourceId",
DROP COLUMN "scholar",
DROP COLUMN "source";

-- AlterTable: Add new columns with defaults, copy data from old columns
ALTER TABLE "Translation" 
ADD COLUMN     "author_name" TEXT,
ADD COLUMN     "direction" TEXT NOT NULL DEFAULT 'ltr',
ADD COLUMN     "info" TEXT,
ADD COLUMN     "language_name" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Unknown Translation',
ADD COLUMN     "slug" TEXT NOT NULL DEFAULT 'unknown';

-- Update Translation: Copy translator to author_name, set language_name from language_code
UPDATE "Translation" SET "author_name" = "translator" WHERE "translator" IS NOT NULL;
UPDATE "Translation" SET "language_name" = CASE 
  WHEN "language_code" = 'en' THEN 'English'
  WHEN "language_code" = 'ar' THEN 'Arabic'
  WHEN "language_code" = 'ur' THEN 'Urdu'
  WHEN "language_code" = 'id' THEN 'Indonesian'
  ELSE "language_code"
END;
UPDATE "Translation" SET "name" = COALESCE("translator", 'Translation ' || "language_code");
UPDATE "Translation" SET "slug" = 'translation-' || "id";

-- Drop old Translation columns
ALTER TABLE "Translation" 
DROP COLUMN "resourceId",
DROP COLUMN "translator";

-- DropTable
DROP TABLE "TafsirResource";

-- DropTable
DROP TABLE "TranslationResource";

-- CreateIndex
CREATE INDEX "Tafsir_slug_idx" ON "Tafsir"("slug");

-- CreateIndex
CREATE INDEX "Tafsir_ayahId_idx" ON "Tafsir"("ayahId");

-- CreateIndex
CREATE INDEX "Translation_slug_idx" ON "Translation"("slug");

-- CreateIndex
CREATE INDEX "Translation_ayahId_idx" ON "Translation"("ayahId");

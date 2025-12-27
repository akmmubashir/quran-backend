/*
  Warnings:

  - You are about to drop the column `bismillah_pre` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `name_ar` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `name_complex` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `name_en` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `name_simple` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `revelation` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `revelation_order` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `surah_info` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `total_ayahs` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `transliterated_name` on the `Surah` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[surahId]` on the table `Surah` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ayahCount` to the `Surah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameArabic` to the `Surah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surahId` to the `Surah` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Surah_number_key";

-- AlterTable
ALTER TABLE "Surah" 
ADD COLUMN     "ayahCount" INTEGER,
ADD COLUMN     "bismillahPre" BOOLEAN DEFAULT true,
ADD COLUMN     "nameArabic" TEXT,
ADD COLUMN     "nameComplex" TEXT,
ADD COLUMN     "nameEnglish" TEXT,
ADD COLUMN     "revelationOrder" INTEGER,
ADD COLUMN     "revelationPlace" TEXT,
ADD COLUMN     "surahId" INTEGER,
ADD COLUMN     "surahinfo" TEXT;

-- Migrate existing data
UPDATE "Surah"
SET 
  "surahId" = "number",
  "nameArabic" = "name_ar",
  "nameEnglish" = "name_en",
  "nameComplex" = COALESCE("name_complex", "name_simple"),
  "revelationPlace" = "revelation",
  "revelationOrder" = "revelation_order",
  "ayahCount" = "total_ayahs",
  "bismillahPre" = "bismillah_pre",
  "surahinfo" = "surah_info";

-- Make new columns NOT NULL where required
ALTER TABLE "Surah"
ALTER COLUMN "surahId" SET NOT NULL,
ALTER COLUMN "nameArabic" SET NOT NULL,
ALTER COLUMN "ayahCount" SET NOT NULL,
ALTER COLUMN "bismillahPre" SET NOT NULL;

-- Drop old columns
ALTER TABLE "Surah" 
DROP COLUMN "bismillah_pre",
DROP COLUMN "createdAt",
DROP COLUMN "name_ar",
DROP COLUMN "name_complex",
DROP COLUMN "name_en",
DROP COLUMN "name_simple",
DROP COLUMN "number",
DROP COLUMN "revelation",
DROP COLUMN "revelation_order",
DROP COLUMN "surah_info",
DROP COLUMN "total_ayahs",
DROP COLUMN "transliterated_name";

-- CreateIndex
CREATE UNIQUE INDEX "Surah_surahId_key" ON "Surah"("surahId");

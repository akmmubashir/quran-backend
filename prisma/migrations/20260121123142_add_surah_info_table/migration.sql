/*
  Warnings:

  - You are about to drop the column `ayah_number` on the `Ayah` table. All the data in the column will be lost.
  - You are about to drop the column `text_ar` on the `Ayah` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `name_ar` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `name_en` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `revelation` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `total_ayahs` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `language_code` on the `Tafsir` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Tafsir` table. All the data in the column will be lost.
  - You are about to drop the column `language_code` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Translation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[surahId,ayahNumber]` on the table `Ayah` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[surahId]` on the table `Surah` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ayahKey` to the `Ayah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ayahNumber` to the `Ayah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ayahCount` to the `Surah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameArabic` to the `Surah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surahId` to the `Surah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ayahText` to the `Tafsir` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languageCode` to the `Tafsir` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ayahText` to the `Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languageCode` to the `Translation` table without a default value. This is not possible if the table is not empty.
  - Made the column `translator` on table `Translation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Tafsir" DROP CONSTRAINT "Tafsir_ayahId_fkey";

-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_ayahId_fkey";

-- DropIndex
DROP INDEX "Ayah_surahId_ayah_number_key";

-- DropIndex
DROP INDEX "Surah_number_key";

-- DropIndex
DROP INDEX "Tafsir_language_code_idx";

-- DropIndex
DROP INDEX "Translation_language_code_idx";

-- AlterTable
ALTER TABLE "Ayah" DROP COLUMN "ayah_number",
DROP COLUMN "text_ar",
ADD COLUMN     "ayahInfo" TEXT,
ADD COLUMN     "ayahKey" TEXT NOT NULL,
ADD COLUMN     "ayahNumber" INTEGER NOT NULL,
ADD COLUMN     "hizbNumber" INTEGER,
ADD COLUMN     "juzNumber" INTEGER,
ADD COLUMN     "pageNumber" INTEGER,
ADD COLUMN     "rubElHizbNumber" INTEGER,
ADD COLUMN     "textImlaei" TEXT,
ADD COLUMN     "textUthmani" TEXT;

-- AlterTable
ALTER TABLE "Surah" DROP COLUMN "createdAt",
DROP COLUMN "name_ar",
DROP COLUMN "name_en",
DROP COLUMN "number",
DROP COLUMN "revelation",
DROP COLUMN "total_ayahs",
ADD COLUMN     "ayahCount" INTEGER NOT NULL,
ADD COLUMN     "bismillahPre" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "nameArabic" TEXT NOT NULL,
ADD COLUMN     "nameComplex" TEXT,
ADD COLUMN     "nameEnglish" TEXT,
ADD COLUMN     "pages" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "revelationOrder" INTEGER,
ADD COLUMN     "revelationPlace" TEXT,
ADD COLUMN     "surahId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tafsir" DROP COLUMN "language_code",
DROP COLUMN "text",
ADD COLUMN     "ayahGroupEnd" INTEGER,
ADD COLUMN     "ayahGroupStart" INTEGER,
ADD COLUMN     "ayahText" TEXT NOT NULL,
ADD COLUMN     "languageCode" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'published',
ADD COLUMN     "surahId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "ayahId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Translation" DROP COLUMN "language_code",
DROP COLUMN "text",
ADD COLUMN     "ayahGroupEnd" INTEGER,
ADD COLUMN     "ayahGroupStart" INTEGER,
ADD COLUMN     "ayahText" TEXT NOT NULL,
ADD COLUMN     "languageCode" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'published',
ADD COLUMN     "surahId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "ayahId" DROP NOT NULL,
ALTER COLUMN "translator" SET NOT NULL;

-- CreateTable
CREATE TABLE "Juz" (
    "id" SERIAL NOT NULL,
    "AyahsCount" INTEGER NOT NULL,
    "ayahMapping" JSONB,
    "firstAyahId" INTEGER,
    "juzNumber" INTEGER NOT NULL,
    "lastAyahId" INTEGER,

    CONSTRAINT "Juz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'ltr',
    "iso" TEXT NOT NULL,
    "nativeName" TEXT,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurahInfo" (
    "id" SERIAL NOT NULL,
    "surahId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "surahinfo" TEXT,
    "revelationPlace" TEXT,
    "nameComplex" TEXT,
    "nameEnglish" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SurahInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Juz_juzNumber_key" ON "Juz"("juzNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Language_iso_key" ON "Language"("iso");

-- CreateIndex
CREATE INDEX "SurahInfo_surahId_idx" ON "SurahInfo"("surahId");

-- CreateIndex
CREATE INDEX "SurahInfo_languageId_idx" ON "SurahInfo"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "SurahInfo_surahId_languageId_key" ON "SurahInfo"("surahId", "languageId");

-- CreateIndex
CREATE INDEX "Ayah_ayahKey_idx" ON "Ayah"("ayahKey");

-- CreateIndex
CREATE INDEX "Ayah_juzNumber_idx" ON "Ayah"("juzNumber");

-- CreateIndex
CREATE INDEX "Ayah_pageNumber_idx" ON "Ayah"("pageNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Ayah_surahId_ayahNumber_key" ON "Ayah"("surahId", "ayahNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Surah_surahId_key" ON "Surah"("surahId");

-- CreateIndex
CREATE INDEX "Tafsir_languageCode_idx" ON "Tafsir"("languageCode");

-- CreateIndex
CREATE INDEX "Tafsir_ayahId_idx" ON "Tafsir"("ayahId");

-- CreateIndex
CREATE INDEX "Tafsir_surahId_idx" ON "Tafsir"("surahId");

-- CreateIndex
CREATE INDEX "Tafsir_status_idx" ON "Tafsir"("status");

-- CreateIndex
CREATE INDEX "Translation_ayahId_idx" ON "Translation"("ayahId");

-- CreateIndex
CREATE INDEX "Translation_languageCode_idx" ON "Translation"("languageCode");

-- CreateIndex
CREATE INDEX "Translation_surahId_idx" ON "Translation"("surahId");

-- CreateIndex
CREATE INDEX "Translation_status_idx" ON "Translation"("status");

-- AddForeignKey
ALTER TABLE "Tafsir" ADD CONSTRAINT "Tafsir_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "Ayah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tafsir" ADD CONSTRAINT "Tafsir_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "Surah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "Ayah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "Surah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurahInfo" ADD CONSTRAINT "SurahInfo_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "Surah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurahInfo" ADD CONSTRAINT "SurahInfo_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

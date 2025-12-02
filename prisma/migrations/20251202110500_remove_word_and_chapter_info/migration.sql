/*
  Warnings:

  - You are about to drop the `ChapterInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Word` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChapterInfo" DROP CONSTRAINT "ChapterInfo_surahId_fkey";

-- DropForeignKey
ALTER TABLE "Word" DROP CONSTRAINT "Word_ayahId_fkey";

-- AlterTable
ALTER TABLE "Surah" ADD COLUMN     "surah_info" TEXT;

-- AlterTable
ALTER TABLE "Tafsir" ALTER COLUMN "language_name" DROP DEFAULT,
ALTER COLUMN "name" DROP DEFAULT,
ALTER COLUMN "slug" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Translation" ALTER COLUMN "language_name" DROP DEFAULT,
ALTER COLUMN "name" DROP DEFAULT,
ALTER COLUMN "slug" DROP DEFAULT;

-- DropTable
DROP TABLE "ChapterInfo";

-- DropTable
DROP TABLE "Word";

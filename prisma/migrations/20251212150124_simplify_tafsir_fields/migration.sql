/*
  Warnings:

  - You are about to drop the column `author_name` on the `Tafsir` table. All the data in the column will be lost.
  - You are about to drop the column `info` on the `Tafsir` table. All the data in the column will be lost.
  - You are about to drop the column `language_name` on the `Tafsir` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tafsir` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Tafsir` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Tafsir_slug_idx";

-- AlterTable
ALTER TABLE "Tafsir" DROP COLUMN "author_name",
DROP COLUMN "info",
DROP COLUMN "language_name",
DROP COLUMN "name",
DROP COLUMN "slug",
ADD COLUMN     "scholar" TEXT,
ADD COLUMN     "source" TEXT;

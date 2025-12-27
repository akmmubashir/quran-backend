/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Juz` table. All the data in the column will be lost.
  - You are about to drop the column `first_verse_key` on the `Juz` table. All the data in the column will be lost.
  - You are about to drop the column `juz_number` on the `Juz` table. All the data in the column will be lost.
  - You are about to drop the column `last_verse_key` on the `Juz` table. All the data in the column will be lost.
  - You are about to drop the column `name_ar` on the `Juz` table. All the data in the column will be lost.
  - You are about to drop the column `name_en` on the `Juz` table. All the data in the column will be lost.
  - You are about to drop the column `verses_count` on the `Juz` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[juzNumber]` on the table `Juz` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `AyahsCount` to the `Juz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `juzNumber` to the `Juz` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Juz_juz_number_key";

-- AlterTable
ALTER TABLE "Juz" 
ADD COLUMN     "AyahsCount" INTEGER,
ADD COLUMN     "ayahMapping" JSONB,
ADD COLUMN     "firstAyahId" INTEGER,
ADD COLUMN     "juzNumber" INTEGER,
ADD COLUMN     "lastAyahId" INTEGER;

-- Migrate existing data
UPDATE "Juz"
SET 
  "juzNumber" = "juz_number",
  "AyahsCount" = "verses_count";

-- Make required columns NOT NULL
ALTER TABLE "Juz"
ALTER COLUMN "juzNumber" SET NOT NULL,
ALTER COLUMN "AyahsCount" SET NOT NULL;

-- Drop old columns
ALTER TABLE "Juz" 
DROP COLUMN "createdAt",
DROP COLUMN "first_verse_key",
DROP COLUMN "juz_number",
DROP COLUMN "last_verse_key",
DROP COLUMN "name_ar",
DROP COLUMN "name_en",
DROP COLUMN "verses_count";

-- CreateIndex
CREATE UNIQUE INDEX "Juz_juzNumber_key" ON "Juz"("juzNumber");

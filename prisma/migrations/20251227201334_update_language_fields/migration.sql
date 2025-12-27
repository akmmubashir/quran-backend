/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Language` table. All the data in the column will be lost.
  - You are about to drop the column `iso_code` on the `Language` table. All the data in the column will be lost.
  - You are about to drop the column `native_name` on the `Language` table. All the data in the column will be lost.
  - You are about to drop the column `translations_count` on the `Language` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[iso]` on the table `Language` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `iso` to the `Language` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Language_iso_code_key";

-- AlterTable
ALTER TABLE "Language" 
ADD COLUMN     "iso" TEXT,
ADD COLUMN     "nativeName" TEXT;

-- Migrate existing data
UPDATE "Language"
SET 
  "iso" = "iso_code",
  "nativeName" = "native_name";

-- Make new column NOT NULL where required
ALTER TABLE "Language"
ALTER COLUMN "iso" SET NOT NULL;

-- Drop old columns
ALTER TABLE "Language" 
DROP COLUMN "createdAt",
DROP COLUMN "iso_code",
DROP COLUMN "native_name",
DROP COLUMN "translations_count";

-- CreateIndex
CREATE UNIQUE INDEX "Language_iso_key" ON "Language"("iso");

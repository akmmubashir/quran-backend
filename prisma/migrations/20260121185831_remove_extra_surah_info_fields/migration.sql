/*
  Warnings:

  - You are about to drop the column `nameComplex` on the `SurahInfo` table. All the data in the column will be lost.
  - You are about to drop the column `nameEnglish` on the `SurahInfo` table. All the data in the column will be lost.
  - You are about to drop the column `revelationPlace` on the `SurahInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SurahInfo" DROP COLUMN "nameComplex",
DROP COLUMN "nameEnglish",
DROP COLUMN "revelationPlace";

/*
  Warnings:

  - You are about to drop the column `author_name` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the column `direction` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the column `info` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the column `language_name` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Translation` table. All the data in the column will be lost.
  - Added the required column `translator` to the `Translation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Translation_slug_idx";

-- AlterTable
ALTER TABLE "Translation" DROP COLUMN "author_name",
DROP COLUMN "direction",
DROP COLUMN "info",
DROP COLUMN "language_name",
DROP COLUMN "name",
DROP COLUMN "slug",
ADD COLUMN     "translator" TEXT NOT NULL;

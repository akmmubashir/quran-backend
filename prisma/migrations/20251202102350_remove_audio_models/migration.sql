/*
  Warnings:

  - You are about to drop the column `audio_url` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the `AudioFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChapterAudio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reciter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AudioFile" DROP CONSTRAINT "AudioFile_ayahId_fkey";

-- DropForeignKey
ALTER TABLE "AudioFile" DROP CONSTRAINT "AudioFile_reciterId_fkey";

-- DropForeignKey
ALTER TABLE "ChapterAudio" DROP CONSTRAINT "ChapterAudio_reciterId_fkey";

-- AlterTable
ALTER TABLE "Word" DROP COLUMN "audio_url";

-- DropTable
DROP TABLE "AudioFile";

-- DropTable
DROP TABLE "ChapterAudio";

-- DropTable
DROP TABLE "Reciter";

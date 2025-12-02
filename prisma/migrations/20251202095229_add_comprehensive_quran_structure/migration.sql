/*
  Warnings:

  - Added the required column `verse_key` to the `Ayah` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tafsir" DROP CONSTRAINT "Tafsir_ayahId_fkey";

-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_ayahId_fkey";

-- AlterTable
ALTER TABLE "Ayah" ADD COLUMN     "hizb_number" INTEGER,
ADD COLUMN     "juz_number" INTEGER,
ADD COLUMN     "page_number" INTEGER,
ADD COLUMN     "rub_el_hizb_number" INTEGER,
ADD COLUMN     "sajdah" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sajdah_type" TEXT,
ADD COLUMN     "text_imlaei" TEXT,
ADD COLUMN     "text_indopak" TEXT,
ADD COLUMN     "text_uthmani" TEXT,
ADD COLUMN     "text_uthmani_simple" TEXT,
ADD COLUMN     "text_uthmani_tajweed" TEXT,
ADD COLUMN     "verse_key" TEXT;

-- Populate verse_key for existing data
UPDATE "Ayah" 
SET "verse_key" = (
  SELECT CONCAT("Surah"."number", ':', "Ayah"."ayah_number")
  FROM "Surah"
  WHERE "Surah"."id" = "Ayah"."surahId"
);

-- Make verse_key required after populating data
ALTER TABLE "Ayah" ALTER COLUMN "verse_key" SET NOT NULL;

-- AlterTable
ALTER TABLE "Surah" ADD COLUMN     "bismillah_pre" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name_complex" TEXT,
ADD COLUMN     "name_simple" TEXT,
ADD COLUMN     "pages" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "revelation_order" INTEGER,
ADD COLUMN     "transliterated_name" TEXT;

-- AlterTable
ALTER TABLE "Tafsir" ADD COLUMN     "resourceId" INTEGER,
ALTER COLUMN "ayahId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Translation" ADD COLUMN     "resourceId" INTEGER,
ALTER COLUMN "ayahId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "text_uthmani" TEXT NOT NULL,
    "text_imlaei" TEXT,
    "text_indopak" TEXT,
    "transliteration" TEXT,
    "translation" TEXT,
    "audio_url" TEXT,
    "char_type" TEXT,
    "page_number" INTEGER,
    "line_number" INTEGER,
    "code_v1" TEXT,
    "code_v2" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranslationResource" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "author_name" TEXT,
    "slug" TEXT NOT NULL,
    "language_name" TEXT NOT NULL,
    "language_code" TEXT NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'ltr',
    "info" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranslationResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TafsirResource" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "author_name" TEXT,
    "slug" TEXT NOT NULL,
    "language_name" TEXT NOT NULL,
    "language_code" TEXT NOT NULL,
    "info" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TafsirResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reciter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT,
    "style" TEXT,
    "qirat" TEXT,
    "relative_path" TEXT,
    "file_formats" TEXT[] DEFAULT ARRAY['mp3']::TEXT[],
    "info" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reciter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioFile" (
    "id" SERIAL NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "reciterId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'mp3',
    "segments" JSONB,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterAudio" (
    "id" SERIAL NOT NULL,
    "surah" INTEGER NOT NULL,
    "reciterId" INTEGER NOT NULL,
    "audio_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "format" TEXT NOT NULL DEFAULT 'mp3',
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChapterAudio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterInfo" (
    "id" SERIAL NOT NULL,
    "surahId" INTEGER NOT NULL,
    "language_code" TEXT NOT NULL,
    "short_text" TEXT,
    "text" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChapterInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Juz" (
    "id" SERIAL NOT NULL,
    "juz_number" INTEGER NOT NULL,
    "name_ar" TEXT,
    "name_en" TEXT,
    "first_verse_key" TEXT NOT NULL,
    "last_verse_key" TEXT NOT NULL,
    "verses_count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Juz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "native_name" TEXT,
    "iso_code" TEXT NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'ltr',
    "translations_count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Word_ayahId_idx" ON "Word"("ayahId");

-- CreateIndex
CREATE UNIQUE INDEX "TranslationResource_slug_key" ON "TranslationResource"("slug");

-- CreateIndex
CREATE INDEX "TranslationResource_language_code_idx" ON "TranslationResource"("language_code");

-- CreateIndex
CREATE UNIQUE INDEX "TafsirResource_slug_key" ON "TafsirResource"("slug");

-- CreateIndex
CREATE INDEX "TafsirResource_language_code_idx" ON "TafsirResource"("language_code");

-- CreateIndex
CREATE INDEX "AudioFile_ayahId_idx" ON "AudioFile"("ayahId");

-- CreateIndex
CREATE INDEX "AudioFile_reciterId_idx" ON "AudioFile"("reciterId");

-- CreateIndex
CREATE INDEX "ChapterAudio_reciterId_idx" ON "ChapterAudio"("reciterId");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterAudio_surah_reciterId_key" ON "ChapterAudio"("surah", "reciterId");

-- CreateIndex
CREATE INDEX "ChapterInfo_surahId_idx" ON "ChapterInfo"("surahId");

-- CreateIndex
CREATE INDEX "ChapterInfo_language_code_idx" ON "ChapterInfo"("language_code");

-- CreateIndex
CREATE UNIQUE INDEX "Juz_juz_number_key" ON "Juz"("juz_number");

-- CreateIndex
CREATE UNIQUE INDEX "Language_iso_code_key" ON "Language"("iso_code");

-- CreateIndex
CREATE INDEX "Ayah_verse_key_idx" ON "Ayah"("verse_key");

-- CreateIndex
CREATE INDEX "Ayah_juz_number_idx" ON "Ayah"("juz_number");

-- CreateIndex
CREATE INDEX "Ayah_page_number_idx" ON "Ayah"("page_number");

-- CreateIndex
CREATE INDEX "Tafsir_resourceId_idx" ON "Tafsir"("resourceId");

-- CreateIndex
CREATE INDEX "Translation_resourceId_idx" ON "Translation"("resourceId");

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "Ayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "Ayah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "TranslationResource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tafsir" ADD CONSTRAINT "Tafsir_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "Ayah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tafsir" ADD CONSTRAINT "Tafsir_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "TafsirResource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioFile" ADD CONSTRAINT "AudioFile_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "Ayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioFile" ADD CONSTRAINT "AudioFile_reciterId_fkey" FOREIGN KEY ("reciterId") REFERENCES "Reciter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterAudio" ADD CONSTRAINT "ChapterAudio_reciterId_fkey" FOREIGN KEY ("reciterId") REFERENCES "Reciter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterInfo" ADD CONSTRAINT "ChapterInfo_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "Surah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

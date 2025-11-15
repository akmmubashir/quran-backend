-- CreateTable
CREATE TABLE "Surah" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT,
    "revelation" TEXT,
    "total_ayahs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Surah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ayah" (
    "id" SERIAL NOT NULL,
    "surahId" INTEGER NOT NULL,
    "ayah_number" INTEGER NOT NULL,
    "text_ar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" SERIAL NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "language_code" TEXT NOT NULL,
    "translator" TEXT,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tafsir" (
    "id" SERIAL NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "language_code" TEXT NOT NULL,
    "scholar" TEXT,
    "source" TEXT,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tafsir_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Surah_number_key" ON "Surah"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Ayah_surahId_ayah_number_key" ON "Ayah"("surahId", "ayah_number");

-- CreateIndex
CREATE INDEX "Translation_language_code_idx" ON "Translation"("language_code");

-- CreateIndex
CREATE INDEX "Tafsir_language_code_idx" ON "Tafsir"("language_code");

-- AddForeignKey
ALTER TABLE "Ayah" ADD CONSTRAINT "Ayah_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "Surah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "Ayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tafsir" ADD CONSTRAINT "Tafsir_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "Ayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

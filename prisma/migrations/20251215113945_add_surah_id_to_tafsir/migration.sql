-- AlterTable
ALTER TABLE "Tafsir" ADD COLUMN     "surahId" INTEGER;

-- CreateIndex
CREATE INDEX "Tafsir_surahId_idx" ON "Tafsir"("surahId");

-- AddForeignKey
ALTER TABLE "Tafsir" ADD CONSTRAINT "Tafsir_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "Surah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

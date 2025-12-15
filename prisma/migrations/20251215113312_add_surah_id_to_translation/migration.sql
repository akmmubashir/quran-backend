-- AlterTable
ALTER TABLE "Translation" ADD COLUMN     "surahId" INTEGER;

-- CreateIndex
CREATE INDEX "Translation_surahId_idx" ON "Translation"("surahId");

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "Surah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

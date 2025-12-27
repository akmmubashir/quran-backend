-- AlterTable: Update Tafsir fields
-- Step 1: Add new columns as nullable
ALTER TABLE "Tafsir" ADD COLUMN "languageCode" TEXT;
ALTER TABLE "Tafsir" ADD COLUMN "ayahText" TEXT;
ALTER TABLE "Tafsir" ADD COLUMN "ayahGroupStart" INTEGER;
ALTER TABLE "Tafsir" ADD COLUMN "ayahGroupEnd" INTEGER;

-- Step 2: Backfill data from old columns to new columns
UPDATE "Tafsir" SET "languageCode" = "language_code";
UPDATE "Tafsir" SET "ayahText" = "text";

-- Step 3: Set new columns as NOT NULL (since we backfilled the data)
ALTER TABLE "Tafsir" ALTER COLUMN "languageCode" SET NOT NULL;
ALTER TABLE "Tafsir" ALTER COLUMN "ayahText" SET NOT NULL;

-- Step 4: Drop old columns
ALTER TABLE "Tafsir" DROP COLUMN "language_code";
ALTER TABLE "Tafsir" DROP COLUMN "text";
ALTER TABLE "Tafsir" DROP COLUMN "createdAt";

-- Step 5: Recreate indexes with new column names
DROP INDEX IF EXISTS "Tafsir_language_code_idx";
CREATE INDEX "Tafsir_languageCode_idx" ON "Tafsir"("languageCode");

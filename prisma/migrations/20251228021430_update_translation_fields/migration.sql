-- AlterTable: Update Translation fields
-- Step 1: Add new columns as nullable
ALTER TABLE "Translation" ADD COLUMN "languageCode" TEXT;
ALTER TABLE "Translation" ADD COLUMN "ayahText" TEXT;
ALTER TABLE "Translation" ADD COLUMN "ayahGroupStart" INTEGER;
ALTER TABLE "Translation" ADD COLUMN "ayahGroupEnd" INTEGER;

-- Step 2: Backfill data from old columns to new columns
UPDATE "Translation" SET "languageCode" = "language_code";
UPDATE "Translation" SET "ayahText" = "text";

-- Step 3: Set new columns as NOT NULL (since we backfilled the data)
ALTER TABLE "Translation" ALTER COLUMN "languageCode" SET NOT NULL;
ALTER TABLE "Translation" ALTER COLUMN "ayahText" SET NOT NULL;

-- Step 4: Drop old columns
ALTER TABLE "Translation" DROP COLUMN "language_code";
ALTER TABLE "Translation" DROP COLUMN "text";
ALTER TABLE "Translation" DROP COLUMN "createdAt";

-- Step 5: Recreate indexes with new column names
DROP INDEX IF EXISTS "Translation_language_code_idx";
CREATE INDEX "Translation_languageCode_idx" ON "Translation"("languageCode");

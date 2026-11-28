-- Allow multiple copies/editions with the same ISBN and add optional reading age group classification.
DROP INDEX IF EXISTS "Book_isbn_key";
ALTER TABLE "Book" ADD COLUMN IF NOT EXISTS "ageGroup" TEXT;
CREATE INDEX IF NOT EXISTS "Book_isbn_idx" ON "Book"("isbn");
CREATE INDEX IF NOT EXISTS "Book_ageGroup_idx" ON "Book"("ageGroup");

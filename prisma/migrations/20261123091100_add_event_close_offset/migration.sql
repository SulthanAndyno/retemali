-- Per-event registration cutoff: how many days before the event start
-- registration closes automatically (H-1, H-2 or H-3). Existing rows keep the
-- historical H-3 behaviour by defaulting to 3 days; new events default to H-1.

-- AlterTable
ALTER TABLE "CommunityEvent" ADD COLUMN "registrationCloseOffsetDays" INTEGER NOT NULL DEFAULT 1;

-- Backfill: events created before this column existed were auto-closed at H-3.
UPDATE "CommunityEvent" SET "registrationCloseOffsetDays" = 3 WHERE "registrationCloseOffsetDays" = 1;

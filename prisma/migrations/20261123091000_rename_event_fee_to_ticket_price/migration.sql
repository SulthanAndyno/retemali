-- Rename the event fee concept: a paid event now charges a fixed entrance
-- ticket price instead of asking for a voluntary infaq.
-- Both statements are in-place renames: existing rows and values are preserved.

-- RenameEnumValue
ALTER TYPE "EventFeeType" RENAME VALUE 'INFAQ' TO 'PAID';

-- RenameColumn
ALTER TABLE "CommunityEvent" RENAME COLUMN "infaqAmount" TO "ticketPrice";

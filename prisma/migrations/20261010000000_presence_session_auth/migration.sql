-- Session IDs are public map identifiers. Store a hash of a separate private
-- bearer token so knowing someone's visible ID is not enough to impersonate them.
ALTER TABLE "Presence"
ADD COLUMN "tokenHash" TEXT NOT NULL DEFAULT '';

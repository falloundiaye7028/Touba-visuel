CREATE TYPE "DocumentResourceType" AS ENUM ('PROPERTY', 'PROJECT', 'BUILDING', 'UNIT', 'OWNER', 'TENANT', 'CONTRACT', 'MAINTENANCE', 'VENDOR', 'OTHER');

ALTER TABLE "documents"
  ADD COLUMN "originalName" TEXT,
  ADD COLUMN "description" TEXT,
  ADD COLUMN "resourceType" "DocumentResourceType" NOT NULL DEFAULT 'OTHER',
  ADD COLUMN "resourceId" UUID,
  ADD COLUMN "documentDate" TIMESTAMP(3),
  ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "uploadedBy" UUID,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "documents"
SET
  "originalName" = "name",
  "resourceId" = "entityId",
  "uploadedBy" = "uploadedById",
  "resourceType" = CASE UPPER("entityType")
    WHEN 'PROPERTY' THEN 'PROPERTY'::"DocumentResourceType"
    WHEN 'PROJECT' THEN 'PROJECT'::"DocumentResourceType"
    WHEN 'BUILDING' THEN 'BUILDING'::"DocumentResourceType"
    WHEN 'UNIT' THEN 'UNIT'::"DocumentResourceType"
    WHEN 'OWNER' THEN 'OWNER'::"DocumentResourceType"
    WHEN 'TENANT' THEN 'TENANT'::"DocumentResourceType"
    WHEN 'CONTRACT' THEN 'CONTRACT'::"DocumentResourceType"
    WHEN 'MAINTENANCE' THEN 'MAINTENANCE'::"DocumentResourceType"
    WHEN 'VENDOR' THEN 'VENDOR'::"DocumentResourceType"
    ELSE 'OTHER'::"DocumentResourceType"
  END;

ALTER TABLE "documents"
  ALTER COLUMN "originalName" SET NOT NULL,
  DROP COLUMN "entityType",
  DROP COLUMN "entityId",
  DROP COLUMN "uploadedById";

DROP INDEX IF EXISTS "documents_organizationId_entityType_entityId_idx";
CREATE INDEX "documents_organizationId_resourceType_resourceId_idx" ON "documents"("organizationId", "resourceType", "resourceId");
CREATE INDEX "documents_organizationId_category_createdAt_idx" ON "documents"("organizationId", "category", "createdAt");
CREATE INDEX "documents_organizationId_uploadedBy_createdAt_idx" ON "documents"("organizationId", "uploadedBy", "createdAt");

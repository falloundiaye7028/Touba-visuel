ALTER TABLE "info_articles"
ADD COLUMN "facebookPostId" TEXT,
ADD COLUMN "facebookSharedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "info_articles_facebookPostId_key"
ON "info_articles"("facebookPostId");

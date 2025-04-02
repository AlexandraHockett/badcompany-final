-- CreateTable
CREATE TABLE "NewsletterTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6366F1',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriberTag" (
    "id" SERIAL NOT NULL,
    "subscriberId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriberTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterTag_name_key" ON "NewsletterTag"("name");

-- CreateIndex
CREATE INDEX "NewsletterSubscriberTag_subscriberId_idx" ON "NewsletterSubscriberTag"("subscriberId");

-- CreateIndex
CREATE INDEX "NewsletterSubscriberTag_tagId_idx" ON "NewsletterSubscriberTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriberTag_subscriberId_tagId_key" ON "NewsletterSubscriberTag"("subscriberId", "tagId");

-- AddForeignKey
ALTER TABLE "NewsletterSubscriberTag" ADD CONSTRAINT "NewsletterSubscriberTag_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterSubscriberTag" ADD CONSTRAINT "NewsletterSubscriberTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "NewsletterTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

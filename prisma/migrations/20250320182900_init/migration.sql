/*
  Warnings:

  - Made the column `userAgent` on table `Visitor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Visitor" ALTER COLUMN "userAgent" SET NOT NULL,
ALTER COLUMN "firstVisit" DROP DEFAULT,
ALTER COLUMN "lastVisit" DROP DEFAULT;

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "source" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "preferences" JSONB,
    "lastEmailSentAt" TIMESTAMP(3),
    "emailsSent" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterCampaign" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "totalRecipients" INTEGER NOT NULL DEFAULT 0,
    "opened" INTEGER NOT NULL DEFAULT 0,
    "clicked" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterCampaignRecipient" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "subscriberId" INTEGER NOT NULL,
    "sentAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),

    CONSTRAINT "NewsletterCampaignRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE INDEX "NewsletterSubscriber_email_idx" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE INDEX "NewsletterSubscriber_active_idx" ON "NewsletterSubscriber"("active");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterCampaignRecipient_campaignId_subscriberId_key" ON "NewsletterCampaignRecipient"("campaignId", "subscriberId");

-- AddForeignKey
ALTER TABLE "NewsletterCampaignRecipient" ADD CONSTRAINT "NewsletterCampaignRecipient_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "NewsletterCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterCampaignRecipient" ADD CONSTRAINT "NewsletterCampaignRecipient_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `scheduledAt` on the `NewsletterCampaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NewsletterCampaign" DROP COLUMN "scheduledAt",
ADD COLUMN     "scheduledFor" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'draft';

-- AlterTable
ALTER TABLE "NewsletterSubscriber" ADD COLUMN     "unsubscribeReason" TEXT,
ADD COLUMN     "dAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "NewsletterUnsubscribe" (
    "id" SERIAL NOT NULL,
    "subscriberId" INTEGER NOT NULL,
    "campaignId" INTEGER,
    "reason" TEXT,
    "unsubscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterUnsubscribe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterLinkClick" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "subscriberId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterLinkClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NewsletterUnsubscribe_subscriberId_idx" ON "NewsletterUnsubscribe"("subscriberId");

-- CreateIndex
CREATE INDEX "NewsletterUnsubscribe_campaignId_idx" ON "NewsletterUnsubscribe"("campaignId");

-- CreateIndex
CREATE INDEX "NewsletterLinkClick_campaignId_idx" ON "NewsletterLinkClick"("campaignId");

-- CreateIndex
CREATE INDEX "NewsletterLinkClick_subscriberId_idx" ON "NewsletterLinkClick"("subscriberId");

-- CreateIndex
CREATE INDEX "NewsletterCampaignRecipient_campaignId_idx" ON "NewsletterCampaignRecipient"("campaignId");

-- CreateIndex
CREATE INDEX "NewsletterCampaignRecipient_subscriberId_idx" ON "NewsletterCampaignRecipient"("subscriberId");

-- AddForeignKey
ALTER TABLE "NewsletterUnsubscribe" ADD CONSTRAINT "NewsletterUnsubscribe_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterUnsubscribe" ADD CONSTRAINT "NewsletterUnsubscribe_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "NewsletterCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterLinkClick" ADD CONSTRAINT "NewsletterLinkClick_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "NewsletterCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterLinkClick" ADD CONSTRAINT "NewsletterLinkClick_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

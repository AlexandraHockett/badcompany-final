/*
  Warnings:

  - You are about to drop the column `dAt` on the `NewsletterSubscriber` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NewsletterSubscriber" DROP COLUMN "dAt",
ADD COLUMN     "unsubscribedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Visitor" ADD COLUMN     "subscriberId" INTEGER;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

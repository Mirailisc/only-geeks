-- AlterEnum
ALTER TYPE "public"."ModerationAction" ADD VALUE 'RESOLVED';

-- DropForeignKey
ALTER TABLE "public"."BlogReport" DROP CONSTRAINT "BlogReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BlogReport" DROP CONSTRAINT "BlogReport_targetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ModerationDecision" DROP CONSTRAINT "ModerationDecision_reportId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProjectReport" DROP CONSTRAINT "ProjectReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProjectReport" DROP CONSTRAINT "ProjectReport_targetId_fkey";

-- AddForeignKey
ALTER TABLE "public"."BlogReport" ADD CONSTRAINT "BlogReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogReport" ADD CONSTRAINT "BlogReport_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "public"."Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectReport" ADD CONSTRAINT "ProjectReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectReport" ADD CONSTRAINT "ProjectReport_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModerationDecision" ADD CONSTRAINT "ModerationDecision_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

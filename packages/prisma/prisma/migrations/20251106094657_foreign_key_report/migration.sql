/*
  Warnings:

  - You are about to drop the column `targetId` on the `Report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_targetBlog_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_targetProject_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_targetUser_fkey";

-- AlterTable
ALTER TABLE "public"."Report" DROP COLUMN "targetId",
ADD COLUMN     "targetBlogId" TEXT,
ADD COLUMN     "targetProjectId" TEXT,
ADD COLUMN     "targetUserId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_targetBlogId_fkey" FOREIGN KEY ("targetBlogId") REFERENCES "public"."Blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_targetProjectId_fkey" FOREIGN KEY ("targetProjectId") REFERENCES "public"."Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

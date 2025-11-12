/*
  Warnings:

  - You are about to drop the column `targetBlogId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `targetProjectId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `targetType` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `targetUserId` on the `Report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_targetBlogId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_targetProjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_targetUserId_fkey";

-- AlterTable
ALTER TABLE "public"."Report" DROP COLUMN "targetBlogId",
DROP COLUMN "targetProjectId",
DROP COLUMN "targetType",
DROP COLUMN "targetUserId";

-- CreateTable
CREATE TABLE "public"."UserReport" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,

    CONSTRAINT "UserReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogReport" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,

    CONSTRAINT "BlogReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectReport" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,

    CONSTRAINT "ProjectReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserReport_reportId_key" ON "public"."UserReport"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogReport_reportId_key" ON "public"."BlogReport"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectReport_reportId_key" ON "public"."ProjectReport"("reportId");

-- AddForeignKey
ALTER TABLE "public"."UserReport" ADD CONSTRAINT "UserReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserReport" ADD CONSTRAINT "UserReport_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogReport" ADD CONSTRAINT "BlogReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogReport" ADD CONSTRAINT "BlogReport_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "public"."Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectReport" ADD CONSTRAINT "ProjectReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectReport" ADD CONSTRAINT "ProjectReport_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

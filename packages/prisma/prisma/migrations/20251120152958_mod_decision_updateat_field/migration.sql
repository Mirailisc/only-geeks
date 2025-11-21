/*
  Warnings:

  - Added the required column `updatedAt` to the `UserRestriction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ModerationDecision" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."UserRestriction" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

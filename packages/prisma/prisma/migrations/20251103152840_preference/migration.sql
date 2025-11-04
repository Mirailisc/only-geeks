/*
  Warnings:

  - You are about to drop the column `isDark` on the `Preference` table. All the data in the column will be lost.
  - You are about to drop the column `isProfilePublic` on the `Preference` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Theme" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- AlterTable
ALTER TABLE "public"."Preference" DROP COLUMN "isDark",
DROP COLUMN "isProfilePublic",
ADD COLUMN     "currentTheme" "public"."Theme" NOT NULL DEFAULT 'LIGHT',
ADD COLUMN     "isPublicProfile" BOOLEAN NOT NULL DEFAULT true;

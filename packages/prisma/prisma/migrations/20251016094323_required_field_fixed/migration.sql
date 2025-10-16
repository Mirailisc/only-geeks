/*
  Warnings:

  - Made the column `school` on table `Education` required. This step will fail if there are existing NULL values in that column.
  - Made the column `degree` on table `Education` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Education" ALTER COLUMN "school" SET NOT NULL,
ALTER COLUMN "degree" SET NOT NULL;

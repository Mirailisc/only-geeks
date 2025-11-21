/*
  Warnings:

  - The values [NO_COMMENT] on the enum `RestrictionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."RestrictionType_new" AS ENUM ('TEMP_BAN', 'NO_POSTING');
ALTER TABLE "public"."UserRestriction" ALTER COLUMN "type" TYPE "public"."RestrictionType_new" USING ("type"::text::"public"."RestrictionType_new");
ALTER TYPE "public"."RestrictionType" RENAME TO "RestrictionType_old";
ALTER TYPE "public"."RestrictionType_new" RENAME TO "RestrictionType";
DROP TYPE "public"."RestrictionType_old";
COMMIT;

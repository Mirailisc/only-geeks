-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'local';

-- AlterTable
ALTER TABLE "public"."Achievement" ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];

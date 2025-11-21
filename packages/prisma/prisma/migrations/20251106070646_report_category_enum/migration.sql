/*
  Warnings:

  - Changed the type of `category` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ReportCategory" AS ENUM ('PLAGIARISM', 'VIOLENT_CONTENT', 'INAPPROPRIATE_CONTENT', 'MALWARE', 'INTELLECTUAL_PROPERTY_VIOLATION', 'MISINFORMATION', 'UNSAFE_FEATURES', 'DATA_MISUSE', 'SPAM', 'HARASSMENT', 'IMPERSONATION', 'INAPPROPRIATE_BEHAVIOR', 'SCAM', 'HATE_SPEECH', 'PRIVACY_VIOLATION', 'SEXUAL_HARASSMENT', 'THREATS', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Report" DROP COLUMN "category",
ADD COLUMN     "category" "public"."ReportCategory" NOT NULL;

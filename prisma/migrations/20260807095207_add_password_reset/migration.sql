-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "resetCode" TEXT,
ADD COLUMN     "resetExpires" TIMESTAMP(3);

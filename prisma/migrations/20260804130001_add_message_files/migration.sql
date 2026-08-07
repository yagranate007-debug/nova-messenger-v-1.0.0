/*
  Warnings:

  - You are about to drop the column `fileSize` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "fileSize",
DROP COLUMN "fileUrl",
DROP COLUMN "type",
ADD COLUMN     "file" TEXT,
ADD COLUMN     "fileType" TEXT,
ALTER COLUMN "text" DROP DEFAULT;

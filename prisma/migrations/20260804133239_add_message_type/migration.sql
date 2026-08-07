/*
  Warnings:

  - You are about to drop the column `file` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "file",
DROP COLUMN "fileType",
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'text',
ALTER COLUMN "text" SET DEFAULT '';

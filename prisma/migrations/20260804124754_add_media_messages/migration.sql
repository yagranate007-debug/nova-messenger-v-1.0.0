-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'text',
ALTER COLUMN "text" DROP NOT NULL;

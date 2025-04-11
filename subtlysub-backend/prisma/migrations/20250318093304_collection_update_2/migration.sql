-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "linkedCollId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_linkedCollId_fkey" FOREIGN KEY ("linkedCollId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

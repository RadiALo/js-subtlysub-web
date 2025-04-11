-- DropForeignKey
ALTER TABLE "Learn" DROP CONSTRAINT "Learn_postId_fkey";

-- DropForeignKey
ALTER TABLE "Learn" DROP CONSTRAINT "Learn_userId_fkey";

-- AddForeignKey
ALTER TABLE "Learn" ADD CONSTRAINT "Learn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Learn" ADD CONSTRAINT "Learn_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Learn" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "progress" JSONB,

    CONSTRAINT "Learn_pkey" PRIMARY KEY ("userId","postId")
);

-- AddForeignKey
ALTER TABLE "Learn" ADD CONSTRAINT "Learn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Learn" ADD CONSTRAINT "Learn_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

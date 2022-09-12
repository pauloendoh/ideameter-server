-- CreateTable
CREATE TABLE "RteImage" (
    "userId" TEXT NOT NULL,
    "ideaId" TEXT,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RteImage_pkey" PRIMARY KEY ("imageUrl")
);

-- AddForeignKey
ALTER TABLE "RteImage" ADD CONSTRAINT "RteImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RteImage" ADD CONSTRAINT "RteImage_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

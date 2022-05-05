-- CreateTable
CREATE TABLE "IdeaRating" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER,

    CONSTRAINT "IdeaRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IdeaRating" ADD CONSTRAINT "IdeaRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdeaRating" ADD CONSTRAINT "IdeaRating_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

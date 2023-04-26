/*
  Warnings:

  - You are about to drop the `HighlightedIdea` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HighlightedIdea" DROP CONSTRAINT "HighlightedIdea_ideaId_fkey";

-- DropForeignKey
ALTER TABLE "HighlightedIdea" DROP CONSTRAINT "HighlightedIdea_userId_fkey";

-- DropTable
DROP TABLE "HighlightedIdea";

-- CreateTable
CREATE TABLE "IdeaHighlight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdeaHighlight_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IdeaHighlight" ADD CONSTRAINT "IdeaHighlight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdeaHighlight" ADD CONSTRAINT "IdeaHighlight_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

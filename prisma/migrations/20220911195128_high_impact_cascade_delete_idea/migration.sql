-- DropForeignKey
ALTER TABLE "HighImpactVote" DROP CONSTRAINT "HighImpactVote_ideaId_fkey";

-- DropForeignKey
ALTER TABLE "HighImpactVote" DROP CONSTRAINT "HighImpactVote_userId_fkey";

-- AddForeignKey
ALTER TABLE "HighImpactVote" ADD CONSTRAINT "HighImpactVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighImpactVote" ADD CONSTRAINT "HighImpactVote_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

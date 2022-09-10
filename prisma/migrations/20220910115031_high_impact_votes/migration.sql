-- CreateTable
CREATE TABLE "HighImpactVote" (
    "userId" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,

    CONSTRAINT "HighImpactVote_pkey" PRIMARY KEY ("userId","ideaId")
);

-- AddForeignKey
ALTER TABLE "HighImpactVote" ADD CONSTRAINT "HighImpactVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighImpactVote" ADD CONSTRAINT "HighImpactVote_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

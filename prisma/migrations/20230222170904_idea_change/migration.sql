-- CreateEnum
CREATE TYPE "IdeaChangeType" AS ENUM ('Description', 'Title');

-- CreateTable
CREATE TABLE "IdeaChange" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "changeType" "IdeaChangeType" NOT NULL,
    "prevText" TEXT NOT NULL,
    "newText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdeaChange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IdeaChange" ADD CONSTRAINT "IdeaChange_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

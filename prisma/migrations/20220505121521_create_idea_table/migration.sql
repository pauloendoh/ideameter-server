-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "tabId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_tabId_fkey" FOREIGN KEY ("tabId") REFERENCES "GroupTab"("id") ON DELETE SET NULL ON UPDATE CASCADE;

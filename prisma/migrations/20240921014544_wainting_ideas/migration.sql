-- CreateTable
CREATE TABLE "_IdeaWaitingIdea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_IdeaWaitingIdea_AB_unique" ON "_IdeaWaitingIdea"("A", "B");

-- CreateIndex
CREATE INDEX "_IdeaWaitingIdea_B_index" ON "_IdeaWaitingIdea"("B");

-- AddForeignKey
ALTER TABLE "_IdeaWaitingIdea" ADD CONSTRAINT "_IdeaWaitingIdea_A_fkey" FOREIGN KEY ("A") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IdeaWaitingIdea" ADD CONSTRAINT "_IdeaWaitingIdea_B_fkey" FOREIGN KEY ("B") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

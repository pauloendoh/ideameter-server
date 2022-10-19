-- DropForeignKey
ALTER TABLE "Idea" DROP CONSTRAINT "Idea_tabId_fkey";

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_tabId_fkey" FOREIGN KEY ("tabId") REFERENCES "GroupTab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

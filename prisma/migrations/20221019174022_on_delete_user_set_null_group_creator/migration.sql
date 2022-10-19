-- DropForeignKey
ALTER TABLE "GroupTab" DROP CONSTRAINT "GroupTab_creatorId_fkey";

-- AlterTable
ALTER TABLE "GroupTab" ALTER COLUMN "creatorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GroupTab" ADD CONSTRAINT "GroupTab_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

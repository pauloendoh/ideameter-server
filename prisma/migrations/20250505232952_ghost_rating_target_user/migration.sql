/*
  Warnings:

  - Added the required column `targetUserId` to the `GhostRating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GhostRating" ADD COLUMN     "targetUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GhostRating" ADD CONSTRAINT "GhostRating_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

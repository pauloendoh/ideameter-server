/*
  Warnings:

  - You are about to drop the column `lastOpenedAt` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "lastOpenedAt";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastOpenedGroupId" TEXT;

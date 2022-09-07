/*
  Warnings:

  - You are about to drop the column `onFireSice` on the `Idea` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Idea" DROP COLUMN "onFireSice",
ADD COLUMN     "onFireSince" TIMESTAMP(3);

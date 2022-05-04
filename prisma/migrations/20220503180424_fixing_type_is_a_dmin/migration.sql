/*
  Warnings:

  - You are about to drop the column `isADmin` on the `UserGroup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserGroup" DROP COLUMN "isADmin",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

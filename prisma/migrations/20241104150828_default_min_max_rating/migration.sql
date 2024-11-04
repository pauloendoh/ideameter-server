/*
  Warnings:

  - Made the column `maxRating` on table `Group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minRating` on table `Group` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "maxRating" SET NOT NULL,
ALTER COLUMN "maxRating" SET DEFAULT 3,
ALTER COLUMN "minRating" SET NOT NULL,
ALTER COLUMN "minRating" SET DEFAULT 1;

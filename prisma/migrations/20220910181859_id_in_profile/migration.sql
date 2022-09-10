/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");

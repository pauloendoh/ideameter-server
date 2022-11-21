-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "RteImage" ALTER COLUMN "userId" DROP NOT NULL;

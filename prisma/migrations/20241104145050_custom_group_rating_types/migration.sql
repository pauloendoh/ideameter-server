-- CreateEnum
CREATE TYPE "GroupRatingInputType" AS ENUM ('dropdown', 'numeric');

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "dropdownTextValues" TEXT[],
ADD COLUMN     "maxRating" DOUBLE PRECISION,
ADD COLUMN     "minRating" DOUBLE PRECISION,
ADD COLUMN     "ratingInputType" "GroupRatingInputType" NOT NULL DEFAULT 'dropdown';

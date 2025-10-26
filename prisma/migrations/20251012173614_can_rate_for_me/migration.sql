-- CreateTable
CREATE TABLE "CanRateForMe" (
    "id" TEXT NOT NULL,
    "ratingFinalOwnerId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "allowedMemberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CanRateForMe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CanRateForMe" ADD CONSTRAINT "CanRateForMe_ratingFinalOwnerId_fkey" FOREIGN KEY ("ratingFinalOwnerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanRateForMe" ADD CONSTRAINT "CanRateForMe_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanRateForMe" ADD CONSTRAINT "CanRateForMe_allowedMemberId_fkey" FOREIGN KEY ("allowedMemberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

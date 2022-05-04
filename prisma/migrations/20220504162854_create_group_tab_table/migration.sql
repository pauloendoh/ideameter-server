-- CreateTable
CREATE TABLE "GroupTab" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupTab_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupTab" ADD CONSTRAINT "GroupTab_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupTab" ADD CONSTRAINT "GroupTab_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

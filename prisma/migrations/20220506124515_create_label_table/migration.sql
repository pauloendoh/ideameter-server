-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL DEFAULT E'#db4035',

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

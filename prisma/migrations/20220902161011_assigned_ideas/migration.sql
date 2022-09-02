-- CreateTable
CREATE TABLE "_assigned" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_assigned_AB_unique" ON "_assigned"("A", "B");

-- CreateIndex
CREATE INDEX "_assigned_B_index" ON "_assigned"("B");

-- AddForeignKey
ALTER TABLE "_assigned" ADD CONSTRAINT "_assigned_A_fkey" FOREIGN KEY ("A") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_assigned" ADD CONSTRAINT "_assigned_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

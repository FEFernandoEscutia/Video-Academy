-- CreateTable
CREATE TABLE "_FavoriteCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteCourses_AB_unique" ON "_FavoriteCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteCourses_B_index" ON "_FavoriteCourses"("B");

-- AddForeignKey
ALTER TABLE "_FavoriteCourses" ADD CONSTRAINT "_FavoriteCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteCourses" ADD CONSTRAINT "_FavoriteCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `videoId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `_PurchasedVideos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_videoId_fkey";

-- DropForeignKey
ALTER TABLE "_PurchasedVideos" DROP CONSTRAINT "_PurchasedVideos_A_fkey";

-- DropForeignKey
ALTER TABLE "_PurchasedVideos" DROP CONSTRAINT "_PurchasedVideos_B_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "videoId",
ADD COLUMN     "courseId" TEXT NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "courseId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_PurchasedVideos";

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "technologies" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PurchasedCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PurchasedCourses_AB_unique" ON "_PurchasedCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_PurchasedCourses_B_index" ON "_PurchasedCourses"("B");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PurchasedCourses" ADD CONSTRAINT "_PurchasedCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PurchasedCourses" ADD CONSTRAINT "_PurchasedCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

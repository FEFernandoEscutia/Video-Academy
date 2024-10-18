/*
  Warnings:

  - You are about to drop the column `available` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `videoId` on the `OrderDetail` table. All the data in the column will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseId` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderDetail" DROP CONSTRAINT "OrderDetail_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "available";

-- AlterTable
ALTER TABLE "OrderDetail" DROP COLUMN "videoId",
ADD COLUMN     "courseId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Subscription";

-- DropEnum
DROP TYPE "SubscriptionType";

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

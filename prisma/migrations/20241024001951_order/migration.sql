/*
  Warnings:

  - You are about to drop the column `courseId` on the `OrderDetail` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderDetail" DROP CONSTRAINT "OrderDetail_courseId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "courseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderDetail" DROP COLUMN "courseId";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `detailsId` on the `Order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Order_detailsId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "detailsId";

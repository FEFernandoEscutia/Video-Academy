/*
  Warnings:

  - You are about to drop the column `rataing` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "rataing",
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 5;

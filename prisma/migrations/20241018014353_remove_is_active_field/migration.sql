/*
  Warnings:

  - You are about to drop the column `isActive` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "isActive",
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;

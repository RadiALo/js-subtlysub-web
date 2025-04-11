/*
  Warnings:

  - Added the required column `lastViewed` to the `Learn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Learn" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastViewed" TIMESTAMP(3) NOT NULL;

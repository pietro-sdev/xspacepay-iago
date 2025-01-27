/*
  Warnings:

  - Added the required column `language` to the `Flow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flow" ADD COLUMN     "language" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'pt';

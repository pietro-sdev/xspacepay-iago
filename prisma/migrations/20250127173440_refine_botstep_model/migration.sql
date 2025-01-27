/*
  Warnings:

  - You are about to drop the column `filePath` on the `BotStep` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BotStep" DROP COLUMN "filePath",
ADD COLUMN     "actionType" TEXT,
ADD COLUMN     "fileData" TEXT,
ADD COLUMN     "fileMime" TEXT;

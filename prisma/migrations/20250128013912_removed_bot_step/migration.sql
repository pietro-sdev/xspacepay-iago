/*
  Warnings:

  - You are about to drop the `BotStep` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BotStep" DROP CONSTRAINT "BotStep_botId_fkey";

-- DropTable
DROP TABLE "BotStep";

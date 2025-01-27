/*
  Warnings:

  - A unique constraint covering the columns `[botId]` on the table `Flow` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Flow_botId_key" ON "Flow"("botId");

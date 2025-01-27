/*
  Warnings:

  - You are about to drop the column `language` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "language";

-- CreateTable
CREATE TABLE "PaymentGateway" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "secretKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentGateway_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentGateway_userId_type_key" ON "PaymentGateway"("userId", "type");

-- AddForeignKey
ALTER TABLE "PaymentGateway" ADD CONSTRAINT "PaymentGateway_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Made the column `status` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "status" SET NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

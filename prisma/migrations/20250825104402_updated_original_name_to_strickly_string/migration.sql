/*
  Warnings:

  - Made the column `originalName` on table `Media` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Media" ALTER COLUMN "originalName" SET NOT NULL;

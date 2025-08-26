/*
  Warnings:

  - You are about to drop the column `visibility` on the `Media` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Media" DROP COLUMN "visibility";

-- DropEnum
DROP TYPE "public"."MediaVisibility";

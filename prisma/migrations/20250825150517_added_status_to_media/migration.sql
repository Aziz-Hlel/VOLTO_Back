/*
  Warnings:

  - The primary key for the `Media` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Media` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."MediaStatus" AS ENUM ('PENDING', 'UPLOADED', 'FAILED');

-- AlterTable
ALTER TABLE "public"."Media" DROP CONSTRAINT "Media_pkey",
DROP COLUMN "id",
ADD COLUMN     "status" "public"."MediaStatus" NOT NULL DEFAULT 'PENDING',
ADD CONSTRAINT "Media_pkey" PRIMARY KEY ("s3Key");

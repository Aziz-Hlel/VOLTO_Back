/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'SERVER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "public"."Tier" AS ENUM ('SILVER', 'GOLD', 'PLATINUM', 'DIAMOND');

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "gender" "public"."Gender" NOT NULL DEFAULT 'M',
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateEnum
CREATE TYPE "public"."MediaVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "public"."Media" ADD COLUMN     "visibility" "public"."MediaVisibility" NOT NULL DEFAULT 'PRIVATE';

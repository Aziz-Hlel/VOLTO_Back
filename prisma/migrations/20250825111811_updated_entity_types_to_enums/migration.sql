/*
  Warnings:

  - Changed the type of `entityType` on the `Media` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."EntityType" AS ENUM ('USER', 'PRODUCT', 'ARTICLE', 'EVENT');

-- AlterTable
ALTER TABLE "public"."Media" DROP COLUMN "entityType",
ADD COLUMN     "entityType" "public"."EntityType" NOT NULL;

-- CreateIndex
CREATE INDEX "Media_entityType_entityId_idx" ON "public"."Media"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Media_entityType_entityId_mediaPurpose_idx" ON "public"."Media"("entityType", "entityId", "mediaPurpose");

-- CreateIndex
CREATE UNIQUE INDEX "Media_entityType_entityId_mediaPurpose_key" ON "public"."Media"("entityType", "entityId", "mediaPurpose");

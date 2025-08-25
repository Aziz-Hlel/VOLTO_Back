-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('WEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "public"."Media" (
    "id" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER,
    "originalName" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "mediaPurpose" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isLadiesNight" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Media_entityType_entityId_idx" ON "public"."Media"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Media_entityType_entityId_mediaPurpose_idx" ON "public"."Media"("entityType", "entityId", "mediaPurpose");

-- CreateIndex
CREATE UNIQUE INDEX "Media_entityType_entityId_mediaPurpose_key" ON "public"."Media"("entityType", "entityId", "mediaPurpose");

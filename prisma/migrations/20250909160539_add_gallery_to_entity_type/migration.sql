-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'WAITER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "public"."Tier" AS ENUM ('SILVER', 'GOLD', 'PLATINUM', 'DIAMOND');

-- CreateEnum
CREATE TYPE "public"."EntityType" AS ENUM ('USER', 'PRODUCT', 'ARTICLE', 'EVENT', 'GALLERY');

-- CreateEnum
CREATE TYPE "public"."MediaStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."MediaPurpose" AS ENUM ('AVATAR', 'IMAGE', 'THUMBNAIL', 'VIDEO');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('WEEKLY', 'SPECIAL');

-- CreateEnum
CREATE TYPE "public"."EventAssiciated" AS ENUM ('LadiesNight', 'SpinnigWheel');

-- CreateEnum
CREATE TYPE "public"."GalleryTags" AS ENUM ('SPECIAL_EVENTS', 'VIBES', 'FOOD', 'LADIES_NIGHT');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "phoneNumber" TEXT,
    "gender" "public"."Gender" NOT NULL DEFAULT 'M',
    "tier" "public"."Tier" NOT NULL DEFAULT 'SILVER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Worker" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "ranking" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Media" (
    "s3Key" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER,
    "status" "public"."MediaStatus" NOT NULL DEFAULT 'PENDING',
    "entityType" "public"."EntityType" NOT NULL,
    "entityId" TEXT,
    "mediaPurpose" "public"."MediaPurpose" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "Media_pkey" PRIMARY KEY ("s3Key")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."EventType" NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "cronStartDate" TEXT,
    "cronEndDate" TEXT,
    "isLadiesNight" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Stats" (
    "id" TEXT NOT NULL,
    "event" "public"."EventAssiciated" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalParticipants" INTEGER NOT NULL,
    "drinksConsumed" INTEGER NOT NULL,
    "quota" INTEGER NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."spinning_wheel_events" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spinning_wheel_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."spinning_wheel_rewards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wheelId" TEXT NOT NULL,

    CONSTRAINT "spinning_wheel_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Gallery" (
    "id" TEXT NOT NULL,
    "tag" "public"."GalleryTags" NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Media_entityType_entityId_idx" ON "public"."Media"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Media_entityType_entityId_mediaPurpose_idx" ON "public"."Media"("entityType", "entityId", "mediaPurpose");

-- CreateIndex
CREATE UNIQUE INDEX "Media_entityType_entityId_mediaPurpose_key" ON "public"."Media"("entityType", "entityId", "mediaPurpose");

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_key" ON "public"."Event"("name");

-- CreateIndex
CREATE INDEX "Event_isLadiesNight_idx" ON "public"."Event"("isLadiesNight");

-- AddForeignKey
ALTER TABLE "public"."spinning_wheel_rewards" ADD CONSTRAINT "spinning_wheel_rewards_wheelId_fkey" FOREIGN KEY ("wheelId") REFERENCES "public"."spinning_wheel_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

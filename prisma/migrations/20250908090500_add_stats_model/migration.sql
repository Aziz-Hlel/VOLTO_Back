-- CreateEnum
CREATE TYPE "public"."EventAssiciated" AS ENUM ('LadiesNight', 'SpinnigWheel');

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

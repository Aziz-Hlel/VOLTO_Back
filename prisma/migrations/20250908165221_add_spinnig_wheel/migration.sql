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

    CONSTRAINT "spinning_wheel_rewards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."spinning_wheel_rewards" ADD CONSTRAINT "spinning_wheel_rewards_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."spinning_wheel_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

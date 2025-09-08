/*
  Warnings:

  - Added the required column `wheelId` to the `spinning_wheel_rewards` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."spinning_wheel_rewards" DROP CONSTRAINT "spinning_wheel_rewards_id_fkey";

-- AlterTable
ALTER TABLE "public"."spinning_wheel_rewards" ADD COLUMN     "wheelId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."spinning_wheel_rewards" ADD CONSTRAINT "spinning_wheel_rewards_wheelId_fkey" FOREIGN KEY ("wheelId") REFERENCES "public"."spinning_wheel_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

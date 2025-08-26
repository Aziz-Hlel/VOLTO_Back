/*
  Warnings:

  - The values [UPLOADED] on the enum `MediaStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."MediaStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');
ALTER TABLE "public"."Media" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Media" ALTER COLUMN "status" TYPE "public"."MediaStatus_new" USING ("status"::text::"public"."MediaStatus_new");
ALTER TYPE "public"."MediaStatus" RENAME TO "MediaStatus_old";
ALTER TYPE "public"."MediaStatus_new" RENAME TO "MediaStatus";
DROP TYPE "public"."MediaStatus_old";
ALTER TABLE "public"."Media" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

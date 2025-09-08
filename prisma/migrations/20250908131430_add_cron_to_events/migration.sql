-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "cronEndDate" TEXT,
ADD COLUMN     "cronStartDate" TEXT,
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL;

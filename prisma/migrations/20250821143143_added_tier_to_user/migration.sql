-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "tier" "public"."Tier" NOT NULL DEFAULT 'SILVER';

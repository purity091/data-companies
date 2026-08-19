ALTER TABLE "companies"
ADD COLUMN "logoUrl" VARCHAR(2048),
ADD COLUMN "trustmrrSlug" VARCHAR(180);

CREATE UNIQUE INDEX "companies_trustmrrSlug_key" ON "companies"("trustmrrSlug");

CREATE TABLE "trustmrr_profiles" (
    "id" BIGSERIAL NOT NULL,
    "companyId" BIGINT NOT NULL,
    "paymentProvider" VARCHAR(80),
    "targetAudience" VARCHAR(20),
    "teamSize" VARCHAR(20),
    "fundingStatus" VARCHAR(30),
    "revenueLast30DaysCents" BIGINT,
    "revenueMrrCents" BIGINT,
    "revenueTotalCents" BIGINT,
    "customers" INTEGER,
    "activeSubscriptions" INTEGER,
    "askingPriceCents" BIGINT,
    "profitMarginLast30Days" DECIMAL(10,4),
    "growth30d" DECIMAL(14,6),
    "growthMrr30d" DECIMAL(14,6),
    "multiple" DECIMAL(14,6),
    "rank" INTEGER,
    "visitorsLast30Days" INTEGER,
    "googleSearchImpressionsLast30Days" BIGINT,
    "revenuePerVisitor" DECIMAL(14,6),
    "onSale" BOOLEAN NOT NULL DEFAULT false,
    "firstListedForSaleAt" TIMESTAMPTZ(3),
    "xHandle" VARCHAR(100),
    "sourceUpdatedAt" TIMESTAMPTZ(3),
    "importedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "trustmrr_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "trustmrr_profiles_companyId_key" ON "trustmrr_profiles"("companyId");
CREATE INDEX "trustmrr_profiles_onSale_idx" ON "trustmrr_profiles"("onSale");
CREATE INDEX "trustmrr_profiles_revenueLast30DaysCents_idx" ON "trustmrr_profiles"("revenueLast30DaysCents");
CREATE INDEX "trustmrr_profiles_askingPriceCents_idx" ON "trustmrr_profiles"("askingPriceCents");

ALTER TABLE "trustmrr_profiles"
ADD CONSTRAINT "trustmrr_profiles_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

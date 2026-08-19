-- Run this script once in Supabase SQL Editor.
-- It is idempotent: running it again will not delete existing data.

BEGIN;

CREATE TABLE IF NOT EXISTS "company_llm_enrichment" (
  "id" BIGSERIAL PRIMARY KEY,
  "companyId" BIGINT NOT NULL UNIQUE,
  "companyType" VARCHAR(100),
  "headquarters" VARCHAR(255),
  "employeeCount" INTEGER,
  "techStack" TEXT,
  "marketingChannels" TEXT,
  "businessModel" TEXT,
  "valueProposition" TEXT,
  "targetCustomers" TEXT,
  "pricingModel" TEXT,
  "relationshipsSummary" TEXT,
  "fundingStage" VARCHAR(100),
  "totalFundingUsd" DECIMAL(20,2),
  "lastFundingDate" DATE,
  "revenueRange" VARCHAR(100),
  "businessStatus" VARCHAR(100),
  "strategicDomain" VARCHAR(255),
  "reachScope" TEXT,
  "audienceSegments" TEXT,
  "strategicAnalysis" TEXT,
  "growthSignals" TEXT,
  "expansionPlan" TEXT,
  "swotStrengths" TEXT,
  "swotWeaknesses" TEXT,
  "swotOpportunities" TEXT,
  "swotThreats" TEXT,
  "evidenceSummary" TEXT,
  "confidence" DECIMAL(4,3),
  "dataGaps" TEXT,
  "risks" TEXT,
  "lastVerifiedAt" DATE,
  "promptVersion" VARCHAR(40) NOT NULL DEFAULT 'llm-4-step-v1',
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "company_llm_enrichment"
  ADD COLUMN IF NOT EXISTS "techStack" TEXT,
  ADD COLUMN IF NOT EXISTS "marketingChannels" TEXT,
  ADD COLUMN IF NOT EXISTS "relationshipsSummary" TEXT,
  ADD COLUMN IF NOT EXISTS "strategicDomain" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "reachScope" TEXT,
  ADD COLUMN IF NOT EXISTS "audienceSegments" TEXT,
  ADD COLUMN IF NOT EXISTS "strategicAnalysis" TEXT,
  ADD COLUMN IF NOT EXISTS "growthSignals" TEXT,
  ADD COLUMN IF NOT EXISTS "expansionPlan" TEXT,
  ADD COLUMN IF NOT EXISTS "swotStrengths" TEXT,
  ADD COLUMN IF NOT EXISTS "swotWeaknesses" TEXT,
  ADD COLUMN IF NOT EXISTS "swotOpportunities" TEXT,
  ADD COLUMN IF NOT EXISTS "swotThreats" TEXT;

ALTER TABLE "company_llm_enrichment"
  ALTER COLUMN "reachScope" TYPE TEXT;

CREATE TABLE IF NOT EXISTS "company_products" (
  "id" BIGSERIAL PRIMARY KEY,
  "companyId" BIGINT NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "url" VARCHAR(2048)
);
CREATE UNIQUE INDEX IF NOT EXISTS "company_products_companyId_name_key" ON "company_products"("companyId", "name");
CREATE INDEX IF NOT EXISTS "company_products_companyId_idx" ON "company_products"("companyId");

CREATE TABLE IF NOT EXISTS "company_competitors" (
  "id" BIGSERIAL PRIMARY KEY,
  "companyId" BIGINT NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "websiteUrl" VARCHAR(2048),
  "relationship" VARCHAR(80)
);
CREATE UNIQUE INDEX IF NOT EXISTS "company_competitors_companyId_name_key" ON "company_competitors"("companyId", "name");
CREATE INDEX IF NOT EXISTS "company_competitors_companyId_idx" ON "company_competitors"("companyId");

CREATE TABLE IF NOT EXISTS "company_related_parties" (
  "id" BIGSERIAL PRIMARY KEY,
  "companyId" BIGINT NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "partyType" VARCHAR(80),
  "relationship" VARCHAR(120),
  "websiteUrl" VARCHAR(2048),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "company_related_parties_companyId_name_key" ON "company_related_parties"("companyId", "name");
CREATE INDEX IF NOT EXISTS "company_related_parties_companyId_idx" ON "company_related_parties"("companyId");

CREATE TABLE IF NOT EXISTS "company_sources" (
  "id" BIGSERIAL PRIMARY KEY,
  "companyId" BIGINT NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "url" VARCHAR(2048) NOT NULL,
  "publisher" VARCHAR(255),
  "sourceType" VARCHAR(40) NOT NULL DEFAULT 'other',
  "accessedAt" TIMESTAMPTZ(3),
  "evidence" TEXT,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "company_sources_companyId_url_key" ON "company_sources"("companyId", "url");
CREATE INDEX IF NOT EXISTS "company_sources_companyId_idx" ON "company_sources"("companyId");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'company_llm_enrichment_companyId_fkey') THEN
    ALTER TABLE "company_llm_enrichment" ADD CONSTRAINT "company_llm_enrichment_companyId_fkey"
      FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'company_products_companyId_fkey') THEN
    ALTER TABLE "company_products" ADD CONSTRAINT "company_products_companyId_fkey"
      FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'company_competitors_companyId_fkey') THEN
    ALTER TABLE "company_competitors" ADD CONSTRAINT "company_competitors_companyId_fkey"
      FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'company_related_parties_companyId_fkey') THEN
    ALTER TABLE "company_related_parties" ADD CONSTRAINT "company_related_parties_companyId_fkey"
      FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'company_sources_companyId_fkey') THEN
    ALTER TABLE "company_sources" ADD CONSTRAINT "company_sources_companyId_fkey"
      FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

COMMIT;

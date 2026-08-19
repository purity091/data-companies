CREATE TABLE "company_llm_enrichment" (
    "id" BIGSERIAL NOT NULL,
    "companyId" BIGINT NOT NULL,
    "companyType" VARCHAR(100),
    "headquarters" VARCHAR(255),
    "employeeCount" INTEGER,
    "businessModel" TEXT,
    "valueProposition" TEXT,
    "targetCustomers" TEXT,
    "pricingModel" TEXT,
    "fundingStage" VARCHAR(100),
    "totalFundingUsd" DECIMAL(20,2),
    "lastFundingDate" DATE,
    "revenueRange" VARCHAR(100),
    "businessStatus" VARCHAR(100),
    "evidenceSummary" TEXT,
    "confidence" DECIMAL(4,3),
    "dataGaps" TEXT,
    "risks" TEXT,
    "lastVerifiedAt" DATE,
    "promptVersion" VARCHAR(40) NOT NULL DEFAULT 'llm-4-step-v1',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "company_llm_enrichment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "company_llm_enrichment_companyId_key" UNIQUE ("companyId")
);

CREATE TABLE "company_products" (
    "id" BIGSERIAL NOT NULL,
    "companyId" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "url" VARCHAR(2048),
    CONSTRAINT "company_products_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "company_products_companyId_name_key" ON "company_products"("companyId", "name");
CREATE INDEX "company_products_companyId_idx" ON "company_products"("companyId");

CREATE TABLE "company_competitors" (
    "id" BIGSERIAL NOT NULL,
    "companyId" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "websiteUrl" VARCHAR(2048),
    "relationship" VARCHAR(80),
    CONSTRAINT "company_competitors_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "company_competitors_companyId_name_key" ON "company_competitors"("companyId", "name");
CREATE INDEX "company_competitors_companyId_idx" ON "company_competitors"("companyId");

CREATE TABLE "company_sources" (
    "id" BIGSERIAL NOT NULL,
    "companyId" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "publisher" VARCHAR(255),
    "sourceType" VARCHAR(40) NOT NULL DEFAULT 'other',
    "accessedAt" TIMESTAMPTZ(3),
    "evidence" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "company_sources_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "company_sources_companyId_url_key" ON "company_sources"("companyId", "url");
CREATE INDEX "company_sources_companyId_idx" ON "company_sources"("companyId");

ALTER TABLE "company_llm_enrichment"
ADD CONSTRAINT "company_llm_enrichment_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_products"
ADD CONSTRAINT "company_products_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_competitors"
ADD CONSTRAINT "company_competitors_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_sources"
ADD CONSTRAINT "company_sources_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

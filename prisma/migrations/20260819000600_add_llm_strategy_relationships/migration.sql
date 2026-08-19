ALTER TABLE "company_llm_enrichment"
  ADD COLUMN "relationshipsSummary" TEXT,
  ADD COLUMN "strategicDomain" VARCHAR(255),
  ADD COLUMN "reachScope" VARCHAR(255),
  ADD COLUMN "audienceSegments" TEXT,
  ADD COLUMN "strategicAnalysis" TEXT,
  ADD COLUMN "growthSignals" TEXT,
  ADD COLUMN "expansionPlan" TEXT,
  ADD COLUMN "swotStrengths" TEXT,
  ADD COLUMN "swotWeaknesses" TEXT,
  ADD COLUMN "swotOpportunities" TEXT,
  ADD COLUMN "swotThreats" TEXT;

CREATE TABLE "company_related_parties" (
    "id" BIGSERIAL NOT NULL,
    "companyId" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "partyType" VARCHAR(80),
    "relationship" VARCHAR(120),
    "websiteUrl" VARCHAR(2048),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "company_related_parties_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "company_related_parties_companyId_name_key"
  ON "company_related_parties"("companyId", "name");
CREATE INDEX "company_related_parties_companyId_idx"
  ON "company_related_parties"("companyId");

ALTER TABLE "company_related_parties"
ADD CONSTRAINT "company_related_parties_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "countries" (
    "id" BIGSERIAL NOT NULL,
    "code" CHAR(2) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "industries" (
    "id" BIGSERIAL NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    CONSTRAINT "industries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "markets" (
    "id" BIGSERIAL NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    CONSTRAINT "markets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "investors" (
    "id" BIGSERIAL NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "websiteUrl" VARCHAR(2048),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "investors_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "companies" (
    "id" BIGSERIAL NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "legalName" VARCHAR(255),
    "description" TEXT,
    "websiteUrl" VARCHAR(2048),
    "foundedYear" SMALLINT,
    "countryId" BIGINT,
    "industryId" BIGINT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "people" (
    "id" BIGSERIAL NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "jobTitle" VARCHAR(255),
    "linkedinUrl" VARCHAR(2048),
    "companyId" BIGINT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_markets" (
    "companyId" BIGINT NOT NULL,
    "marketId" BIGINT NOT NULL,
    CONSTRAINT "company_markets_pkey" PRIMARY KEY ("companyId", "marketId")
);

CREATE TABLE "company_investors" (
    "companyId" BIGINT NOT NULL,
    "investorId" BIGINT NOT NULL,
    "investedAt" TIMESTAMPTZ(3),
    CONSTRAINT "company_investors_pkey" PRIMARY KEY ("companyId", "investorId")
);

CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");
CREATE UNIQUE INDEX "industries_slug_key" ON "industries"("slug");
CREATE UNIQUE INDEX "industries_name_key" ON "industries"("name");
CREATE UNIQUE INDEX "markets_slug_key" ON "markets"("slug");
CREATE UNIQUE INDEX "markets_name_key" ON "markets"("name");
CREATE UNIQUE INDEX "investors_slug_key" ON "investors"("slug");
CREATE INDEX "investors_name_idx" ON "investors"("name");
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");
CREATE INDEX "companies_name_idx" ON "companies"("name");
CREATE INDEX "companies_createdAt_id_idx" ON "companies"("createdAt", "id");
CREATE INDEX "companies_countryId_idx" ON "companies"("countryId");
CREATE INDEX "companies_industryId_idx" ON "companies"("industryId");
CREATE INDEX "companies_countryId_createdAt_id_idx" ON "companies"("countryId", "createdAt", "id");
CREATE INDEX "companies_industryId_createdAt_id_idx" ON "companies"("industryId", "createdAt", "id");
CREATE INDEX "people_companyId_idx" ON "people"("companyId");
CREATE INDEX "people_fullName_idx" ON "people"("fullName");
CREATE INDEX "company_markets_marketId_idx" ON "company_markets"("marketId");
CREATE INDEX "company_investors_investorId_idx" ON "company_investors"("investorId");

ALTER TABLE "companies" ADD CONSTRAINT "companies_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "companies" ADD CONSTRAINT "companies_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "people" ADD CONSTRAINT "people_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "company_markets" ADD CONSTRAINT "company_markets_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_markets" ADD CONSTRAINT "company_markets_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "markets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_investors" ADD CONSTRAINT "company_investors_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_investors" ADD CONSTRAINT "company_investors_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

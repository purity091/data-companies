ALTER TABLE "trustmrr_profiles"
ADD COLUMN "xFollowerCount" BIGINT,
ADD COLUMN "isMerchantOfRecord" BOOLEAN,
ADD COLUMN "domainRating" DECIMAL(8,3),
ADD COLUMN "founderMessage" TEXT,
ADD COLUMN "insightValueProposition" TEXT,
ADD COLUMN "insightProblemSolved" TEXT,
ADD COLUMN "insightPricingModel" TEXT,
ADD COLUMN "insightTargetPersona" TEXT,
ADD COLUMN "insightBusinessType" VARCHAR(30),
ADD COLUMN "insightTeamSize" VARCHAR(20),
ADD COLUMN "insightFundingStatus" VARCHAR(30),
ADD COLUMN "insightEstimatedUserCount" INTEGER,
ADD COLUMN "trustmrrUrl" VARCHAR(2048),
ADD COLUMN "markdownUrl" VARCHAR(2048),
ADD COLUMN "previousAskingPriceCents" BIGINT,
ADD COLUMN "listingTier" VARCHAR(40),
ADD COLUMN "listingTierBgColor" VARCHAR(30),
ADD COLUMN "listingTierBgColorDark" VARCHAR(30),
ADD COLUMN "brandingPrimaryColor" VARCHAR(30),
ADD COLUMN "brandingSecondaryColor" VARCHAR(30),
ADD COLUMN "pageviewCount" INTEGER,
ADD COLUMN "offerCount" INTEGER,
ADD COLUMN "stealthMode" BOOLEAN,
ADD COLUMN "isMobileApp" BOOLEAN,
ADD COLUMN "xFounderName" VARCHAR(255),
ADD COLUMN "xProfilePicture" VARCHAR(2048);

CREATE TABLE "trustmrr_tech_stack" (
    "companyId" BIGINT NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "category" VARCHAR(80),
    CONSTRAINT "trustmrr_tech_stack_pkey" PRIMARY KEY ("companyId", "slug")
);
CREATE INDEX "trustmrr_tech_stack_slug_idx" ON "trustmrr_tech_stack"("slug");

CREATE TABLE "trustmrr_marketing_channels" (
    "companyId" BIGINT NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "category" VARCHAR(80),
    CONSTRAINT "trustmrr_marketing_channels_pkey" PRIMARY KEY ("companyId", "slug")
);
CREATE INDEX "trustmrr_marketing_channels_slug_idx" ON "trustmrr_marketing_channels"("slug");

CREATE TABLE "trustmrr_cofounders" (
    "id" BIGSERIAL NOT NULL,
    "companyId" BIGINT NOT NULL,
    "xHandle" VARCHAR(100) NOT NULL,
    "xName" VARCHAR(255),
    CONSTRAINT "trustmrr_cofounders_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "trustmrr_cofounders_companyId_xHandle_key" ON "trustmrr_cofounders"("companyId", "xHandle");
CREATE INDEX "trustmrr_cofounders_companyId_idx" ON "trustmrr_cofounders"("companyId");

ALTER TABLE "trustmrr_tech_stack"
ADD CONSTRAINT "trustmrr_tech_stack_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "trustmrr_marketing_channels"
ADD CONSTRAINT "trustmrr_marketing_channels_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "trustmrr_cofounders"
ADD CONSTRAINT "trustmrr_cofounders_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

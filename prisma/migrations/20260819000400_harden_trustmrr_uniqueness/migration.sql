-- Keep one company per TrustMRR source slug, regardless of letter casing.
CREATE UNIQUE INDEX "companies_trustmrrSlug_lower_key"
ON "companies" (LOWER("trustmrrSlug"))
WHERE "trustmrrSlug" IS NOT NULL;

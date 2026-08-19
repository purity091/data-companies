import { NextResponse } from "next/server";
import { z } from "zod";
import { apiErrorResponse } from "@/lib/api-error";
import { parseEnrichmentBundle, type EnrichmentPartKey } from "@/modules/imports/llm-enrichment.parser";
import { companyService } from "@/modules/companies/company.service";
import { isDatabaseConfigured } from "@/lib/database-status";

const requestSchema = z.object({
  companyId: z.string().regex(/^\d+$/).optional(),
  parts: z.object({
    identity: z.string().max(500_000).optional().default(""),
    business: z.string().max(500_000).optional().default(""),
    peopleFinance: z.string().max(500_000).optional().default(""),
    evidence: z.string().max(500_000).optional().default(""),
  }),
});

export async function POST(request: Request) {
  try {
    const { parts, companyId } = requestSchema.parse(await request.json());
    let fallback = {};
    if (companyId && isDatabaseConfigured()) {
      const current = await companyService.getCompany(BigInt(companyId));
      if (current) fallback = {
        name: current.name,
        legalName: current.legalName,
        description: current.description,
        websiteUrl: current.websiteUrl,
        foundedYear: current.foundedYear,
        countryName: current.country?.name ?? null,
        industryName: current.industry?.name ?? null,
        people: current.people,
        investors: current.investors.map((entry) => ({ name: entry.investor.name, slug: entry.investor.slug, websiteUrl: entry.investor.websiteUrl })),
        markets: current.markets.map((entry) => entry.market.name),
        sources: [],
      };
    }
    const result = parseEnrichmentBundle(parts as Partial<Record<EnrichmentPartKey, string>>, fallback);
    return NextResponse.json({ data: result.company, enrichment: result.bundle, issues: result.issues, canCommit: Boolean(result.company && result.bundle && !result.issues.some((issue) => issue.severity === "error")) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

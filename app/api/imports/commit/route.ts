import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-error";
import { databaseNotConfiguredResponse, isDatabaseConfigured, isPreviewMode } from "@/lib/database-status";
import { llmCommitRequestSchema, type LlmCompany } from "@/modules/imports/llm-import.validation";
import { companyService } from "@/modules/companies/company.service";
import { serializeCompany } from "@/modules/companies/company.mapper";
import { previewStore } from "@/modules/preview/preview.store";
import { peopleRepository } from "@/modules/people/people.repository";
import { investorsService } from "@/modules/investors/investors.service";
import { catalogService } from "@/modules/catalog/catalog.service";
import { marketsRepository } from "@/modules/markets/markets.repository";
import { mergeEnrichmentIntoCompany } from "@/modules/imports/llm-enrichment.merge";
import { ensureLlmEnrichmentTables, saveLlmEnrichment } from "@/modules/imports/llm-enrichment.repository";
import type { LlmEnrichmentBundle } from "@/modules/imports/llm-enrichment.validation";

function same(value: string, candidate: string) {
  return value.trim().toLocaleLowerCase() === candidate.trim().toLocaleLowerCase();
}

function previewEnrichment(bundle: LlmEnrichmentBundle) {
  const identity = bundle.identity;
  const business = bundle.business;
  const finance = bundle.peopleFinance;
  const evidence = bundle.evidence;
  const sources = [...(identity?.sources ?? []), ...(business?.sources ?? []), ...(finance?.sources ?? []), ...(evidence?.sources ?? [])]
    .filter((source) => source.url)
    .map((source) => ({ title: source.title || "مصدر غير معنون", url: source.url as string, publisher: source.publisher ?? null, sourceType: source.sourceType, evidence: source.evidence ?? null }));

  return {
    llmEnrichment: {
      promptVersion: "llm-4-step-v1",
      vision: identity?.vision ?? null,
      companyType: identity?.companyType ?? null,
      headquarters: identity?.headquarters ?? null,
      employeeCount: identity?.employeeCount ?? null,
      techStack: identity?.techStack?.join("\n") ?? null,
      marketingChannels: identity?.marketingChannels?.join("\n") ?? null,
      businessModel: business?.businessModel ?? identity?.businessModel ?? null,
      valueProposition: business?.valueProposition ?? null,
      targetCustomers: business?.targetCustomers ?? null,
      pricingModel: business?.pricingModel ?? null,
      relationshipsSummary: business?.relationshipsSummary ?? null,
      fundingStage: finance?.fundingStage ?? null,
      totalFundingUsd: finance?.totalFundingUsd ?? null,
      lastFundingDate: finance?.lastFundingDate ?? null,
      revenueRange: finance?.revenueRange ?? null,
      businessStatus: finance?.businessStatus ?? null,
      strategicDomain: evidence?.strategicDomain ?? identity?.strategicDomain ?? null,
      reachScope: evidence?.reachScope ?? identity?.reachScope ?? null,
      audienceSegments: evidence?.audienceSegments?.join("\n") ?? null,
      strategicAnalysis: evidence?.strategicAnalysis ?? null,
      growthSignals: evidence?.growthSignals ?? null,
      expansionPlan: evidence?.expansionPlan ?? null,
      swotStrengths: evidence?.swot?.strengths?.join("\n") ?? null,
      swotWeaknesses: evidence?.swot?.weaknesses?.join("\n") ?? null,
      swotOpportunities: evidence?.swot?.opportunities?.join("\n") ?? null,
      swotThreats: evidence?.swot?.threats?.join("\n") ?? null,
      evidenceSummary: evidence?.evidenceSummary ?? null,
      confidence: evidence?.confidence ?? null,
      dataGaps: evidence?.dataGaps?.join("\n") ?? null,
      risks: evidence?.risks?.join("\n") ?? null,
      lastVerifiedAt: evidence?.lastVerifiedAt ?? null,
    },
    products: (business?.products ?? []).map((product) => ({ name: product.name, description: product.description ?? null, url: product.url ?? null })),
    competitors: (business?.competitors ?? []).map((competitor) => ({ name: competitor.name, websiteUrl: competitor.websiteUrl ?? null, relationship: competitor.relationship ?? null })),
    relatedParties: (business?.relatedParties ?? []).map((party) => ({ name: party.name, partyType: party.partyType ?? null, relationship: party.relationship ?? null, websiteUrl: party.websiteUrl ?? null })),
    sources,
  };
}

async function commitToPreview(company: LlmCompany, enrichment?: LlmEnrichmentBundle) {
  const created = previewStore.createCompany({
    name: company.name,
    legalName: company.legalName,
    description: company.description,
    websiteUrl: company.websiteUrl,
    foundedYear: company.foundedYear,
    countryId: previewStore.findCountryId(company.countryName) ? BigInt(previewStore.findCountryId(company.countryName) as string) : null,
    industryId: previewStore.findIndustryId(company.industryName) ? BigInt(previewStore.findIndustryId(company.industryName) as string) : null,
  });
  for (const person of company.people) previewStore.addPerson(created.id, person);
  for (const investor of company.investors) previewStore.addInvestor(created.id, { ...investor, slug: investor.slug ?? undefined });
  for (const market of company.markets) previewStore.attachMarket(created.id, market);
  if (enrichment) previewStore.setEnrichment(created.id, previewEnrichment(enrichment));
  return previewStore.getCompany(created.id);
}

async function commitToDatabase(company: LlmCompany, existingCompanyId?: string) {
  const [countries, industries, markets] = await Promise.all([
    catalogService.list("countries"),
    catalogService.list("industries"),
    catalogService.list("markets"),
  ]);
  const country = company.countryName ? countries.find((item) => same(item.name, company.countryName as string)) : undefined;
  const industry = company.industryName ? industries.find((item) => same(item.name, company.industryName as string)) : undefined;
  const companyInput = {
    name: company.name,
    legalName: company.legalName,
    description: company.description,
    websiteUrl: company.websiteUrl,
    foundedYear: company.foundedYear,
    countryId: country?.id ?? null,
    industryId: industry?.id ?? null,
  };

  const savedBase = existingCompanyId
    ? await companyService.updateCompany(BigInt(existingCompanyId), companyInput)
    : await companyService.createCompany(companyInput);

  for (const person of company.people) await peopleRepository.upsertFromImport(savedBase.id, person);
  for (const investor of company.investors) await investorsService.linkToCompany(savedBase.id, { ...investor, slug: investor.slug ?? undefined });
  for (const marketName of company.markets) {
    const market = markets.find((item) => same(item.name, marketName));
    if (market) await marketsRepository.linkToCompany(savedBase.id, market.id);
  }
  return companyService.getCompany(savedBase.id);
}

export async function POST(request: Request) {
  try {
    const { company, companyId, enrichment } = llmCommitRequestSchema.parse(await request.json());
    // Keep fields from the preview/current company when only one enrichment stage is submitted.
    const mergedCompany = enrichment ? mergeEnrichmentIntoCompany(enrichment, company) : company;
    if (isPreviewMode()) {
      const saved = await commitToPreview(mergedCompany, enrichment);
      return NextResponse.json({ mode: "preview", data: saved, sourcesReceived: company.sources.length }, { status: 201 });
    }
    if (!isDatabaseConfigured()) {
      const saved = await commitToPreview(mergedCompany, enrichment);
      return NextResponse.json({ mode: "preview", data: saved, sourcesReceived: company.sources.length }, { status: 201 });
    }

    try {
      if (enrichment) await ensureLlmEnrichmentTables();
      const saved = await commitToDatabase(mergedCompany, companyId);
      if (!saved) throw new Error("Company was saved but could not be loaded");
      const enrichmentSaved = enrichment ? await saveLlmEnrichment(saved.id, enrichment) : null;
      return NextResponse.json({ data: serializeCompany(saved), sourcesReceived: mergedCompany.sources.length, enrichment: enrichmentSaved }, { status: 201 });
    } catch (dbError) {
      console.warn("Database commit failed, falling back to preview store:", dbError);
      const saved = await commitToPreview(mergedCompany, enrichment);
      return NextResponse.json({ mode: "preview", data: saved, sourcesReceived: company.sources.length, warning: "Database saving unavailable; saved in preview mode." }, { status: 201 });
    }
  } catch (error) {
    return apiErrorResponse(error);
  }
}

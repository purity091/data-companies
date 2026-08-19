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

function same(value: string, candidate: string) {
  return value.trim().toLocaleLowerCase() === candidate.trim().toLocaleLowerCase();
}

async function commitToPreview(company: LlmCompany) {
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
      const saved = await commitToPreview(mergedCompany);
      return NextResponse.json({ mode: "preview", data: saved, sourcesReceived: company.sources.length }, { status: 201 });
    }
    if (!isDatabaseConfigured()) return databaseNotConfiguredResponse();
    if (enrichment) await ensureLlmEnrichmentTables();
    const saved = await commitToDatabase(mergedCompany, companyId);
    if (!saved) throw new Error("Company was saved but could not be loaded");
    const enrichmentSaved = enrichment ? await saveLlmEnrichment(saved.id, enrichment) : null;
    return NextResponse.json({ data: serializeCompany(saved), sourcesReceived: mergedCompany.sources.length, enrichment: enrichmentSaved }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { LlmEnrichmentBundle } from "./llm-enrichment.validation";

export async function ensureLlmEnrichmentTables() {
  const client = getSupabaseAdmin();
  const checks = await Promise.all([
    client.from("company_llm_enrichment").select("id").limit(1),
    client.from("company_products").select("id").limit(1),
    client.from("company_competitors").select("id").limit(1),
    client.from("company_related_parties").select("id").limit(1),
    client.from("company_sources").select("id").limit(1),
  ]);
  const failed = checks.find((result) => result.error);
  if (failed?.error) throw failed.error;
}

function lines(values: string[]) {
  return values.length ? values.join("\n") : null;
}

export async function saveLlmEnrichment(companyId: bigint, bundle: LlmEnrichmentBundle) {
  const client = getSupabaseAdmin();
  const identity = bundle.identity;
  const business = bundle.business;
  const finance = bundle.peopleFinance;
  const evidence = bundle.evidence;
  const enrichment: Record<string, unknown> = { companyId: companyId.toString(), promptVersion: "llm-4-step-v1", updatedAt: new Date().toISOString() };
  if (identity) {
    assignDefined(enrichment, identity, ["vision", "companyType", "headquarters", "employeeCount", "businessModel", "strategicDomain", "reachScope"]);
    if (identity.techStack !== undefined) enrichment.techStack = lines(identity.techStack);
    if (identity.marketingChannels !== undefined) enrichment.marketingChannels = lines(identity.marketingChannels);
  }
  if (business) assignDefined(enrichment, business, ["businessModel", "valueProposition", "targetCustomers", "pricingModel", "relationshipsSummary"]);
  if (finance) assignDefined(enrichment, finance, ["fundingStage", "totalFundingUsd", "lastFundingDate", "revenueRange", "businessStatus"]);
  if (evidence) {
    assignDefined(enrichment, evidence, ["strategicDomain", "reachScope", "strategicAnalysis", "growthSignals", "expansionPlan", "evidenceSummary", "confidence", "lastVerifiedAt"]);
    if (evidence.audienceSegments !== undefined) enrichment.audienceSegments = lines(evidence.audienceSegments);
    if (evidence.swot !== undefined) {
      if (evidence.swot.strengths !== undefined) enrichment.swotStrengths = lines(evidence.swot.strengths);
      if (evidence.swot.weaknesses !== undefined) enrichment.swotWeaknesses = lines(evidence.swot.weaknesses);
      if (evidence.swot.opportunities !== undefined) enrichment.swotOpportunities = lines(evidence.swot.opportunities);
      if (evidence.swot.threats !== undefined) enrichment.swotThreats = lines(evidence.swot.threats);
    }
    if (evidence.dataGaps !== undefined) enrichment.dataGaps = lines(evidence.dataGaps);
    if (evidence.risks !== undefined) enrichment.risks = lines(evidence.risks);
  }

  const { error: enrichmentError } = await client.from("company_llm_enrichment").upsert(enrichment, { onConflict: "companyId" });
  if (enrichmentError) throw enrichmentError;

  if (business?.products?.length) await replaceChildRows(client, "company_products", companyId, business.products.map((product) => ({
    companyId: companyId.toString(), name: product.name, description: product.description ?? null, url: product.url ?? null,
  })));
  if (business?.competitors?.length) await replaceChildRows(client, "company_competitors", companyId, business.competitors.map((competitor) => ({
    companyId: companyId.toString(), name: competitor.name, websiteUrl: competitor.websiteUrl ?? null, relationship: competitor.relationship ?? null,
  })));
  if (business?.relatedParties?.length) await replaceChildRows(client, "company_related_parties", companyId, business.relatedParties.map((party) => ({
    companyId: companyId.toString(), name: party.name, partyType: party.partyType ?? null, relationship: party.relationship ?? null, websiteUrl: party.websiteUrl ?? null,
  })));

  const sources = [...(identity?.sources ?? []), ...(business?.sources ?? []), ...(finance?.sources ?? []), ...(evidence?.sources ?? [])].filter((source) => source.url);
  const uniqueSources = [...new Map(sources.map((source) => [source.url as string, source])).values()];
  if (uniqueSources.length) {
    const { error } = await client.from("company_sources").upsert(uniqueSources.map((source) => ({
      companyId: companyId.toString(),
      title: source.title || "مصدر غير معنون",
      url: source.url as string,
      publisher: source.publisher ?? null,
      sourceType: source.sourceType,
      accessedAt: source.accessedAt ?? null,
      evidence: source.evidence ?? null,
      updatedAt: new Date().toISOString(),
    })), { onConflict: "companyId,url" });
    if (error) throw error;
  }

  return { sourceCount: uniqueSources.length, productCount: business?.products?.length ?? 0, competitorCount: business?.competitors?.length ?? 0, relatedPartyCount: business?.relatedParties?.length ?? 0 };
}

async function replaceChildRows(client: ReturnType<typeof getSupabaseAdmin>, table: "company_products" | "company_competitors" | "company_related_parties", companyId: bigint, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const { error } = await client.from(table).upsert(rows, { onConflict: "companyId,name" });
  if (error) throw error;
}

function assignDefined(target: Record<string, unknown>, source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) if (source[key] !== undefined) target[key] = source[key];
}

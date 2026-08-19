import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { CompanyCreateInput, CompanyListInput, CompanyListRecord, CompanyRecord, CompanyUpdateInput } from "./company.types";

const listSelect = `
  id, slug, name, legalName, description, websiteUrl, logoUrl, foundedYear, trustmrrSlug, createdAt, updatedAt,
  country:countries(id, code, name),
  industry:industries(id, slug, name),
  trustmrr:trustmrr_profiles(paymentProvider, revenueLast30DaysCents, revenueMrrCents, revenueTotalCents, customers, activeSubscriptions, askingPriceCents, growth30d, growthMrr30d, multiple, rank, onSale, sourceUpdatedAt, updatedAt)
`;

const fullSelect = `
  id, slug, name, legalName, description, websiteUrl, logoUrl, foundedYear, trustmrrSlug, createdAt, updatedAt,
  country:countries(id, code, name),
  industry:industries(id, slug, name),
  people:people(id, fullName, jobTitle, linkedinUrl, companyId, createdAt, updatedAt),
  markets:company_markets(companyId, marketId, market:markets(id, slug, name)),
  investors:company_investors(companyId, investorId, investedAt, investor:investors(id, slug, name, websiteUrl)),
  trustmrr:trustmrr_profiles(*),
  trustmrrTechStack:trustmrr_tech_stack(slug, category),
  trustmrrMarketingChannels:trustmrr_marketing_channels(slug, category),
  trustmrrCofounders:trustmrr_cofounders(xHandle, xName)
`;

function id(value: unknown): bigint {
  return BigInt(String(value));
}

function date(value: unknown): Date {
  return new Date(String(value));
}

function normalizeCompany(row: Record<string, any>): CompanyRecord {
  return {
    ...row,
    trustmrr: Array.isArray(row.trustmrr) ? row.trustmrr[0] ?? null : row.trustmrr ?? null,
    llmEnrichment: Array.isArray(row.llmEnrichment) ? row.llmEnrichment[0] ?? null : row.llmEnrichment ?? null,
    id: id(row.id),
    createdAt: date(row.createdAt),
    updatedAt: date(row.updatedAt),
    country: row.country ? { ...row.country, id: id(row.country.id) } : null,
    industry: row.industry ? { ...row.industry, id: id(row.industry.id) } : null,
    people: (row.people ?? []).map((person: Record<string, any>) => ({
      ...person,
      id: id(person.id),
      companyId: person.companyId == null ? null : id(person.companyId),
      createdAt: date(person.createdAt),
      updatedAt: date(person.updatedAt),
    })),
    markets: (row.markets ?? []).map((entry: Record<string, any>) => ({
      ...entry,
      companyId: id(entry.companyId),
      marketId: id(entry.marketId),
      market: { ...entry.market, id: id(entry.market.id) },
    })),
    investors: (row.investors ?? []).map((entry: Record<string, any>) => ({
      ...entry,
      companyId: id(entry.companyId),
      investorId: id(entry.investorId),
      investedAt: entry.investedAt ? date(entry.investedAt) : null,
      investor: { ...entry.investor, id: id(entry.investor.id) },
    })),
  } as CompanyRecord;
}

function normalizeList(row: Record<string, any>): CompanyListRecord {
  return {
    ...row,
    trustmrr: Array.isArray(row.trustmrr) ? row.trustmrr[0] ?? null : row.trustmrr ?? null,
    id: id(row.id),
    createdAt: date(row.createdAt),
    updatedAt: date(row.updatedAt),
    country: row.country ? { ...row.country, id: id(row.country.id) } : null,
    industry: row.industry ? { ...row.industry, id: id(row.industry.id) } : null,
  } as CompanyListRecord;
}

function dbData(input: CompanyCreateInput | CompanyUpdateInput): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(input)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, typeof value === "bigint" ? value.toString() : value]),
  );
}

export class CompanyRepository {
  async list(input: CompanyListInput): Promise<{ data: CompanyListRecord[]; hasMore: boolean; total: number }> {
    const client = getSupabaseAdmin();
    let query = client.from("companies").select(listSelect, { count: "exact" });

    if (input.query) {
      const term = input.query.replace(/[,%()]/g, " ");
      query = query.or(`name.ilike.%${term}%,legalName.ilike.%${term}%`);
    }
    if (input.countryId) query = query.eq("countryId", input.countryId.toString());
    if (input.industryId) query = query.eq("industryId", input.industryId.toString());
    if (input.cursor) {
      const cursorDate = input.cursor.createdAt.replace(/[(),]/g, "");
      const cursorId = input.cursor.id.replace(/[^0-9]/g, "");
      query = query.or(`createdAt.lt.${cursorDate},and(createdAt.eq.${cursorDate},id.lt.${cursorId})`);
    }

    const { data, count, error } = await query
      .order("createdAt", { ascending: false })
      .order("id", { ascending: false })
      .limit(input.limit + 1);

    if (error) throw error;
    const rows = (data ?? []).map((row) => normalizeList(row as Record<string, any>));
    return { data: rows.slice(0, input.limit), hasMore: rows.length > input.limit, total: count ?? 0 };
  }

  async findById(companyId: bigint): Promise<CompanyRecord | null> {
    const client = getSupabaseAdmin();
    const { data, error } = await client
      .from("companies")
      .select(fullSelect)
      .eq("id", companyId.toString())
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const [enrichment, products, competitors, relatedParties, sources] = await Promise.all([
      client.from("company_llm_enrichment").select("*").eq("companyId", companyId.toString()).maybeSingle(),
      client.from("company_products").select("id, name, description, url").eq("companyId", companyId.toString()).order("name"),
      client.from("company_competitors").select("id, name, websiteUrl, relationship").eq("companyId", companyId.toString()).order("name"),
      client.from("company_related_parties").select("id, name, partyType, relationship, websiteUrl").eq("companyId", companyId.toString()).order("name"),
      client.from("company_sources").select("id, title, url, publisher, sourceType, accessedAt, evidence").eq("companyId", companyId.toString()).order("title"),
    ]);
    for (const result of [enrichment, products, competitors, relatedParties, sources]) {
      if (result.error && result.error.code !== "PGRST205") throw result.error;
    }

    return normalizeCompany({
      ...(data as Record<string, any>),
      llmEnrichment: enrichment.error ? null : enrichment.data,
      products: products.error ? [] : products.data ?? [],
      competitors: competitors.error ? [] : competitors.data ?? [],
      relatedParties: relatedParties.error ? [] : relatedParties.data ?? [],
      sources: sources.error ? [] : sources.data ?? [],
    });
  }

  async findBySlug(slug: string): Promise<{ id: bigint } | null> {
    const { data, error } = await getSupabaseAdmin().from("companies").select("id").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data ? { id: id(data.id) } : null;
  }

  async create(input: CompanyCreateInput): Promise<CompanyRecord> {
    const insertData = { ...dbData(input), updatedAt: new Date().toISOString() };
    const { data, error } = await getSupabaseAdmin()
      .from("companies")
      .insert(insertData)
      .select(fullSelect)
      .single();
    if (error) throw error;
    return normalizeCompany(data as Record<string, any>);
  }

  async update(companyId: bigint, input: CompanyUpdateInput): Promise<CompanyRecord> {
    const updateData = { ...dbData(input), updatedAt: new Date().toISOString() };
    const { data, error } = await getSupabaseAdmin()
      .from("companies")
      .update(updateData)
      .eq("id", companyId.toString())
      .select(fullSelect)
      .single();
    if (error) throw error;
    return normalizeCompany(data as Record<string, any>);
  }
}

export const companyRepository = new CompanyRepository();

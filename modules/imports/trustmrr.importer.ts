import { getSupabaseAdmin } from "@/lib/supabase/admin";

const TRUSTMRR_ENDPOINT = "https://trustmrr.com/api/v1/startups";
const PAGE_SIZE = 10;

type TrustMrrStartup = {
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  website: string | null;
  country: string | null;
  foundedDate: string | null;
  category: string | null;
  paymentProvider: string | null;
  targetAudience: string | null;
  revenue?: { last30Days?: number; mrr?: number; total?: number };
  customers: number | null;
  activeSubscriptions: number | null;
  askingPrice: number | null;
  profitMarginLast30Days: number | null;
  growth30d: number | null;
  growthMRR30d: number | null;
  multiple: number | null;
  rank: number | null;
  visitorsLast30Days: number | null;
  googleSearchImpressionsLast30Days: number | null;
  revenuePerVisitor: number | null;
  onSale: boolean;
  firstListedForSaleAt: string | null;
  xHandle: string | null;
};

type TrustMrrPage = {
  data: TrustMrrStartup[];
  meta: { total: number; page: number; limit: number; hasMore: boolean };
};

type TrustMrrDetail = TrustMrrStartup & {
  url: string | null;
  markdownUrl: string | null;
  isMobileApp: boolean | null;
  previousAskingPrice: number | null;
  listingTier: string | null;
  listingTierBgColor: string | null;
  listingTierBgColorDark: string | null;
  brandingPrimaryColor: string | null;
  brandingSecondaryColor: string | null;
  pageviewCount: number | null;
  offerCount: number | null;
  stealthMode: boolean | null;
  xFounderName: string | null;
  xProfilePicture: string | null;
  domainRating: number | null;
  founderMessage: string | null;
  xFollowerCount: number | null;
  isMerchantOfRecord: boolean | null;
  startupInsights: {
    valueProposition: string | null;
    problemSolved: string | null;
    pricingModel: string | null;
    targetPersona: string | null;
    businessType: string | null;
    teamSize: string | null;
    fundingStatus: string | null;
    estimatedUserCount: number | null;
  } | null;
  techStack: { slug: string; category: string | null }[] | null;
  marketingChannels: { slug: string; category: string | null }[] | { slug: string; category: string | null } | null;
  cofounders: { xHandle: string; xName: string | null }[] | null;
};

export type TrustMrrImportOptions = {
  maxPages?: number;
  startPage?: number;
  sort?: string;
  onSale?: boolean;
  category?: string;
  teamSize?: string;
  fundingStatus?: string;
};

const countryNames: Record<string, string> = {
  AE: "United Arab Emirates", AU: "Australia", BR: "Brazil", CA: "Canada", DE: "Germany",
  EG: "Egypt", ES: "Spain", FR: "France", GB: "United Kingdom", IN: "India", JP: "Japan",
  NL: "Netherlands", SA: "Saudi Arabia", SG: "Singapore", TR: "Türkiye", UA: "Ukraine", US: "United States",
};

function integerString(value: number | null | undefined): string | null {
  return typeof value === "number" && Number.isFinite(value) ? String(Math.trunc(value)) : null;
}

function decimal(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function displayName(value: string): string {
  return value.split(/[-_]/g).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function safeSlug(value: string): string {
  const slug = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 170);
  return slug || "company";
}

function normalizeTagItems(value: unknown): { slug: string; category: string | null }[] {
  const values = Array.isArray(value) ? value : value && typeof value === "object" ? [value] : [];
  return values.filter((item): item is { slug: string; category: string | null } => {
    return Boolean(item && typeof item === "object" && "slug" in item && typeof item.slug === "string");
  }).map((item) => ({ slug: item.slug, category: item.category ?? null }));
}

function normalizeCofounders(value: unknown): { xHandle: string; xName: string | null }[] {
  return (Array.isArray(value) ? value : []).filter((item): item is { xHandle: string; xName: string | null } => {
    return Boolean(item && typeof item === "object" && "xHandle" in item && typeof item.xHandle === "string");
  }).map((item) => ({ xHandle: item.xHandle, xName: item.xName ?? null }));
}

async function fetchPage(apiKey: string, options: TrustMrrImportOptions, page: number): Promise<TrustMrrPage> {
  const url = new URL(TRUSTMRR_ENDPOINT);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(PAGE_SIZE));
  url.searchParams.set("sort", options.sort ?? "revenue-desc");
  if (options.onSale !== undefined) url.searchParams.set("onSale", String(options.onSale));
  if (options.category) url.searchParams.set("category", options.category);
  if (options.teamSize) url.searchParams.set("teamSize", options.teamSize);
  if (options.fundingStatus) url.searchParams.set("fundingStatus", options.fundingStatus);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`TrustMRR request failed (${response.status}): ${(await response.text()).slice(0, 300)}`);
  return (await response.json()) as TrustMrrPage;
}

async function fetchDetail(apiKey: string, slug: string): Promise<TrustMrrDetail> {
  const response = await fetch(`${TRUSTMRR_ENDPOINT}/${encodeURIComponent(slug)}`, {
    headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`TrustMRR detail request failed (${response.status}): ${(await response.text()).slice(0, 300)}`);
  const body = (await response.json()) as { data: TrustMrrDetail };
  return body.data;
}

type ImportOperation = "created" | "updated" | "skipped";

function sourceSlug(value: string) {
  return value.trim().toLowerCase().slice(0, 180);
}

async function uniqueSlug(client: ReturnType<typeof getSupabaseAdmin>, baseSlug: string, trustmrrSlug: string) {
  const normalized = safeSlug(baseSlug);
  let candidate = normalized;
  let suffix = 2;
  while (true) {
    const { data, error } = await client.from("companies").select("trustmrrSlug").eq("slug", candidate).maybeSingle();
    if (error) throw error;
    if (!data || data.trustmrrSlug?.toLowerCase() === trustmrrSlug.toLowerCase()) return candidate;
    const suffixText = `-${suffix++}`;
    candidate = `${normalized.slice(0, 180 - suffixText.length)}${suffixText}`;
  }
}

async function importStartup(startup: TrustMrrStartup | TrustMrrDetail, options: { skipExisting?: boolean } = {}): Promise<ImportOperation> {
  const client = getSupabaseAdmin();
  const now = new Date().toISOString();
  const trustmrrSlug = sourceSlug(startup.slug);

  // TrustMRR slugs are the stable source identifier. Existing rows are never
  // inserted again, even if the same startup appears on a later API page.
  const { data: bySource, error: sourceError } = await client.from("companies")
    .select("id")
    .eq("trustmrrSlug", trustmrrSlug)
    .limit(1)
    .maybeSingle();
  if (sourceError) throw sourceError;

  let existing = bySource;
  if (!existing) {
    const { data: byCaseInsensitiveSource, error: caseInsensitiveError } = await client.from("companies")
      .select("id")
      .ilike("trustmrrSlug", trustmrrSlug)
      .limit(1)
      .maybeSingle();
    if (caseInsensitiveError) throw caseInsensitiveError;
    existing = byCaseInsensitiveSource;
  }

  if (existing && options.skipExisting) return "skipped";

  const countryCode = startup.country?.trim().toUpperCase() || null;
  let countryId: string | null = null;
  if (countryCode && /^[A-Z]{2}$/.test(countryCode)) {
    const { data, error } = await client.from("countries")
      .upsert({ code: countryCode, name: countryNames[countryCode] ?? countryCode }, { onConflict: "code" })
      .select("id").single();
    if (error) throw error;
    countryId = String(data.id);
  }

  const category = startup.category?.trim().toLowerCase() || null;
  let industryId: string | null = null;
  if (category) {
    const slug = safeSlug(category);
    const { data, error } = await client.from("industries")
      .upsert({ slug, name: displayName(category) }, { onConflict: "slug" })
      .select("id").single();
    if (error) throw error;
    industryId = String(data.id);
  }

  if (!existing) {
    const { data: bySlug, error: slugError } = await client.from("companies")
      .select("id").eq("slug", safeSlug(startup.slug)).maybeSingle();
    if (slugError) throw slugError;
    existing = bySlug;
  }

  const companyData = {
    name: startup.name.trim(),
    description: startup.description?.trim() || null,
    websiteUrl: startup.website?.trim() || null,
    logoUrl: startup.icon?.trim() || null,
    foundedYear: startup.foundedDate ? new Date(startup.foundedDate).getUTCFullYear() || null : null,
    trustmrrSlug,
    countryId,
    industryId,
    updatedAt: now,
  };

  let companyId: string;
  if (existing) {
    const { data, error } = await client.from("companies").update(companyData).eq("id", String(existing.id)).select("id").single();
    if (error) throw error;
    companyId = String(data.id);
  } else {
    const slug = await uniqueSlug(client, startup.slug, trustmrrSlug);
    const { data, error } = await client.from("companies").insert({ ...companyData, slug }).select("id").single();
    if (error) {
      // A second importer can pass the existence check before the first one
      // commits. The database unique index remains the final protection.
      if (error.code !== "23505") throw error;
      const { data: racedCompany, error: raceLookupError } = await client.from("companies")
        .select("id")
        .eq("trustmrrSlug", trustmrrSlug)
        .maybeSingle();
      if (raceLookupError || !racedCompany) throw error;
      if (options.skipExisting) return "skipped";
      companyId = String(racedCompany.id);
    } else {
      companyId = String(data.id);
    }
  }

  const profile = {
    companyId,
    paymentProvider: startup.paymentProvider,
    targetAudience: startup.targetAudience,
    teamSize: "startupInsights" in startup ? startup.startupInsights?.teamSize ?? null : null,
    fundingStatus: "startupInsights" in startup ? startup.startupInsights?.fundingStatus ?? null : null,
    revenueLast30DaysCents: integerString(startup.revenue?.last30Days),
    revenueMrrCents: integerString(startup.revenue?.mrr),
    revenueTotalCents: integerString(startup.revenue?.total),
    customers: startup.customers,
    activeSubscriptions: startup.activeSubscriptions,
    askingPriceCents: integerString(startup.askingPrice),
    profitMarginLast30Days: decimal(startup.profitMarginLast30Days),
    growth30d: decimal(startup.growth30d),
    growthMrr30d: decimal(startup.growthMRR30d),
    multiple: decimal(startup.multiple),
    rank: startup.rank,
    visitorsLast30Days: startup.visitorsLast30Days,
    googleSearchImpressionsLast30Days: integerString(startup.googleSearchImpressionsLast30Days),
    revenuePerVisitor: decimal(startup.revenuePerVisitor),
    onSale: startup.onSale,
    firstListedForSaleAt: asDate(startup.firstListedForSaleAt),
    xHandle: startup.xHandle,
    xFollowerCount: "xFollowerCount" in startup ? integerString(startup.xFollowerCount) : null,
    isMerchantOfRecord: "isMerchantOfRecord" in startup ? startup.isMerchantOfRecord : null,
    domainRating: "domainRating" in startup ? decimal(startup.domainRating) : null,
    founderMessage: "founderMessage" in startup ? startup.founderMessage : null,
    insightValueProposition: "startupInsights" in startup ? startup.startupInsights?.valueProposition ?? null : null,
    insightProblemSolved: "startupInsights" in startup ? startup.startupInsights?.problemSolved ?? null : null,
    insightPricingModel: "startupInsights" in startup ? startup.startupInsights?.pricingModel ?? null : null,
    insightTargetPersona: "startupInsights" in startup ? startup.startupInsights?.targetPersona ?? null : null,
    insightBusinessType: "startupInsights" in startup ? startup.startupInsights?.businessType ?? null : null,
    insightTeamSize: "startupInsights" in startup ? startup.startupInsights?.teamSize ?? null : null,
    insightFundingStatus: "startupInsights" in startup ? startup.startupInsights?.fundingStatus ?? null : null,
    insightEstimatedUserCount: "startupInsights" in startup ? startup.startupInsights?.estimatedUserCount ?? null : null,
    trustmrrUrl: "url" in startup ? startup.url : null,
    markdownUrl: "markdownUrl" in startup ? startup.markdownUrl : null,
    previousAskingPriceCents: "previousAskingPrice" in startup ? integerString(startup.previousAskingPrice) : null,
    listingTier: "listingTier" in startup ? startup.listingTier : null,
    listingTierBgColor: "listingTierBgColor" in startup ? startup.listingTierBgColor : null,
    listingTierBgColorDark: "listingTierBgColorDark" in startup ? startup.listingTierBgColorDark : null,
    brandingPrimaryColor: "brandingPrimaryColor" in startup ? startup.brandingPrimaryColor : null,
    brandingSecondaryColor: "brandingSecondaryColor" in startup ? startup.brandingSecondaryColor : null,
    pageviewCount: "pageviewCount" in startup ? startup.pageviewCount : null,
    offerCount: "offerCount" in startup ? startup.offerCount : null,
    stealthMode: "stealthMode" in startup ? startup.stealthMode : null,
    isMobileApp: "isMobileApp" in startup ? startup.isMobileApp : null,
    xFounderName: "xFounderName" in startup ? startup.xFounderName : null,
    xProfilePicture: "xProfilePicture" in startup ? startup.xProfilePicture : null,
    sourceUpdatedAt: now,
    updatedAt: now,
  };

  const { error: profileError } = await client.from("trustmrr_profiles")
    .upsert(profile, { onConflict: "companyId" });
  if (profileError) throw profileError;

  if ("techStack" in startup) {
    const detail = startup as TrustMrrDetail;
    const techStack = normalizeTagItems(detail.techStack);
    const marketingChannels = normalizeTagItems(detail.marketingChannels);
    const cofounders = normalizeCofounders(detail.cofounders);
    const { error: techDeleteError } = await client.from("trustmrr_tech_stack").delete().eq("companyId", companyId);
    if (techDeleteError) throw techDeleteError;
    if (techStack.length) {
      const { error } = await client.from("trustmrr_tech_stack").insert(techStack.map((item) => ({
        companyId, slug: item.slug, category: item.category,
      })));
      if (error) throw error;
    }

    const { error: marketingDeleteError } = await client.from("trustmrr_marketing_channels").delete().eq("companyId", companyId);
    if (marketingDeleteError) throw marketingDeleteError;
    if (marketingChannels.length) {
      const { error } = await client.from("trustmrr_marketing_channels").insert(marketingChannels.map((item) => ({
        companyId, slug: item.slug, category: item.category,
      })));
      if (error) throw error;
    }

    const { error: cofounderDeleteError } = await client.from("trustmrr_cofounders").delete().eq("companyId", companyId);
    if (cofounderDeleteError) throw cofounderDeleteError;
    if (cofounders.length) {
      const { error } = await client.from("trustmrr_cofounders").insert(cofounders.map((item) => ({
        companyId, xHandle: item.xHandle, xName: item.xName,
      })));
      if (error) throw error;
    }
  }
  return existing ? "updated" : "created";
}

export async function importTrustMrrDetail(slug: string) {
  const apiKey = process.env.TRUSTMRR_API_KEY?.trim();
  if (!apiKey) throw new Error("TRUSTMRR_API_KEY is not configured");
  const detail = await fetchDetail(apiKey, slug);
  const operation = await importStartup(detail);
  return { slug: detail.slug, name: detail.name, operation, techStack: normalizeTagItems(detail.techStack).length, marketingChannels: normalizeTagItems(detail.marketingChannels).length, cofounders: normalizeCofounders(detail.cofounders).length };
}

export async function importTrustMrr(options: TrustMrrImportOptions = {}) {
  const apiKey = process.env.TRUSTMRR_API_KEY?.trim();
  if (!apiKey) throw new Error("TRUSTMRR_API_KEY is not configured");

  const maxPages = Math.min(Math.max(options.maxPages ?? 1, 1), 100);
  let page = Math.max(options.startPage ?? 1, 1);
  let hasMore = true;
  let pagesProcessed = 0;
  let fetched = 0;
  let created = 0;
  let updated = 0;
  let skipped = 0;
  let apiTotal = 0;
  let apiPage = page;
  let apiLimit = PAGE_SIZE;

  while (hasMore && pagesProcessed < maxPages) {
    const result = await fetchPage(apiKey, options, page);
    apiTotal = result.meta.total;
    apiPage = result.meta.page;
    apiLimit = result.meta.limit;
    const seen = new Set<string>();
    for (const startup of result.data) {
      const key = sourceSlug(startup.slug);
      if (seen.has(key)) {
        skipped += 1;
        continue;
      }
      seen.add(key);

      const operation = await importStartup(startup, { skipExisting: true });
      fetched += 1;
      if (operation === "created") created += 1;
      else if (operation === "updated") updated += 1;
      else skipped += 1;
    }
    hasMore = result.meta.hasMore;
    pagesProcessed += 1;
    page += 1;
  }

  return { fetched, created, updated, skipped, pages: pagesProcessed, hasMore, apiTotal, apiPage, apiLimit };
}

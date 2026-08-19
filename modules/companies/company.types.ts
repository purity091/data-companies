export type CompanyCreateInput = {
  name: string;
  slug?: string;
  legalName?: string | null;
  description?: string | null;
  websiteUrl?: string | null;
  logoUrl?: string | null;
  foundedYear?: number | null;
  trustmrrSlug?: string | null;
  countryId?: bigint | null;
  industryId?: bigint | null;
};

export type CompanyUpdateInput = Partial<CompanyCreateInput>;

export type CompanyListInput = {
  limit: number;
  cursor?: { createdAt: string; id: string };
  query?: string;
  countryId?: bigint;
  industryId?: bigint;
};

export type CompanyListRecord = {
  id: bigint;
  slug: string;
  name: string;
  legalName: string | null;
  description: string | null;
  websiteUrl: string | null;
  logoUrl?: string | null;
  foundedYear: number | null;
  trustmrrSlug?: string | null;
  createdAt: Date;
  updatedAt: Date;
  country: { id: bigint; code: string; name: string } | null;
  industry: { id: bigint; slug: string; name: string } | null;
  trustmrr: TrustMrrSummary | null;
};

export type TrustMrrSummary = {
  paymentProvider: string | null;
  revenueLast30DaysCents: string | number | null;
  revenueMrrCents: string | number | null;
  revenueTotalCents: string | number | null;
  customers: number | null;
  activeSubscriptions: number | null;
  askingPriceCents: string | number | null;
  growth30d: string | number | null;
  growthMrr30d: string | number | null;
  multiple: string | number | null;
  rank: number | null;
  onSale: boolean | null;
  sourceUpdatedAt: string | Date | null;
  updatedAt: string | Date | null;
};

export type CompanyRecord = CompanyListRecord & {
  llmEnrichment?: Record<string, unknown> | null;
  products?: Array<Record<string, unknown>>;
  competitors?: Array<Record<string, unknown>>;
  relatedParties?: Array<Record<string, unknown>>;
  sources?: Array<Record<string, unknown>>;
  people: Array<{
    id: bigint;
    fullName: string;
    jobTitle: string | null;
    linkedinUrl: string | null;
    companyId: bigint | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
  markets: Array<{ companyId: bigint; marketId: bigint; market: { id: bigint; slug: string; name: string } }>;
  investors: Array<{
    companyId: bigint;
    investorId: bigint;
    investedAt: Date | null;
    investor: { id: bigint; slug: string; name: string; websiteUrl: string | null };
  }>;
};

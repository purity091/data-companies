import { z } from "zod";

const nullableText = (max: number) => z.string().trim().max(max).nullable().optional();
const nullableTextOrList = (max: number) => z.preprocess(
  (value) => Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).join("\n")
    : value,
  z.string().trim().max(max).nullable().optional(),
);
const nullableTextOrStructured = (max: number) => z.preprocess(
  (value) => {
    let normalized: unknown = value;
    if (Array.isArray(value)) {
      normalized = value.map((item) => typeof item === "string" ? item : JSON.stringify(item)).filter(Boolean).join("\n");
    } else if (value && typeof value === "object") {
      normalized = Object.entries(value as Record<string, unknown>)
        .map(([key, item]) => `${key}: ${typeof item === "string" ? item : JSON.stringify(item)}`)
        .join("\n");
    }
    return typeof normalized === "string" ? normalized.trim().slice(0, max) : normalized;
  },
  z.string().trim().max(max).nullable().optional(),
);
const optionalUrl = z.preprocess((value) => {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    return new URL(value.trim()).toString();
  } catch {
    return null;
  }
}, z.string().url().max(2048).nullable().optional());

const optionalIsoDatetime = z.preprocess((value) => {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Date.parse(value.trim());
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}, z.string().datetime({ offset: true }).nullable().optional());

const optionalIsoDate = z.preprocess((value) => {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Date.parse(value.trim());
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString().slice(0, 10);
}, z.string().date().nullable().optional());

const optionalConfidence = z.preprocess((value) => {
  if (typeof value === "number") return value;
  if (typeof value !== "string" || !value.trim()) return null;

  const raw = value.trim().replace(/,/g, "");
  const isPercent = raw.endsWith("%");
  const parsed = Number.parseFloat(raw.replace(/%$/, ""));
  if (!Number.isFinite(parsed)) return null;

  const normalized = isPercent || parsed > 1 ? parsed / 100 : parsed;
  return normalized >= 0 && normalized <= 1 ? normalized : null;
}, z.number().min(0).max(1).nullable().optional());

const optionalNonNegativeInteger = z.preprocess((value) => {
  if (typeof value === "number") return Number.isInteger(value) && value >= 0 ? value : null;
  if (typeof value !== "string" || !value.trim()) return null;

  const normalized = value.trim().replace(/,/g, "");
  const match = normalized.match(/^(\d+)\+?$/);
  return match ? Number(match[1]) : null;
}, z.number().int().min(0).nullable().optional());

const normalizedSourceType = z.preprocess((value) => {
  if (typeof value !== "string" || !value.trim()) return "other";
  const sourceType = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  const aliases: Record<string, string> = {
    official_website: "official",
    company_website: "official",
    website: "official",
    company: "official",
    government_site: "government",
    public_registry: "registry",
    corporate_registry: "registry",
    article: "news",
    media: "news",
    blog: "news",
    social_media: "social",
    linkedin: "social",
    twitter: "social",
    x: "social",
    database: "directory",
    directory_listing: "directory",
  };
  return aliases[sourceType] ?? ["official", "government", "registry", "news", "social", "directory", "other"].includes(sourceType)
    ? aliases[sourceType] ?? sourceType
    : "other";
}, z.enum(["official", "government", "registry", "news", "social", "directory", "other"]).default("other"));

export const enrichmentSourceSchema = z.object({
  title: nullableText(255),
  url: optionalUrl,
  publisher: nullableText(255),
  sourceType: normalizedSourceType,
  accessedAt: optionalIsoDatetime,
  evidence: nullableText(4000),
});

const enrichmentPersonObjectSchema = z.object({
  fullName: z.string().trim().min(1).max(255),
  jobTitle: nullableText(255),
  linkedinUrl: nullableText(2048),
  xHandle: nullableText(100),
  isFounder: z.boolean().default(false),
  sourceUrls: z.array(optionalUrl).max(20).default([]).transform((urls) => urls.filter((url): url is string => Boolean(url))),
});

const normalizePerson = (value: unknown) => {
  if (typeof value === "string") return { fullName: value };
  if (!value || typeof value !== "object") return value;

  const person = value as Record<string, unknown>;
  if (typeof person.fullName === "string" && person.fullName.trim()) return person;

  const alternativeName = person.name ?? person.full_name ?? person.personName;
  if (typeof alternativeName === "string" && alternativeName.trim()) {
    return { ...person, fullName: alternativeName };
  }

  const firstName = typeof person.firstName === "string" ? person.firstName.trim() : "";
  const lastName = typeof person.lastName === "string" ? person.lastName.trim() : "";
  if (firstName || lastName) return { ...person, fullName: `${firstName} ${lastName}`.trim() };

  return person;
};

export const enrichmentPersonSchema = z.preprocess(normalizePerson, enrichmentPersonObjectSchema);

export const enrichmentInvestorSchema = z.object({
  name: z.string().trim().min(1).max(255),
  slug: nullableText(180),
  websiteUrl: nullableText(2048),
  stage: nullableText(80),
  sourceUrls: z.array(z.string().url().max(2048)).max(20).default([]),
});

export const enrichmentProductSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: nullableText(4000),
  url: nullableText(2048),
});

const enrichmentRelatedPartyObjectSchema = z.object({
  name: z.string().trim().min(1).max(255),
  partyType: nullableText(80),
  relationship: nullableText(120),
  websiteUrl: nullableText(2048),
  sourceUrls: z.array(optionalUrl).max(20).default([]).transform((urls) => urls.filter((url): url is string => Boolean(url))),
});

export const enrichmentRelatedPartySchema = z.preprocess(
  (value) => typeof value === "string" ? { name: value } : value,
  enrichmentRelatedPartyObjectSchema,
);

const enrichmentCompetitorObjectSchema = z.object({
  name: z.string().trim().min(1).max(255),
  websiteUrl: nullableText(2048),
  relationship: nullableText(80),
});

export const enrichmentCompetitorSchema = z.preprocess(
  (value) => typeof value === "string" ? { name: value } : value,
  enrichmentCompetitorObjectSchema,
);

export const identityInstructionSchema = z.object({
  instructionId: z.literal("identity_profile"),
  companyKey: z.string().trim().min(1).max(180),
  name: nullableText(255),
  legalName: nullableText(255),
  description: nullableText(65535),
  websiteUrl: nullableText(2048),
  countryName: nullableText(255),
  industryName: nullableText(255),
  foundedYear: z.number().int().min(1000).max(2200).nullable().optional(),
  companyType: nullableText(100),
  headquarters: nullableText(255),
  employeeCount: optionalNonNegativeInteger,
  techStack: z.array(z.string().trim().min(1).max(255)).max(200).optional(),
  marketingChannels: z.array(z.string().trim().min(1).max(255)).max(200).optional(),
  sources: z.array(enrichmentSourceSchema).max(100).optional(),
});

export const businessInstructionSchema = z.object({
  instructionId: z.literal("business_market"),
  companyKey: z.string().trim().min(1).max(180),
  businessModel: nullableText(4000),
  valueProposition: nullableText(4000),
  targetCustomers: nullableTextOrList(2000),
  pricingModel: nullableTextOrStructured(2000),
  relationshipsSummary: nullableText(4000),
  products: z.array(enrichmentProductSchema).max(100).optional(),
  markets: z.array(z.string().trim().min(1).max(255)).max(100).optional(),
  competitors: z.array(enrichmentCompetitorSchema).max(100).optional(),
  relatedParties: z.array(enrichmentRelatedPartySchema).max(100).optional(),
  sources: z.array(enrichmentSourceSchema).max(100).optional(),
});

export const peopleFinanceInstructionSchema = z.object({
  instructionId: z.literal("people_finance"),
  companyKey: z.string().trim().min(1).max(180),
  people: z.array(enrichmentPersonSchema).max(100).optional(),
  investors: z.array(enrichmentInvestorSchema).max(100).optional(),
  fundingStage: nullableText(100),
  totalFundingUsd: z.number().nonnegative().nullable().optional(),
  lastFundingDate: optionalIsoDate,
  revenueRange: nullableText(100),
  businessStatus: nullableText(100),
  sources: z.array(enrichmentSourceSchema).max(100).optional(),
});

export const evidenceInstructionSchema = z.object({
  instructionId: z.literal("evidence_risks"),
  companyKey: z.string().trim().min(1).max(180),
  strategicDomain: nullableText(255),
  reachScope: nullableTextOrStructured(10000),
  audienceSegments: z.array(z.string().trim().min(1).max(500)).max(100).optional(),
  strategicAnalysis: nullableText(10000),
  growthSignals: nullableTextOrStructured(10000),
  expansionPlan: nullableText(10000),
  swot: z.object({
    strengths: z.array(z.string().trim().min(1).max(1000)).max(50).optional(),
    weaknesses: z.array(z.string().trim().min(1).max(1000)).max(50).optional(),
    opportunities: z.array(z.string().trim().min(1).max(1000)).max(50).optional(),
    threats: z.array(z.string().trim().min(1).max(1000)).max(50).optional(),
  }).optional(),
  evidenceSummary: nullableText(10000),
  confidence: optionalConfidence,
  dataGaps: z.array(z.string().trim().min(1).max(1000)).max(100).optional(),
  risks: z.array(z.string().trim().min(1).max(1000)).max(100).optional(),
  lastVerifiedAt: optionalIsoDate,
  sources: z.array(enrichmentSourceSchema).max(100).optional(),
});

export const llmEnrichmentBundleSchema = z.object({
  identity: identityInstructionSchema.optional(),
  business: businessInstructionSchema.optional(),
  peopleFinance: peopleFinanceInstructionSchema.optional(),
  evidence: evidenceInstructionSchema.optional(),
});

export type LlmEnrichmentBundle = z.infer<typeof llmEnrichmentBundleSchema>;
export type EnrichmentSource = z.infer<typeof enrichmentSourceSchema>;

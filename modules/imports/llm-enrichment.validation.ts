import { z } from "zod";

function normalizeDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - "٠".charCodeAt(0)))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - "۰".charCodeAt(0)));
}

function stringifyValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const items = value.map(stringifyValue).filter((item): item is string => Boolean(item));
    return items.length ? items.join("\n") : null;
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return null;
    }
  }
  return null;
}

const nullableText = (max: number) => z.preprocess(
  (value) => stringifyValue(value),
  z.string().trim().max(max).nullable().optional(),
);

const nullableTextOrList = (max: number) => z.preprocess(
  (value) => Array.isArray(value)
    ? value.map(stringifyValue).filter((item): item is string => Boolean(item)).join("\n") || null
    : stringifyValue(value),
  z.string().trim().max(max).nullable().optional(),
);

const nullableTextOrStructured = (max: number) => z.preprocess(
  (value) => {
    if (Array.isArray(value)) return value.map(stringifyValue).filter((item): item is string => Boolean(item)).join("\n") || null;
    return stringifyValue(value);
  },
  z.string().trim().max(max).nullable().optional(),
);

const optionalUrl = z.preprocess((value) => {
  const raw = stringifyValue(value);
  if (!raw) return null;
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).toString();
  } catch {
    return null;
  }
}, z.string().url().max(2048).nullable().optional());

const optionalIsoDatetime = z.preprocess((value) => {
  const raw = stringifyValue(value);
  if (!raw) return null;
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}, z.string().datetime({ offset: true }).nullable().optional());

const optionalIsoDate = z.preprocess((value) => {
  const raw = stringifyValue(value);
  if (!raw) return null;
  const isoMatch = normalizeDigits(raw).match(/\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  if (isoMatch) {
    const candidate = `${isoMatch[1]}-${isoMatch[2].padStart(2, "0")}-${isoMatch[3].padStart(2, "0")}`;
    if (!Number.isNaN(Date.parse(candidate))) return candidate;
  }
  const parsed = Date.parse(normalizeDigits(raw));
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString().slice(0, 10);
}, z.string().date().nullable().optional());

const optionalConfidence = z.preprocess((value) => {
  const rawValue = stringifyValue(value);
  if (!rawValue) return null;
  const raw = normalizeDigits(rawValue).trim().replace(/,/g, "");
  const isPercent = raw.endsWith("%");
  const parsed = Number.parseFloat(raw.replace(/%$/, ""));
  if (!Number.isFinite(parsed)) return null;
  const normalized = isPercent || parsed > 1 ? parsed / 100 : parsed;
  return normalized >= 0 && normalized <= 1 ? normalized : null;
}, z.number().min(0).max(1).nullable().optional());

const optionalNonNegativeInteger = z.preprocess((value) => {
  const rawValue = stringifyValue(value);
  if (!rawValue) return null;
  const normalized = normalizeDigits(rawValue).trim().replace(/,/g, "");
  const match = normalized.match(/^(\d+)(?:\+|\s*موظف.*)?$/i);
  return match ? Number(match[1]) : null;
}, z.number().int().min(0).nullable().optional());

const optionalNumber = z.preprocess((value) => {
  const rawValue = stringifyValue(value);
  if (!rawValue) return null;
  const raw = normalizeDigits(rawValue).replace(/,/g, "").replace(/[$€£]/g, "").trim().toLowerCase();
  const multiplier = raw.endsWith("b") ? 1_000_000_000 : raw.endsWith("m") ? 1_000_000 : raw.endsWith("k") ? 1_000 : 1;
  const parsed = Number.parseFloat(raw.replace(/[a-z]+$/i, "").replace(/(?:ر\.س|ريال|دولار|usd|sar)$/i, "").trim());
  return Number.isFinite(parsed) && parsed >= 0 ? parsed * multiplier : null;
}, z.number().nonnegative().nullable().optional());

const optionalBoolean = z.preprocess((value) => {
  if (typeof value === "boolean") return value;
  const raw = stringifyValue(value)?.toLowerCase();
  if (["true", "1", "yes", "نعم", "نعم founder"].includes(raw || "")) return true;
  if (["false", "0", "no", "لا"].includes(raw || "")) return false;
  return false;
}, z.boolean().default(false));

const normalizedSourceType = z.preprocess((value) => {
  const raw = stringifyValue(value);
  if (!raw) return "other";
  const sourceType = raw.toLowerCase().replace(/[\s-]+/g, "_");
  const aliases: Record<string, string> = {
    official_website: "official", company_website: "official", website: "official", company: "official",
    government_site: "government", public_registry: "registry", corporate_registry: "registry",
    article: "news", media: "news", blog: "news", social_media: "social", linkedin: "social",
    twitter: "social", x: "social", database: "directory", directory_listing: "directory",
    "رسمي": "official", "حكومي": "government", "سجل تجاري": "registry", "أخبار": "news",
    "تواصل اجتماعي": "social", "دليل": "directory",
  };
  const normalized = aliases[sourceType] ?? sourceType;
  return ["official", "government", "registry", "news", "social", "directory", "other"].includes(normalized)
    ? normalized
    : "other";
}, z.enum(["official", "government", "registry", "news", "social", "directory", "other"]).default("other"));

const tolerantArray = <T extends z.ZodTypeAny>(itemSchema: T, max: number) => z.preprocess(
  (value) => {
    if (value === null || value === undefined || value === "") return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return value.split(/[\n,،؛]+/).map((item) => item.trim()).filter(Boolean);
    return [value];
  },
  z.array(itemSchema.nullable().catch(null)).max(max).transform((items) => items.filter((item): item is z.output<T> => item !== null)),
);

const tolerantStringList = (maxItems: number, maxLength: number) => tolerantArray(
  z.preprocess((value) => stringifyValue(value), z.string().trim().min(1).max(maxLength)),
  maxItems,
);

const urlList = (max: number) => tolerantArray(optionalUrl, max).transform((urls) => urls.filter((url): url is string => Boolean(url)));

const companyKeySchema = z.preprocess((value) => stringifyValue(value), z.string().trim().min(1).max(180));

export const enrichmentSourceSchema = z.object({
  title: nullableText(255),
  url: optionalUrl,
  publisher: nullableText(255),
  sourceType: normalizedSourceType,
  accessedAt: optionalIsoDatetime,
  evidence: nullableText(4000),
});

const enrichmentPersonObjectSchema = z.object({
  fullName: z.preprocess((value) => stringifyValue(value), z.string().trim().min(1).max(255)),
  jobTitle: nullableText(255),
  linkedinUrl: nullableText(2048),
  xHandle: nullableText(100),
  isFounder: optionalBoolean,
  sourceUrls: urlList(20),
});

const normalizePerson = (value: unknown) => {
  if (typeof value === "string") return { fullName: value };
  if (!value || typeof value !== "object") return value;
  const person = value as Record<string, unknown>;
  if (typeof person.fullName === "string" && person.fullName.trim()) return person;
  const alternativeName = person.name ?? person.full_name ?? person.personName ?? person["الاسم"];
  if (typeof alternativeName === "string" && alternativeName.trim()) return { ...person, fullName: alternativeName };
  const firstName = stringifyValue(person.firstName) ?? "";
  const lastName = stringifyValue(person.lastName) ?? "";
  if (firstName || lastName) return { ...person, fullName: `${firstName} ${lastName}`.trim() };
  return person;
};

export const enrichmentPersonSchema = z.preprocess(normalizePerson, enrichmentPersonObjectSchema);

export const enrichmentInvestorSchema = z.object({
  name: z.preprocess((value) => stringifyValue(value), z.string().trim().min(1).max(255)),
  slug: nullableText(180),
  websiteUrl: nullableText(2048),
  stage: nullableText(80),
  sourceUrls: urlList(20),
});

export const enrichmentProductSchema = z.object({
  name: z.preprocess((value) => stringifyValue(value), z.string().trim().min(1).max(255)),
  description: nullableText(4000),
  url: nullableText(2048),
});

const enrichmentRelatedPartyObjectSchema = z.object({
  name: z.preprocess((value) => stringifyValue(value), z.string().trim().min(1).max(255)),
  partyType: nullableText(80),
  relationship: nullableText(120),
  websiteUrl: nullableText(2048),
  sourceUrls: urlList(20),
});

export const enrichmentRelatedPartySchema = z.preprocess(
  (value) => typeof value === "string" ? { name: value } : value,
  enrichmentRelatedPartyObjectSchema,
);

const enrichmentCompetitorObjectSchema = z.object({
  name: z.preprocess((value) => stringifyValue(value), z.string().trim().min(1).max(255)),
  websiteUrl: nullableText(2048),
  relationship: nullableText(80),
});

export const enrichmentCompetitorSchema = z.preprocess(
  (value) => typeof value === "string" ? { name: value } : value,
  enrichmentCompetitorObjectSchema,
);

const sourcesList = tolerantArray(enrichmentSourceSchema, 100);

export const identityInstructionSchema = z.object({
  instructionId: z.literal("identity_profile"),
  companyKey: companyKeySchema,
  name: nullableText(255),
  legalName: nullableText(255),
  description: nullableText(65535),
  websiteUrl: nullableText(2048),
  countryName: nullableText(255),
  industryName: nullableText(255),
  foundedYear: optionalNonNegativeInteger,
  companyType: nullableText(100),
  headquarters: nullableText(255),
  employeeCount: optionalNonNegativeInteger,
  techStack: tolerantStringList(200, 255),
  marketingChannels: tolerantStringList(200, 255),
  sources: sourcesList,
});

export const businessInstructionSchema = z.object({
  instructionId: z.literal("business_market"),
  companyKey: companyKeySchema,
  businessModel: nullableText(4000),
  valueProposition: nullableText(4000),
  targetCustomers: nullableTextOrList(2000),
  pricingModel: nullableTextOrStructured(2000),
  relationshipsSummary: nullableText(4000),
  products: tolerantArray(enrichmentProductSchema, 100),
  markets: tolerantStringList(100, 255),
  competitors: tolerantArray(enrichmentCompetitorSchema, 100),
  relatedParties: tolerantArray(enrichmentRelatedPartySchema, 100),
  sources: sourcesList,
});

export const peopleFinanceInstructionSchema = z.object({
  instructionId: z.literal("people_finance"),
  companyKey: companyKeySchema,
  people: tolerantArray(enrichmentPersonSchema, 100),
  investors: tolerantArray(enrichmentInvestorSchema, 100),
  fundingStage: nullableText(100),
  totalFundingUsd: optionalNumber,
  lastFundingDate: optionalIsoDate,
  revenueRange: nullableText(100),
  businessStatus: nullableText(100),
  sources: sourcesList,
});

export const evidenceInstructionSchema = z.object({
  instructionId: z.literal("evidence_risks"),
  companyKey: companyKeySchema,
  strategicDomain: nullableText(255),
  reachScope: nullableTextOrStructured(10000),
  audienceSegments: tolerantStringList(100, 500),
  strategicAnalysis: nullableText(10000),
  growthSignals: nullableTextOrStructured(10000),
  expansionPlan: nullableText(10000),
  swot: z.object({
    strengths: tolerantStringList(50, 1000),
    weaknesses: tolerantStringList(50, 1000),
    opportunities: tolerantStringList(50, 1000),
    threats: tolerantStringList(50, 1000),
  }).optional(),
  evidenceSummary: nullableText(10000),
  confidence: optionalConfidence,
  dataGaps: tolerantStringList(100, 1000),
  risks: tolerantStringList(100, 1000),
  lastVerifiedAt: optionalIsoDate,
  sources: sourcesList,
});

export const llmEnrichmentBundleSchema = z.object({
  identity: identityInstructionSchema.optional(),
  business: businessInstructionSchema.optional(),
  peopleFinance: peopleFinanceInstructionSchema.optional(),
  evidence: evidenceInstructionSchema.optional(),
});

export type LlmEnrichmentBundle = z.infer<typeof llmEnrichmentBundleSchema>;
export type EnrichmentSource = z.infer<typeof enrichmentSourceSchema>;

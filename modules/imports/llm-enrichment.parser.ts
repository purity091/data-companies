import { mergeEnrichmentIntoCompany } from "./llm-enrichment.merge";
import type { LlmCompany } from "./llm-import.validation";
import {
  businessInstructionSchema,
  evidenceInstructionSchema,
  identityInstructionSchema,
  llmEnrichmentBundleSchema,
  peopleFinanceInstructionSchema,
  type LlmEnrichmentBundle,
} from "./llm-enrichment.validation";

export type EnrichmentPartKey = "identity" | "business" | "peopleFinance" | "evidence";
export type EnrichmentParseIssue = { severity: "error" | "warning"; field: string; message: string };

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function keySignature(key: string) {
  return key.toLowerCase().replace(/[\s_-]+/g, "");
}

const keyAliases: Record<string, string> = {
  instruction: "instructionId",
  instructionid: "instructionId",
  معرفالتعليمة: "instructionId",
  companykey: "companyKey",
  companyid: "companyKey",
  companyslug: "companyKey",
  مفتاحالشركة: "companyKey",
  معرفالشركة: "companyKey",
  "اسم الشركة": "name",
  اسمالشركة: "name",
  الاسم: "name",
  companyname: "name",
  legalname: "legalName",
  الاسمالقانوني: "legalName",
  الوصف: "description",
  نبذة: "description",
  الموقع: "websiteUrl",
  رابطالموقع: "websiteUrl",
  website: "websiteUrl",
  country: "countryName",
  الدولة: "countryName",
  industry: "industryName",
  sector: "industryName",
  القطاع: "industryName",
  founded: "foundedYear",
  foundedyear: "foundedYear",
  سنةالتأسيس: "foundedYear",
  headquarters: "headquarters",
  المقر: "headquarters",
  employees: "employeeCount",
  employeecount: "employeeCount",
  عددالموظفين: "employeeCount",
  techstack: "techStack",
  قنواتالتسويق: "marketingChannels",
  marketingchannels: "marketingChannels",
  الأشخاص: "people",
  الاشخاص: "people",
  people: "people",
  الفريق: "people",
  المستثمرون: "investors",
  المستثمرين: "investors",
  investors: "investors",
  الأسواق: "markets",
  الاسواق: "markets",
  markets: "markets",
  المصادر: "sources",
  المراجع: "sources",
  sources: "sources",
  المنتجات: "products",
  products: "products",
  المنافسون: "competitors",
  competitors: "competitors",
  الأطرافالمرتبطة: "relatedParties",
  الاطرافالمرتبطة: "relatedParties",
  relatedparties: "relatedParties",
  businessmodel: "businessModel",
  نموذجالعمل: "businessModel",
  القيمةالمقترحة: "valueProposition",
  valueproposition: "valueProposition",
  العملاءالمستهدفون: "targetCustomers",
  targetcustomers: "targetCustomers",
  نموذجالتسعير: "pricingModel",
  pricingmodel: "pricingModel",
  ملخصالعلاقات: "relationshipsSummary",
  relationshipsSummary: "relationshipsSummary",
  مرحلةالتمويل: "fundingStage",
  fundingstage: "fundingStage",
  إجماليالتمويل: "totalFundingUsd",
  اجماليالتمويل: "totalFundingUsd",
  totalfundingusd: "totalFundingUsd",
  آخرتمويل: "lastFundingDate",
  اخرتمويل: "lastFundingDate",
  lastfundingdate: "lastFundingDate",
  نطاقالإيرادات: "revenueRange",
  نطاقالايرادات: "revenueRange",
  revenuerange: "revenueRange",
  حالةالنشاط: "businessStatus",
  businessstatus: "businessStatus",
  المجالالاستراتيجي: "strategicDomain",
  strategicdomain: "strategicDomain",
  نطاقالوصول: "reachScope",
  reachscope: "reachScope",
  شرائحالجمهور: "audienceSegments",
  audiencesegments: "audienceSegments",
  التحليلالاستراتيجي: "strategicAnalysis",
  strategicanalysis: "strategicAnalysis",
  إشاراتالنمو: "growthSignals",
  اشاراتالنمو: "growthSignals",
  growthsignals: "growthSignals",
  خطةالتوسع: "expansionPlan",
  expansionplan: "expansionPlan",
  تحليلswot: "swot",
  swot: "swot",
  ملخصالأدلة: "evidenceSummary",
  evidencesummary: "evidenceSummary",
  الثقة: "confidence",
  confidence: "confidence",
  فجواتالبيانات: "dataGaps",
  datagaps: "dataGaps",
  المخاطر: "risks",
  risks: "risks",
  آخرتحقق: "lastVerifiedAt",
  "اخر تحقق": "lastVerifiedAt",
  lastverifiedat: "lastVerifiedAt",
  الاسمبالكامل: "fullName",
  full_name: "fullName",
  fullname: "fullName",
  المسمىالوظيفي: "jobTitle",
  jobtitle: "jobTitle",
  الموقعالإلكتروني: "websiteUrl",
  websiteurl: "websiteUrl",
  الرابط: "url",
  الرابطالمصدر: "url",
  الرابطالمستخدم: "url",
  url: "url",
};

function normalizeObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeObjectKeys);
  if (!isRecord(value)) return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => {
    const normalizedKey = keyAliases[keySignature(key)] ?? key;
    return [normalizedKey, normalizeObjectKeys(item)];
  }));
}

function unwrapObject(value: unknown): UnknownRecord | null {
  let current: unknown = value;

  // LLMs often wrap otherwise valid JSON in data/result/response, and some
  // return an array containing the requested object. Accept both forms before
  // validating the stage-specific fields.
  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) {
      current = current.find(isRecord);
      continue;
    }
    if (!isRecord(current)) return null;
    const record = current;
    const wrapper = ["data", "result", "response", "output", "enrichment"]
      .map((key) => record[key])
      .find((candidate) => isRecord(candidate) || Array.isArray(candidate));
    if (!wrapper) return current;
    current = wrapper;
  }

  return isRecord(current) ? current : null;
}

function extractPart(value: UnknownRecord, part: EnrichmentPartKey): UnknownRecord {
  const normalized = normalizeObjectKeys(value);
  if (!isRecord(normalized)) return value;

  const signatures: Record<EnrichmentPartKey, string[]> = {
    identity: ["identity", "identityprofile", "companyprofile"],
    business: ["business", "businessmarket", "businessmodel"],
    peopleFinance: ["peoplefinance", "people", "finance", "peopleandfinance"],
    evidence: ["evidence", "evidencerisks", "strategy", "strategic"],
  };

  for (const [key, candidate] of Object.entries(normalized)) {
    if (signatures[part].includes(keySignature(key))) {
      const unwrapped = unwrapObject(candidate);
      if (unwrapped) return unwrapped;
    }
  }

  // A few models return { stages: { identity: {...} } }.
  for (const key of ["stages", "sections", "parts"]) {
    const container = normalized[key];
    if (!isRecord(container)) continue;
    const candidate = Object.entries(container).find(([candidateKey]) => signatures[part].includes(keySignature(candidateKey)))?.[1];
    const unwrapped = candidate === undefined ? null : unwrapObject(candidate);
    if (unwrapped) return unwrapped;
  }

  // The expected format is already a flat stage object.
  return normalized;
}

function stripTrailingCommas(value: string) {
  return value.replace(/,\s*([}\]])/g, "$1");
}

function jsonCandidates(raw: string) {
  const cleaned = raw.replace(/^\uFEFF/, "").replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  const candidates = [cleaned];
  for (let start = 0; start < cleaned.length; start += 1) {
    if (cleaned[start] !== "{" && cleaned[start] !== "[") continue;
    const opening = cleaned[start];
    const closing = opening === "{" ? "}" : "]";
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let index = start; index < cleaned.length; index += 1) {
      const character = cleaned[index];
      if (inString) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (character === '"') inString = false;
        continue;
      }
      if (character === '"') {
        inString = true;
        continue;
      }
      if (character === opening) depth += 1;
      if (character === closing) depth -= 1;
      if (depth === 0) {
        candidates.push(cleaned.slice(start, index + 1));
        break;
      }
    }
  }
  return candidates.map(stripTrailingCommas);
}

function parseJson(raw: string): UnknownRecord | null {
  for (const candidate of jsonCandidates(raw)) {
    try {
      const parsed = unwrapObject(JSON.parse(candidate));
      if (parsed) return parsed;
    } catch {
      // Try another candidate. A response may contain a short explanation around the JSON.
    }
  }
  return null;
}

const schemas = {
  identity: identityInstructionSchema,
  business: businessInstructionSchema,
  peopleFinance: peopleFinanceInstructionSchema,
  evidence: evidenceInstructionSchema,
};

const instructionIds: Record<EnrichmentPartKey, string> = {
  identity: "identity_profile",
  business: "business_market",
  peopleFinance: "people_finance",
  evidence: "evidence_risks",
};

function issueMessage(issue: { path: PropertyKey[]; message: string }, severity: "error" | "warning"): EnrichmentParseIssue {
  return {
    severity,
    field: issue.path.map(String).join(".") || "content",
    message: issue.message,
  };
}

function compactIssues(issues: EnrichmentParseIssue[]) {
  const unique = [...new Map(issues.map((issue) => [`${issue.severity}:${issue.field}:${issue.message}`, issue])).values()];
  const maxVisible = 8;
  if (unique.length <= maxVisible) return unique;
  const hiddenCount = unique.length - maxVisible;
  return [
    ...unique.slice(0, maxVisible),
    { severity: "warning" as const, field: "summary", message: `تم تجميع ${hiddenCount} ملاحظات متشابهة لتسريع الإدخال. البيانات الصالحة محفوظة.` },
  ];
}

export function parseEnrichmentBundle(parts: Partial<Record<EnrichmentPartKey, string>>, fallback: Partial<LlmCompany> = {}) {
  const issues: EnrichmentParseIssue[] = [];
  const parsed: Partial<LlmEnrichmentBundle> = {};
  const fallbackCompanyKey = text(fallback.name);

  for (const key of Object.keys(schemas) as EnrichmentPartKey[]) {
    if (!parts[key]?.trim()) {
      issues.push({ severity: "warning", field: key, message: "هذه المرحلة غير مدخلة حاليًا، ويمكن إضافتها لاحقًا." });
      continue;
    }

    const parsedJson = parseJson(parts[key] as string);
    const raw = parsedJson ? extractPart(parsedJson, key) : null;
    if (!raw) {
      issues.push({ severity: "warning", field: key, message: "تعذر قراءة هذه المرحلة، لذلك تم تجاهلها مع الاحتفاظ ببقية البيانات." });
      continue;
    }

    const normalized = normalizeObjectKeys(raw) as UnknownRecord;
    const inferredCompanyKey = text(normalized.companyKey) ?? fallbackCompanyKey ?? text(normalized.name) ?? "unknown-company";
    const candidate = {
      ...normalized,
      instructionId: instructionIds[key],
      companyKey: inferredCompanyKey,
    };
    const schema = schemas[key];
    const result = schema.safeParse(candidate);

    if (result.success) {
      parsed[key] = result.data as never;
      continue;
    }

    // Field-level problems should not discard all other usable fields from a stage.
    const relaxedResult = schema.partial().safeParse(candidate);
    if (relaxedResult.success) {
      parsed[key] = relaxedResult.data as never;
      issues.push(...result.error.issues.map((issue) => issueMessage(issue, "warning")));
    } else {
      issues.push(...result.error.issues.map((issue) => issueMessage(issue, "warning")));
    }
  }

  const stages = Object.entries(parsed) as [EnrichmentPartKey, Record<string, unknown>][];
  const canonicalCompanyKey = fallbackCompanyKey
    ?? text(parsed.identity?.name)
    ?? stages.map(([, stage]) => text(stage.companyKey)).find(Boolean)
    ?? "unknown-company";

  for (const [key, stage] of stages) {
    if (text(stage.companyKey) !== canonicalCompanyKey) {
      issues.push({ severity: "warning", field: `${key}.companyKey`, message: "تم توحيد companyKey تلقائيًا ليتوافق مع بقية المراحل." });
      stage.companyKey = canonicalCompanyKey;
    }
  }

  const bundleResult = llmEnrichmentBundleSchema.safeParse(parsed);
  if (!bundleResult.success) {
    return {
      bundle: null,
      company: null,
      issues: compactIssues([...issues, ...bundleResult.error.issues.map((issue) => issueMessage(issue, "warning"))]),
    };
  }

  try {
    return { bundle: bundleResult.data, company: mergeEnrichmentIntoCompany(bundleResult.data, fallback), issues: compactIssues(issues) };
  } catch (error) {
    return {
      bundle: bundleResult.data,
      company: null,
      issues: compactIssues([...issues, { severity: "error" as const, field: "company", message: error instanceof Error ? error.message : "تعذر تجميع بيانات الشركة" }]),
    };
  }
}

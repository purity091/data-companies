import { z } from "zod";
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
  permanentidentifier: "companyKey",
  permanentid: "companyKey",
  مفتاحالشركة: "companyKey",
  معرفالشركة: "companyKey",
  "المعرّف الدائم": "companyKey",
  المعرّفالدائم: "companyKey",
  "اسم الشركة": "name",
  اسمالشركة: "name",
  الاسم: "name",
  companyname: "name",
  legalname: "legalName",
  الاسمالقانوني: "legalName",
  الوصف: "description",
  نبذة: "description",
  vision: "vision",
  الرؤية: "vision",
  اللمحةالتعريفية: "vision",
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
  businessmodel: "businessModel",
  نموذجالنشاط: "businessModel",
  نموذجالعمل: "businessModel",
  strategicdomain: "strategicDomain",
  المجالالاستراتيجي: "strategicDomain",
  reachscope: "reachScope",
  نطاقالوصول: "reachScope",
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
  currentmarkets: "currentMarkets",
  الأسواقالحالية: "currentMarkets",
  الاسواقالحالية: "currentMarkets",
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

function normalizeJsonQuotesAndFormatting(str: string): string {
  return str
    .replace(/^\uFEFF/, "")
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*/g, "$1")
    .trim();
}

function stripTrailingCommas(value: string) {
  return value.replace(/,\s*([}\]])/g, "$1");
}

function jsonCandidates(raw: string) {
  const normalized = normalizeJsonQuotesAndFormatting(raw);
  const candidates: string[] = [];

  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/gi;
  let match;
  while ((match = codeBlockRegex.exec(normalized)) !== null) {
    if (match[1]?.trim()) {
      candidates.push(match[1].trim());
    }
  }

  candidates.push(normalized);

  for (let start = 0; start < normalized.length; start += 1) {
    if (normalized[start] !== "{" && normalized[start] !== "[") continue;
    const opening = normalized[start];
    const closing = opening === "{" ? "}" : "]";
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let index = start; index < normalized.length; index += 1) {
      const character = normalized[index];
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
        candidates.push(normalized.slice(start, index + 1));
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
      try {
        const sanitizedCandidate = candidate.replace(/(:\s*"[\s\S]*?")/g, (m) => m.replace(/\n/g, "\\n"));
        const parsed = unwrapObject(JSON.parse(sanitizedCandidate));
        if (parsed) return parsed;
      } catch {
        // Try another candidate.
      }
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

function parsePersonBullet(itemText: string): UnknownRecord {
  const obj: UnknownRecord = {};
  if (itemText.includes("|")) {
    const parts = itemText.split("|").map((p) => p.trim());
    for (const part of parts) {
      const kv = part.match(/^([^:：]+)[:：]\s*(.*)$/);
      if (kv) {
        const k = keySignature(kv[1].trim());
        const v = kv[2].trim();
        if (k.includes("اسم") || k.includes("fullname") || k.includes("name")) obj.fullName = v;
        else if (k.includes("مسمى") || k.includes("منصب") || k.includes("وظي") || k.includes("title")) obj.jobTitle = v;
        else if (k.includes("مؤسس") || k.includes("founder")) obj.isFounder = ["نعم", "true", "1", "yes"].includes(v.toLowerCase());
        else if (k.includes("linkedin") || k.includes("لينك")) obj.linkedinUrl = v;
      }
    }
  } else {
    const kv = itemText.match(/^([^:：]+)[:：]\s*(.*)$/);
    if (kv) {
      obj.fullName = kv[1].trim();
      obj.jobTitle = kv[2].trim();
    } else {
      obj.fullName = itemText.trim();
    }
  }
  return obj;
}

function parseInvestorBullet(itemText: string): UnknownRecord {
  const obj: UnknownRecord = {};
  if (itemText.includes("|")) {
    const parts = itemText.split("|").map((p) => p.trim());
    for (const part of parts) {
      const kv = part.match(/^([^:：]+)[:：]\s*(.*)$/);
      if (kv) {
        const k = keySignature(kv[1].trim());
        const v = kv[2].trim();
        if (k.includes("مستثمر") || k.includes("اسم") || k.includes("name")) obj.name = v;
        else if (k.includes("مرحلة") || k.includes("stage")) obj.stage = v;
        else if (k.includes("موقع") || k.includes("رابط") || k.includes("url") || k.includes("website")) obj.websiteUrl = v;
      }
    }
  } else {
    const kv = itemText.match(/^([^:：]+)[:：]\s*(.*)$/);
    if (kv) {
      obj.name = kv[1].trim();
      if (/^https?:\/\//i.test(kv[2].trim())) obj.websiteUrl = kv[2].trim();
      else obj.stage = kv[2].trim();
    } else {
      obj.name = itemText.trim();
    }
  }
  return obj;
}

function parseProductBullet(itemText: string): UnknownRecord {
  const obj: UnknownRecord = {};
  if (itemText.includes("|")) {
    const parts = itemText.split("|").map((p) => p.trim());
    for (const part of parts) {
      const kv = part.match(/^([^:：]+)[:：]\s*(.*)$/);
      if (kv) {
        const k = keySignature(kv[1].trim());
        const v = kv[2].trim();
        if (k.includes("منتج") || k.includes("اسم") || k.includes("name")) obj.name = v;
        else if (k.includes("وصف") || k.includes("desc")) obj.description = v;
        else if (k.includes("رابط") || k.includes("موقع") || k.includes("url")) obj.url = v;
      }
    }
  } else {
    const kv = itemText.match(/^([^:：]+)[:：]\s*(.*)$/);
    if (kv) {
      obj.name = kv[1].trim();
      if (/^https?:\/\//i.test(kv[2].trim())) obj.url = kv[2].trim();
      else obj.description = kv[2].trim();
    } else {
      obj.name = itemText.trim();
    }
  }
  return obj;
}

function parseCompetitorBullet(itemText: string): UnknownRecord {
  const obj: UnknownRecord = {};
  if (itemText.includes("|")) {
    const parts = itemText.split("|").map((p) => p.trim());
    for (const part of parts) {
      const kv = part.match(/^([^:：]+)[:：]\s*(.*)$/);
      if (kv) {
        const k = keySignature(kv[1].trim());
        const v = kv[2].trim();
        if (k.includes("منافس") || k.includes("اسم") || k.includes("name")) obj.name = v;
        else if (k.includes("موقع") || k.includes("رابط") || k.includes("url") || k.includes("website")) obj.websiteUrl = v;
        else if (k.includes("علاقة") || k.includes("نوع") || k.includes("rel")) obj.relationship = v;
      }
    }
  } else {
    const kv = itemText.match(/^([^:：]+)[:：]\s*(.*)$/);
    if (kv) {
      obj.name = kv[1].trim();
      if (/^https?:\/\//i.test(kv[2].trim())) obj.websiteUrl = kv[2].trim();
      else obj.relationship = kv[2].trim();
    } else {
      obj.name = itemText.trim();
    }
  }
  return obj;
}

function parseRelatedPartyBullet(itemText: string): UnknownRecord {
  const obj: UnknownRecord = {};
  if (itemText.includes("|")) {
    const parts = itemText.split("|").map((p) => p.trim());
    for (const part of parts) {
      const kv = part.match(/^([^:：]+)[:：]\s*(.*)$/);
      if (kv) {
        const k = keySignature(kv[1].trim());
        const v = kv[2].trim();
        if (k.includes("اسم") || k.includes("party") || k.includes("name")) obj.name = v;
        else if (k.includes("نوع") || k.includes("type")) obj.partyType = v;
        else if (k.includes("علاقة") || k.includes("rel")) obj.relationship = v;
        else if (k.includes("موقع") || k.includes("رابط") || k.includes("url")) obj.websiteUrl = v;
      }
    }
  } else {
    const kv = itemText.match(/^([^:：]+)[:：]\s*(.*)$/);
    if (kv) {
      obj.name = kv[1].trim();
      obj.relationship = kv[2].trim();
    } else {
      obj.name = itemText.trim();
    }
  }
  return obj;
}

function parseSourceBullet(itemText: string): UnknownRecord {
  const obj: UnknownRecord = {};
  if (itemText.includes("|")) {
    const parts = itemText.split("|").map((p) => p.trim());
    for (const part of parts) {
      const kv = part.match(/^([^:：]+)[:：]\s*(.*)$/);
      if (kv) {
        const k = keySignature(kv[1].trim());
        const v = kv[2].trim();
        if (k.includes("عنوان") || k.includes("مصدر") || k.includes("title")) obj.title = v;
        else if (k.includes("رابط") || k.includes("موقع") || k.includes("url")) obj.url = v;
        else if (k.includes("ناشر") || k.includes("جهة") || k.includes("pub")) obj.publisher = v;
        else if (k.includes("نوع") || k.includes("type")) obj.sourceType = v;
        else if (k.includes("دليل") || k.includes("evidence")) obj.evidence = v;
      } else if (/^https?:\/\//i.test(part)) {
        obj.url = part;
      } else if (!obj.title) {
        obj.title = part;
      }
    }
  } else {
    const kv = itemText.match(/^([^:：]+)[:：]\s*(.*)$/);
    if (kv) {
      obj.title = kv[1].trim();
      obj.url = kv[2].trim();
    } else if (/^https?:\/\//i.test(itemText)) {
      obj.url = itemText.trim();
      obj.title = "مصدر خارجي";
    } else {
      obj.title = itemText.trim();
    }
  }
  return obj;
}

function parseKeyValueText(raw: string): UnknownRecord | null {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  const result: UnknownRecord = {};
  let currentListKey: string | null = null;
  let currentSwotCategory: "strengths" | "weaknesses" | "opportunities" | "threats" | null = null;
  const unknownMarkers = ["غير معروف", "غير محدد", "غير متوفر", "لا يوجد", "غ/م", "null", "none", "unknown", "-"];

  for (const line of lines) {
    // Check SWOT headers
    if (/^(نقاط\s*القوة|القوة)[:：]?$/i.test(line)) { currentSwotCategory = "strengths"; currentListKey = null; continue; }
    if (/^(نقاط\s*الضعف|الضعف)[:：]?$/i.test(line)) { currentSwotCategory = "weaknesses"; currentListKey = null; continue; }
    if (/^(الفرص)[:：]?$/i.test(line)) { currentSwotCategory = "opportunities"; currentListKey = null; continue; }
    if (/^(التهديدات|المخاطر\s*التنافسية)[:：]?$/i.test(line)) { currentSwotCategory = "threats"; currentListKey = null; continue; }

    const bulletMatch = line.match(/^[-*•]\s*(.*)$/);
    if (bulletMatch) {
      const itemText = bulletMatch[1].trim();
      if (!itemText || unknownMarkers.includes(itemText.toLowerCase())) continue;

      if (currentSwotCategory) {
        if (!isRecord(result.swot)) result.swot = { strengths: [], weaknesses: [], opportunities: [], threats: [] };
        const swotObj = result.swot as Record<string, string[]>;
        if (Array.isArray(swotObj[currentSwotCategory])) swotObj[currentSwotCategory].push(itemText);
        continue;
      }

      if (currentListKey) {
        if (!Array.isArray(result[currentListKey])) {
          result[currentListKey] = [];
        }

        if (currentListKey === "people") {
          (result.people as UnknownRecord[]).push(parsePersonBullet(itemText));
        } else if (currentListKey === "investors") {
          (result.investors as UnknownRecord[]).push(parseInvestorBullet(itemText));
        } else if (currentListKey === "products") {
          (result.products as UnknownRecord[]).push(parseProductBullet(itemText));
        } else if (currentListKey === "competitors") {
          (result.competitors as UnknownRecord[]).push(parseCompetitorBullet(itemText));
        } else if (currentListKey === "relatedParties") {
          (result.relatedParties as UnknownRecord[]).push(parseRelatedPartyBullet(itemText));
        } else if (currentListKey === "sources") {
          (result.sources as UnknownRecord[]).push(parseSourceBullet(itemText));
        } else {
          (result[currentListKey] as unknown[]).push(itemText);
        }
        continue;
      }
    }

    const kvMatch = line.match(/^([^:：]+)[:：]\s*(.*)$/);
    if (kvMatch) {
      const rawKey = kvMatch[1].trim();
      const rawVal = kvMatch[2].trim();
      const mappedKey = keyAliases[keySignature(rawKey)] ?? keyAliases[rawKey] ?? rawKey;

      if (!mappedKey) continue;

      currentListKey = mappedKey;
      currentSwotCategory = null;

      if (!rawVal || unknownMarkers.includes(rawVal.toLowerCase())) {
        if (!(mappedKey in result)) {
          result[mappedKey] = null;
        }
        continue;
      }

      const listFields = new Set(["markets", "currentMarkets", "techStack", "marketingChannels", "audienceSegments", "dataGaps", "risks"]);
      if (listFields.has(mappedKey)) {
        const items = rawVal.split(/[,،؛]+/).map((s) => s.trim()).filter((s) => s && !unknownMarkers.includes(s.toLowerCase()));
        result[mappedKey] = items;
      } else {
        result[mappedKey] = rawVal;
      }
    }
  }

  return Object.keys(result).length > 0 ? result : null;
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
    const raw = parsedJson ? extractPart(parsedJson, key) : parseKeyValueText(parts[key] as string);
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

    const relaxedResult = schema.partial().safeParse(candidate);
    if (relaxedResult.success) {
      parsed[key] = relaxedResult.data as never;
      issues.push(...result.error.issues.map((issue) => issueMessage(issue, "warning")));
    } else {
      // Fallback field-by-field sanitization so one invalid field never drops the whole stage
      const sanitized: UnknownRecord = {
        instructionId: instructionIds[key],
        companyKey: inferredCompanyKey,
      };
      const candRecord = candidate as UnknownRecord;
      const shape = schema.shape as Record<string, z.ZodTypeAny>;
      for (const [fieldKey, fieldSchema] of Object.entries(shape)) {
        if (fieldKey in candRecord) {
          const fieldResult = fieldSchema.safeParse(candRecord[fieldKey]);
          if (fieldResult.success) {
            sanitized[fieldKey] = fieldResult.data;
          }
        }
      }
      const finalTry = schema.partial().safeParse(sanitized);
      if (finalTry.success) {
        parsed[key] = finalTry.data as never;
      }
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

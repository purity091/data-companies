import { llmCompanySchema, type LlmCompany } from "./llm-import.validation";

export type ImportIssue = {
  severity: "error" | "warning";
  field: string;
  message: string;
};

export type ParsedLlmImport = {
  format: "json" | "markdown" | "text";
  company: LlmCompany | null;
  issues: ImportIssue[];
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function pick(record: UnknownRecord, keys: string[]): unknown {
  const normalized = new Map(Object.entries(record).map(([key, value]) => [key.toLowerCase().replace(/[\s_-]+/g, ""), value]));
  return keys.map((key) => normalized.get(key.toLowerCase().replace(/[\s_-]+/g, ""))).find((value) => value !== undefined);
}

function asList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(/[\n,،؛]+/).map((item) => item.trim()).filter(Boolean);
  if (isRecord(value)) return [value];
  return [];
}

function safeUrl(value: unknown): string | null {
  const raw = text(value);
  if (!raw) return null;
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).toString();
  } catch {
    return null;
  }
}

function mapPeople(value: unknown) {
  return asList(value).map((item) => {
    if (typeof item === "string") {
      const [fullName, jobTitle] = item.split(/\s+-\s+|\s+—\s+|\s+\|\s+/).map((part) => part.trim());
      return { fullName, jobTitle: jobTitle || null, linkedinUrl: null };
    }
    if (!isRecord(item)) return null;
    return {
      fullName: text(pick(item, ["fullname", "name", "person", "الاسم"])) || "",
      jobTitle: text(pick(item, ["jobtitle", "title", "role", "position", "المسمى الوظيفي"])) || null,
      linkedinUrl: safeUrl(pick(item, ["linkedinurl", "linkedin"])),
    };
  }).filter((item): item is { fullName: string; jobTitle: string | null; linkedinUrl: string | null } => Boolean(item?.fullName));
}

function mapInvestors(value: unknown) {
  return asList(value).map((item) => {
    if (typeof item === "string") return { name: item, slug: null, websiteUrl: null };
    if (!isRecord(item)) return null;
    return {
      name: text(pick(item, ["name", "investor", "المستثمر"])) || "",
      slug: text(pick(item, ["slug"])) || null,
      websiteUrl: safeUrl(pick(item, ["websiteurl", "website", "الموقع"])),
    };
  }).filter((item): item is { name: string; slug: string | null; websiteUrl: string | null } => Boolean(item?.name));
}

function mapSources(value: unknown, rawText: string) {
  const explicit = asList(value).map((item) => {
    if (typeof item === "string") return { title: null, url: safeUrl(item) };
    if (!isRecord(item)) return null;
    return { title: text(pick(item, ["title", "name", "العنوان"])), url: safeUrl(pick(item, ["url", "link", "الرابط"])) };
  }).filter((item): item is { title: string | null; url: string | null } => Boolean(item?.url));
  const discovered = [...rawText.matchAll(/https?:\/\/[^\s)\]}>]+/gi)].map((match) => ({ title: null, url: safeUrl(match[0].replace(/[.,]+$/, "")) }));
  const all = [...explicit, ...discovered].filter((item): item is { title: string | null; url: string } => Boolean(item.url));
  return [...new Map(all.map((item) => [item.url, item])).values()];
}

function normalizeRecord(input: UnknownRecord, rawText: string): unknown {
  const nested = pick(input, ["company", "companyrecord", "data", "الشركة", "البيانات"]);
  const record = isRecord(nested) ? nested : input;
  const foundedRaw = pick(record, ["foundedyear", "founded", "yearfounded", "سنة التأسيس"]);
  const foundedYear = Number(String(foundedRaw ?? "").replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - "٠".charCodeAt(0))));
  return {
    name: text(pick(record, ["name", "companyname", "اسم الشركة", "اسم الشركة"])) || "",
    legalName: text(pick(record, ["legalname", "الاسم القانوني"])),
    description: text(pick(record, ["description", "about", "shortdescription", "نبذة", "الوصف"])),
    websiteUrl: safeUrl(pick(record, ["websiteurl", "website", "url", "الموقع"])),
    foundedYear: Number.isInteger(foundedYear) && foundedYear > 999 ? foundedYear : null,
    countryName: text(pick(record, ["countryname", "country", "الدولة"])),
    industryName: text(pick(record, ["industryname", "industry", "الصناعة", "القطاع"])),
    people: mapPeople(pick(record, ["people", "keypeople", "team", "الأشخاص", "الفريق"])),
    investors: mapInvestors(pick(record, ["investors", "investor", "المستثمرون"])),
    markets: asList(pick(record, ["markets", "market", "الأسواق"])).map((item) => typeof item === "string" ? item : isRecord(item) ? text(pick(item, ["name", "market", "السوق"])) : null).filter((item): item is string => Boolean(item)),
    sources: mapSources(pick(record, ["sources", "references", "المصادر", "المراجع"]), rawText),
  };
}

function parseJson(rawText: string): UnknownRecord | null {
  const withoutFence = rawText.replace(/^\uFEFF/, "").replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  const candidates = [withoutFence];
  const first = withoutFence.indexOf("{");
  const last = withoutFence.lastIndexOf("}");
  if (first >= 0 && last > first) candidates.push(withoutFence.slice(first, last + 1));
  for (const candidate of candidates) {
    try {
      const parsed: unknown = JSON.parse(candidate.replace(/,\s*([}\]])/g, "$1"));
      if (isRecord(parsed)) return parsed;
      if (Array.isArray(parsed) && isRecord(parsed[0])) return parsed[0];
    } catch {
      // Continue with the next candidate, then fall back to labeled text.
    }
  }
  return null;
}

function parseLabeledText(rawText: string): UnknownRecord {
  const output: UnknownRecord = {};
  let activeList: "people" | "investors" | "markets" | "sources" | null = null;
  const aliases: Record<string, string> = {
    name: "name", "company name": "name", "اسم الشركة": "name", website: "website", url: "website", "الموقع": "website",
    description: "description", about: "description", "الوصف": "description", country: "country", "الدولة": "country",
    industry: "industry", sector: "industry", "الصناعة": "industry", "القطاع": "industry", "سنة التأسيس": "foundedYear", "founded year": "foundedYear",
    people: "people", team: "people", "الأشخاص": "people", investors: "investors", "المستثمرون": "investors", markets: "markets", "الأسواق": "markets", sources: "sources", references: "sources", "المصادر": "sources",
  };
  for (const line of rawText.split(/\r?\n/)) {
    const clean = line.replace(/^\s*[-*•]\s*/, "").trim();
    const separator = clean.indexOf(":");
    const rawKey = (separator >= 0 ? clean.slice(0, separator).trim() : clean.replace(/^#+\s*/, "")).toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
    const key = aliases[rawKey];
    if (key && ["people", "investors", "markets", "sources"].includes(key)) {
      activeList = key as "people" | "investors" | "markets" | "sources";
      if (!output[key]) output[key] = [];
      if (separator >= 0 && clean.slice(separator + 1).trim()) (output[key] as unknown[]).push(clean.slice(separator + 1).trim());
      continue;
    }
    if (activeList && /^\s*[-*•]/.test(line)) {
      (output[activeList] as unknown[]).push(clean);
      continue;
    }
    if (key && separator >= 0) {
      output[key] = clean.slice(separator + 1).trim();
      activeList = null;
    }
  }
  return output;
}

function compactIssues(issues: ImportIssue[]) {
  const unique = [...new Map(issues.map((issue) => [`${issue.severity}:${issue.field}:${issue.message}`, issue])).values()];
  const maxVisible = 6;
  if (unique.length <= maxVisible) return unique;
  return [
    ...unique.slice(0, maxVisible),
    { severity: "warning" as const, field: "summary", message: `تم إخفاء ${unique.length - maxVisible} ملاحظات متشابهة. راجع الحقول الظاهرة فقط.` },
  ];
}

export function parseLlmImport(rawText: string): ParsedLlmImport {
  const json = parseJson(rawText);
  const format = json ? "json" : rawText.includes("\n") ? "markdown" : "text";
  const candidate = normalizeRecord(json || parseLabeledText(rawText), rawText);
  const result = llmCompanySchema.safeParse(candidate);
  if (!result.success) {
    return {
      format,
      company: null,
      issues: compactIssues(result.error.issues.map((issue) => ({ severity: "error", field: issue.path.join(".") || "company", message: issue.message }))),
    };
  }
  const issues: ImportIssue[] = [];
  if (!result.data.websiteUrl) issues.push({ severity: "warning", field: "websiteUrl", message: "لم يتم العثور على موقع موثوق للشركة." });
  if (!result.data.countryName) issues.push({ severity: "warning", field: "countryName", message: "الدولة غير محددة." });
  if (!result.data.industryName) issues.push({ severity: "warning", field: "industryName", message: "الصناعة أو القطاع غير محدد." });
  if (!result.data.sources.length) issues.push({ severity: "warning", field: "sources", message: "لم يتم العثور على روابط مصادر." });
  return { format, company: result.data, issues: compactIssues(issues) };
}

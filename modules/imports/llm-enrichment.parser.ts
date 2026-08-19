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

function parseJson(raw: string): unknown {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(cleaned);
}

const schemas = {
  identity: identityInstructionSchema,
  business: businessInstructionSchema,
  peopleFinance: peopleFinanceInstructionSchema,
  evidence: evidenceInstructionSchema,
};

export function parseEnrichmentBundle(parts: Partial<Record<EnrichmentPartKey, string>>, fallback: Partial<LlmCompany> = {}) {
  const issues: EnrichmentParseIssue[] = [];
  const parsed: Partial<LlmEnrichmentBundle> = {};

  for (const key of Object.keys(schemas) as EnrichmentPartKey[]) {
    if (!parts[key]?.trim()) {
      issues.push({ severity: "warning", field: key, message: "هذه المرحلة غير مدخلة حاليًا، ويمكن إضافتها لاحقًا." });
      continue;
    }
    try {
      const result = schemas[key].safeParse(parseJson(parts[key]));
      if (!result.success) {
        for (const issue of result.error.issues) issues.push({ severity: "error", field: `${key}.${issue.path.join(".")}`, message: issue.message });
      } else {
        parsed[key] = result.data as never;
      }
    } catch {
      issues.push({ severity: "error", field: key, message: "النص ليس JSON صالحًا. احذف Markdown وأرسل JSON فقط." });
    }
  }

  if (issues.some((issue) => issue.severity === "error")) return { bundle: null, company: null, issues };

  const result = llmEnrichmentBundleSchema.safeParse(parsed);
  if (!result.success) {
    return {
      bundle: null,
      company: null,
      issues: result.error.issues.map((issue) => ({ severity: "error" as const, field: issue.path.join("."), message: issue.message })),
    };
  }

  try {
    return { bundle: result.data, company: mergeEnrichmentIntoCompany(result.data, fallback), issues };
  } catch (error) {
    return { bundle: null, company: null, issues: [{ severity: "error" as const, field: "companyKey", message: error instanceof Error ? error.message : "الشركة غير متطابقة بين التعليمات الأربع" }] };
  }
}

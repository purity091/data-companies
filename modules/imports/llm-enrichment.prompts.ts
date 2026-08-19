import type { LlmEnrichmentBundle } from "./llm-enrichment.validation";

type PromptDefinition = {
  id: keyof LlmEnrichmentBundle;
  instructionId: string;
  title: string;
  purpose: string;
  fields: string[];
  fieldGuidance: string[];
};

const rules = `
أنت باحث شركات محترف. أعد JSON صالحًا فقط، بلا Markdown وبلا شرح خارج JSON.
لا تخمّن أي معلومة. إذا لم تجد دليلًا موثوقًا استخدم null أو [] أو اكتبها في dataGaps.
أرفق رابط المصدر لكل معلومة مهمة. فضّل الموقع الرسمي والسجلات الحكومية والمصادر الأولية.
استخدم الأرقام الغربية 1234، والتواريخ بصيغة ISO.
هذه المرحلة مستقلة ويمكن إرسالها وحدها. الحقول غير المتاحة اختيارية، ولا تفشل الإجابة بسبب نقصها.
إذا لم يوجد رابط صالح، استخدم url: null وسجّل المعلومة ضمن dataGaps بدل اختراع رابط.
`;

export const enrichmentPromptDefinitions: PromptDefinition[] = [
  {
    id: "identity",
    instructionId: "identity_profile",
    title: "1. الهوية والملف الأساسي",
    purpose: "تثبيت هوية الشركة ومنع دمج شركة مع شركة مشابهة.",
    fields: ["companyKey", "name", "legalName", "description", "websiteUrl", "countryName", "industryName", "foundedYear", "companyType", "headquarters", "employeeCount", "techStack", "marketingChannels", "sources"],
    fieldGuidance: ["name is the verified public company name; legalName is the registered name when available.", "description must be a concise factual company profile, not marketing copy.", "countryName, industryName, companyType, headquarters, and employeeCount populate the About and Strategy tabs.", "techStack and marketingChannels must be arrays of short names for the Technical Data tab.", "Do not invent a founding year or employee count; use null when unknown."],
  },
  {
    id: "business",
    instructionId: "business_market",
    title: "2. المحيط التنافسي والهيكل",
    purpose: "تجميع العلاقات والأسواق والمنافسين والأطراف المرتبطة بالشركة.",
    fields: ["companyKey", "businessModel", "valueProposition", "targetCustomers", "pricingModel", "relationshipsSummary", "products", "markets", "competitors", "relatedParties", "sources"],
    fieldGuidance: ["businessModel, valueProposition, targetCustomers, pricingModel, and relationshipsSummary populate the Strategy and Structure tabs.", "targetCustomers may be an array of segments; products, competitors, and relatedParties must be arrays.", "Each competitor object should contain name, websiteUrl, and relationship when known.", "Each relatedParty object should contain name, partyType, relationship, and websiteUrl when known.", "markets must be an array of normalized market names without duplicates."],
  },
  {
    id: "peopleFinance",
    instructionId: "people_finance",
    title: "3. التمويل والاستثمارات",
    purpose: "جمع الأشخاص، المؤسسين، المستثمرين، التمويل والحالة التجارية.",
    fields: ["companyKey", "people", "investors", "fundingStage", "totalFundingUsd", "lastFundingDate", "revenueRange", "businessStatus", "sources"],
    fieldGuidance: ["people and investors must be arrays; every person must have fullName or name, and every investor must have name.", "Use numeric totalFundingUsd in USD without currency symbols when the amount is known.", "fundingStage, lastFundingDate, revenueRange, and businessStatus populate the Funding tab.", "Do not create funding rounds because the current page only stores funding summary fields."],
  },
  {
    id: "evidence",
    instructionId: "evidence_risks",
    title: "4. التحليل الاستراتيجي والجمهور",
    purpose: "تجميع التحليل الاستراتيجي والجمهور وSWOT والتوسع مع الأدلة والفجوات.",
    fields: ["companyKey", "strategicDomain", "reachScope", "audienceSegments", "strategicAnalysis", "growthSignals", "expansionPlan", "swot", "evidenceSummary", "confidence", "dataGaps", "risks", "lastVerifiedAt", "sources"],
    fieldGuidance: ["strategicDomain and reachScope populate the Analysis overview tab.", "audienceSegments must be an array of clearly named audience groups.", "swot must be an object with arrays: strengths, weaknesses, opportunities, threats.", "strategicAnalysis, growthSignals, and expansionPlan populate the Analysis and Expansion tabs.", "confidence must be a number from 0 to 1; use null if evidence is insufficient."],
  },
];

export function buildEnrichmentPrompt(definition: PromptDefinition, companyHint: string) {
  return `${rules}
المهمة: ${definition.title}
الهدف: ${definition.purpose}
الشركة المستهدفة: ${companyHint || "استخدم اسم الشركة ورابطها من المحتوى المرفق"}

أعد كائن JSON يبدأ بالحقل instructionId وقيمته "${definition.instructionId}"، ثم companyKey، ثم الحقول التالية فقط:
${definition.fields.map((field) => `- ${field}`).join("\n")}

قواعد الحقول:
${definition.fieldGuidance.map((rule) => `- ${rule}`).join("\n")}

قواعد المصادر:
- كل مصدر يجب أن يحتوي title وurl وpublisher وsourceType وaccessedAt وevidence.
- لا تضع رابطًا غير متأكد منه.
- لا تكرر المصادر.

المحتوى الذي ستبحث فيه أو تحلله:
{{PASTE_SOURCE_CONTENT_HERE}}
`;
}

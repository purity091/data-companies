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
أنت باحث شركات محترف. أعد كائن JSON صالحًا فقط، من دون Markdown أو شرح خارج JSON.
اكتب جميع الحقول الوصفية والتحليلية باللغة العربية الفصحى الواضحة. اترك الأسماء الرسمية
وأسماء المنتجات والتقنيات والعلامات التجارية بلغتها الأصلية عند الحاجة، ولا تترجم الروابط.
لا تخمّن أي معلومة. عند غياب الدليل استخدم null أو [] وسجّل النقص في dataGaps إن كان الحقل متاحًا.
استخدم الأرقام الغربية 1234 والتواريخ بصيغة ISO. اجعل النصوص موجزة وواقعية وليست دعائية.
هذه المرحلة مستقلة ويمكن إرسالها وحدها. الحقول غير المتاحة اختيارية، ولا تفشل الإجابة بسبب نقصها.
أرفق مصدرًا موثوقًا لكل معلومة مهمة، وفضّل الموقع الرسمي والسجلات الحكومية والمصادر الأولية.
إذا لم يوجد رابط صالح، استخدم url: null ولا تخترع رابطًا.
`;

export const enrichmentPromptDefinitions: PromptDefinition[] = [
  {
    id: "identity",
    instructionId: "identity_profile",
    title: "1. هوية الشركة والملف الأساسي",
    purpose: "تثبيت هوية الشركة ومنع دمجها مع شركة مشابهة.",
    fields: ["companyKey", "name", "legalName", "description", "websiteUrl", "countryName", "industryName", "foundedYear", "companyType", "headquarters", "employeeCount", "techStack", "marketingChannels", "sources"],
    fieldGuidance: [
      "name هو الاسم العام الموثق للشركة، وlegalName هو الاسم القانوني المسجل إن وجد.",
      "اكتب description بالعربية في فقرة واقعية قصيرة، وليست نصًا تسويقيًا.",
      "استخدم null عند عدم معرفة سنة التأسيس أو عدد الموظفين، ولا تقدّرهما.",
      "techStack وmarketingChannels قائمتان من أسماء قصيرة، ويمكن إبقاء أسماء الأدوات بلغتها الأصلية.",
    ],
  },
  {
    id: "business",
    instructionId: "business_market",
    title: "2. نموذج العمل والسوق والعلاقات",
    purpose: "تجميع نموذج العمل والمنتجات والأسواق والمنافسين والأطراف المرتبطة.",
    fields: ["companyKey", "businessModel", "valueProposition", "targetCustomers", "pricingModel", "relationshipsSummary", "products", "markets", "competitors", "relatedParties", "sources"],
    fieldGuidance: [
      "اكتب businessModel وvalueProposition وtargetCustomers وpricingModel وrelationshipsSummary بالعربية.",
      "targetCustomers وmarkets قائمتان عند تعدد العناصر، والمنتجات والمنافسون والأطراف المرتبطة مصفوفات.",
      "يحتوي كل منافس على name وwebsiteUrl وrelationship عند توفرها، وكل طرف مرتبط على name وpartyType وrelationship وwebsiteUrl.",
      "لا تكرر الأسواق أو العناصر، ولا تضف علاقة غير موثقة.",
    ],
  },
  {
    id: "peopleFinance",
    instructionId: "people_finance",
    title: "3. الأشخاص والتمويل والحالة التجارية",
    purpose: "جمع الأشخاص المؤثرين والمؤسسين والمستثمرين وملخص التمويل والحالة التجارية.",
    fields: ["companyKey", "people", "investors", "fundingStage", "totalFundingUsd", "lastFundingDate", "revenueRange", "businessStatus", "sources"],
    fieldGuidance: [
      "people وinvestors مصفوفتان. يجب أن يحتوي الشخص على fullName أو name، والمستثمر على name.",
      "اكتب jobTitle وfundingStage وrevenueRange وbusinessStatus بالعربية عند عدم كونها اسمًا رسميًا.",
      "totalFundingUsd رقم بالدولار من دون رمز العملة، ولا تنشئ جولات تمويل غير موجودة.",
      "استخدم التاريخ بصيغة YYYY-MM-DD، وnull عند عدم القدرة على التحقق.",
    ],
  },
  {
    id: "evidence",
    instructionId: "evidence_risks",
    title: "4. التحليل الاستراتيجي والجمهور والأدلة",
    purpose: "تجميع التحليل الاستراتيجي والجمهور وSWOT وإشارات النمو وخطة التوسع مع الأدلة والفجوات.",
    fields: ["companyKey", "strategicDomain", "reachScope", "audienceSegments", "strategicAnalysis", "growthSignals", "expansionPlan", "swot", "evidenceSummary", "confidence", "dataGaps", "risks", "lastVerifiedAt", "sources"],
    fieldGuidance: [
      "اكتب strategicDomain وreachScope وstrategicAnalysis وgrowthSignals وexpansionPlan وevidenceSummary بالعربية.",
      "audienceSegments مصفوفة من شرائح جمهور واضحة، وswot كائن يحتوي strengths وweaknesses وopportunities وthreats.",
      "confidence رقم بين 0 و1، ويُقبل أيضًا كنسبة مئوية مثل 75%، أو استخدم null عند ضعف الأدلة.",
      "أدرج الفجوات والمخاطر بوضوح بدل ملء المعلومات الناقصة بتخمينات.",
    ],
  },
];

export type EnrichmentPromptSlice = PromptDefinition & {
  sliceId: string;
  part: keyof LlmEnrichmentBundle;
};

export const enrichmentPromptSlices: EnrichmentPromptSlice[] = [
  {
    sliceId: "identity_core",
    part: "identity",
    id: "identity",
    instructionId: "identity_profile",
    title: "1A. الهوية والبيانات الأساسية",
    purpose: "الاسم والوصف والرابط والدولة والمجال وسنة التأسيس فقط.",
    fields: ["companyKey", "name", "legalName", "description", "websiteUrl", "countryName", "industryName", "foundedYear", "sources"],
    fieldGuidance: [
      "أعد الحقول المتاحة فقط، ولا تملأ أي قيمة بالتخمين.",
      "اكتب description بالعربية الفصحى في فقرة قصيرة، واستخدم null عند عدم التحقق.",
    ],
  },
  {
    sliceId: "identity_operations",
    part: "identity",
    id: "identity",
    instructionId: "identity_profile",
    title: "1B. التشغيل والتقنية",
    purpose: "نوع الشركة والمقر وعدد الموظفين والتقنيات وقنوات التسويق فقط.",
    fields: ["companyKey", "companyType", "headquarters", "employeeCount", "techStack", "marketingChannels", "sources"],
    fieldGuidance: [
      "لا تقدّر عدد الموظفين. استخدم null عند عدم وجود مصدر واضح.",
      "أعد techStack وmarketingChannels كمصفوفتين قصيرتين عند توفر الدليل.",
    ],
  },
  {
    sliceId: "business_model",
    part: "business",
    id: "business",
    instructionId: "business_market",
    title: "2A. نموذج العمل والسوق",
    purpose: "نموذج العمل والقيمة والعملاء والتسعير والأسواق فقط.",
    fields: ["companyKey", "businessModel", "valueProposition", "targetCustomers", "pricingModel", "markets", "sources"],
    fieldGuidance: [
      "اكتب الحقول الوصفية بالعربية الفصحى وباختصار.",
      "أعد markets كمصفوفة، ولا تضف سوقًا غير موثق.",
    ],
  },
  {
    sliceId: "business_ecosystem",
    part: "business",
    id: "business",
    instructionId: "business_market",
    title: "2B. المنتجات والعلاقات",
    purpose: "المنتجات والمنافسون والأطراف المرتبطة وملخص العلاقات فقط.",
    fields: ["companyKey", "relationshipsSummary", "products", "competitors", "relatedParties", "sources"],
    fieldGuidance: [
      "كل عنصر في المنتجات والمنافسين والأطراف المرتبطة يجب أن يكون موثقًا.",
      "استخدم [] عند عدم وجود عناصر موثوقة، ولا تخترع منافسين.",
    ],
  },
  {
    sliceId: "people_team",
    part: "peopleFinance",
    id: "peopleFinance",
    instructionId: "people_finance",
    title: "3A. الأشخاص المؤثرون",
    purpose: "المؤسسون وأعضاء الفريق والأشخاص المؤثرون فقط.",
    fields: ["companyKey", "people", "sources"],
    fieldGuidance: [
      "كل شخص يحتاج fullName، ويمكن وضع jobTitle وlinkedinUrl كـ null.",
      "استخدم [] عند عدم وجود أشخاص يمكن التحقق منهم.",
    ],
  },
  {
    sliceId: "people_finance",
    part: "peopleFinance",
    id: "peopleFinance",
    instructionId: "people_finance",
    title: "3B. التمويل والحالة التجارية",
    purpose: "المستثمرون والتمويل والإيرادات والحالة التجارية فقط.",
    fields: ["companyKey", "investors", "fundingStage", "totalFundingUsd", "lastFundingDate", "revenueRange", "businessStatus", "sources"],
    fieldGuidance: [
      "استخدم null للأرقام والتواريخ غير المؤكدة، ولا تنشئ جولات تمويل من التخمين.",
      "أعد totalFundingUsd كرقم بالدولار دون رمز العملة.",
    ],
  },
  {
    sliceId: "evidence_strategy",
    part: "evidence",
    id: "evidence",
    instructionId: "evidence_risks",
    title: "4A. الاستراتيجية والجمهور",
    purpose: "المجال الاستراتيجي ونطاق الوصول والجمهور والتحليل وإشارات النمو والتوسع فقط.",
    fields: ["companyKey", "strategicDomain", "reachScope", "audienceSegments", "strategicAnalysis", "growthSignals", "expansionPlan", "sources"],
    fieldGuidance: [
      "اكتب التحليل بالعربية الفصحى مع التمييز بين الحقيقة والاستنتاج.",
      "استخدم [] لشرائح الجمهور عند عدم وجود دليل.",
    ],
  },
  {
    sliceId: "evidence_quality",
    part: "evidence",
    id: "evidence",
    instructionId: "evidence_risks",
    title: "4B. الأدلة والمخاطر وSWOT",
    purpose: "تحليل SWOT وملخص الأدلة ودرجة الثقة والفجوات والمخاطر فقط.",
    fields: ["companyKey", "swot", "evidenceSummary", "confidence", "dataGaps", "risks", "lastVerifiedAt", "sources"],
    fieldGuidance: [
      "confidence رقم بين 0 و1، واستخدم null عند ضعف الأدلة.",
      "لا تملأ الفجوات أو المخاطر بتخمينات؛ اذكرها فقط عند وجود أساس واضح.",
    ],
  },
];

export function buildEnrichmentPrompt(definition: PromptDefinition, companyHint: string) {
  return `${rules}
المهمة: ${definition.title}
الهدف: ${definition.purpose}
الشركة المستهدفة: ${companyHint || "استخرج اسم الشركة ورابطها من المحتوى المرفق"}

أعد كائن JSON يبدأ بالحقل instructionId وقيمته "${definition.instructionId}"، ثم companyKey، ثم الحقول التالية فقط:
${definition.fields.map((field) => `- ${field}`).join("\n")}

إرشادات الحقول:
${definition.fieldGuidance.map((rule) => `- ${rule}`).join("\n")}

قواعد المصادر:
- كل مصدر كائن يحتوي title وurl وpublisher وsourceType وaccessedAt وevidence عند توفرها.
- لا تضع رابطًا غير متأكد منه، ولا تكرر المصادر.
- يمكن ترك الحقول الاختيارية ناقصة أو وضع null و[] عند عدم توفر الدليل.

المحتوى الذي ستبحث فيه أو تحلله:
{{PASTE_SOURCE_CONTENT_HERE}}
`;
}

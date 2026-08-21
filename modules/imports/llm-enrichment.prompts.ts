import type { LlmEnrichmentBundle } from "./llm-enrichment.validation";

type PromptDefinition = {
  id: keyof LlmEnrichmentBundle;
  instructionId: string;
  title: string;
  purpose: string;
  fields: string[];
  fieldGuidance: string[];
};

// This is the source of truth for the contract shown to every LLM. Keeping
// one instruction per field prevents a field from silently existing in the
// validator/UI without being requested in the research prompt.
const fieldInstructions: Record<keyof LlmEnrichmentBundle, Record<string, string>> = {
  identity: {
    companyKey: "معرّف ثابت للشركة: استخدم الاسم الرسمي أو الرابط، ولا تترجم هذا المعرّف ولا تغيّره بين المراحل.",
    name: "الاسم التجاري أو العام الموثق للشركة كما يظهر في المصدر الرسمي.",
    legalName: "الاسم القانوني المسجل حرفيًا إن وُجد؛ استخدم null إذا لم يظهر في مصدر موثوق.",
    description: "نبذة عربية قصيرة وواقعية تشرح ما تفعله الشركة، وليست عبارة تسويقية.",
    vision: "الرؤية أو اللمحة التعريفية المعلنة للشركة، بصياغة عربية موجزة؛ افصلها عن الوصف التشغيلي.",
    websiteUrl: "الرابط الرسمي للشركة بصيغة https:// إن أمكن؛ لا تنشئ رابطًا غير موجود.",
    countryName: "الدولة المرتبطة بالمقر أو التسجيل، بالاسم الواضح المتداول.",
    industryName: "القطاع أو الصناعة الأساسية للشركة، بصياغة موجزة ومفهومة.",
    foundedYear: "سنة التأسيس كرقم صحيح من أربعة أرقام، أو null عند عدم التحقق.",
    markets: "مصفوفة الأسواق أو القطاعات العامة التي تخدمها الشركة، دون تكرار.",
    currentMarkets: "مصفوفة الأسواق الحالية التي تعمل فيها الشركة الآن، وافصلها عن الأسواق التاريخية أو المحتملة.",
    businessModel: "نموذج النشاط في جملة عربية بسيطة توضّح كيف تعمل الشركة أو تحقق الإيراد.",
    strategicDomain: "المجال الاستراتيجي أو مساحة المنافسة التي تنتمي إليها الشركة.",
    reachScope: "نطاق الوصول الجغرافي أو السوقي أو التشغيلي، كنص قصير أو قائمة مفهومة.",
    companyType: "نوع الكيان أو نموذج الشركة مثل شركة خاصة أو مؤسسة غير ربحية عند وجود دليل.",
    headquarters: "المقر أو المدينة/الدولة كما يرد في المصدر، دون اختراع عنوان تفصيلي.",
    employeeCount: "عدد الموظفين كرقم صحيح فقط عند وجود رقم أو نطاق موثوق؛ لا تحوّل النطاق إلى رقم مخترع.",
    techStack: "مصفوفة أسماء التقنيات أو الأدوات المستخدمة فعليًا، مع إبقاء الأسماء الأصلية.",
    marketingChannels: "مصفوفة قنوات التسويق أو الوصول التي يظهر استخدامها أو يمكن استنتاجها مباشرة من الدليل.",
    sources: "مصفوفة مصادر تدعم معلومات هذه المرحلة، وكل عنصر يضم title وurl وpublisher وsourceType وaccessedAt وevidence عند توفرها.",
    "sources.title": "عنوان المصدر كما يظهر في الصفحة أو عنوان وصفي قصير.",
    "sources.url": "رابط المصدر القابل للفتح؛ استخدم null إذا لم يوجد رابط صالح.",
    "sources.publisher": "الناشر أو الجهة المالكة للمصدر.",
    "sources.sourceType": "نوع المصدر مثل official أو government أو registry أو news أو social أو directory أو other.",
    "sources.accessedAt": "تاريخ ووقت الوصول بصيغة ISO عند توفره.",
    "sources.evidence": "اقتباس موجز أو وصف الجزء الذي يثبت المعلومة.",
  },
  business: {
    companyKey: "استخدم نفس معرّف الشركة في مرحلة الهوية، أو أنشئه من الاسم/الرابط إن كانت هذه أول مرحلة.",
    businessModel: "اشرح بالعربية كيف تحقق الشركة القيمة أو الإيراد، ومن يدفع لها، دون مبالغة.",
    valueProposition: "اشرح المشكلة التي تحلها الشركة والقيمة التي تقدمها للعميل.",
    targetCustomers: "صف العملاء المستهدفين بوضوح؛ يمكن أن تكون قيمة نصية أو قائمة عند تعدد الشرائح.",
    pricingModel: "صف طريقة التسعير أو الباقات أو نموذج الدفع، ويمكن أن تكون قيمة منظمة أو نصًا موجزًا.",
    relationshipsSummary: "لخّص العلاقات التجارية أو المؤسسية المهمة مع التمييز بين الحقيقة والاستنتاج.",
    products: "مصفوفة المنتجات أو الخدمات الموثقة، ولا تضف منتجًا لمجرد أن اسمه متوقع من القطاع.",
    "products.name": "اسم المنتج أو الخدمة كما تستخدمه الشركة.",
    "products.description": "وصف عربي قصير لما يقدمه المنتج أو الخدمة.",
    "products.url": "رابط صفحة المنتج إن وجد، وإلا null.",
    markets: "مصفوفة الأسواق أو المجالات التي تخدمها الشركة، دون تكرار.",
    competitors: "مصفوفة المنافسين الذين توجد قرينة معقولة على منافستهم للشركة.",
    "competitors.name": "اسم المنافس.",
    "competitors.websiteUrl": "موقع المنافس إن كان موثوقًا، وإلا null.",
    "competitors.relationship": "سبب المنافسة أو طبيعة العلاقة بجملة قصيرة.",
    relatedParties: "مصفوفة الأطراف المرتبطة مثل الشركاء أو الشركات الأم أو الجهات التابعة عند وجود دليل.",
    "relatedParties.name": "اسم الطرف المرتبط.",
    "relatedParties.partyType": "نوع الطرف مثل parent أو subsidiary أو partner أو distributor عند معرفته.",
    "relatedParties.relationship": "شرح العلاقة باختصار، مع ذكر أنها استنتاج إذا كانت كذلك.",
    "relatedParties.websiteUrl": "رابط الطرف المرتبط إن وجد، وإلا null.",
    sources: "مصفوفة المصادر التي تثبت نموذج العمل والمنتجات والأسواق والعلاقات.",
    "sources.title": "عنوان المصدر.",
    "sources.url": "الرابط القابل للفتح أو null.",
    "sources.publisher": "الناشر أو الجهة المالكة.",
    "sources.sourceType": "نوع المصدر وفق القيم المدعومة: official أو government أو registry أو news أو social أو directory أو other.",
    "sources.accessedAt": "تاريخ ووقت الوصول بصيغة ISO عند توفره.",
    "sources.evidence": "الجزء الذي يثبت المعلومة أو يشرح أساس الاستنتاج.",
  },
  peopleFinance: {
    companyKey: "استخدم نفس معرّف الشركة في المراحل الأخرى.",
    people: "مصفوفة الأشخاص المؤثرين أو المؤسسين أو أعضاء القيادة الذين يمكن ربطهم بالشركة.",
    "people.fullName": "الاسم الكامل للشخص؛ يمكن قبول name أو firstName/lastName وتحويلها إلى fullName.",
    "people.jobTitle": "المسمى الوظيفي الحالي أو التاريخي كما يذكره المصدر، وإلا null.",
    "people.linkedinUrl": "رابط LinkedIn للشخص إن كان مؤكدًا، وإلا null.",
    "people.xHandle": "حساب X إن كان مؤكدًا، وإلا null.",
    "people.isFounder": "true فقط عند وجود دليل على التأسيس، وإلا false.",
    "people.sourceUrls": "مصفوفة روابط المصادر الخاصة بالشخص.",
    investors: "مصفوفة المستثمرين أو الجهات الممولة المذكورة في مصدر يمكن التحقق منه.",
    "investors.name": "اسم المستثمر أو الجهة الاستثمارية.",
    "investors.slug": "معرّف قصير بالإنجليزية عند توفره، وإلا null.",
    "investors.websiteUrl": "الموقع الرسمي للمستثمر إن وجد، وإلا null.",
    "investors.stage": "مرحلة الاستثمار المرتبطة بالمستثمر إن كانت مذكورة.",
    "investors.sourceUrls": "مصفوفة روابط المصادر الخاصة بالمستثمر أو الاستثمار.",
    fundingStage: "مرحلة التمويل الحالية أو آخر مرحلة معلنة بصياغة مفهومة، وإلا null.",
    totalFundingUsd: "إجمالي التمويل بالدولار كرقم؛ حوّل الوحدات المعلنة مثل M وB حسابيًا فقط عند وضوحها.",
    lastFundingDate: "تاريخ آخر تمويل بصيغة YYYY-MM-DD، وإلا null.",
    revenueRange: "نطاق الإيرادات كما ورد أو استنتاج مهني واضح من أدلة متعددة، وإلا null.",
    businessStatus: "حالة النشاط مثل active أو acquired أو closed مع شرح عربي موجز عند الحاجة.",
    sources: "مصفوفة مصادر الأشخاص والتمويل والحالة التجارية.",
    "sources.title": "عنوان المصدر.",
    "sources.url": "الرابط القابل للفتح أو null.",
    "sources.publisher": "الناشر أو الجهة المالكة.",
    "sources.sourceType": "نوع المصدر وفق القيم المدعومة.",
    "sources.accessedAt": "تاريخ ووقت الوصول بصيغة ISO عند توفره.",
    "sources.evidence": "الجزء الذي يثبت الشخص أو التمويل أو الحالة.",
  },
  evidence: {
    companyKey: "استخدم نفس معرّف الشركة في المراحل الأخرى.",
    strategicDomain: "المجال الاستراتيجي الذي تنافس أو تعمل فيه الشركة.",
    reachScope: "نطاق الوصول الجغرافي أو السوقي أو التشغيلي؛ يمكن أن يكون نصًا أو قيمة منظمة.",
    audienceSegments: "مصفوفة شرائح الجمهور المستهدف بصياغات واضحة وغير متكررة.",
    strategicAnalysis: "تحليل عربي يربط الأدلة بوضع الشركة، مع وسم الاستنتاجات بأنها تحليل لا حقيقة منقولة.",
    growthSignals: "إشارات النمو المدعومة مثل التوسع أو التوظيف أو المنتجات الجديدة، ويمكن أن تكون نصًا أو قائمة منظمة.",
    expansionPlan: "خطة التوسع المعلنة أو خطة منطقية مستنتجة من الأدلة، مع توضيح أنها استنتاج عند الحاجة.",
    swot: "كائن SWOT يحتوي دائمًا على strengths وweaknesses وopportunities وthreats كمصفوفات.",
    "swot.strengths": "مصفوفة نقاط القوة المدعومة بالأدلة.",
    "swot.weaknesses": "مصفوفة نقاط الضعف أو القيود المدعومة أو المستنتجة بوضوح.",
    "swot.opportunities": "مصفوفة الفرص المعقولة المبنية على السوق والأدلة.",
    "swot.threats": "مصفوفة التهديدات أو المخاطر الخارجية المدعومة بالأدلة.",
    evidenceSummary: "ملخص عربي يوضح أهم الأدلة وما هو مؤكد وما هو استنتاج وما زال ناقصًا.",
    confidence: "درجة ثقة من 0 إلى 1، أو نسبة مئوية يحولها النظام، تعكس جودة الأدلة لا قوة الصياغة.",
    dataGaps: "مصفوفة الفجوات التي تمنع التحقق الكامل، ولا تستخدمها لملء قيمة غير معروفة.",
    risks: "مصفوفة المخاطر الواقعية المبنية على الأدلة أو التحليل الواضح.",
    lastVerifiedAt: "تاريخ آخر تحقق بصيغة YYYY-MM-DD.",
    sources: "مصفوفة مصادر الأدلة والتحليل، مع ربط كل نتيجة مهمة بمصدر عند الإمكان.",
    "sources.title": "عنوان المصدر.",
    "sources.url": "الرابط القابل للفتح أو null.",
    "sources.publisher": "الناشر أو الجهة المالكة.",
    "sources.sourceType": "نوع المصدر وفق القيم المدعومة.",
    "sources.accessedAt": "تاريخ ووقت الوصول بصيغة ISO عند توفره.",
    "sources.evidence": "الجزء الذي يثبت النتيجة أو يوضح أساس الاستنتاج.",
  },
};

const researchInstructions: Record<keyof LlmEnrichmentBundle, string[]> = {
  identity: [
    "ابدأ بالبحث عن الشركة باستخدام الاسم والرابط المرفقين، ثم طابق الكيان القانوني مع الموقع الرسمي أو سجل تجاري/حكومي موثوق.",
    "تحقق من الاسم القانوني والوصف والدولة والقطاع وسنة التأسيس من صفحات الشركة الرسمية أو مصدر أولي، ولا تخلطها مع شركة تحمل اسمًا مشابهًا.",
    "استخدم مصدرًا مباشرًا لكل قيمة أساسية، واذكر في dataGaps أي قيمة لم يمكن التحقق منها.",
  ],
  business: [
    "ابحث في الموقع الرسمي وصفحات المنتجات والتسعير والعملاء والتوثيق لفهم ما تبيعه الشركة وكيف تخدم السوق.",
    "استخرج الأسواق والمنتجات والمنافسين والأطراف المرتبطة من أدلة قابلة للتحقق مثل المواقع الرسمية وملفات الشركات والمصادر الأولية.",
    "لا تعتبر أي شركة منافسًا أو طرفًا مرتبطًا إلا عند وجود دليل واضح على العلاقة، وأرفق روابط المصادر المستخدمة.",
  ],
  peopleFinance: [
    "ابحث في صفحة الفريق والقيادة الرسمية، ملفات LinkedIn الموثوقة، إعلانات التمويل، وملفات المستثمرين الرسمية.",
    "طابق اسم كل شخص ومستثمر مع الشركة المقصودة، وميّز بين التمويل المعلن والادعاءات غير المؤكدة.",
    "لا تنشئ أرقامًا أو تواريخ أو جولات تمويل من التقدير؛ استخدم null أو [] عند غياب مصدر أولي واضح.",
  ],
  evidence: [
    "اجمع الأدلة من الموقع الرسمي والوثائق الأولية والسجلات الحكومية والمصادر المهنية الحديثة قبل كتابة أي تحليل.",
    "افصل بوضوح بين الحقائق المنقولة والاستنتاج التحليلي، واربط كل نتيجة مهمة بمصدر يمكن فتحه.",
    "قيّم حداثة المصادر وتعارضها، ثم سجّل الفجوات والمخاطر ودرجة الثقة بدل ملء المعلومات الناقصة بالتخمين.",
  ],
};

const rules = `
أنت باحث ذكاء اصطناعي محترف. ابحث عن الشركة المحددة واجلب بياناتها من الويب، ثم أعد النتيجة بكائن JSON صالح فقط دون أي نص أو شرح خارج JSON.
`;

function renderFieldInstructions(definition: PromptDefinition) {
  const fields = Object.entries(fieldInstructions[definition.id])
    .filter(([field]) => definition.fields.some((parent) => field === parent || field.startsWith(`${parent}.`)));

  return fields.map(([field, instruction]) => `- ${field}: ${instruction}`).join("\n");
}

function simpleJsonTemplate(definition: PromptDefinition) {
  const listFields = new Set(["techStack", "marketingChannels", "markets", "currentMarkets", "audienceSegments", "dataGaps", "risks", "sources", "people", "investors", "products", "competitors", "relatedParties"]);
  const template: Record<string, unknown> = {
    instructionId: definition.instructionId,
    companyKey: "اسم-الشركة-بالإنجليزية-أو-الرابط",
  };

  const samplePlaceholders: Record<string, unknown> = {
    name: "الاسم التجاري للشركة",
    legalName: "الاسم القانوني المسجل (أو null عند عدم المعرفة)",
    description: "نبذة ووصف عربي شامل وواقعي عن نشاط الشركة",
    vision: "الرؤية واللمحة التعريفية المعلنة للشركة",
    websiteUrl: "https://example.com",
    countryName: "اسم الدولة (مثال: السعودية)",
    industryName: "القطاع أو الصناعة الأساسية",
    foundedYear: 2020,
    headquarters: "المدينة والدولة (مثال: الرياض، السعودية)",
    businessModel: "شرح نموذج العمل وكيف تحقق الشركة أرباحها",
    strategicDomain: "المجال الاستراتيجي ومساحة المنافسة",
    reachScope: "نطاق الوصول (محلي / إقليمي / عالمي)",
    companyType: "نوع الشركة (شركة خاصة / مساهمة / إلخ)",
    employeeCount: 100,
    fundingStage: "مرحلة التمويل (مثال: Seed / Series A)",
    totalFundingUsd: 5000000,
    lastFundingDate: "2023-05-15",
    revenueRange: "نطاق الإيرادات التقديري",
    businessStatus: "حالة النشاط (active / closed)",
    confidence: 0.9,
    evidenceSummary: "ملخص للأدلة والحقائق المستخرجة",
    strategicAnalysis: "تحليل استراتيجي لوضع الشركة بالسوق",
    growthSignals: "إشارات ومؤشرات النمو",
    expansionPlan: "خطة التوسع المستقبلية",
  };

  for (const field of definition.fields) {
    if (field === "companyKey") continue;
    if (field === "swot") {
      template[field] = { strengths: ["نقطة قوة 1"], weaknesses: ["نقطة ضعف 1"], opportunities: ["فرصة 1"], threats: ["تهديد 1"] };
    } else if (listFields.has(field)) {
      template[field] = ["عنصر 1"];
    } else if (samplePlaceholders[field] !== undefined) {
      template[field] = samplePlaceholders[field];
    } else {
      template[field] = "قيمة الحقل المستخرجة (أو null عند عدم التوفر)";
    }
  }

  return JSON.stringify(template, null, 2);
}

export const enrichmentPromptDefinitions: PromptDefinition[] = [
  {
    id: "identity",
    instructionId: "identity_profile",
    title: "1. هوية الشركة والملف الأساسي",
    purpose: "تثبيت هوية الشركة والملف الأساسي والمقر والقطاع.",
    fields: ["companyKey", "name", "legalName", "description", "vision", "websiteUrl", "countryName", "industryName", "foundedYear", "headquarters", "markets", "currentMarkets", "businessModel", "strategicDomain", "reachScope", "companyType", "employeeCount", "techStack", "marketingChannels", "sources"],
    fieldGuidance: [
      "املأ كل الحقول الممكنة من نتائج البحث عن الشركة.",
      "استخدم null أو [] للحقول التي تعذر التحقق منها.",
    ],
  },
  {
    id: "business",
    instructionId: "business_market",
    title: "2. نموذج العمل والسوق والعلاقات",
    purpose: "جمع نموذج العمل والمنتجات والأسواق والمنافسين والأطراف المرتبطة.",
    fields: ["companyKey", "businessModel", "valueProposition", "targetCustomers", "pricingModel", "relationshipsSummary", "products", "markets", "competitors", "relatedParties", "sources"],
    fieldGuidance: [
      "اكتب الحقول الوصفية بالعربية الفصحى البسيطة.",
      "أدرج المنتجات والمنافسين كمصفوفات منظمة.",
    ],
  },
  {
    id: "peopleFinance",
    instructionId: "people_finance",
    title: "3. الأشخاص والتمويل والحالة التجارية",
    purpose: "جمع الأشخاص المؤثرين والمؤسسين والمستثمرين والتمويل.",
    fields: ["companyKey", "people", "investors", "fundingStage", "totalFundingUsd", "lastFundingDate", "revenueRange", "businessStatus", "sources"],
    fieldGuidance: [
      "أعد الأشخاص والمستثمرين كمصفوفات بها الأسماء والوظائف والروابط إن وجدت.",
      "ضع totalFundingUsd كرقم بالدولار فقط دون رموز.",
    ],
  },
  {
    id: "evidence",
    instructionId: "evidence_risks",
    title: "4. التحليل الاستراتيجي والجمهور والأدلة",
    purpose: "تجميع التحليل الاستراتيجي وSWOT والجمهور والمخاطر والمصادر.",
    fields: ["companyKey", "strategicDomain", "reachScope", "audienceSegments", "strategicAnalysis", "growthSignals", "expansionPlan", "swot", "evidenceSummary", "confidence", "dataGaps", "risks", "lastVerifiedAt", "sources"],
    fieldGuidance: [
      "اكتب التحليل وSWOT بالعربية الفصحى.",
      "سجل المخاطر وفجوات البيانات بوضوح بدلاً من التخمين.",
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
    purpose: "الاسم والوصف والرابط والدولة والمجال وسنة التأسيس.",
    fields: ["companyKey", "name", "legalName", "description", "websiteUrl", "countryName", "industryName", "foundedYear", "sources"],
    fieldGuidance: [
      "اكتب description بالعربية الفصحى في فقرة قصيرة.",
    ],
  },
  {
    sliceId: "identity_operations",
    part: "identity",
    id: "identity",
    instructionId: "identity_profile",
    title: "1B. التشغيل والتقنية",
    purpose: "نوع الشركة والمقر وعدد الموظفين والتقنيات وقنوات التسويق.",
    fields: ["companyKey", "companyType", "headquarters", "employeeCount", "techStack", "marketingChannels", "sources"],
    fieldGuidance: [
      "أعد techStack وmarketingChannels كمصفوفتين قصيرتين عند توفر الدليل.",
    ],
  },
  {
    sliceId: "business_model",
    part: "business",
    id: "business",
    instructionId: "business_market",
    title: "2A. نموذج العمل والسوق",
    purpose: "نموذج العمل والقيمة والعملاء والتسعير والأسواق.",
    fields: ["companyKey", "businessModel", "valueProposition", "targetCustomers", "pricingModel", "markets", "sources"],
    fieldGuidance: [
      "اكتب الحقول الوصفية بالعربية الفصحى وباختصار.",
    ],
  },
  {
    sliceId: "business_ecosystem",
    part: "business",
    id: "business",
    instructionId: "business_market",
    title: "2B. المنتجات والعلاقات",
    purpose: "المنتجات والمنافسون والأطراف المرتبطة وملخص العلاقات.",
    fields: ["companyKey", "relationshipsSummary", "products", "competitors", "relatedParties", "sources"],
    fieldGuidance: [
      "أضف المنتجات والمنافسين الموثقين فقط.",
    ],
  },
  {
    sliceId: "people_team",
    part: "peopleFinance",
    id: "peopleFinance",
    instructionId: "people_finance",
    title: "3A. الأشخاص المؤثرون",
    purpose: "المؤسسون وأعضاء الفريق والقيادة.",
    fields: ["companyKey", "people", "sources"],
    fieldGuidance: [
      "كل شخص يستلزم fullName على الأقل.",
    ],
  },
  {
    sliceId: "people_finance",
    part: "peopleFinance",
    id: "peopleFinance",
    instructionId: "people_finance",
    title: "3B. التمويل والحالة التجارية",
    purpose: "المستثمرون والتمويل والإيرادات والحالة التجارية.",
    fields: ["companyKey", "investors", "fundingStage", "totalFundingUsd", "lastFundingDate", "revenueRange", "businessStatus", "sources"],
    fieldGuidance: [
      "ضع null للأرقام والتواريخ غير المؤكدة.",
    ],
  },
  {
    sliceId: "evidence_strategy",
    part: "evidence",
    id: "evidence",
    instructionId: "evidence_risks",
    title: "4A. الاستراتيجية والجمهور",
    purpose: "المجال الاستراتيجي ونطاق الوصول والجمهور والتحليل وخطة التوسع.",
    fields: ["companyKey", "strategicDomain", "reachScope", "audienceSegments", "strategicAnalysis", "growthSignals", "expansionPlan", "sources"],
    fieldGuidance: [
      "اكتب التحليل بالعربية الفصحى المباشرة.",
    ],
  },
  {
    sliceId: "evidence_quality",
    part: "evidence",
    id: "evidence",
    instructionId: "evidence_risks",
    title: "4B. الأدلة والمخاطر وSWOT",
    purpose: "تحليل SWOT وملخص الأدلة ودرجة الثقة والفجوات والمخاطر.",
    fields: ["companyKey", "swot", "evidenceSummary", "confidence", "dataGaps", "risks", "lastVerifiedAt", "sources"],
    fieldGuidance: [
      "confidence رقم بين 0 و 1 (مثال: 0.85).",
    ],
  },
];

const arabicFieldNames: Record<string, string> = {
  companyKey: "معرف الشركة",
  name: "الاسم التجاري",
  legalName: "الاسم القانوني",
  description: "نبذة ووصف الشركة",
  vision: "الرؤية واللمحة التعريفية",
  websiteUrl: "الموقع الإلكتروني",
  countryName: "الدولة",
  industryName: "القطاع أو الصناعة",
  foundedYear: "سنة التأسيس",
  headquarters: "المقر الرئيسي",
  markets: "الأسواق المستهدفة",
  currentMarkets: "الأسواق الحالية",
  businessModel: "نموذج النشاط أو العمل",
  strategicDomain: "المجال الاستراتيجي",
  reachScope: "نطاق الوصول",
  companyType: "نوع الشركة",
  employeeCount: "عدد الموظفين",
  techStack: "التقنيات المستخدمة",
  marketingChannels: "قنوات التسويق",
  valueProposition: "القيمة المقترحة",
  targetCustomers: "العملاء المستهدفون",
  pricingModel: "نموذج التسعير",
  relationshipsSummary: "ملخص العلاقات",
  products: "المنتجات",
  competitors: "المنافسون",
  relatedParties: "الأطراف المرتبطة",
  people: "أهم الأشخاص أو القيادة",
  investors: "المستثمرون",
  fundingStage: "مرحلة التمويل",
  totalFundingUsd: "إجمالي التمويل بالدولار",
  lastFundingDate: "تاريخ آخر تمويل",
  revenueRange: "نطاق الإيرادات",
  businessStatus: "حالة النشاط",
  strategicAnalysis: "التحليل الاستراتيجي",
  growthSignals: "مؤشرات النمو",
  expansionPlan: "خطة التوسع",
  evidenceSummary: "ملخص الأدلة",
  confidence: "درجة الثقة",
  dataGaps: "فجوات البيانات",
  risks: "المخاطر",
  lastVerifiedAt: "تاريخ التحقق",
  sources: "المصادر والمراجع",
};

export function buildKeyValueEnrichmentPrompt(definition: PromptDefinition, companyHint: string): string {
  const fieldLines = definition.fields
    .filter((field) => field !== "companyKey")
    .map((field) => {
      const label = arabicFieldNames[field] ?? field;

      // List fields — show bullet format
      if (field === "markets" || field === "currentMarkets") {
        return `${label}:\n- السوق الأول\n- السوق الثاني`;
      }
      if (field === "techStack") {
        return `${label}:\n- التقنية الأولى\n- التقنية الثانية`;
      }
      if (field === "marketingChannels") {
        return `${label}:\n- القناة الأولى\n- القناة الثانية`;
      }
      if (field === "audienceSegments" || field === "dataGaps" || field === "risks") {
        return `${label}:\n- العنصر الأول\n- العنصر الثاني`;
      }

      // Nested object fields — show named bullet format
      if (field === "people") {
        return `أهم الأشخاص والقيادة:\n- الاسم الكامل: [الاسم] | المسمى الوظيفي: [المنصب] | هل مؤسس: نعم/لا`;
      }
      if (field === "investors") {
        return `المستثمرون:\n- اسم المستثمر: [الاسم] | المرحلة: [seed/series-A/...] | الموقع: [رابط]`;
      }
      if (field === "products") {
        return `المنتجات:\n- اسم المنتج: [الاسم] | الوصف: [وصف مختصر] | الرابط: [URL]`;
      }
      if (field === "competitors") {
        return `المنافسون:\n- اسم المنافس: [الاسم] | الموقع: [رابط] | نوع المنافسة: [مباشر/غير مباشر]`;
      }
      if (field === "relatedParties") {
        return `الأطراف المرتبطة:\n- الاسم: [الاسم] | نوع العلاقة: [شريك/مورد/عميل] | الموقع: [رابط]`;
      }
      if (field === "sources") {
        return `المصادر:\n- العنوان: [عنوان المصدر] | الرابط: [URL] | الناشر: [اسم الجهة]`;
      }
      if (field === "swot") {
        return `نقاط القوة:\n- [نقطة قوة]\nنقاط الضعف:\n- [نقطة ضعف]\nالفرص:\n- [فرصة]\nالتهديدات:\n- [تهديد]`;
      }

      // Numeric fields
      if (field === "foundedYear") return `${label}: 20XX`;
      if (field === "employeeCount") return `${label}: 000`;
      if (field === "totalFundingUsd") return `${label}: 0000000`;
      if (field === "confidence") return `${label}: 0.85`;

      // Date fields
      if (field === "lastFundingDate" || field === "lastVerifiedAt") return `${label}: YYYY-MM-DD`;

      // URL fields
      if (field === "websiteUrl") return `${label}: https://...`;

      // Default text field
      return `${label}: [اكتب القيمة هنا]`;
    })
    .join("\n");

  const fieldCount = definition.fields.filter((f) => f !== "companyKey").length;

  return `## مهمتك: استخراج بيانات شركة وإعادتها بتنسيق نصي بسيط

أنت باحث خبير في تحليل بيانات الشركات. مهمتك هي البحث عن المعلومات التالية وإعادتها بشكل نصي منظم بدون أي أكواد أو JSON.

---
### الشركة المستهدفة
${companyHint}

---
### القسم المطلوب: ${definition.title}
**الهدف:** ${definition.purpose}
**عدد الحقول المطلوبة:** ${fieldCount} حقلاً

---
### تعليمات صارمة لطريقة الإجابة

✅ **افعل:**
- اكتب كل حقل في سطر مستقل بالتنسيق: \`اسم الحقل: القيمة\`
- للقوائم والأشخاص والمنتجات، استخدم سطراً لكل عنصر يبدأ بشرطة \`-\`
- اكتب الوصف والتحليل باللغة العربية الفصحى
- احتفظ بالروابط والأسماء الأجنبية بلغتها الأصلية
- إذا لم تجد معلومة بعد البحث، اكتب: \`اسم الحقل: غير معروف\`

❌ **لا تفعل:**
- لا تكتب أي كود JSON أو أقواس \`{ }\`
- لا تضيف شرحاً أو مقدمة قبل أو بعد الإجابة
- لا تترك حقلاً فارغاً دون قيمة أو "غير معروف"

---
### الهيكل المطلوب (استبدل القيم بين الأقواس [] بالبيانات الحقيقية)

${fieldLines}

---
### المحتوى الإضافي للتحليل (إن وجد — احذف هذا السطر واستبدله بالنص أو الصفحة التي تريد تحليلها)
{{PASTE_SOURCE_CONTENT_HERE}}
`;
}

/** @deprecated Use buildKeyValueEnrichmentPrompt instead. Kept for backward compatibility with FourStepEnrichmentWorkspace and CompanyEnrichmentPrompt. */
export const buildEnrichmentPrompt = buildKeyValueEnrichmentPrompt;

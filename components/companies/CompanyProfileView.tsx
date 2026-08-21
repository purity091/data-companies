"use client";

import { useState } from "react";

export type CompanyProfileData = {
  id: string;
  slug: string;
  name: string;
  legalName: string | null;
  description: string | null;
  websiteUrl: string | null;
  foundedYear: number | null;
  country: { name: string; code: string } | null;
  industry: { name: string } | null;
  people: { id: string; fullName: string; jobTitle: string | null }[];
  markets: { market: { name: string } }[];
  investors: { investor: { name: string; websiteUrl?: string | null } }[];
  llmEnrichment?: {
    vision?: string | null;
    companyType?: string | null;
    employeeCount?: number | null;
    headquarters?: string | null;
    techStack?: string | null;
    marketingChannels?: string | null;
    businessModel?: string | null;
    valueProposition?: string | null;
    targetCustomers?: string | null;
    pricingModel?: string | null;
    relationshipsSummary?: string | null;
    strategicDomain?: string | null;
    reachScope?: string | null;
    audienceSegments?: string | null;
    strategicAnalysis?: string | null;
    growthSignals?: string | null;
    expansionPlan?: string | null;
    swotStrengths?: string | null;
    swotWeaknesses?: string | null;
    swotOpportunities?: string | null;
    swotThreats?: string | null;
    fundingStage?: string | null;
    totalFundingUsd?: string | number | null;
    lastFundingDate?: string | null;
    revenueRange?: string | null;
    businessStatus?: string | null;
    evidenceSummary?: string | null;
    confidence?: number | null;
    dataGaps?: string | null;
    risks?: string | null;
    lastVerifiedAt?: string | null;
  } | null;
  sources?: { id?: string; title?: string | null; url?: string | null; publisher?: string | null; sourceType?: string | null; evidence?: string | null }[];
  products?: { name: string; description: string | null; url: string | null }[];
  competitors?: { name: string; websiteUrl: string | null; relationship: string | null }[];
  relatedParties?: { name: string; partyType: string | null; relationship: string | null; websiteUrl: string | null }[];
  trustmrrTechStack?: { slug: string; category: string | null }[];
  trustmrrMarketingChannels?: { slug: string; category: string | null }[];
};

function splitLines(value: string | null | undefined) {
  return value?.split("\n").map((item) => item.trim()).filter(Boolean) ?? [];
}

function EmptyState({ children = "لا توجد بيانات مسجلة بعد." }: { children?: string }) {
  return <div className="rounded-2xl bg-slate-50 px-5 py-8 text-center text-sm font-medium text-slate-500">{children}</div>;
}

function SectionTitle({
  number,
  tone,
  title,
  description,
}: {
  number: string;
  tone: "sky" | "violet" | "emerald" | "amber";
  title: string;
  description: string;
}) {
  const colors = {
    sky: "bg-sky-500/10 text-sky-600",
    violet: "bg-violet-500/10 text-violet-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    amber: "bg-amber-500/10 text-amber-600",
  } as const;

  return (
    <div className="flex items-start gap-3.5">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${colors[tone]}`}>
        {number}
      </div>
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl">{title}</h2>
        <p className="mt-1 text-xs font-medium leading-6 text-slate-500 sm:text-sm">{description}</p>
      </div>
    </div>
  );
}

function SubTabs({
  items,
  active,
  onChange,
  tone,
}: {
  items: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  tone: "sky" | "violet" | "emerald" | "amber";
}) {
  const activeColors = {
    sky: "text-sky-600 border-sky-500",
    violet: "text-violet-600 border-violet-500",
    emerald: "text-emerald-600 border-emerald-500",
    amber: "text-amber-600 border-amber-500",
  } as const;

  return (
    <div className="mt-6 flex gap-3 sm:gap-5 overflow-x-auto border-b border-slate-200/80 scrollbar-none pb-0.5">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`shrink-0 border-b-2 pb-3 text-xs font-bold transition sm:text-sm whitespace-nowrap px-1 ${
            active === item.id ? activeColors[tone] : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function DetailTile({ label, value, accent = "sky" }: { label: string; value: string; accent?: "sky" | "emerald" | "violet" | "amber" }) {
  const colors = {
    sky: "bg-sky-500/10 text-sky-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    violet: "bg-violet-500/10 text-violet-600",
    amber: "bg-amber-500/10 text-amber-600",
  } as const;

  return (
    <div className="rounded-2xl bg-slate-100/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-500">{label}</span>
        <span className={`rounded-xl px-2 py-1 text-xs font-black ${colors[accent]}`}>●</span>
      </div>
      <p className="mt-3 truncate text-base font-extrabold text-slate-950">{value}</p>
    </div>
  );
}

function TextPanel({ title, value, empty }: { title: string; value: string | null | undefined; empty: string }) {
  return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><h3 className="text-sm font-black text-amber-900">{title}</h3><p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-7 text-amber-950/75">{value || empty}</p></div>;
}

function TagPanel({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><h3 className="text-sm font-black text-amber-900">{title}</h3>{items.length ? <div className="mt-4 flex flex-wrap gap-2">{items.map((item, index) => <span key={`${item}-${index}`} className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-amber-900">{item}</span>)}</div> : <p className="mt-2 text-sm font-medium leading-7 text-amber-950/75">{empty}</p>}</div>;
}

function SwotGrid({ swot }: { swot: Record<"strengths" | "weaknesses" | "opportunities" | "threats", string[]> }) {
  const items = [
    ["نقاط القوة", swot.strengths, "bg-emerald-50 border-emerald-200 text-emerald-900"],
    ["نقاط الضعف", swot.weaknesses, "bg-rose-50 border-rose-200 text-rose-900"],
    ["الفرص", swot.opportunities, "bg-sky-50 border-sky-200 text-sky-900"],
    ["التهديدات", swot.threats, "bg-amber-50 border-amber-200 text-amber-900"],
  ] as const;
  return <div className="grid gap-4 sm:grid-cols-2">{items.map(([title, values, classes]) => <div key={title} className={`rounded-2xl border p-5 ${classes}`}><h3 className="text-sm font-black">{title}</h3>{values.length ? <ul className="mt-3 space-y-2 text-sm leading-6">{values.map((value, index) => <li key={`${value}-${index}`}>• {value}</li>)}</ul> : <p className="mt-2 text-sm opacity-70">لا توجد بيانات.</p>}</div>)}</div>;
}

export function CompanyProfileView({ company }: { company: CompanyProfileData }) {
  const [identityTab, setIdentityTab] = useState("about");
  const [ecosystemTab, setEcosystemTab] = useState("structure");
  const [fundingTab, setFundingTab] = useState("funding");
  const [strategyTab, setStrategyTab] = useState("analysis");

  const markets = company.markets.map(({ market }) => market.name);
  const llm = company.llmEnrichment;
  const competitors = company.competitors ?? [];
  const relatedParties = company.relatedParties ?? [];
  const techStack = company.trustmrrTechStack?.length
    ? company.trustmrrTechStack.map((item) => ({ slug: item.slug, category: item.category }))
    : splitLines(llm?.techStack).map((slug) => ({ slug, category: null }));
  const marketingChannels = company.trustmrrMarketingChannels?.length
    ? company.trustmrrMarketingChannels.map((item) => ({ slug: item.slug, category: item.category }))
    : splitLines(llm?.marketingChannels).map((slug) => ({ slug, category: null }));
  const audienceSegments = splitLines(llm?.audienceSegments);
  const swot = {
    strengths: splitLines(llm?.swotStrengths),
    weaknesses: splitLines(llm?.swotWeaknesses),
    opportunities: splitLines(llm?.swotOpportunities),
    threats: splitLines(llm?.swotThreats),
  };
  const country = company.country?.name || "غير محددة";
  const industry = company.industry?.name || "غير محددة";

  return (
    <article className="space-y-6" data-company-id={company.id}>
      <section id="section-summary" className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-5 sm:items-center sm:gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-2xl font-black text-slate-400 sm:h-20 sm:w-20">
                {company.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{company.name}</h1>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">● ملف موثق</span>
                </div>
                <p className="max-w-3xl text-sm font-medium leading-7 text-slate-500">
                  {company.description || "لا يوجد وصف تعريفي للشركة حتى الآن."}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{industry}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{country}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{company.slug}</span>
                </div>
              </div>
            </div>
            {company.websiteUrl && (
              <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="w-full rounded-xl bg-slate-950 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-sky-700 md:w-auto">
                زيارة موقع الشركة ↗
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="flex items-start gap-6">
        <aside className="sticky top-6 hidden w-64 shrink-0 lg:block">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="mb-3 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">فهرس ملف الشركة</div>
            <nav className="space-y-1 text-xs">
              {[
                ["main-section-1", "01", "هوية الشركة", "text-sky-700"],
                ["main-section-2", "02", "المحيط والهيكل", "text-violet-700"],
                ["main-section-3", "03", "التمويل والاستثمار", "text-emerald-700"],
                ["main-section-4", "04", "الاستراتيجية والجمهور", "text-amber-700"],
              ].map(([id, number, label, color]) => (
                <a key={id} href={`#${id}`} className={`flex items-center gap-3 rounded-xl px-3 py-3 font-bold transition hover:bg-slate-50 ${color}`}>
                  <span className="font-black">{number}</span>
                  <span>{label}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-8">
          <section id="main-section-1" className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div className="bg-slate-50/80 p-6 sm:p-7">
              <SectionTitle number="01" tone="sky" title="هوية ومعلومات الشركة" description="الملف التعريفي، البيانات الأساسية، والمعلومات التي ستتوسع لاحقًا مع مصادر MySQL." />
              <SubTabs tone="sky" active={identityTab} onChange={setIdentityTab} items={[{ id: "about", label: "حول الشركة" }, { id: "strategy", label: "النشاط والمجال" }, { id: "legal", label: "البيانات القانونية" }, { id: "tech", label: "البيانات التقنية" }]} />
            </div>
            <div className="p-6 sm:p-7">
              {identityTab === "about" && (
                <div className="space-y-6">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <h3 className="text-xs font-black uppercase tracking-wide text-sky-600">الرؤية واللمحة التعريفية</h3>
                    {llm?.vision && <p className="mt-3 text-sm font-medium leading-8 text-slate-700">{llm.vision}</p>}
                    <p className="mt-3 text-sm font-medium leading-8 text-slate-700">{company.description || "لم تتم إضافة لمحة تعريفية كاملة للشركة بعد."}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <DetailTile label="سنة التأسيس" value={company.foundedYear?.toString() || "غير محددة"} />
                    <DetailTile label="المقر الرئيسي" value={llm?.headquarters || country} />
                    <DetailTile label="الصناعة" value={industry} accent="violet" />
                    <DetailTile label="الأسواق" value={`${markets.length} أسواق`} accent="emerald" />
                    <DetailTile label="نوع الشركة" value={llm?.companyType || "غير محدد"} accent="sky" />
                    <DetailTile label="عدد الموظفين" value={llm?.employeeCount == null ? "غير محدد" : llm.employeeCount.toLocaleString("en-US")} accent="sky" />
                    {llm?.businessStatus && <DetailTile label="حالة النشاط" value={llm.businessStatus} accent="emerald" />}
                    {llm?.lastVerifiedAt && <DetailTile label="آخر تحقق" value={llm.lastVerifiedAt} accent="amber" />}
                  </div>
                </div>
              )}
              {identityTab === "strategy" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DetailTile label="نموذج النشاط" value={llm?.businessModel || industry} />
                    <DetailTile label="المجال الاستراتيجي" value={llm?.strategicDomain || industry} accent="violet" />
                    <DetailTile label="نطاق الوصول" value={llm?.reachScope || country} accent="sky" />
                    <DetailTile label="الأسواق الحالية" value={markets.join("، ") || "غير مسجلة"} accent="violet" />
                    {llm?.pricingModel && <DetailTile label="نموذج التسعير" value={llm.pricingModel} accent="amber" />}
                  </div>
                  {llm?.valueProposition && <TextPanel title="القيمة المقترحة" value={llm.valueProposition} empty="" />}
                  {llm?.targetCustomers && <TextPanel title="العملاء المستهدفون" value={llm.targetCustomers} empty="" />}
                </div>
              )}
              {identityTab === "legal" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailTile label="الاسم القانوني" value={company.legalName || company.name} />
                  <DetailTile label="المعرّف الدائم" value={company.slug} accent="violet" />
                </div>
              )}
              {identityTab === "tech" && <div className="space-y-5"><div><h3 className="text-sm font-black text-slate-900">تقنيات الشركة</h3>{techStack.length ? <div className="mt-4 flex flex-wrap gap-2">{techStack.map((item) => <span key={item.slug} className="rounded-xl bg-sky-50 px-3 py-2 text-xs font-bold text-sky-800">{item.slug}{item.category ? ` · ${item.category}` : ""}</span>)} </div> : <EmptyState>لا توجد تقنيات مسجلة بعد.</EmptyState>}</div><div><h3 className="text-sm font-black text-slate-900">قنوات التسويق</h3>{marketingChannels.length ? <div className="mt-4 flex flex-wrap gap-2">{marketingChannels.map((item) => <span key={item.slug} className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">{item.slug}{item.category ? ` · ${item.category}` : ""}</span>)} </div> : <EmptyState>لا توجد قنوات تسويق مسجلة بعد.</EmptyState>}</div></div>}
            </div>
          </section>

          <section id="main-section-2" className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div className="bg-slate-50/80 p-6 sm:p-7">
              <SectionTitle number="02" tone="violet" title="المحيط التنافسي والهيكل" description="العلاقات، الأسواق، والأطراف المرتبطة بالشركة في مساحة واحدة قابلة للتوسع." />
              <SubTabs tone="violet" active={ecosystemTab} onChange={setEcosystemTab} items={[{ id: "structure", label: "الهيكل والعلاقات" }, { id: "markets", label: "الأسواق" }, { id: "similar", label: "الشركات المماثلة" }, { id: "sectors", label: "القطاعات المرتبطة" }]} />
            </div>
            <div className="p-6 sm:p-7">
              {ecosystemTab === "structure" && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <h3 className="text-sm font-black text-slate-900">فريق الشركة</h3>
                    <div className="mt-4 space-y-3">
                      {company.people.length ? company.people.map((person) => <div key={person.id} className="flex items-center justify-between rounded-xl bg-white p-3"><span className="text-sm font-bold">{person.fullName}</span><span className="text-xs text-slate-500">{person.jobTitle || "عضو فريق"}</span></div>) : <EmptyState>لا يوجد أشخاص مرتبطون بالشركة.</EmptyState>}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <h3 className="text-sm font-black text-slate-900">الأسواق المسجلة</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {markets.length ? markets.map((market) => <span key={market} className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-violet-700">{market}</span>) : <EmptyState>لا توجد أسواق مرتبطة.</EmptyState>}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <h3 className="text-sm font-black text-slate-900">الأطراف المرتبطة</h3>
                    <div className="mt-4 space-y-2">{relatedParties.length ? relatedParties.map((party) => <div key={party.name} className="rounded-xl bg-white p-3"><p className="text-sm font-bold">{party.name}</p><p className="mt-1 text-xs text-slate-500">{[party.partyType, party.relationship].filter(Boolean).join(" · ") || "طرف مرتبط"}</p></div>) : <EmptyState>لا توجد أطراف مرتبطة.</EmptyState>}</div>
                  </div>
                  {llm?.relationshipsSummary && <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 md:col-span-2"><h3 className="text-sm font-black text-violet-900">ملخص العلاقات</h3><p className="mt-2 text-sm leading-7 text-violet-950/75">{llm.relationshipsSummary}</p></div>}
                </div>
              )}
              {ecosystemTab === "markets" && (markets.length ? <div className="grid gap-3 sm:grid-cols-2">{markets.map((market) => <div key={market} className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-800">{market}<span className="mt-2 block text-xs font-medium text-slate-500">سوق مرتبط بالشركة</span></div>)}</div> : <EmptyState />)}
              {ecosystemTab === "similar" && (competitors.length ? <div className="grid gap-3 sm:grid-cols-2">{competitors.map((competitor) => <div key={competitor.name} className="rounded-2xl bg-slate-50 p-5"><p className="font-black text-slate-900">{competitor.name}</p><p className="mt-2 text-xs text-slate-500">{competitor.relationship || "منافس"}</p>{competitor.websiteUrl && <a href={competitor.websiteUrl} target="_blank" rel="noreferrer" className="mt-3 block text-xs font-bold text-violet-700">زيارة الموقع ↗</a>}</div>)}</div> : <EmptyState>لا توجد شركات منافسة مسجلة.</EmptyState>)}
              {ecosystemTab === "sectors" && <div className="space-y-4"><DetailTile label="الصناعة الرئيسية" value={industry} accent="violet" /><TagPanel title="الفئات والقنوات ذات الصلة" items={[...new Set([...markets, ...marketingChannels.map((item) => item.category || item.slug)])]} empty="لا توجد قطاعات مرتبطة بعد." /></div>}
            </div>
          </section>

          <section id="main-section-3" className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div className="bg-slate-50/80 p-6 sm:p-7">
              <SectionTitle number="03" tone="emerald" title="التمويل والاستثمارات" description="واجهة سجل التمويل والمستثمرين، جاهزة لإضافة جولات التمويل والمبالغ ومصادرها لاحقًا." />
              <SubTabs tone="emerald" active={fundingTab} onChange={setFundingTab} items={[{ id: "funding", label: "جولات التمويل" }, { id: "investments", label: "المستثمرون" }]} />
            </div>
            <div className="p-6 sm:p-7">
              {fundingTab === "funding" && <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><DetailTile label="مرحلة التمويل" value={llm?.fundingStage || "غير محددة"} accent="emerald" /><DetailTile label="إجمالي التمويل" value={llm?.totalFundingUsd == null ? "غير محدد" : `$${Number(llm.totalFundingUsd).toLocaleString("en-US")}`} accent="emerald" /><DetailTile label="آخر تمويل" value={llm?.lastFundingDate || "غير محدد"} accent="emerald" /><DetailTile label="نطاق الإيرادات" value={llm?.revenueRange || "غير محدد"} accent="emerald" /></div><EmptyState>لا توجد جولات تمويل تفصيلية مسجلة بعد. سيتم ربطها بجدول FundingRounds مستقل لاحقًا.</EmptyState></div>}
            </div>
            {fundingTab === "investments" && (company.investors.length ? <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-right text-sm"><thead><tr className="border-b border-slate-200 text-xs text-slate-500"><th className="px-4 py-3">المستثمر</th><th className="px-4 py-3">الموقع</th><th className="px-4 py-3">الحالة</th></tr></thead><tbody>{company.investors.map(({ investor }) => <tr key={investor.name} className="border-b border-slate-100"><td className="px-4 py-4 font-bold">{investor.name}</td><td className="px-4 py-4 text-slate-500">{investor.websiteUrl || "غير متوفر"}</td><td className="px-4 py-4"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">مرتبط</span></td></tr>)}</tbody></table></div> : <EmptyState>لا يوجد مستثمرون مرتبطون بالشركة.</EmptyState>)}
          </section>

          <section id="main-section-4" className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div className="bg-slate-50/80 p-6 sm:p-7">
              <SectionTitle number="04" tone="amber" title="التحليل الاستراتيجي والجمهور" description="قسم واحد للتحليلات المتقدمة، الجمهور المستهدف، نموذج العمل، والتوسع المستقبلي." />
              <SubTabs tone="amber" active={strategyTab} onChange={setStrategyTab} items={[{ id: "analysis", label: "نظرة عامة" }, { id: "swot", label: "تحليل SWOT" }, { id: "audience", label: "الجمهور المستهدف" }, { id: "expansion", label: "التوسع والنمو" }, { id: "evidence", label: "الأدلة والمخاطر" }]} />
            </div>
            <div className="p-6 sm:p-7">
              {strategyTab === "analysis" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DetailTile label="المجال الاستراتيجي" value={llm?.strategicDomain || industry} accent="amber" />
                    <DetailTile label="نطاق الوصول" value={llm?.reachScope || markets.join("، ") || country} accent="sky" />
                  </div>
                  <TextPanel title="التحليل الاستراتيجي" value={llm?.strategicAnalysis || llm?.businessModel} empty="لم تتم إضافة التحليل الاستراتيجي بعد." />
                  {llm?.evidenceSummary && <TextPanel title="ملخص الأدلة" value={llm.evidenceSummary} empty="" />}
                  {llm?.confidence != null && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <span className="text-xs font-black text-amber-900">درجة الثقة بالبيانات</span>
                      <p className="mt-2 text-2xl font-black text-amber-700">{Math.round(llm.confidence * 100)}%</p>
                    </div>
                  )}
                </div>
              )}
              {strategyTab === "swot" && <SwotGrid swot={swot} />}
              {strategyTab === "audience" && (
                <div className="space-y-4">
                  <TagPanel title="شرائح الجمهور المستهدف" items={audienceSegments} empty="لم تتم إضافة شرائح الجمهور بعد." />
                  {llm?.targetCustomers && <TextPanel title="وصف العملاء المستهدفين" value={llm.targetCustomers} empty="" />}
                </div>
              )}
              {strategyTab === "expansion" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextPanel title="خطة التوسع" value={llm?.expansionPlan} empty="لم تتم إضافة خطة التوسع بعد." />
                  <TextPanel title="إشارات النمو" value={llm?.growthSignals} empty="لم تتم إضافة إشارات نمو بعد." />
                </div>
              )}
              {strategyTab === "evidence" && (
                <div className="space-y-4">
                  {llm?.risks && <TagPanel title="المخاطر" items={splitLines(llm.risks)} empty="لا توجد مخاطر مسجلة." />}
                  {llm?.dataGaps && <TagPanel title="فجوات البيانات" items={splitLines(llm.dataGaps)} empty="لا توجد فجوات مسجلة." />}
                  {(company.sources ?? []).length > 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                      <h3 className="text-sm font-black text-amber-900">المصادر الموثقة ({company.sources?.length})</h3>
                      <div className="mt-4 space-y-3">
                        {company.sources?.map((source, index) => (
                          <div key={source.id ?? index} className="rounded-xl bg-white p-3">
                            <p className="text-sm font-bold text-slate-900">{source.title || "مصدر بلا عنوان"}</p>
                            {source.publisher && <p className="mt-1 text-xs text-slate-500">{source.publisher} · {source.sourceType}</p>}
                            {source.url && <a href={source.url} target="_blank" rel="noreferrer" className="mt-1 block text-xs font-bold text-sky-700 hover:underline">{source.url}</a>}
                            {source.evidence && <p className="mt-2 text-xs leading-5 text-slate-600">{source.evidence}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!(company.sources ?? []).length && !llm?.risks && !llm?.dataGaps && <EmptyState>لا توجد أدلة أو مخاطر مسجلة بعد.</EmptyState>}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}

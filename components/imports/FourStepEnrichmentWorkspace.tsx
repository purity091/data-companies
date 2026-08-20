"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  Copy,
  ExternalLink,
  FileCheck2,
  Globe2,
  Layers3,
  RefreshCw,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { enrichmentPromptDefinitions, buildEnrichmentPrompt } from "@/modules/imports/llm-enrichment.prompts";
import type { LlmEnrichmentBundle } from "@/modules/imports/llm-enrichment.validation";
import { CompanyProfileView, type CompanyProfileData } from "@/components/companies/CompanyProfileView";
import { Button } from "@/components/ui/button";

type PartKey = "identity" | "business" | "peopleFinance" | "evidence";
type ReviewKey = "summary" | PartKey;
type Parts = Record<PartKey, string>;
type Issue = { severity: "error" | "warning"; field: string; message: string };

type PreviewSource = {
  title?: string | null;
  url: string;
  publisher?: string | null;
  sourceType?: string;
  accessedAt?: string | null;
  evidence?: string | null;
};

type PreviewPerson = { fullName: string; jobTitle?: string | null; linkedinUrl?: string | null };
type PreviewInvestor = { name: string; slug?: string | null; websiteUrl?: string | null };
type PreviewProduct = { name: string; description?: string | null; url?: string | null };
type PreviewCompetitor = { name: string; websiteUrl?: string | null; relationship?: string | null };
type PreviewRelatedParty = { name: string; partyType?: string | null; relationship?: string | null; websiteUrl?: string | null };
type PreviewCompany = {
  name: string;
  legalName?: string | null;
  description?: string | null;
  websiteUrl?: string | null;
  foundedYear?: number | null;
  countryName?: string | null;
  industryName?: string | null;
  people: PreviewPerson[];
  investors: PreviewInvestor[];
  markets: string[];
  sources: PreviewSource[];
};

const emptyParts: Parts = { identity: "", business: "", peopleFinance: "", evidence: "" };

const partKeys: PartKey[] = ["identity", "business", "peopleFinance", "evidence"];

function issuePart(issue: Issue, fallback: PartKey): PartKey {
  const candidate = issue.field.split(".")[0] as PartKey;
  return partKeys.includes(candidate) ? candidate : fallback;
}

function buildRepairPrompt(parts: Parts, issues: Issue[], selectedIssue?: Issue, active: PartKey = "identity") {
  const stage = selectedIssue ? issuePart(selectedIssue, active) : null;
  const relevantIssues = selectedIssue
    ? issues.filter((issue) => issue.field === stage || issue.field.startsWith(`${stage}.`) || issue.field === selectedIssue.field)
    : issues;
  const content = stage
    ? `المرحلة: ${stage}\n${parts[stage] || "لا يوجد JSON مدخل لهذه المرحلة."}`
    : partKeys.filter((key) => parts[key].trim()).map((key) => `المرحلة: ${key}\n${parts[key]}`).join("\n\n");

  return `أنت مصلح JSON متخصص. أصلح JSON التالي بناءً على ملاحظات التحقق.

القواعد:
- أعد JSON صالحًا فقط، دون Markdown أو شرح خارج JSON.
- لا تغيّر البيانات الصحيحة ولا تخترع معلومات جديدة.
- عالج الأخطاء المذكورة فقط، وحافظ على أسماء الحقول المطلوبة.
- عند غياب قيمة استخدم null أو [] حسب نوع الحقل.
- اجعل النصوص الوصفية باللغة العربية.

ملاحظات التحقق:
${relevantIssues.map((issue) => `- ${issue.field}: ${issue.message}`).join("\n") || "راجع صحة البنية العامة ونسّق JSON فقط."}

JSON المطلوب إصلاحه:
${content}

أعد النسخة المصححة فقط لتتمكن من لصقها مباشرة في خانة ${stage || "المرحلة المناسبة"}.`;
}

function RepairPromptButton({ prompt, label = "نسخ تعليمات الإصلاح" }: { prompt: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <button type="button" onClick={() => void copy()} className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-800 hover:bg-sky-100"><Copy className="size-3.5" />{copied ? "تم النسخ" : label}</button>;
}

function IssueList({ issues, parts, active }: { issues: Issue[]; parts: Parts; active: PartKey }) {
  return <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="font-black text-slate-950">نتيجة التحقق</h2><p className="mt-1 text-xs text-slate-500">يمكنك نسخ تعليمات جاهزة وإرسالها إلى ChatGPT أو أي LLM لإصلاح JSON.</p></div>
      <RepairPromptButton prompt={buildRepairPrompt(parts, issues, undefined, active)} />
    </div>
    <div className="mt-4 space-y-2">
      {issues.map((issue, index) => <div key={`${issue.field}-${index}`} className={`flex flex-wrap items-start justify-between gap-3 rounded-2xl p-3 text-sm ${issue.severity === "error" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-900"}`}>
        <div className="flex min-w-0 flex-1 items-start gap-3"><span className="mt-0.5"><AlertTriangle className="size-4" /></span><span><b dir="ltr" className="font-mono text-xs">{issue.field}</b><span className="mx-2">—</span>{issue.message}</span></div>
        <RepairPromptButton label="نسخ إصلاح" prompt={buildRepairPrompt(parts, issues, issue, active)} />
      </div>)}
    </div>
  </div>;
}

const reviewItems: { id: ReviewKey; label: string; short: string; icon: typeof Building2 }[] = [
  { id: "summary", label: "الملخص", short: "نظرة عامة", icon: FileCheck2 },
  { id: "identity", label: "هوية الشركة", short: "الملف الأساسي", icon: Building2 },
  { id: "business", label: "العمل والمنتجات", short: "السوق والمنتج", icon: Layers3 },
  { id: "peopleFinance", label: "الفريق والتمويل", short: "الأشخاص والمال", icon: Users },
  { id: "evidence", label: "الأدلة والجودة", short: "الثقة والفجوات", icon: ShieldCheck },
];

export function FourStepEnrichmentWorkspace() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyHint, setCompanyHint] = useState("");
  const [parts, setParts] = useState<Parts>(emptyParts);
  const [active, setActive] = useState<PartKey>("identity");
  const [reviewTab, setReviewTab] = useState<ReviewKey>("summary");
  const [preview, setPreview] = useState<PreviewCompany | null>(null);
  const [enrichment, setEnrichment] = useState<LlmEnrichmentBundle | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCompanyId(params.get("companyId"));
  }, []);

  const activeDefinition = useMemo(() => enrichmentPromptDefinitions.find((item) => item.id === active), [active]);
  const enteredCount = Object.values(parts).filter((value) => value.trim()).length;

  async function copyPrompt() {
    if (!activeDefinition) return;
    await navigator.clipboard.writeText(buildEnrichmentPrompt(activeDefinition, companyHint));
    setStatus("تم نسخ التعليمة. ألصقها في ChatGPT أو Perplexity ثم أعد JSON هنا.");
  }

  async function previewBundle() {
    setLoading(true);
    setError(null);
    setStatus(null);
    setPreview(null);
    try {
      const response = await fetch("/api/imports/enrichment/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parts, companyId: companyId || undefined }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error([body.error, body.details].filter(Boolean).join(": ") || "تعذر التحقق من التعليمات الأربع");
      setPreview(body.data as PreviewCompany);
      setEnrichment(body.enrichment as LlmEnrichmentBundle | null);
      setIssues(body.issues || []);
      setReviewTab("summary");
      setStatus(body.canCommit ? "اكتملت المراجعة. البيانات أدناه هي التي ستدخل إلى قاعدة البيانات." : "راجع الأخطاء المشار إليها قبل الحفظ.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "تعذر التحقق من JSON");
    } finally {
      setLoading(false);
    }
  }

  async function commitBundle() {
    if (!preview || !enrichment || issues.some((issue) => issue.severity === "error")) return;
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const response = await fetch("/api/imports/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: preview, enrichment, companyId: companyId || undefined }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error([body.error, body.details].filter(Boolean).join(": ") || "تعذر حفظ الإثراء");
      setStatus(`تم حفظ ${body.data.name} مع بيانات الإثراء والمصادر والمنتجات والمنافسين.`);
      setPreview(null);
      setEnrichment(null);
      setIssues([]);
      setParts(emptyParts);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "تعذر حفظ البيانات");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/companies" className="inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:text-sky-900">
              <ArrowLeft className="size-4" /> العودة إلى الشركات
            </Link>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">إثراء الشركة عبر 4 تعليمات JSON</h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">أدخل نتائج النماذج اللغوية على مراحل، ثم راجع كل قيمة وقائمة ومصدر قبل اعتمادها.</p>
          </div>
          <Link href="/companies/new"><Button variant="outline">إدخال يدوي</Button></Link>
        </header>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <GuideCard icon={<Globe2 className="size-5" />} title="اجمع" text="انسخ التعليمة المناسبة وأرسلها إلى النموذج." />
          <GuideCard icon={<FileCheck2 className="size-5" />} title="راجع" text="تحقق من البيانات المنظمة والمصادر والفجوات." />
          <GuideCard icon={<ShieldCheck className="size-5" />} title="اعتمد" text="لا يتم الحفظ إلا بعد ضغط زر الاعتماد." />
        </div>

        <div className="mt-6 rounded-3xl border border-sky-200 bg-sky-50 p-5 text-sm leading-7 text-sky-950">
          <p className="font-black">قاعدة الجودة</p>
          <p>لا تخمّن. استخدم <code className="rounded bg-white px-1.5 py-0.5">null</code> أو قائمة فارغة عند غياب الدليل. التحذيرات لا تمنع الحفظ، أما الأخطاء فتحتاج إلى تصحيح.</p>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <label className="text-sm font-black text-slate-800">اسم الشركة أو رابطها</label>
              <p className="mt-1 text-xs text-slate-500">استخدمه لتخصيص التعليمة عندما تنشئ شركة جديدة.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{enteredCount} / 4 تعليمات مدخلة</span>
          </div>
          <input value={companyHint} onChange={(event) => setCompanyHint(event.target.value)} className="form-input mt-4" placeholder="مثال: https://example.com أو اسم الشركة" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-2 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
            {enrichmentPromptDefinitions.map((definition, index) => {
              const filled = Boolean(parts[definition.id].trim());
              return <button key={definition.id} type="button" onClick={() => setActive(definition.id)} className={`flex w-full items-start gap-3 rounded-2xl p-4 text-right transition ${active === definition.id ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-100"}`}>
                <span className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${active === definition.id ? "bg-white/15 text-white" : filled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{filled ? <Check className="size-4" /> : index + 1}</span>
                <span><p className="font-black">{definition.title}</p><p className={`mt-1 text-xs leading-5 ${active === definition.id ? "text-slate-300" : "text-slate-500"}`}>{definition.purpose}</p></span>
              </button>;
            })}
          </aside>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            {activeDefinition && <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div><p className="text-xs font-black uppercase tracking-widest text-sky-600">{activeDefinition.instructionId}</p><h2 className="mt-1 text-xl font-black text-slate-950">{activeDefinition.title}</h2><p className="mt-2 text-sm text-slate-500">الحقول: {activeDefinition.fields.join(", ")}</p></div>
                <Button type="button" variant="secondary" onClick={() => void copyPrompt()}>نسخ التعليمة</Button>
              </div>
              <textarea value={parts[active]} onChange={(event) => setParts((current) => ({ ...current, [active]: event.target.value }))} className="mt-5 min-h-[380px] w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-7 text-slate-800 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100" placeholder="ألصق JSON الناتج هنا..." spellCheck={false} />
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => setActive(enrichmentPromptDefinitions[(enrichmentPromptDefinitions.findIndex((item) => item.id === active) + 1) % enrichmentPromptDefinitions.length].id)}>المرحلة التالية <ChevronLeft className="size-4" /></Button>
                <Button type="button" onClick={() => void previewBundle()} disabled={loading}><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> مراجعة البيانات</Button>
              </div>
            </>}
          </section>
        </div>

        {(error || status) && <div className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 text-sm leading-7 ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{error ? <AlertTriangle className="mt-1 size-5 shrink-0" /> : <CheckCircle2 className="mt-1 size-5 shrink-0" />}<span>{error || status}</span></div>}
        {issues.length > 0 && <IssueList issues={issues} parts={parts} active={active} />}

        {preview && enrichment && <CompanyPreviewBeforeCommit preview={preview} enrichment={enrichment} companyId={companyId} issues={issues} loading={loading} onCommit={() => void commitBundle()} />}
      </div>
    </main>
  );
}

function buildProfilePreview(preview: PreviewCompany, enrichment: LlmEnrichmentBundle, companyId: string | null): CompanyProfileData {
  const identity = enrichment.identity;
  const business = enrichment.business;
  const finance = enrichment.peopleFinance;
  const evidence = enrichment.evidence;
  const companyKey = identity?.companyKey || business?.companyKey || finance?.companyKey || evidence?.companyKey || preview.name;
  const slug = companyId || companyKey.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "preview";
  const markets = business?.markets ?? preview.markets;

  return {
    id: companyId || "preview",
    slug,
    name: preview.name,
    legalName: preview.legalName ?? null,
    description: preview.description ?? null,
    websiteUrl: preview.websiteUrl ?? null,
    foundedYear: preview.foundedYear ?? null,
    country: preview.countryName ? { name: preview.countryName, code: "" } : null,
    industry: preview.industryName ? { name: preview.industryName } : null,
    people: preview.people.map((person, index) => ({ id: `preview-person-${index}`, fullName: person.fullName, jobTitle: person.jobTitle ?? null })),
    markets: markets.map((name, index) => ({ companyId: "preview", marketId: `preview-market-${index}`, market: { id: `preview-market-${index}`, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name } })),
    investors: preview.investors.map((item) => ({ investor: { name: item.name, websiteUrl: item.websiteUrl ?? null } })),
    llmEnrichment: {
      companyType: identity?.companyType ?? null,
      employeeCount: identity?.employeeCount ?? null,
      techStack: identity?.techStack?.join("\n") ?? null,
      marketingChannels: identity?.marketingChannels?.join("\n") ?? null,
      businessModel: business?.businessModel ?? null,
      relationshipsSummary: business?.relationshipsSummary ?? null,
      strategicDomain: evidence?.strategicDomain ?? null,
      reachScope: evidence?.reachScope ?? null,
      audienceSegments: evidence?.audienceSegments?.join("\n") ?? null,
      strategicAnalysis: evidence?.strategicAnalysis ?? null,
      growthSignals: evidence?.growthSignals ?? null,
      expansionPlan: evidence?.expansionPlan ?? null,
      swotStrengths: evidence?.swot?.strengths?.join("\n") ?? null,
      swotWeaknesses: evidence?.swot?.weaknesses?.join("\n") ?? null,
      swotOpportunities: evidence?.swot?.opportunities?.join("\n") ?? null,
      swotThreats: evidence?.swot?.threats?.join("\n") ?? null,
      fundingStage: finance?.fundingStage ?? null,
      totalFundingUsd: finance?.totalFundingUsd ?? null,
      lastFundingDate: finance?.lastFundingDate ?? null,
      revenueRange: finance?.revenueRange ?? null,
    },
    products: (business?.products ?? []).map((item) => ({ name: item.name, description: item.description ?? null, url: item.url ?? null })),
    competitors: (business?.competitors ?? []).map((item) => ({ name: item.name, websiteUrl: item.websiteUrl ?? null, relationship: item.relationship ?? null })),
    relatedParties: (business?.relatedParties ?? []).map((item) => ({ name: item.name, partyType: item.partyType ?? null, relationship: item.relationship ?? null, websiteUrl: item.websiteUrl ?? null })),
    trustmrrTechStack: [],
    trustmrrMarketingChannels: [],
  };
}

function CompanyPreviewBeforeCommit({ preview, enrichment, companyId, issues, loading, onCommit }: { preview: PreviewCompany; enrichment: LlmEnrichmentBundle; companyId: string | null; issues: Issue[]; loading: boolean; onCommit: () => void }) {
  const hasErrors = issues.some((issue) => issue.severity === "error");
  return <section className="mt-8"><div className="mb-5 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-sm font-black text-emerald-700"><CheckCircle2 className="size-4" /> معاينة مطابقة لصفحة الشركة</div><p className="mt-2 text-sm leading-7 text-slate-600">هذه هي نفس الأقسام والتبويبات التي ستظهر بعد الحفظ. راجعها كما سيرى المستخدم الملف النهائي.</p></div><span className={`rounded-full px-3 py-2 text-xs font-black ${hasErrors ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{hasErrors ? "توجد أخطاء تمنع الحفظ" : "جاهزة للمراجعة والاعتماد"}</span></div><CompanyProfileView company={buildProfilePreview(preview, enrichment, companyId)} /><div className="mt-6 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-7 text-slate-600">سيتم حفظ البيانات المنظمة بعد اعتمادك، مع الاحتفاظ بالبيانات السابقة عند تحديث شركة موجودة.</p><Button className="min-w-52" onClick={onCommit} disabled={loading || hasErrors}>{loading ? "جارٍ الحفظ..." : "اعتماد وحفظ البيانات"}</Button></div></section>;
}

function ReviewPanel({ preview, enrichment, issues, reviewTab, setReviewTab, loading, onCommit }: { preview: PreviewCompany; enrichment: LlmEnrichmentBundle; issues: Issue[]; reviewTab: ReviewKey; setReviewTab: (tab: ReviewKey) => void; loading: boolean; onCommit: () => void }) {
  const sources = uniqueSources([
    ...preview.sources,
    ...(enrichment.identity?.sources ?? []).map(toPreviewSource),
    ...(enrichment.business?.sources ?? []).map(toPreviewSource),
    ...(enrichment.peopleFinance?.sources ?? []).map(toPreviewSource),
    ...(enrichment.evidence?.sources ?? []).map(toPreviewSource),
  ].filter((source): source is PreviewSource => Boolean(source)));
  const products: PreviewProduct[] = enrichment.business?.products ?? [];
  const competitors: PreviewCompetitor[] = enrichment.business?.competitors ?? [];
  const relatedParties: PreviewRelatedParty[] = enrichment.business?.relatedParties ?? [];
  const people: PreviewPerson[] = (enrichment.peopleFinance?.people ?? preview.people).map((person) => ({ fullName: person.fullName, jobTitle: person.jobTitle, linkedinUrl: person.linkedinUrl }));
  const investors: PreviewInvestor[] = (enrichment.peopleFinance?.investors ?? preview.investors).map((investor) => ({ name: investor.name, slug: investor.slug, websiteUrl: investor.websiteUrl }));
  const hasErrors = issues.some((issue) => issue.severity === "error");
  const activeReview = reviewItems.find((item) => item.id === reviewTab) ?? reviewItems[0];

  return <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-300 bg-white shadow-xl shadow-slate-200/50">
    <div className="border-b border-slate-200 bg-gradient-to-l from-slate-950 to-slate-800 p-6 text-white sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex items-center gap-2 text-xs font-bold text-emerald-300"><CheckCircle2 className="size-4" /> مراجعة آمنة قبل الحفظ</div><h2 className="mt-2 text-2xl font-black">{preview.name}</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">هذه معاينة موحدة للبيانات التي ستُحفظ. انتقل بين الأقسام للتأكد من الحقول والقوائم والمصادر.</p></div><div className={`rounded-2xl border px-4 py-3 text-sm font-bold ${hasErrors ? "border-red-300/30 bg-red-500/15 text-red-200" : "border-emerald-300/30 bg-emerald-500/15 text-emerald-200"}`}>{hasErrors ? "تحتاج إلى تصحيح" : "جاهزة للاعتماد"}</div></div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7"><ReviewCount icon={<Users className="size-4" />} label="الأشخاص" value={people.length} /><ReviewCount icon={<WalletCards className="size-4" />} label="المستثمرون" value={investors.length} /><ReviewCount icon={<Layers3 className="size-4" />} label="المنتجات" value={products.length} /><ReviewCount icon={<Globe2 className="size-4" />} label="الأسواق" value={(enrichment.business?.markets ?? preview.markets).length} /><ReviewCount icon={<Building2 className="size-4" />} label="المنافسون" value={competitors.length} /><ReviewCount icon={<FileCheck2 className="size-4" />} label="المصادر" value={sources.length} /><ReviewCount icon={<ShieldCheck className="size-4" />} label="المراحل" value={Object.keys(enrichment).length} /></div>
    </div>

    <div className="border-b border-slate-200 bg-slate-50 p-3"><div className="flex gap-2 overflow-x-auto">{reviewItems.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => setReviewTab(item.id)} className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${reviewTab === item.id ? "bg-white text-sky-700 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:bg-white"}`}><Icon className="size-4" />{item.label}</button>; })}</div></div>

    <div className="p-6 sm:p-8"><div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-sky-600">{activeReview.short}</p><h3 className="mt-1 text-xl font-black text-slate-950">{activeReview.label}</h3></div><span className="text-xs text-slate-500">القيم المعروضة هي القيم النهائية</span></div>
      {reviewTab === "summary" && <SummaryReview preview={preview} enrichment={enrichment} sources={sources} />}
      {reviewTab === "identity" && <IdentityReview preview={preview} enrichment={enrichment} sources={sources} />}
      {reviewTab === "business" && <BusinessReview preview={preview} enrichment={enrichment} products={products} competitors={competitors} relatedParties={relatedParties} />}
      {reviewTab === "peopleFinance" && <PeopleFinanceReview enrichment={enrichment} people={people} investors={investors} />}
      {reviewTab === "evidence" && <EvidenceReview enrichment={enrichment} sources={sources} />}
    </div>

    <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-6 text-slate-600">بعد الاعتماد ستُحفظ البيانات المنظمة، ولن يتم تخزين نص التعليمات الخام.</p><Button className="min-w-48" onClick={onCommit} disabled={loading || hasErrors}>{loading ? "جارٍ الحفظ..." : "اعتماد وحفظ البيانات"}</Button></div>
  </section>;
}

function SummaryReview({ preview, enrichment, sources }: { preview: PreviewCompany; enrichment: LlmEnrichmentBundle; sources: PreviewSource[] }) {
  const fields = [
    ["الاسم", preview.name], ["الاسم القانوني", preview.legalName], ["الدولة", preview.countryName], ["الصناعة", preview.industryName], ["سنة التأسيس", preview.foundedYear], ["الموقع", preview.websiteUrl],
  ];
  const missing = fields.filter(([, value]) => value === null || value === undefined || value === "").map(([label]) => label);
  return <div className="space-y-5"><div className="grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><p className="text-sm font-black text-emerald-900">سيتم حفظ</p><p className="mt-2 text-2xl font-black text-emerald-950">{Object.keys(enrichment).length} مراحل إثراء</p><p className="mt-1 text-xs text-emerald-800">مع {sources.length.toLocaleString("en-US")} مصدرًا قابلًا للتحقق.</p></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="text-sm font-black text-amber-900">حقول تحتاج لاحقًا</p><p className="mt-2 text-2xl font-black text-amber-950">{missing.length.toLocaleString("en-US")}</p><p className="mt-1 text-xs text-amber-800">يمكن تحسينها في مراجعة لاحقة دون فقد البيانات الحالية.</p></div></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{fields.map(([label, value]) => <ReviewField key={String(label)} label={String(label)} value={value} />)}</div><TextBox label="الوصف" value={preview.description} /></div>;
}

function IdentityReview({ preview, enrichment, sources }: { preview: PreviewCompany; enrichment: LlmEnrichmentBundle; sources: PreviewSource[] }) { return <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><ReviewField label="الاسم" value={preview.name} /><ReviewField label="الاسم القانوني" value={preview.legalName} /><ReviewField label="الدولة" value={preview.countryName} /><ReviewField label="الصناعة" value={preview.industryName} /><ReviewField label="المقر" value={enrichment.identity?.headquarters} /><ReviewField label="نوع الشركة" value={enrichment.identity?.companyType} /><ReviewField label="الموظفون" value={enrichment.identity?.employeeCount} /><ReviewField label="سنة التأسيس" value={preview.foundedYear} /></div><TextBox label="الوصف" value={preview.description} /><SourceList sources={sources} /> </div>; }

function BusinessReview({ preview, enrichment, products, competitors, relatedParties }: { preview: PreviewCompany; enrichment: LlmEnrichmentBundle; products: PreviewProduct[]; competitors: PreviewCompetitor[]; relatedParties: PreviewRelatedParty[] }) { const business = enrichment.business; return <div className="space-y-5"><div className="grid gap-4 lg:grid-cols-2"><TextBox label="نموذج العمل" value={business?.businessModel} /><TextBox label="القيمة المقترحة" value={business?.valueProposition} /><TextBox label="العملاء المستهدفون" value={business?.targetCustomers} /><TextBox label="نموذج التسعير" value={business?.pricingModel} /><TextBox label="ملخص العلاقات" value={business?.relationshipsSummary} /></div><TagList title="الأسواق" items={business?.markets ?? preview.markets} /><div className="grid gap-5 lg:grid-cols-3"><ItemList title="المنتجات" empty="لم يتم إدخال منتجات" items={products.map((item) => ({ title: item.name, text: item.description, url: item.url }))} /><ItemList title="المنافسون" empty="لم يتم إدخال منافسين" items={competitors.map((item) => ({ title: item.name, text: item.relationship, url: item.websiteUrl }))} /><ItemList title="الأطراف المرتبطة" empty="لم يتم إدخال أطراف مرتبطة" items={relatedParties.map((item) => ({ title: item.name, text: [item.partyType, item.relationship].filter(Boolean).join(" · "), url: item.websiteUrl }))} /></div></div>; }

function PeopleFinanceReview({ enrichment, people, investors }: { enrichment: LlmEnrichmentBundle; people: PreviewPerson[]; investors: PreviewInvestor[] }) { const finance = enrichment.peopleFinance; return <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><ReviewField label="مرحلة التمويل" value={finance?.fundingStage} /><ReviewField label="إجمالي التمويل" value={finance?.totalFundingUsd == null ? null : `$${Number(finance.totalFundingUsd).toLocaleString("en-US")}`} /><ReviewField label="آخر تمويل" value={finance?.lastFundingDate} /><ReviewField label="نطاق الإيرادات" value={finance?.revenueRange} /><ReviewField label="حالة النشاط" value={finance?.businessStatus} /></div><div className="grid gap-5 lg:grid-cols-2"><PersonList people={people} /><ItemList title="المستثمرون" empty="لم يتم إدخال مستثمرين" items={investors.map((item) => ({ title: item.name, text: item.slug || item.websiteUrl, url: item.websiteUrl }))} /></div></div>; }

function EvidenceReview({ enrichment, sources }: { enrichment: LlmEnrichmentBundle; sources: PreviewSource[] }) { const evidence = enrichment.evidence; const swot = evidence?.swot; return <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-3"><ReviewField label="درجة الثقة" value={evidence?.confidence == null ? null : `${(evidence.confidence * 100).toLocaleString("en-US", { maximumFractionDigits: 1 })}%`} /><ReviewField label="آخر تحقق" value={evidence?.lastVerifiedAt} /><ReviewField label="عدد المصادر" value={sources.length} /></div><div className="grid gap-4 lg:grid-cols-2"><ReviewField label="المجال الاستراتيجي" value={evidence?.strategicDomain} /><ReviewField label="نطاق الوصول" value={evidence?.reachScope} /></div><TextBox label="التحليل الاستراتيجي" value={evidence?.strategicAnalysis} /><TextBox label="خطة التوسع" value={evidence?.expansionPlan} /><TextBox label="إشارات النمو" value={evidence?.growthSignals} /><TagList title="الجمهور المستهدف" items={evidence?.audienceSegments ?? []} empty="لم تتم إضافة شرائح الجمهور" /><div className="grid gap-4 sm:grid-cols-2"><TagList title="نقاط القوة" items={swot?.strengths ?? []} /><TagList title="نقاط الضعف" items={swot?.weaknesses ?? []} /><TagList title="الفرص" items={swot?.opportunities ?? []} /><TagList title="التهديدات" items={swot?.threats ?? []} /></div><TextBox label="ملخص الأدلة" value={evidence?.evidenceSummary} /><TagList title="فجوات البيانات" items={evidence?.dataGaps ?? []} empty="لا توجد فجوات مسجلة" /><TagList title="المخاطر" items={evidence?.risks ?? []} empty="لا توجد مخاطر مسجلة" /><SourceList sources={sources} /></div>; }

function GuideCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">{icon}</span><div><p className="font-black text-slate-900">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div></div>; }
function ReviewCount({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) { return <div className="rounded-2xl border border-white/10 bg-white/10 p-3"><div className="flex items-center gap-2 text-slate-300">{icon}<span className="text-[11px] font-bold">{label}</span></div><p className="mt-2 text-xl font-black">{value.toLocaleString("en-US")}</p></div>; }
function ReviewField({ label, value }: { label: string; value: unknown }) { const display = value === null || value === undefined || value === "" ? "غير متوفر" : String(value); return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">{label}</p><p className={`mt-2 break-words text-sm font-black ${display === "غير متوفر" ? "text-slate-400" : "text-slate-900"}`}>{display}</p></div>; }
function TextBox({ label, value }: { label: string; value: unknown }) { if (value === null || value === undefined || value === "") return <div className="rounded-2xl border border-dashed border-slate-200 p-4"><p className="text-sm font-black text-slate-500">{label}</p><p className="mt-2 text-sm text-slate-400">غير متوفر حاليًا</p></div>; return <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm font-black text-slate-800">{label}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{String(value)}</p></div>; }
function TagList({ title, items, empty = "لا توجد بيانات" }: { title: string; items?: string[]; empty?: string }) { return <div><p className="mb-2 text-sm font-black text-slate-800">{title}</p>{items?.length ? <div className="flex flex-wrap gap-2">{items.map((item, index) => <span key={`${item}-${index}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">{item}</span>)}</div> : <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">{empty}</p>}</div>; }
function ItemList({ title, empty, items }: { title: string; empty: string; items: { title: string; text?: string | null; url?: string | null }[] }) { return <div><p className="mb-2 text-sm font-black text-slate-800">{title}</p>{items.length ? <div className="space-y-2">{items.map((item, index) => <div key={`${item.title}-${index}`} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 p-4"><div><p className="font-black text-slate-900">{item.title}</p>{item.text && <p className="mt-1 text-sm leading-6 text-slate-500">{item.text}</p>}</div>{item.url && <a href={item.url} target="_blank" rel="noreferrer" aria-label={`فتح ${item.title}`} className="text-sky-700 hover:text-sky-950"><ExternalLink className="size-4" /></a>}</div>)}</div> : <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">{empty}</p>}</div>; }
function PersonList({ people }: { people: PreviewPerson[] }) { return <div><p className="mb-2 text-sm font-black text-slate-800">الأشخاص</p>{people.length ? <div className="space-y-2">{people.map((person, index) => <div key={`${person.fullName}-${index}`} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-3"><p className="font-black text-slate-900">{person.fullName}</p>{person.linkedinUrl && <a href={person.linkedinUrl} target="_blank" rel="noreferrer" className="text-sky-700"><ExternalLink className="size-4" /></a>}</div><p className="mt-1 text-sm text-slate-500">{person.jobTitle || "المسمى الوظيفي غير متوفر"}</p></div>)}</div> : <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">لم يتم إدخال أشخاص</p>}</div>; }
function SourceList({ sources }: { sources: PreviewSource[] }) { return <div><div className="mb-2 flex items-center justify-between"><p className="text-sm font-black text-slate-800">المصادر</p><span className="text-xs text-slate-500">{sources.length.toLocaleString("en-US")} مصدر</span></div>{sources.length ? <div className="grid gap-3 lg:grid-cols-2">{sources.map((source, index) => <a key={`${source.url}-${index}`} href={source.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-sky-50/50"><div className="flex items-start justify-between gap-3"><p className="font-black text-slate-900">{source.title || "مصدر غير معن"}</p><ExternalLink className="size-4 shrink-0 text-sky-700" /></div><p className="mt-2 truncate text-xs text-slate-500" dir="ltr">{source.url}</p>{source.publisher && <p className="mt-2 text-xs font-bold text-slate-600">{source.publisher}</p>}{source.evidence && <p className="mt-2 text-sm leading-6 text-slate-600">{source.evidence}</p>}</a>)}</div> : <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">لا توجد مصادر صالحة للعرض.</p>}</div>; }
function toPreviewSource(source: { title?: string | null; url?: string | null; publisher?: string | null; sourceType?: string; accessedAt?: string | null; evidence?: string | null }): PreviewSource | null { return source.url ? { title: source.title, url: source.url, publisher: source.publisher, sourceType: source.sourceType, accessedAt: source.accessedAt, evidence: source.evidence } : null; }
function uniqueSources(sources: PreviewSource[]) { return [...new Map(sources.filter((source) => source.url).map((source) => [source.url, source])).values()]; }

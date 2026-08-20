"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, FileCheck2, RefreshCw, X } from "lucide-react";
import { enrichmentPromptSlices, buildEnrichmentPrompt } from "@/modules/imports/llm-enrichment.prompts";
import type { EnrichmentPromptSlice } from "@/modules/imports/llm-enrichment.prompts";
import type { LlmEnrichmentBundle } from "@/modules/imports/llm-enrichment.validation";
import { Button } from "@/components/ui/button";

type Issue = { severity: "error" | "warning"; field: string; message: string };
type SliceParts = Record<string, string>;
type CompanyForAi = {
  id: string;
  name: string;
  legalName: string | null;
  websiteUrl: string | null;
  country: { name: string; code: string } | null;
  industry: { name: string } | null;
  people: { fullName: string; jobTitle: string | null }[];
  markets: { market: { name: string } }[];
  investors: { investor: { name: string } }[];
};
type PreviewResponse = {
  data: Record<string, unknown> | null;
  enrichment: LlmEnrichmentBundle | null;
  issues: Issue[];
  canCommit: boolean;
};

const emptySliceParts: SliceParts = Object.fromEntries(enrichmentPromptSlices.map((slice) => [slice.sliceId, ""]));

function partLabel(slice: EnrichmentPromptSlice) {
  return slice.title;
}

export function CompanyAiEditModal({
  company,
  open,
  onClose,
  onSaved,
}: {
  company: CompanyForAi;
  open: boolean;
  onClose: () => void;
  onSaved: (company: Record<string, unknown>) => void;
}) {
  const [activeId, setActiveId] = useState(enrichmentPromptSlices[0].sliceId);
  const [parts, setParts] = useState<SliceParts>(emptySliceParts);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeSlice = useMemo(() => enrichmentPromptSlices.find((slice) => slice.sliceId === activeId) ?? enrichmentPromptSlices[0]!, [activeId]);
  const companyHint = useMemo(() => [
    `اسم الشركة: ${company.name}`,
    `الرابط الرسمي: ${company.websiteUrl || "غير متوفر"}`,
    `الاسم القانوني: ${company.legalName || "غير متوفر"}`,
    `الدولة: ${company.country?.name || "غير محددة"}`,
    `المجال: ${company.industry?.name || "غير محدد"}`,
    `الأسواق الحالية: ${company.markets.map(({ market }) => market.name).join(", ") || "لا توجد"}`,
    `الأشخاص المسجلون: ${company.people.length}`,
    `المستثمرون المسجلون: ${company.investors.length}`,
  ].join("\n"), [company]);
  const prompt = useMemo(() => activeSlice ? buildEnrichmentPrompt(activeSlice, companyHint) : "", [activeSlice, companyHint]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, onClose, open]);

  useEffect(() => {
    if (!open) {
      setParts(emptySliceParts);
      setIssues([]);
      setStatus(null);
      setError(null);
      setActiveId(enrichmentPromptSlices[0].sliceId);
    }
  }, [open]);

  if (!open) return null;

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setStatus("تم نسخ التعليمة. ألصقها في ChatGPT أو أي LLM ثم أعد JSON لهذا الجزء فقط.");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("تعذر النسخ التلقائي. انسخ النص من مربع التعليمة يدويًا.");
    }
  }

  async function previewSlice(): Promise<PreviewResponse> {
    if (!parts[activeSlice.sliceId]?.trim()) throw new Error("ألصق JSON لهذا الجزء أولًا.");
    const requestParts = { identity: "", business: "", peopleFinance: "", evidence: "" };
    requestParts[activeSlice.part] = parts[activeSlice.sliceId];
    const response = await fetch("/api/imports/enrichment/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: company.id, parts: requestParts }),
    });
    const body = await response.json() as PreviewResponse & { error?: string; details?: string };
    if (!response.ok) throw new Error([body.error, body.details].filter(Boolean).join(": ") || "تعذر تحليل JSON");
    setIssues((body.issues || []).filter((issue) => issue.field === activeSlice.part || issue.field.startsWith(`${activeSlice.part}.`)));
    if (body.enrichment?.[activeSlice.part]) setParts((current) => ({ ...current, [activeSlice.sliceId]: JSON.stringify(body.enrichment?.[activeSlice.part], null, 2) }));
    return body;
  }

  async function reviewSlice() {
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      await previewSlice();
      setStatus(`تم تحليل ${partLabel(activeSlice)}. راجع التحذيرات ثم اضغط حفظ الجزء.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "تعذر تحليل JSON");
    } finally {
      setLoading(false);
    }
  }

  async function saveSlice() {
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const preview = await previewSlice();
      if (!preview.data || !preview.enrichment?.[activeSlice.part]) throw new Error("تعذر تجهيز هذا الجزء للحفظ.");
      if (preview.issues.some((issue) => issue.severity === "error")) throw new Error("يوجد خطأ في JSON يمنع الحفظ.");
      const response = await fetch("/api/imports/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: preview.data, enrichment: preview.enrichment, companyId: company.id }),
      });
      const body = await response.json() as { data?: Record<string, unknown>; error?: string; details?: string };
      if (!response.ok || !body.data) throw new Error([body.error, body.details].filter(Boolean).join(": ") || "تعذر حفظ الجزء");
      onSaved(body.data);
      setStatus(`تم حفظ ${partLabel(activeSlice)} في قاعدة البيانات.`);
      setIssues([]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "تعذر حفظ الجزء");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4 sm:p-8" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="company-ai-modal-title" className="my-4 w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:my-8">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div><p className="text-xs font-black uppercase tracking-widest text-sky-600">تحرير مباشر داخل صفحة الشركة</p><h2 id="company-ai-modal-title" className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">إكمال بيانات {company.name} بأجزاء صغيرة</h2><p className="mt-2 text-sm leading-7 text-slate-600">كل تعليمة تطلب مجموعة محدودة من الحقول لتقليل أخطاء JSON. احفظ كل جزء على حدة.</p></div>
          <button type="button" onClick={onClose} disabled={loading} aria-label="إغلاق النافذة" className="rounded-xl p-2 text-slate-500 hover:bg-white hover:text-slate-950 disabled:opacity-50"><X className="size-5" /></button>
        </header>
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[250px_1fr]">
          <nav className="space-y-2">
            {enrichmentPromptSlices.map((slice, index) => {
              const filled = Boolean(parts[slice.sliceId]?.trim());
              return <button key={slice.sliceId} type="button" onClick={() => { setActiveId(slice.sliceId); setIssues([]); setError(null); setStatus(null); }} className={`flex w-full items-start gap-3 rounded-2xl p-3 text-right transition ${activeId === slice.sliceId ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}><span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${activeId === slice.sliceId ? "bg-white/15" : filled ? "bg-emerald-100 text-emerald-700" : "bg-white text-slate-500"}`}>{filled ? <Check className="size-4" /> : index + 1}</span><span><span className="block text-sm font-black">{slice.title}</span><span className={`mt-1 block text-xs leading-5 ${activeId === slice.sliceId ? "text-slate-300" : "text-slate-500"}`}>{filled ? "JSON جاهز للحفظ" : slice.purpose}</span></span></button>;
            })}
          </nav>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-lg font-black text-slate-950">{activeSlice.title}</h3><p className="mt-1 text-xs text-slate-500">الحقول المحدودة: {activeSlice.fields.join(", ")}</p></div><Button type="button" onClick={() => void copyPrompt()} className="bg-sky-700 text-white hover:bg-sky-800"><Copy className="size-4" />{copied ? "تم النسخ" : "نسخ تعليمة هذا الجزء"}</Button></div>
            <details open className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4"><summary className="cursor-pointer text-sm font-black text-sky-950">تعليمة الذكاء الاصطناعي لهذا الجزء فقط</summary><textarea readOnly value={prompt} className="mt-3 min-h-[220px] w-full rounded-xl border border-sky-200 bg-white p-3 font-mono text-xs leading-6 text-slate-700 outline-none" aria-label="تعليمة الذكاء الاصطناعي" /></details>
            <textarea value={parts[activeSlice.sliceId]} onChange={(event) => { setParts((current) => ({ ...current, [activeSlice.sliceId]: event.target.value })); setIssues([]); setStatus(null); }} className="mt-4 min-h-[220px] w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-7 text-slate-800 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100" placeholder="ألصق JSON الناتج لهذا الجزء هنا..." spellCheck={false} />
            <div className="mt-4 flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => void reviewSlice()} disabled={loading}><FileCheck2 className="size-4" />{loading ? "جارٍ التحليل..." : "مراجعة الجزء"}</Button><Button type="button" onClick={() => void saveSlice()} disabled={loading}><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />حفظ الجزء في قاعدة البيانات</Button></div>
            {(error || status) && <div className={`mt-4 rounded-2xl border p-3 text-sm leading-7 ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{error || status}</div>}
            {issues.length > 0 && <div className="mt-4 space-y-2">{issues.map((issue, index) => <div key={`${issue.field}-${index}`} className={`rounded-xl p-3 text-xs leading-6 ${issue.severity === "error" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-900"}`}><b dir="ltr" className="font-mono">{issue.field}</b> — {issue.message}</div>)}</div>}
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Person = { fullName: string; jobTitle?: string | null; linkedinUrl?: string | null };
type Investor = { name: string; slug?: string | null; websiteUrl?: string | null };
type Source = { title?: string | null; url: string };
type ImportedCompany = { name: string; legalName?: string | null; description?: string | null; websiteUrl?: string | null; foundedYear?: number | null; countryName?: string | null; industryName?: string | null; people: Person[]; investors: Investor[]; markets: string[]; sources: Source[] };
type Issue = { severity: "error" | "warning"; field: string; message: string };

const example = `COMPANY_RECORD

name: Stripe
legal_name: Stripe, Inc.
website: https://stripe.com
country: United States
industry: Fintech
founded_year: 2010
description: Financial infrastructure platform for businesses.

people:
- Patrick Collison - Co-founder and CEO

investors:
- Sequoia Capital - https://www.sequoiacap.com

markets:
- Payments
- Financial Infrastructure

sources:
- https://stripe.com`;

export function LLMImportWorkspace() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [rawText, setRawText] = useState("");
  const [company, setCompany] = useState<ImportedCompany | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [format, setFormat] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCompanyId(new URLSearchParams(window.location.search).get("companyId"));
  }, []);

  async function preview() {
    setLoading(true); setError(null); setStatus(null);
    try {
      const response = await fetch("/api/imports/preview", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rawText }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "تعذر تحليل المحتوى");
      setCompany(body.data as ImportedCompany | null); setIssues((body.issues || []) as Issue[]); setFormat(body.format || null);
      setStatus(body.canCommit ? "تم تحليل المحتوى. راجع البيانات قبل الحفظ." : "يحتاج المحتوى إلى تصحيح قبل الحفظ.");
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "تعذر تحليل المحتوى"); }
    finally { setLoading(false); }
  }

  async function commit() {
    if (!company) return;
    setLoading(true); setError(null); setStatus(null);
    try {
      const response = await fetch("/api/imports/commit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ company, companyId: companyId || undefined }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "تعذر حفظ الشركة");
      setStatus(`تم حفظ ${body.data.name}. يمكنك فتح ملف الشركة الآن.`); setCompany(null); setRawText("");
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "تعذر حفظ الشركة"); }
    finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><Link href="/companies" className="text-sm font-bold text-sky-700">← العودة إلى الشركات</Link><h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">استيراد شركة بمساعدة الذكاء الاصطناعي</h1><p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-slate-600">الصق نتيجة ChatGPT أو Perplexity كنص أو Markdown أو JSON. سيتم تحليلها وعرضها للمراجعة قبل إرسالها إلى API.</p></div>
          <Link href="/companies/new" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-bold text-slate-700 hover:border-sky-300 hover:text-sky-700">إدخال يدوي</Link>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-black text-slate-950">المحتوى الخام</h2><p className="mt-1 text-xs font-medium text-slate-500">المحتوى لا يُحفظ كقاعدة بيانات؛ يستخدم للتحليل فقط.</p></div><button type="button" onClick={() => setRawText(example)} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">تحميل مثال</button></div>
            <textarea value={rawText} onChange={(event) => setRawText(event.target.value)} className="mt-5 min-h-[480px] w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-7 text-slate-800 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100" placeholder="الصق هنا إجابة ChatGPT أو Perplexity..." />
            <button type="button" onClick={() => void preview()} disabled={!rawText.trim() || loading} className="mt-4 w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "جارٍ المعالجة..." : "تحليل ومعاينة البيانات"}</button>
          </section>

          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-black text-slate-950">المراجعة قبل الحفظ</h2><p className="mt-1 text-xs font-medium text-slate-500">لا يتم الحفظ إلا بعد هذه الخطوة.</p></div>{format && <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">{format}</span>}</div>
            {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}{status && <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">{status}</div>}
            {!company ? <div className="mt-6 rounded-2xl bg-slate-50 px-5 py-16 text-center text-sm font-medium leading-7 text-slate-500">ستظهر هنا البيانات المستخرجة قبل الحفظ.</div> : <div className="mt-6 space-y-5">
              <div className="rounded-2xl bg-slate-50 p-5"><h3 className="text-xl font-black text-slate-950">{company.name}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{company.description || "لا يوجد وصف"}</p><div className="mt-4 flex flex-wrap gap-2">{[company.countryName, company.industryName, company.foundedYear?.toString()].filter(Boolean).map((item) => <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">{item}</span>)}</div></div>
              <div className="grid gap-3 sm:grid-cols-2"><PreviewCount label="الأشخاص" value={company.people.length} /><PreviewCount label="المستثمرون" value={company.investors.length} /><PreviewCount label="الأسواق" value={company.markets.length} /><PreviewCount label="المصادر" value={company.sources.length} /></div>
              <PreviewList title="الأشخاص" values={company.people.map((item) => `${item.fullName}${item.jobTitle ? ` — ${item.jobTitle}` : ""}`)} /><PreviewList title="المستثمرون" values={company.investors.map((item) => item.name)} /><PreviewList title="المصادر" values={company.sources.map((item) => item.url)} links />
              {issues.length > 0 && <div className="space-y-2">{issues.map((issue, index) => <div key={`${issue.field}-${index}`} className={`rounded-xl p-3 text-xs font-medium ${issue.severity === "error" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"}`}><b>{issue.field}</b>: {issue.message}</div>)}</div>}
              <button type="button" onClick={() => void commit()} disabled={loading || issues.some((issue) => issue.severity === "error")} className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">اعتماد وحفظ الشركة</button>
            </div>}
          </section>
        </div>
      </div>
    </main>
  );
}

function PreviewCount({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl bg-slate-100 p-4"><span className="text-xs font-bold text-slate-500">{label}</span><strong className="mt-2 block text-2xl font-black text-slate-950">{value}</strong></div>; }
function PreviewList({ title, values, links = false }: { title: string; values: string[]; links?: boolean }) { return <div><h3 className="mb-2 text-sm font-black text-slate-900">{title}</h3>{values.length ? <div className="space-y-2">{values.slice(0, 8).map((value) => links ? <a key={value} href={value} target="_blank" rel="noreferrer" className="block truncate rounded-xl bg-slate-50 p-3 text-xs font-medium text-sky-700 hover:underline">{value}</a> : <div key={value} className="rounded-xl bg-slate-50 p-3 text-xs font-medium text-slate-700">{value}</div>)}</div> : <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">لا توجد بيانات.</p>}</div>; }

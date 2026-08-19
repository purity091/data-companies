"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { CompanyProfileView } from "@/components/companies/CompanyProfileView";
import { CompanyEnrichmentPrompt } from "@/components/companies/CompanyEnrichmentPrompt";
import { TrustMrrDetailsCard } from "@/components/companies/TrustMrrDetailsCard";
import { CompanyLlmEnrichmentCard } from "@/components/companies/CompanyLlmEnrichmentCard";

type Company = {
  id: string;
  slug: string;
  name: string;
  legalName: string | null;
  description: string | null;
  websiteUrl: string | null;
  trustmrrSlug?: string | null;
  foundedYear: number | null;
  country: { name: string; code: string } | null;
  industry: { name: string } | null;
  people: { id: string; fullName: string; jobTitle: string | null }[];
  markets: { market: { name: string } }[];
  investors: { investor: { name: string; websiteUrl?: string | null } }[];
  trustmrr?: any;
  trustmrrTechStack?: { slug: string; category: string | null }[];
  trustmrrMarketingChannels?: { slug: string; category: string | null }[];
  trustmrrCofounders?: { xHandle: string; xName: string | null }[];
  llmEnrichment?: any;
  products?: { name: string; description: string | null; url: string | null }[];
  competitors?: { name: string; websiteUrl: string | null; relationship: string | null }[];
  relatedParties?: { name: string; partyType: string | null; relationship: string | null; websiteUrl: string | null }[];
  sources?: { title: string; url: string; publisher: string | null; sourceType: string; evidence: string | null }[];
};

export function CompanyDetails({ id }: { id: string }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [relationshipError, setRelationshipError] = useState<string | null>(null);
  const [savingRelationship, setSavingRelationship] = useState(false);
  const [personName, setPersonName] = useState("");
  const [personJobTitle, setPersonJobTitle] = useState("");
  const [personLinkedin, setPersonLinkedin] = useState("");
  const [investorName, setInvestorName] = useState("");
  const [investorSlug, setInvestorSlug] = useState("");
  const [investorWebsite, setInvestorWebsite] = useState("");

  useEffect(() => {
    void fetch(`/api/companies/${id}`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body.error || "تعذر تحميل تفاصيل الشركة");
        }
        setPreviewMode(body.mode === "preview");
        setCompany(body.data as Company);
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : "تعذر تحميل الشركة");
      });
  }, [id]);

  async function addPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingRelationship(true);
    setRelationshipError(null);

    try {
      const response = await fetch(`/api/companies/${id}/people`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: personName, jobTitle: personJobTitle || null, linkedinUrl: personLinkedin || null }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "تعذر إضافة الشخص");
      setCompany((current) => current ? { ...current, people: [...current.people, body.data] } : current);
      setPersonName("");
      setPersonJobTitle("");
      setPersonLinkedin("");
    } catch (requestError) {
      setRelationshipError(requestError instanceof Error ? requestError.message : "تعذر إضافة الشخص");
    } finally {
      setSavingRelationship(false);
    }
  }

  async function addInvestor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingRelationship(true);
    setRelationshipError(null);

    try {
      const response = await fetch(`/api/companies/${id}/investors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: investorName, slug: investorSlug || undefined, websiteUrl: investorWebsite || null }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "تعذر إضافة المستثمر");
      setCompany((current) => current ? { ...current, investors: [...current.investors, body.data] } : current);
      setInvestorName("");
      setInvestorSlug("");
      setInvestorWebsite("");
    } catch (requestError) {
      setRelationshipError(requestError instanceof Error ? requestError.message : "تعذر إضافة المستثمر");
    } finally {
      setSavingRelationship(false);
    }
  }

  if (error) return <main className="p-10 text-center text-red-700">{error}</main>;
  if (!company) return <main className="p-10 text-center text-slate-500">جارٍ تحميل تفاصيل الشركة...</main>;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/companies" className="text-sm font-bold text-sky-700 hover:text-sky-900">→ العودة إلى الشركات</Link>
          <div className="flex gap-2">
            <Link href={`/companies/${company.id}/edit`} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-sky-300 hover:text-sky-700">تعديل الشركة</Link>
          </div>
        </div>

        {previewMode && <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium leading-7 text-amber-800">وضع المعاينة فعال: التعديلات مؤقتة داخل الذاكرة. عند ضبط DATABASE_URL ستستخدم الواجهة MySQL عبر API بنفس التصميم.</div>}

        <div className="mt-6">
          <CompanyProfileView company={company} />
          <CompanyEnrichmentPrompt company={company} />
          <TrustMrrDetailsCard
            slug={company.trustmrrSlug || company.slug}
            details={company.trustmrr ? {
              ...company.trustmrr,
              techStack: company.trustmrrTechStack || [],
              marketingChannels: company.trustmrrMarketingChannels || [],
              cofounders: company.trustmrrCofounders || [],
            } : null}
          />
          <CompanyLlmEnrichmentCard
            enrichment={company.llmEnrichment}
            products={company.products}
            competitors={company.competitors}
            sources={company.sources}
          />
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-950">إدارة العلاقات</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">أضف الأشخاص والمستثمرين عبر API، وستظهر البيانات مباشرة داخل ملف الشركة.</p>
          </div>

          {relationshipError && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{relationshipError}</div>}

          <div className="grid gap-6 lg:grid-cols-2">
            <form onSubmit={addPerson} className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-black">إضافة شخص</h3>
              <div className="mt-4 space-y-3">
                <input required value={personName} onChange={(event) => setPersonName(event.target.value)} className="form-input" placeholder="الاسم الكامل" />
                <input value={personJobTitle} onChange={(event) => setPersonJobTitle(event.target.value)} className="form-input" placeholder="المسمى الوظيفي" />
                <input type="url" value={personLinkedin} onChange={(event) => setPersonLinkedin(event.target.value)} className="form-input" placeholder="رابط LinkedIn" />
                <button disabled={savingRelationship} className="w-full rounded-xl bg-sky-700 px-4 py-3 text-sm font-bold text-white hover:bg-sky-800 disabled:opacity-50">إضافة الشخص</button>
              </div>
            </form>

            <form onSubmit={addInvestor} className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-black">إضافة مستثمر</h3>
              <div className="mt-4 space-y-3">
                <input required value={investorName} onChange={(event) => setInvestorName(event.target.value)} className="form-input" placeholder="اسم المستثمر" />
                <input value={investorSlug} onChange={(event) => setInvestorSlug(event.target.value)} className="form-input" placeholder="slug اختياري" />
                <input type="url" value={investorWebsite} onChange={(event) => setInvestorWebsite(event.target.value)} className="form-input" placeholder="الموقع الإلكتروني" />
                <button disabled={savingRelationship} className="w-full rounded-xl bg-sky-700 px-4 py-3 text-sm font-bold text-white hover:bg-sky-800 disabled:opacity-50">إضافة المستثمر</button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

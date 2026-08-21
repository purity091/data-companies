"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CompanyProfileView } from "@/components/companies/CompanyProfileView";
import type { CompanyProfileData } from "@/components/companies/CompanyProfileView";
import { CompanyAiEditModal } from "@/components/companies/CompanyAiEditModal";
import { Button } from "@/components/ui/button";

// CompanyForAi is the minimal shape needed by the AI modal
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

export function CompanyDetails({ id }: { id: string }) {
  const [company, setCompany] = useState<CompanyProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  useEffect(() => {
    void fetch(`/api/companies/${id}`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body.error || "تعذر تحميل تفاصيل الشركة");
        }
        setPreviewMode(body.mode === "preview");
        setCompany(body.data as CompanyProfileData);
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : "تعذر تحميل الشركة");
      });
  }, [id]);

  if (error) return <main className="p-10 text-center text-red-700">{error}</main>;
  if (!company) return <main className="p-10 text-center text-slate-500">جارٍ تحميل تفاصيل الشركة...</main>;

  // Extract the minimal shape needed by the AI modal from the full company data
  const companyForAi: CompanyForAi = {
    id: company.id,
    name: company.name,
    legalName: company.legalName,
    websiteUrl: company.websiteUrl,
    country: company.country,
    industry: company.industry,
    people: company.people,
    markets: company.markets,
    investors: company.investors.map(({ investor }) => ({ investor: { name: investor.name, websiteUrl: investor.websiteUrl } })),
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/companies" className="text-sm font-bold text-sky-700 hover:text-sky-900">
            → العودة إلى الشركات
          </Link>
          <div className="flex gap-2">
            <Button type="button" onClick={() => setAiModalOpen(true)}>إكمال بالذكاء الاصطناعي</Button>
            <Link
              href={`/companies/${company.id}/edit`}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-sky-300 hover:text-sky-700"
            >
              تعديل الشركة
            </Link>
          </div>
        </div>

        {previewMode && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium leading-7 text-amber-800">
            وضع المعاينة فعال: التعديلات مؤقتة داخل الذاكرة. عند ضبط DATABASE_URL ستستخدم الواجهة قاعدة البيانات الحقيقية.
          </div>
        )}

        <div className="mt-6">
          <CompanyProfileView company={company} />
        </div>

        <CompanyAiEditModal
          company={companyForAi}
          open={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          onSaved={(savedCompany) => setCompany(savedCompany as CompanyProfileData)}
        />
      </div>
    </main>
  );
}

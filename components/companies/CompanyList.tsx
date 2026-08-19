"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CompanyDataTable, type CompanyTableRow } from "@/components/companies/CompanyDataTable";
import { TrustMrrImportButton } from "@/components/imports/TrustMrrImportButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CompaniesResponse = {
  mode?: "preview" | "database";
  data: CompanyTableRow[];
  total?: number;
  pagination: { nextCursor: string | null; hasMore: boolean };
  code?: string;
  error?: string;
};

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ar-u-nu-latn", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function CompanyList() {
  const [companies, setCompanies] = useState<CompanyTableRow[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"preview" | "database" | null>(null);

  const loadCompanies = useCallback(async (cursor?: string | null, search = "") => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ limit: "10" });
      if (search.trim()) params.set("q", search.trim());
      if (cursor) params.set("cursor", cursor);

      const response = await fetch(`/api/companies?${params.toString()}`);
      const body = (await response.json()) as CompaniesResponse;
      if (!response.ok) {
        throw new Error(
          body.code === "DATABASE_NOT_CONFIGURED"
            ? "قاعدة البيانات غير مهيأة بعد. تحقق من متغيرات Supabase."
            : body.error || "تعذر تحميل الشركات",
        );
      }

      setCompanies(cursor ? (current) => [...current, ...body.data] : () => body.data);
      setTotal(body.total ?? body.data.length);
      setNextCursor(body.pagination.nextCursor);
      setMode(body.mode || "database");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "تعذر تحميل الشركات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCompanies(null, "");
  }, [loadCompanies]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadCompanies(null, query);
  }

  const metrics = useMemo(() => {
    const withTrustMrr = companies.filter((company) => company.trustmrr).length;
    const latest = companies.reduce<string | undefined>((value, company) => {
      if (!value || new Date(company.updatedAt) > new Date(value)) return company.updatedAt;
      return value;
    }, undefined);
    return { withTrustMrr, latest };
  }, [companies]);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <p className="text-sm font-bold text-sky-700">Global Companies</p>
              {mode === "database" && <Badge variant="secondary">متصل بقاعدة البيانات</Badge>}
              {mode === "preview" && <Badge variant="outline">وضع المعاينة</Badge>}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">قاعدة بيانات الشركات</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              جدول مركزي لقراءة الشركات المجلوبة حديثًا، مؤشرات TrustMRR، وآخر وقت تم فيه تحديث كل سجل.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TrustMrrImportButton onImported={() => void loadCompanies(null, query)} />
            <Link href="/imports"><Button variant="outline">استيراد من AI</Button></Link>
            <Link href="/companies/new"><Button>إضافة شركة</Button></Link>
            <Link href="/"><Button variant="ghost">الرئيسية</Button></Link>
          </div>
        </header>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-500">إجمالي الشركات الموجودة</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{total.toLocaleString("en-US")}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-500">الشركات المعروضة</p>
            <p className="mt-2 text-2xl font-black text-sky-700">{companies.length.toLocaleString("en-US")}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-500">بيانات TrustMRR المتوفرة</p>
            <p className="mt-2 text-2xl font-black text-emerald-700">{metrics.withTrustMrr.toLocaleString("en-US")}</p>
          </div>
        </div>

        <form onSubmit={submitSearch} className="mb-6 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث باسم الشركة أو الاسم القانوني..."
            className="h-10 min-w-0 flex-1 bg-slate-50"
          />
          <Button type="submit">بحث</Button>
        </form>

        {mode === "preview" && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800">
            وضع المعاينة فعال: البيانات مؤقتة ولن تبقى بعد إعادة تشغيل التطبيق.
          </div>
        )}

        {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        {loading && companies.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">جارٍ تحميل الشركات...</div>
        ) : (
          <CompanyDataTable
            companies={companies}
            loading={loading}
          />
        )}
      </div>
    </main>
  );
}

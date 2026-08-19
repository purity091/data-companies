"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LookupItem = { id: string; name: string; code?: string };

export type CompanyFormValues = {
  name: string;
  slug: string;
  legalName: string;
  description: string;
  websiteUrl: string;
  foundedYear: string;
  countryId: string;
  industryId: string;
};

const emptyValues: CompanyFormValues = {
  name: "",
  slug: "",
  legalName: "",
  description: "",
  websiteUrl: "",
  foundedYear: "",
  countryId: "",
  industryId: "",
};

type CompanyFormProps = {
  companyId?: string;
  initialValues?: Partial<CompanyFormValues>;
};

function apiMessage(body: { code?: string; error?: string; details?: unknown }) {
  if (body.code === "DATABASE_NOT_CONFIGURED") {
    return "قاعدة البيانات غير مُعدّة بعد. لا يمكن حفظ الشركة قبل ضبط DATABASE_URL.";
  }

  if (body.error === "Validation failed") {
    return "يرجى مراجعة الحقول المدخلة والتأكد من صحة البيانات.";
  }

  return body.error || "تعذر حفظ بيانات الشركة.";
}

export function CompanyForm({ companyId, initialValues }: CompanyFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<CompanyFormValues>({ ...emptyValues, ...initialValues });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<LookupItem[]>([]);
  const [industries, setIndustries] = useState<LookupItem[]>([]);
  const [catalogsLoaded, setCatalogsLoaded] = useState(false);

  useEffect(() => {
    void Promise.all([
      fetch("/api/countries").then((response) => (response.ok ? response.json() : null)),
      fetch("/api/industries").then((response) => (response.ok ? response.json() : null)),
    ]).then(([countriesBody, industriesBody]) => {
      setCountries((countriesBody?.data || []) as LookupItem[]);
      setIndustries((industriesBody?.data || []) as LookupItem[]);
      setCatalogsLoaded(true);
    });
  }, []);

  function updateField(field: keyof CompanyFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: values.name,
      slug: values.slug || undefined,
      legalName: values.legalName || null,
      description: values.description || null,
      websiteUrl: values.websiteUrl || null,
      foundedYear: values.foundedYear ? Number(values.foundedYear) : null,
      countryId: values.countryId || null,
      industryId: values.industryId || null,
    };

    try {
      const response = await fetch(companyId ? `/api/companies/${companyId}` : "/api/companies", {
        method: companyId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(apiMessage(body));
      }

      const savedId = body.data.id as string;
      router.push(`/companies/${savedId}`);
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "تعذر حفظ بيانات الشركة.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen px-5 py-10 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <Link href={companyId ? `/companies/${companyId}` : "/companies"} className="text-sm font-semibold text-blue-700 hover:text-blue-900">
          ← العودة
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold text-blue-700">Company Management</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">{companyId ? "تعديل الشركة" : "إضافة شركة"}</h1>
            <p className="mt-2 text-slate-600">ستُرسل البيانات إلى API ثم تُحفظ في MySQL بعد تفعيل الاتصال.</p>
          </div>

          {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">{error}</div>}

          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-slate-700">اسم الشركة *</span>
                <input required value={values.name} onChange={(event) => updateField("name", event.target.value)} className="form-input" placeholder="Example Technologies" />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">Slug</span>
                <input value={values.slug} onChange={(event) => updateField("slug", event.target.value)} className="form-input" placeholder="example-technologies" />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">الاسم القانوني</span>
                <input value={values.legalName} onChange={(event) => updateField("legalName", event.target.value)} className="form-input" />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">الموقع الإلكتروني</span>
                <input type="url" value={values.websiteUrl} onChange={(event) => updateField("websiteUrl", event.target.value)} className="form-input" placeholder="https://example.com" />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">سنة التأسيس</span>
                <input type="number" min="1000" max="2200" value={values.foundedYear} onChange={(event) => updateField("foundedYear", event.target.value)} className="form-input" />
              </label>

              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-slate-700">الوصف</span>
                <textarea rows={5} value={values.description} onChange={(event) => updateField("description", event.target.value)} className="form-input resize-y" />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">الدولة</span>
                {countries.length > 0 ? (
                  <select value={values.countryId} onChange={(event) => updateField("countryId", event.target.value)} className="form-input">
                    <option value="">اختر الدولة</option>
                    {countries.map((country) => <option key={country.id} value={country.id}>{country.name}{country.code ? ` (${country.code})` : ""}</option>)}
                  </select>
                ) : (
                  <input inputMode="numeric" value={values.countryId} onChange={(event) => updateField("countryId", event.target.value)} className="form-input" placeholder={catalogsLoaded ? "لا توجد دول بعد" : "جاري تحميل الدول..."} />
                )}
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">الصناعة</span>
                {industries.length > 0 ? (
                  <select value={values.industryId} onChange={(event) => updateField("industryId", event.target.value)} className="form-input">
                    <option value="">اختر الصناعة</option>
                    {industries.map((industry) => <option key={industry.id} value={industry.id}>{industry.name}</option>)}
                  </select>
                ) : (
                  <input inputMode="numeric" value={values.industryId} onChange={(event) => updateField("industryId", event.target.value)} className="form-input" placeholder={catalogsLoaded ? "لا توجد صناعات بعد" : "جاري تحميل الصناعات..."} />
                )}
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Link href={companyId ? `/companies/${companyId}` : "/companies"} className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50">إلغاء</Link>
              <button disabled={saving} type="submit" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? "جاري الحفظ..." : "حفظ الشركة"}</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

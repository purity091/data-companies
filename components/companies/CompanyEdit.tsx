"use client";

import { useEffect, useState } from "react";
import { CompanyForm, type CompanyFormValues } from "./CompanyForm";

export function CompanyEdit({ id }: { id: string }) {
  const [values, setValues] = useState<CompanyFormValues | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch(`/api/companies/${id}`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) {
          throw new Error(
            body.code === "DATABASE_NOT_CONFIGURED"
              ? "قاعدة البيانات غير مُعدّة بعد. لا يمكن تحميل الشركة للتعديل."
              : body.error || "تعذر تحميل الشركة.",
          );
        }

        const company = body.data;
        setValues({
          name: company.name || "",
          slug: company.slug || "",
          legalName: company.legalName || "",
          description: company.description || "",
          websiteUrl: company.websiteUrl || "",
          foundedYear: company.foundedYear ? String(company.foundedYear) : "",
          countryId: company.countryId || "",
          industryId: company.industryId || "",
        });
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : "تعذر تحميل الشركة.");
      });
  }, [id]);

  if (error) return <main className="p-10 text-center text-red-700">{error}</main>;
  if (!values) return <main className="p-10 text-center text-slate-500">جاري تحميل بيانات الشركة...</main>;

  return <CompanyForm companyId={id} initialValues={values} />;
}

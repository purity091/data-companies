"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CompanyForPrompt = {
  id: string;
  slug: string;
  name: string;
  legalName: string | null;
  description: string | null;
  websiteUrl: string | null;
  foundedYear: number | null;
  country: { name: string; code: string } | null;
  industry: { name: string } | null;
  people: { fullName: string; jobTitle: string | null; linkedinUrl?: string | null }[];
  markets: { market: { name: string } }[];
  investors: { investor: { name: string; websiteUrl?: string | null } }[];
};

function buildPrompt(company: CompanyForPrompt, missingFields: string[]) {
  return {
    task: "enrich_company_record",
    instructions: [
      "Return ONLY valid JSON. Do not use Markdown fences.",
      "Use reliable public sources and include every source URL used.",
      "Do not guess. Use null or an empty array when a value cannot be verified.",
      "Keep the existing company name and id unchanged.",
      "The result will be pasted into the application's AI Import page for review before saving.",
    ],
    company: {
      id: company.id,
      slug: company.slug,
      name: company.name,
      knownData: {
        legalName: company.legalName,
        description: company.description,
        websiteUrl: company.websiteUrl,
        foundedYear: company.foundedYear,
        countryName: company.country?.name ?? null,
        industryName: company.industry?.name ?? null,
        people: company.people,
        investors: company.investors.map(({ investor }) => investor),
        markets: company.markets.map(({ market }) => market.name),
      },
    },
    missingFields,
    outputSchema: {
      name: company.name,
      legalName: null,
      description: null,
      websiteUrl: null,
      foundedYear: null,
      countryName: null,
      industryName: null,
      people: [{ fullName: "", jobTitle: null, linkedinUrl: null }],
      investors: [{ name: "", slug: null, websiteUrl: null }],
      markets: [""],
      sources: [{ title: "", url: "https://example.com" }],
    },
  };
}

export function CompanyEnrichmentPrompt({ company }: { company: CompanyForPrompt }) {
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);

  const missingFields = useMemo(() => {
    const missing: string[] = [];
    if (!company.legalName) missing.push("legalName");
    if (!company.description) missing.push("description");
    if (!company.websiteUrl) missing.push("websiteUrl");
    if (!company.foundedYear) missing.push("foundedYear");
    if (!company.country) missing.push("countryName");
    if (!company.industry) missing.push("industryName");
    if (company.people.length === 0) missing.push("people");
    if (company.investors.length === 0) missing.push("investors");
    if (company.markets.length === 0) missing.push("markets");
    missing.push("sources");
    return missing;
  }, [company]);

  const prompt = useMemo(
    () => JSON.stringify(buildPrompt(company, missingFields), null, 2),
    [company, missingFields],
  );

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="border-sky-200/80 bg-sky-50/50 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-black text-foreground">إكمال ملف الشركة بالذكاء الاصطناعي</CardTitle>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            أنشئ تعليمة JSON جاهزة لـ ChatGPT أو Perplexity لجمع البيانات الناقصة مع المصادر.
          </p>
        </div>
        <Badge variant="secondary">{missingFields.length} حقول ناقصة</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {missingFields.map((field) => <Badge key={field} variant="outline">{field}</Badge>)}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" onClick={() => setGenerated(true)}>
            {generated ? "تم توليد التعليمة" : "توليد تعليمة JSON"}
          </Button>
          {generated && <Button type="button" variant="outline" onClick={() => void copyPrompt()}>{copied ? "تم النسخ" : "نسخ التعليمة"}</Button>}
          {generated && <Button asChild type="button" variant="ghost"><Link href={`/imports?companyId=${encodeURIComponent(company.id)}`}>فتح استيراد AI</Link></Button>}
        </div>
        {generated && (
          <textarea
            readOnly
            value={prompt}
            aria-label="تعليمة إثراء الشركة بصيغة JSON"
            className="mt-5 min-h-[360px] w-full rounded-xl border border-border bg-background p-4 font-mono text-xs leading-6 text-foreground outline-none"
          />
        )}
      </CardContent>
    </Card>
  );
}

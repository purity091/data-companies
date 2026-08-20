"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink } from "lucide-react";
import { enrichmentPromptDefinitions, buildEnrichmentPrompt } from "@/modules/imports/llm-enrichment.prompts";
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

export function CompanyEnrichmentPrompt({ company }: { company: CompanyForPrompt }) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const companyHint = useMemo(() => [
    `اسم الشركة: ${company.name}`,
    `الرابط الرسمي: ${company.websiteUrl || "غير متوفر"}`,
    `الاسم القانوني: ${company.legalName || "غير متوفر"}`,
    `الدولة: ${company.country?.name || "غير محددة"}`,
    `المجال: ${company.industry?.name || "غير محدد"}`,
    `الأسواق الحالية: ${company.markets.map(({ market }) => market.name).join(", ") || "لا توجد"}`,
    `عدد الأشخاص المسجلين: ${company.people.length}`,
    `عدد المستثمرين المسجلين: ${company.investors.length}`,
  ].join("\n"), [company]);

  const prompts = useMemo(
    () => enrichmentPromptDefinitions.map((definition) => ({
      definition,
      prompt: buildEnrichmentPrompt(definition, companyHint),
    })),
    [companyHint],
  );

  async function copyPrompt(id: string, prompt: string) {
    await navigator.clipboard.writeText(prompt);
    setCopiedSection(id);
    window.setTimeout(() => setCopiedSection((current) => current === id ? null : current), 2000);
  }

  return (
    <Card className="mt-8 border-sky-200/80 bg-sky-50/50 shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg font-black text-foreground">إكمال بيانات {company.name} مرحلةً مرحلة</CardTitle>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              اختر القسم، انسخ تعليمته المخصصة لهذه الشركة، أرسلها إلى LLM، ثم افتح القسم وألصق JSON الناتج.
            </p>
          </div>
          <Badge variant="secondary">4 أقسام مستقلة</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-2">
          {prompts.map(({ definition, prompt }, index) => {
            const copied = copiedSection === definition.id;
            return (
              <Card key={definition.id} className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base font-black">{definition.title}</CardTitle>
                      <p className="mt-2 text-xs leading-6 text-muted-foreground">{definition.purpose}</p>
                    </div>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-black text-sky-700">{index + 1}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs font-bold text-slate-500">الحقول: {definition.fields.join(", ")}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button type="button" onClick={() => void copyPrompt(definition.id, prompt)} className="bg-sky-700 text-white hover:bg-sky-800">
                      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                      {copied ? "تم نسخ التعليمة" : "نسخ تعليمة الذكاء الاصطناعي"}
                    </Button>
                    <Button asChild nativeButton={false} variant="outline">
                      <Link href={`/imports?companyId=${encodeURIComponent(company.id)}&part=${encodeURIComponent(definition.id)}`}>
                        فتح قسم الإدخال <ExternalLink className="size-4" />
                      </Link>
                    </Button>
                  </div>
                  <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <summary className="cursor-pointer text-xs font-black text-slate-700">عرض التعليمة قبل نسخها</summary>
                    <textarea readOnly value={prompt} aria-label={`تعليمة ${definition.title}`} className="mt-3 min-h-[220px] w-full rounded-lg border border-slate-200 bg-white p-3 font-mono text-[11px] leading-6 text-slate-700 outline-none" />
                  </details>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

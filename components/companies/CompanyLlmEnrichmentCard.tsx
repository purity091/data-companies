"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Enrichment = {
  companyType: string | null;
  headquarters: string | null;
  employeeCount: number | null;
  businessModel: string | null;
  valueProposition: string | null;
  targetCustomers: string | null;
  pricingModel: string | null;
  fundingStage: string | null;
  totalFundingUsd: string | number | null;
  lastFundingDate: string | null;
  revenueRange: string | null;
  businessStatus: string | null;
  evidenceSummary: string | null;
  confidence: string | number | null;
  dataGaps: string | null;
  risks: string | null;
  lastVerifiedAt: string | null;
  promptVersion: string;
};

type Props = {
  enrichment?: Enrichment | null;
  products?: { name: string; description: string | null; url: string | null }[];
  competitors?: { name: string; websiteUrl: string | null; relationship: string | null }[];
  sources?: { title: string; url: string; publisher: string | null; sourceType: string; evidence: string | null }[];
};

function date(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ar-u-nu-latn", { dateStyle: "medium" }).format(new Date(value));
}

function number(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  return Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function CompanyLlmEnrichmentCard({ enrichment, products = [], competitors = [], sources = [] }: Props) {
  if (!enrichment) return null;

  return (
    <Card className="mt-8 border-emerald-200/80 bg-emerald-50/30 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-black">إثراء الذكاء الاصطناعي</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">بيانات البحث الموثقة عبر التعليمات الأربع، منفصلة عن بيانات TrustMRR.</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="business">
          <TabsList className="w-full justify-start overflow-x-auto bg-white/80">
            <TabsTrigger value="business">العمل والمنتجات</TabsTrigger>
            <TabsTrigger value="team">الفريق والتمويل</TabsTrigger>
            <TabsTrigger value="evidence">الأدلة والمخاطر</TabsTrigger>
            <TabsTrigger value="sources">المصادر</TabsTrigger>
          </TabsList>

          <TabsContent value="business" className="mt-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="نوع الشركة" value={enrichment.companyType} />
              <Field label="المقر" value={enrichment.headquarters} />
              <Field label="عدد الموظفين" value={number(enrichment.employeeCount)} />
              <Field label="حالة النشاط" value={enrichment.businessStatus} />
            </div>
            <TextBlock label="نموذج العمل" value={enrichment.businessModel} />
            <TextBlock label="القيمة المقترحة" value={enrichment.valueProposition} />
            <TextBlock label="العملاء المستهدفون" value={enrichment.targetCustomers} />
            <TextBlock label="نموذج التسعير" value={enrichment.pricingModel} />
            <List title="المنتجات" items={products.map((item) => `${item.name}${item.description ? ` — ${item.description}` : ""}`)} />
            <List title="المنافسون" items={competitors.map((item) => `${item.name}${item.relationship ? ` — ${item.relationship}` : ""}`)} />
          </TabsContent>

          <TabsContent value="team" className="mt-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="مرحلة التمويل" value={enrichment.fundingStage} />
              <Field label="إجمالي التمويل بالدولار" value={enrichment.totalFundingUsd === null ? "—" : `$${number(enrichment.totalFundingUsd)}`} />
              <Field label="تاريخ آخر تمويل" value={date(enrichment.lastFundingDate)} />
              <Field label="نطاق الإيرادات" value={enrichment.revenueRange} />
            </div>
          </TabsContent>

          <TabsContent value="evidence" className="mt-5 space-y-4">
            <div className="flex flex-wrap gap-2"><Badge variant="secondary">الثقة: {enrichment.confidence === null ? "—" : `${number(Number(enrichment.confidence) * 100)}%`}</Badge><Badge variant="outline">آخر تحقق: {date(enrichment.lastVerifiedAt)}</Badge><Badge variant="outline">الإصدار: {enrichment.promptVersion}</Badge></div>
            <TextBlock label="ملخص الأدلة" value={enrichment.evidenceSummary} />
            <List title="فجوات البيانات" items={(enrichment.dataGaps || "").split("\n").filter(Boolean)} />
            <List title="المخاطر" items={(enrichment.risks || "").split("\n").filter(Boolean)} />
          </TabsContent>

          <TabsContent value="sources" className="mt-5 space-y-3">
            {sources.length ? sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="block rounded-2xl bg-white p-4 hover:bg-emerald-50"><p className="font-bold text-emerald-800">{source.title}</p><p className="mt-1 truncate text-xs text-slate-500">{source.url}</p>{source.evidence && <p className="mt-2 text-sm leading-6 text-slate-700">{source.evidence}</p>}</a>) : <p className="text-sm text-muted-foreground">لا توجد مصادر محفوظة.</p>}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) { return <div className="rounded-2xl bg-white p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-black">{value || "—"}</p></div>; }
function TextBlock({ label, value }: { label: string; value: string | null }) { if (!value) return null; return <div className="rounded-2xl bg-white p-4"><p className="text-sm font-black text-emerald-800">{label}</p><p className="mt-2 text-sm leading-7 text-slate-700">{value}</p></div>; }
function List({ title, items }: { title: string; items: string[] }) { return <div><p className="mb-2 text-sm font-black text-emerald-800">{title}</p>{items.length ? <div className="flex flex-wrap gap-2">{items.map((item, index) => <Badge key={`${item}-${index}`} variant="outline">{item}</Badge>)}</div> : <p className="text-sm text-muted-foreground">لا توجد بيانات.</p>}</div>; }

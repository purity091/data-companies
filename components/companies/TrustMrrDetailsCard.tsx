"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Building2, 
  TrendingUp, 
  Sparkles, 
  Globe, 
  RefreshCw, 
  ExternalLink, 
  Code, 
  User, 
  Activity, 
  Lock, 
  CheckCircle2, 
  Palette,
  ShoppingBag,
  Coins,
  ArrowUpRight
} from "lucide-react";

export type TrustMrrData = {
  paymentProvider: string | null;
  targetAudience: string | null;
  teamSize: string | null;
  fundingStatus: string | null;
  revenueLast30DaysCents: string | number | null;
  revenueMrrCents: string | number | null;
  revenueTotalCents: string | number | null;
  customers: number | null;
  activeSubscriptions: number | null;
  askingPriceCents: string | number | null;
  profitMarginLast30Days: string | number | null;
  growth30d: string | number | null;
  growthMrr30d: string | number | null;
  multiple: string | number | null;
  rank: number | null;
  visitorsLast30Days: number | null;
  googleSearchImpressionsLast30Days: string | number | null;
  revenuePerVisitor: string | number | null;
  onSale: boolean | null;
  firstListedForSaleAt: string | null;
  xHandle: string | null;
  xFollowerCount: string | number | null;
  isMerchantOfRecord: boolean | null;
  domainRating: string | number | null;
  founderMessage: string | null;
  insightValueProposition: string | null;
  insightProblemSolved: string | null;
  insightPricingModel: string | null;
  insightTargetPersona: string | null;
  insightBusinessType: string | null;
  insightTeamSize: string | null;
  insightFundingStatus: string | null;
  insightEstimatedUserCount: number | null;
  trustmrrUrl: string | null;
  markdownUrl: string | null;
  previousAskingPriceCents: string | number | null;
  listingTier: string | null;
  listingTierBgColor: string | null;
  listingTierBgColorDark: string | null;
  brandingPrimaryColor: string | null;
  brandingSecondaryColor: string | null;
  pageviewCount: number | null;
  offerCount: number | null;
  stealthMode: boolean | null;
  isMobileApp: boolean | null;
  xFounderName: string | null;
  xProfilePicture: string | null;
  sourceUpdatedAt: string | null;
  updatedAt: string | null;
  techStack: { slug: string; category: string | null }[];
  marketingChannels: { slug: string; category: string | null }[];
  cofounders: { xHandle: string; xName: string | null }[];
};

function number(value: string | number | null | undefined, digits = 0) {
  if (value === null || value === undefined || value === "") return "—";
  return Number(value).toLocaleString("en-US", { maximumFractionDigits: digits });
}

function money(cents: string | number | null | undefined) {
  if (cents === null || cents === undefined || cents === "") return "—";
  return `$${(Number(cents) / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function percent(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  return `${Number(value) > 0 ? "+" : ""}${number(value, 2)}%`;
}

function date(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ar-u-nu-latn", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function yesNo(value: boolean | null | undefined) {
  if (value === null || value === undefined) return "—";
  return value ? "نعم" : "لا";
}

type TabId = "overview" | "financial" | "growth" | "insights" | "people" | "technology" | "source";

const TAB_ITEMS: { id: TabId; label: string; Icon: React.ElementType; color: string; activeColor: string }[] = [
  { id: "overview",   label: "نظرة عامة",      Icon: Activity,  color: "text-emerald-600", activeColor: "text-emerald-700 dark:text-emerald-300" },
  { id: "financial",  label: "المال والبيع",   Icon: DollarSign, color: "text-emerald-600", activeColor: "text-emerald-700 dark:text-emerald-300" },
  { id: "growth",     label: "النمو والجمهور", Icon: Users,      color: "text-sky-600",     activeColor: "text-sky-700 dark:text-sky-300" },
  { id: "insights",   label: "الرؤى والتحليل", Icon: Sparkles,   color: "text-amber-500",   activeColor: "text-amber-700 dark:text-amber-300" },
  { id: "people",     label: "المؤسسون",       Icon: User,       color: "text-indigo-600",  activeColor: "text-indigo-700 dark:text-indigo-300" },
  { id: "technology", label: "التقنية والتسويق", Icon: Code,     color: "text-purple-600",  activeColor: "text-purple-700 dark:text-purple-300" },
  { id: "source",     label: "المصدر والهوية", Icon: Globe,      color: "text-blue-600",    activeColor: "text-blue-700 dark:text-blue-300" },
];

export function TrustMrrDetailsCard({ slug, details }: { slug: string; details?: TrustMrrData | null }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  async function fetchDetails() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/imports/trustmrr/detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "تعذر جلب التفاصيل الكاملة");
      setMessage("تم تحديث البيانات بنجاح.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر جلب التفاصيل الكاملة");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-xs border-violet-200/80 dark:border-violet-900/60 bg-card rounded-2xl overflow-hidden my-6">
      {/* Verified Header Callout Bar */}
      <CardHeader className="p-4 sm:p-6 bg-gradient-to-b from-violet-50/80 to-transparent dark:from-violet-950/30 border-b border-border/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0 shadow-2xs">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base sm:text-lg lg:text-xl font-black text-foreground">
                  بيانات TrustMRR المالية المتحققة (TrustMRR Verified Metrics)
                </CardTitle>
                <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 text-[10px] font-bold px-2 py-0.5 shrink-0">
                  Stripe Verified
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground font-medium leading-relaxed">
                كل المؤشرات والحقول التي تم تخزينها من المصدر، مقسمة إلى تبويبات سهلة التصفح.
              </p>
            </div>
          </div>

          <Button 
            type="button" 
            size="sm"
            variant="outline" 
            onClick={() => void fetchDetails()} 
            disabled={loading}
            className="gap-2 font-bold border-violet-200 text-violet-800 hover:bg-violet-100/60 dark:border-violet-800 dark:text-violet-200 dark:hover:bg-violet-950 shrink-0 rounded-xl px-4 w-full sm:w-auto justify-center"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-violet-600" : ""}`} />
            <span>{loading ? "جارٍ الجلب..." : details ? "تحديث البيانات" : "جلب التفاصيل الكاملة"}</span>
          </Button>
        </div>

        {message && (
          <div className="p-2.5 rounded-xl bg-violet-100/70 dark:bg-violet-900/40 text-violet-900 dark:text-violet-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="size-4 text-violet-600 dark:text-violet-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}
      </CardHeader>

      {!details ? (
        <CardContent className="p-6">
          <div className="rounded-2xl border border-dashed border-violet-300 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-950/20 p-8 text-center text-sm leading-7 text-muted-foreground flex flex-col items-center justify-center gap-3">
            <ShieldCheck className="size-10 text-violet-400 opacity-80" />
            <p className="max-w-md font-medium">
              لم يتم تحميل التفاصيل الكاملة بعد. اضغط على زر "جلب التفاصيل الكاملة" لبدء مزامنة كافة مؤشرات TrustMRR والتقنيات والمؤسسين.
            </p>
          </div>
        </CardContent>
      ) : (
        <CardContent className="p-4 sm:p-6 space-y-5">
          <div className="w-full space-y-5">
            {/* Custom Tabs - scrollable strip */}
            <div className="w-full overflow-x-auto">
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 min-w-max sm:min-w-0 sm:flex-wrap">
                {TAB_ITEMS.map(({ id, label, Icon, color, activeColor }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 h-9 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                      activeTab === id
                        ? `bg-white dark:bg-slate-800 shadow-sm ${activeColor}`
                        : `text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200`
                    }`}
                  >
                    <Icon className={`size-3.5 shrink-0 ${activeTab === id ? activeColor : color}`} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT */}
            {activeTab === "overview" && <div className="space-y-6">
              {/* Primary 4 Metric Cards Grid - Matching the 4 Core Sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                
                {/* Metric 1: Revenue MRR (Emerald Theme) */}
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 flex flex-col justify-between gap-2 shadow-2xs hover:border-emerald-300 transition-all group">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">الإيراد الشهري (MRR)</span>
                    <div className="p-1 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 group-hover:scale-110 transition-transform shrink-0">
                      <DollarSign className="size-3.5" />
                    </div>
                  </div>
                  <span className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-300 tracking-tight dir-ltr text-right truncate">
                    {money(details.revenueMrrCents)}
                  </span>
                  <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-900/40 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium truncate">
                      إجمالي: {money(details.revenueTotalCents)}
                    </span>
                    <Badge variant="outline" className="text-[9px] font-bold bg-emerald-100/70 text-emerald-800 border-emerald-300 dark:bg-emerald-900/80 dark:text-emerald-200 shrink-0">
                      متحقق Stripe
                    </Badge>
                  </div>
                </div>

                {/* Metric 2: Traffic & Growth (Sky Theme) */}
                <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/60 flex flex-col justify-between gap-2 shadow-2xs hover:border-sky-300 transition-all group">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs font-extrabold text-sky-800 dark:text-sky-300 uppercase tracking-wider">الزيارات والنمو (30d)</span>
                    <div className="p-1 rounded-md bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 group-hover:scale-110 transition-transform shrink-0">
                      <Users className="size-3.5" />
                    </div>
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-sky-950 dark:text-sky-100 dir-ltr text-right truncate">
                    {number(details.visitorsLast30Days)} زائر
                  </span>
                  <div className="pt-2 border-t border-sky-200/50 dark:border-sky-900/40 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-sky-700 dark:text-sky-400 font-medium truncate">
                      معدل النمو: {percent(details.growth30d)}
                    </span>
                    <Badge variant="outline" className="text-[9px] font-bold bg-sky-100/70 text-sky-800 border-sky-300 dark:bg-sky-900/80 dark:text-sky-200 shrink-0">
                      نشاط ميداني
                    </Badge>
                  </div>
                </div>

                {/* Metric 3: Funding & Team (Indigo Theme) */}
                <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 flex flex-col justify-between gap-2 shadow-2xs hover:border-indigo-300 transition-all group">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs font-extrabold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">التمويل والفريق</span>
                    <div className="p-1 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 group-hover:scale-110 transition-transform shrink-0">
                      <Building2 className="size-3.5" />
                    </div>
                  </div>
                  <span className="text-sm sm:text-base font-bold text-indigo-950 dark:text-indigo-100 leading-tight truncate">
                    {details.fundingStatus || "تمويل ذاتي"}
                  </span>
                  <div className="pt-2 border-t border-indigo-200/50 dark:border-indigo-900/40 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-indigo-700 dark:text-indigo-400 font-medium truncate">
                      الفريق: {details.teamSize || "غير مفصح"}
                    </span>
                    <Badge variant="outline" className="text-[9px] font-bold bg-indigo-100/70 text-indigo-800 border-indigo-300 dark:bg-indigo-900/80 dark:text-indigo-200 shrink-0">
                      رأس المال
                    </Badge>
                  </div>
                </div>

                {/* Metric 4: Valuation & Price (Purple Theme) */}
                <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/60 flex flex-col justify-between gap-2 shadow-2xs hover:border-purple-300 transition-all group">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs font-extrabold text-purple-800 dark:text-purple-300 uppercase tracking-wider">سعر البيع والمضاعف</span>
                    <div className="p-1 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 group-hover:scale-110 transition-transform shrink-0">
                      <TrendingUp className="size-3.5" />
                    </div>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-purple-950 dark:text-purple-100 leading-tight dir-ltr text-right truncate">
                    {money(details.askingPriceCents)}
                  </span>
                  <div className="pt-2 border-t border-purple-200/50 dark:border-purple-900/40 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-purple-700 dark:text-purple-400 font-medium truncate">
                      المضاعف: {number(details.multiple, 2)}x
                    </span>
                    <Badge variant="outline" className="text-[9px] font-bold bg-purple-100/70 text-purple-800 border-purple-300 dark:bg-purple-900/80 dark:text-purple-200 shrink-0">
                      قيمة الأصل
                    </Badge>
                  </div>
                </div>

              </div>

              {/* Secondary Details Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Metric label="إيراد آخر 30 يومًا" value={money(details.revenueLast30DaysCents)} icon={DollarSign} accent />
                <Metric label="ترتيب TrustMRR" value={details.rank ? `#${number(details.rank)}` : "—"} icon={TrendingUp} />
                <Metric label="عدد العملاء" value={number(details.customers)} icon={Users} />
                <Metric label="الاشتراكات النشطة" value={number(details.activeSubscriptions)} icon={CheckCircle2} />
                <Metric label="مزود الدفع" value={details.paymentProvider} icon={ShoppingBag} />
                <Metric label="معروض للبيع" value={yesNo(details.onSale)} icon={Coins} />
                <Metric label="انطباعات Google (30d)" value={number(details.googleSearchImpressionsLast30Days)} icon={Activity} />
                <Metric label="إيراد لكل زائر" value={details.revenuePerVisitor === null ? "—" : `$${number(details.revenuePerVisitor, 2)}`} icon={ArrowUpRight} />
              </div>

              {/* Tags & Badges Row */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-border/40">
                {details.targetAudience && <Badge variant="outline" className="bg-muted/40 font-semibold text-xs py-1 px-3">الجمهور: {details.targetAudience}</Badge>}
                {details.teamSize && <Badge variant="outline" className="bg-muted/40 font-semibold text-xs py-1 px-3">الفريق: {details.teamSize}</Badge>}
                {details.fundingStatus && <Badge variant="outline" className="bg-muted/40 font-semibold text-xs py-1 px-3">التمويل: {details.fundingStatus}</Badge>}
                {details.listingTier && <Badge variant="secondary" className="font-semibold text-xs py-1 px-3">الفئة: {details.listingTier}</Badge>}
                {details.isMobileApp !== null && <Badge variant="secondary" className="font-semibold text-xs py-1 px-3">تطبيق جوال: {yesNo(details.isMobileApp)}</Badge>}
                {details.stealthMode && <Badge variant="destructive" className="font-semibold text-xs py-1 px-3"><Lock className="size-3 me-1 inline" /> وضع التخفي</Badge>}
              </div>
            </div>}

            {activeTab === "financial" && <div className="space-y-6">
              <Section title="الأرقام المالية والإيرادات" icon={DollarSign}>
                <Metric label="MRR (الإيراد الشهري)" value={money(details.revenueMrrCents)} accent />
                <Metric label="إيراد 30 يومًا" value={money(details.revenueLast30DaysCents)} />
                <Metric label="الإيراد الإجمالي التراكمي" value={money(details.revenueTotalCents)} />
                <Metric label="الهامش خلال 30 يومًا" value={percent(details.profitMarginLast30Days)} />
              </Section>

              <Section title="تقييم الاستحواذ وسعر البيع" icon={Coins}>
                <Metric label="سعر البيع الحالي" value={money(details.askingPriceCents)} accent />
                <Metric label="سعر البيع السابق" value={money(details.previousAskingPriceCents)} />
                <Metric label="مضاعف التقييم (Multiple)" value={number(details.multiple, 2)} />
                <Metric label="الإيراد المتولد لكل زائر" value={details.revenuePerVisitor === null ? "—" : `$${number(details.revenuePerVisitor, 2)}`} />
              </Section>

              <Section title="تفاصيل وحالة الصفقة" icon={ShoppingBag}>
                <Field label="معروض للبيع" value={yesNo(details.onSale)} />
                <Field label="تاريخ الإدراج الأول" value={date(details.firstListedForSaleAt)} />
                <Field label="عدد العروض المقدمة" value={number(details.offerCount)} />
                <Field label="مشاهدات صفحة الإدراج" value={number(details.pageviewCount)} />
                <Field label="Merchant of Record" value={yesNo(details.isMerchantOfRecord)} />
              </Section>
            </div>}

            {activeTab === "growth" && <div className="space-y-6">
              <Section title="مؤشرات النمو والوصول" icon={TrendingUp}>
                <Metric label="معدل النمو (30d)" value={percent(details.growth30d)} accent />
                <Metric label="نمو MRR (30d)" value={percent(details.growthMrr30d)} accent />
                <Metric label="إجمالي الزوار (30d)" value={number(details.visitorsLast30Days)} />
                <Metric label="ظهور نتائج Google" value={number(details.googleSearchImpressionsLast30Days)} />
                <Metric label="متابعو X (تويتر)" value={number(details.xFollowerCount)} />
                <Metric label="عدد المستخدمين التقديري" value={number(details.insightEstimatedUserCount)} />
              </Section>

              <Section title="هيكل الجمهور والفريق" icon={Users}>
                <Field label="الجمهور المستهدف" value={details.targetAudience} />
                <Field label="حجم الفريق" value={details.teamSize} />
                <Field label="حالة التمويل" value={details.fundingStatus} />
                <Field label="نوع النشاط" value={details.insightBusinessType} />
                <Field label="حجم الفريق حسب الرؤى" value={details.insightTeamSize} />
                <Field label="التمويل حسب الرؤى" value={details.insightFundingStatus} />
              </Section>
            </div>}

            {activeTab === "insights" && <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Insight label="العرض والقيمة المقترحة (Value Proposition)" value={details.insightValueProposition} icon={Sparkles} />
                <Insight label="المشكلة التي يحلها المنتج (Problem Solved)" value={details.insightProblemSolved} icon={CheckCircle2} />
                <Insight label="نموذج التسعير والاشتراكات" value={details.insightPricingModel} icon={DollarSign} />
                <Insight label="الشخصية والعميل المستهدف (Persona)" value={details.insightTargetPersona} icon={Users} />
                <Insight label="نموذج وسياق النشاط التجاري" value={details.insightBusinessType} icon={Building2} />
                <Insight label="رسالة المؤسس للمشترين والاستثمار" value={details.founderMessage} icon={User} />
              </div>
            </div>}

            {activeTab === "people" && <div className="space-y-6">
              <Section title="بيانات المؤسس الرئيسي" icon={User}>
                <Field label="اسم المؤسس" value={details.xFounderName} />
                <Field label="حساب X الرسمي" value={details.xHandle ? `@${details.xHandle}` : null} />
                <Field label="المتابعون في X" value={number(details.xFollowerCount)} />
                <Field label="تقييم النطاق (Domain Rating)" value={number(details.domainRating, 2)} />
              </Section>

              {details.xProfilePicture && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={details.xProfilePicture} alt="صورة المؤسس" className="size-14 rounded-full object-cover border-2 border-violet-300 dark:border-violet-700 shadow-2xs shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">الصورة الشخصية الرسمية في X</p>
                    <a href={details.xProfilePicture} target="_blank" rel="noreferrer" className="text-sm font-bold text-violet-700 dark:text-violet-300 hover:underline flex items-center gap-1 mt-0.5">
                      <span>عرض الصورة بحجمها الكامل</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              )}

              <TagGroup label="المؤسسون المشاركون (Co-Founders)" values={details.cofounders.map((item) => `${item.xName || "مؤسس"} (@${item.xHandle})`)} icon={Users} />
            </div>}

            {activeTab === "technology" && <div className="space-y-6">
              <TagGroup label="البنية والتقنيات المستخدمة (Tech Stack)" values={details.techStack.map((item) => item.category ? `${item.slug} · ${item.category}` : item.slug)} icon={Code} />
              <TagGroup label="قنوات التسويق والنمو (Marketing Channels)" values={details.marketingChannels.map((item) => item.category ? `${item.slug} · ${item.category}` : item.slug)} icon={Globe} />
            </div>}

            {activeTab === "source" && <div className="space-y-6">
              <Section title="سجلات التحديث والروابط الرسمية" icon={Globe}>
                <Field label="آخر تحديث من المصدر" value={date(details.sourceUpdatedAt)} />
                <Field label="آخر تحديث بقاعدة البيانات" value={date(details.updatedAt)} />
                <Field label="رابط صفحة TrustMRR" value={details.trustmrrUrl} link />
                <Field label="ملف Markdown الموثق" value={details.markdownUrl} link />
                <Field label="تصنيف فئة الإدراج" value={details.listingTier} />
                <Field label="تطبيق جوال" value={yesNo(details.isMobileApp)} />
                <Field label="وضع التخفي" value={yesNo(details.stealthMode)} />
              </Section>

              <Section title="هوية وألوان العلامة التجارية" icon={Palette}>
                <ColorField label="اللون الأساسي للعلامة" value={details.brandingPrimaryColor} />
                <ColorField label="اللون الثانوي للعلامة" value={details.brandingSecondaryColor} />
                <ColorField label="خلفية فئة الإدراج" value={details.listingTierBgColor} />
                <ColorField label="خلفية الفئة بالوضع الداكن" value={details.listingTierBgColorDark} />
              </Section>
            </div>}

          </div>
        </CardContent>
      )}
    </Card>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 pb-1 border-b border-border/30">
        {Icon && <Icon className="size-4 text-violet-700 dark:text-violet-400 shrink-0" />}
        <h3 className="text-xs sm:text-sm font-extrabold text-foreground">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">{children}</div>
    </section>
  );
}

function Metric({ label, value, accent = false, icon: Icon }: { label: string; value: string | null | undefined; accent?: boolean; icon?: React.ElementType }) {
  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between gap-1 shadow-2xs hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between gap-1">
        <p className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">{label}</p>
        {Icon && <Icon className="size-3.5 text-muted-foreground/70 shrink-0" />}
      </div>
      <p className={`text-sm sm:text-base lg:text-lg font-extrabold tracking-tight dir-ltr text-right truncate ${accent ? "text-violet-700 dark:text-violet-300 font-black" : "text-foreground"}`}>
        {value || "—"}
      </p>
    </div>
  );
}

function Field({ label, value, link = false }: { label: string; value: string | null | undefined; link?: boolean }) {
  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between gap-1 shadow-2xs">
      <p className="text-[11px] sm:text-xs font-bold text-muted-foreground truncate">{label}</p>
      {link && value ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noreferrer" 
          className="truncate text-xs sm:text-sm font-bold text-violet-700 dark:text-violet-300 hover:underline inline-flex items-center gap-1 dir-ltr"
        >
          <span className="truncate">{value}</span>
          <ExternalLink className="size-3 shrink-0" />
        </a>
      ) : (
        <p className="break-words text-xs sm:text-sm font-bold text-foreground">{value || "—"}</p>
      )}
    </div>
  );
}

function Insight({ label, value, icon: Icon }: { label: string; value: string | null; icon?: React.ElementType }) {
  if (!value) return null;
  return (
    <div className="p-4 sm:p-5 rounded-xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-200/70 dark:border-violet-900/50 shadow-2xs space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4 text-violet-600 dark:text-violet-400 shrink-0" />}
        <p className="text-xs sm:text-sm font-black text-violet-900 dark:text-violet-200">{label}</p>
      </div>
      <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">{value}</p>
    </div>
  );
}

function TagGroup({ label, values, icon: Icon }: { label: string; values: string[]; icon?: React.ElementType }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-1 border-b border-border/30">
        {Icon && <Icon className="size-4 text-violet-700 dark:text-violet-400 shrink-0" />}
        <p className="text-xs sm:text-sm font-extrabold text-foreground">{label}</p>
      </div>
      {values.length ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <Badge key={`${value}-${index}`} variant="outline" className="bg-muted/40 border-border/60 text-xs font-medium py-1 px-3">
              {value}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">لا توجد بيانات محفوظة.</p>
      )}
    </div>
  );
}

function ColorField({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800">
      <span className="size-7 rounded-lg border border-slate-200 shadow-2xs shrink-0" style={value ? { backgroundColor: value } : undefined} />
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-muted-foreground">{label}</p>
        <p className="text-xs font-mono font-bold text-foreground truncate dir-ltr">{value || "—"}</p>
      </div>
    </div>
  );
}

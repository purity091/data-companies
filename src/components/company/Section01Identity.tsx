import { useState } from "react";
import {
  FileJson,
  CheckCircle2,
  Building2,
  TrendingUp,
  ShieldCheck,
  Globe,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Layers,
  Zap,
  Phone,
  Mail,
  Cpu,
  Info,
  ExternalLink,
} from "lucide-react";
import { Company } from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  selectedCompany: Company;
}

export function Section01Identity({ selectedCompany }: Props) {
  const [activeIdentityTab, setActiveIdentityTab] = useState<"about" | "strategy" | "legal" | "tech">("about");

  return (
    <Card id="main-section-1" className="border-0 shadow-sm shadow-slate-200/60 dark:shadow-none rounded-3xl overflow-hidden bg-card space-y-0 pt-0 relative">
      {/* Master Section Header Banner */}
      <div className="p-6 sm:p-7 bg-muted/30 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0 flex items-center justify-center">
              <FileJson className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">هوية ومعلومات الشركة الرئيسية</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">الملف التعريفي الشامل، النماذج الربحية، البيانات القانونية والتنظيمية، ومقاييس حركة الموقع</p>
            </div>
          </div>
        </div>

        {/* Classic Underline Tabs Navigation */}
        <div className="flex gap-6 overflow-x-auto pt-2">
          <button
            type="button"
            onClick={() => setActiveIdentityTab("about")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap relative ${
              activeIdentityTab === "about"
                ? "text-sky-600 dark:text-sky-400 font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>حول ونشاطات الشركة</span>
            </div>
            {activeIdentityTab === "about" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-sky-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveIdentityTab("strategy")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap relative ${
              activeIdentityTab === "strategy"
                ? "text-sky-600 dark:text-sky-400 font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>النموذج الربحي والمكانة</span>
            </div>
            {activeIdentityTab === "strategy" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-sky-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveIdentityTab("legal")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap relative ${
              activeIdentityTab === "legal"
                ? "text-sky-600 dark:text-sky-400 font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>التفاصيل القانونية</span>
            </div>
            {activeIdentityTab === "legal" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-sky-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveIdentityTab("tech")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap relative ${
              activeIdentityTab === "tech"
                ? "text-sky-600 dark:text-sky-400 font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>بيانات التقنية والزيارات</span>
            </div>
            {activeIdentityTab === "tech" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-sky-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Master Card Content Area */}
      <CardContent className="p-6 sm:p-7">
        {/* ABOUT TAB CONTENT */}
        {activeIdentityTab === "about" && (
          <div id="section-about" className="space-y-6">
            {/* Corporate Narrative Box */}
            <div className="p-5 rounded-2xl bg-muted/30 space-y-3">
              <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>الرؤية واللمحة التعريفية للمنظومة</span>
              </h4>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                {selectedCompany.aboutDescription || "لم يتم إضافة لمحة تعريفية كاملة للشركة بعد."}
              </p>
            </div>

            {/* Metric Summary Grid - 4 High-Impact Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4.5 rounded-2xl bg-muted/40 space-y-2 relative overflow-hidden transition-all hover:bg-muted/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-bold">عام التأسيس</span>
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-foreground">{selectedCompany.foundedDate || "2016"}</div>
                <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold block">8+ سنوات من الريادة</span>
              </div>

              <div className="p-4.5 rounded-2xl bg-muted/40 space-y-2 relative overflow-hidden transition-all hover:bg-muted/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-bold">حجم فريق العمل</span>
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-foreground">{selectedCompany.employeeRange || "501-1000"}</div>
                <span className="text-[10px] text-muted-foreground font-semibold block">كوادر تقنية وإدارية متخصصة</span>
              </div>

              <div className="p-4.5 rounded-2xl bg-muted/40 space-y-2 relative overflow-hidden transition-all hover:bg-muted/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-bold">المقر والتوسع</span>
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-base sm:text-lg font-extrabold text-foreground truncate">{selectedCompany.hqLocation || "مكة / الرياض"}</div>
                <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold block">توسع شامل في دول الخليج</span>
              </div>

              <div className="p-4.5 rounded-2xl bg-muted/40 space-y-2 relative overflow-hidden transition-all hover:bg-muted/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-bold">إجمالي التمويل</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{selectedCompany.totalFundingAmount || "$130M+"}</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">جولات Series B ناجحة</span>
              </div>
            </div>

            {/* Operating Pillars Box */}
            <div className="p-5 rounded-2xl bg-muted/30 space-y-3">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-sky-500" />
                <span>الركائز التشغيلية الرئيسية للمنظومة:</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-card shadow-xs flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">المتاجر الرقمية المستقلة (SaaS Stores)</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">تمكين التجار من امتلاك وبناء مواقع تجارية متكاملة بدون أكواد برمجية.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-card shadow-xs flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">التقنية المالية والمدفوعات (Salla Pay)</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">محرك مدمج لدعم مدى، Apple Pay، والتقسيط (تابي وتمارا) بتسوية فورية.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-card shadow-xs flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">منظومة اللوجستيات والشحن (Salla Logistics)</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">ربط آلي مع شركات الشحن المحلية والدولية بأسعار مخصصة.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-card shadow-xs flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">متجر التطبيقات المفتوح (Salla App Store)</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">أكثر من 400+ تطبيق للربط التسويقي والمحاسبي وإدارة العلاقات CRM.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BUSINESS MODEL TAB CONTENT */}
        {activeIdentityTab === "strategy" && (
          <div id="section-strategy" className="space-y-5 text-xs sm:text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-muted/40 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wide">
                  <DollarSign className="h-4 w-4" />
                  <span>نموذج الإيرادات (Revenue Architecture)</span>
                </div>
                <span className="font-extrabold text-foreground text-base block">{selectedCompany.revenueModel || "غير محدد"}</span>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  يعتمد النموذج على الاشتراكات السحابية الدورية (الباقات) بالإضافة إلى رسوم العمليات وحصة الإيرادات من متجر التطبيقات.
                </p>
              </div>

              <div className="p-5 bg-muted/40 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wide">
                  <TrendingUp className="h-4 w-4" />
                  <span>المكانة والتمركز السوقي (Market Positioning)</span>
                </div>
                <span className="font-extrabold text-foreground text-base block">{selectedCompany.marketPosition || "غير محدد"}</span>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  الهيمنة الساحقة على سوق التجارة الإلكترونية المستقلة في المملكة العربية السعودية بحصة تتجاوز 60%.
                </p>
              </div>
            </div>

            {selectedCompany.competitiveAdvantage && (
              <div className="p-5 bg-muted/40 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-bold text-xs">
                  <Zap className="h-4 w-4 text-sky-500" />
                  <span>خندق الميزة التنافسية المحورية (Core Competitive Moat)</span>
                </div>
                <p className="text-foreground leading-relaxed text-xs sm:text-sm font-semibold">
                  {selectedCompany.competitiveAdvantage}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary" className="text-[11px] font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border-0 px-3 py-1">
                    ✓ ربط فوري مع النفاذ الوطني
                  </Badge>
                  <Badge variant="secondary" className="text-[11px] font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border-0 px-3 py-1">
                    ✓ امتثال الزكاة والضريبة ZATCA Phase 2
                  </Badge>
                  <Badge variant="secondary" className="text-[11px] font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border-0 px-3 py-1">
                    ✓ اعتمادية PCI-DSS Level 1 لأمن المدفوعات
                  </Badge>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LEGAL DETAILS TAB CONTENT */}
        {activeIdentityTab === "legal" && (
          <div id="section-details" className="space-y-6 text-xs sm:text-sm">
            {/* Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4.5 bg-muted/40 rounded-2xl space-y-1.5">
                <span className="text-muted-foreground text-xs font-bold block">الاسم القانوني الرسمي</span>
                <span className="font-extrabold text-foreground text-sm block truncate">{selectedCompany.legalName || "شركة سلة لتقنية المعلومات"}</span>
              </div>

              <div className="p-4.5 bg-muted/40 rounded-2xl space-y-1.5">
                <span className="text-muted-foreground text-xs font-bold block">معروفة أيضاً باسم</span>
                <span className="font-extrabold text-foreground text-sm block truncate">{selectedCompany.alsoKnownAs || "Salla, Salla Pay"}</span>
              </div>

              <div className="p-4.5 bg-muted/40 rounded-2xl space-y-1.5">
                <span className="text-muted-foreground text-xs font-bold block">حالة التشغيل والترخيص</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm block flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  {selectedCompany.operatingStatus || "نشط وقائم رسمياً"}
                </span>
              </div>

              <div className="p-4.5 bg-muted/40 rounded-2xl space-y-1.5">
                <span className="text-muted-foreground text-xs font-bold block">رمز البورصة / التخارج</span>
                <span className="font-extrabold text-foreground text-sm block">{selectedCompany.stockSymbol || "شركة خاصة (Pre-IPO)"}</span>
              </div>

              <div className="p-4.5 bg-muted/40 rounded-2xl space-y-1.5">
                <span className="text-muted-foreground text-xs font-bold block">نوع المؤسسة</span>
                <span className="font-extrabold text-foreground text-sm block">{selectedCompany.companyType || "شركة ذات مسؤولية محدودة (SaaS)"}</span>
              </div>

              <div className="p-4.5 bg-muted/40 rounded-2xl space-y-1.5">
                <span className="text-muted-foreground text-xs font-bold block">المؤسسون والإدارة</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedCompany.founders && selectedCompany.founders.length > 0 ? selectedCompany.founders.map((f, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border-0">
                      {f}
                    </Badge>
                  )) : (
                    <Badge variant="outline" className="text-xs font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border-0">
                      نواف حاسر و سلمان بات
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info Banner */}
            <div className="p-5 rounded-2xl bg-muted/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h5 className="text-xs font-bold text-foreground mb-1">معلومات التواصل الرسمي والمساندة</h5>
                <p className="text-[11px] text-muted-foreground font-medium">القنوات التوثيقية المتاحة لخدمة الشركاء والتجار على مدار الساعة.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold shrink-0">
                <div className="flex items-center gap-2 text-foreground bg-card shadow-xs px-3.5 py-2 rounded-xl">
                  <Phone className="h-4 w-4 text-sky-500" />
                  <span className="ltr text-right">{selectedCompany.phoneNumber || "920011112"}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground bg-card shadow-xs px-3.5 py-2 rounded-xl">
                  <Mail className="h-4 w-4 text-sky-500" />
                  <span>{selectedCompany.contactEmail || "support@salla.sa"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TECH & WEB STATISTICS TAB CONTENT */}
        {activeIdentityTab === "tech" && (
          <div id="section-tech" className="space-y-6 text-xs sm:text-sm font-medium">
            {/* Prominent Card for Website Visits & Launch Button */}
            <Card className="border-0 bg-muted/30 rounded-2xl overflow-hidden shadow-none">
              <div className="p-5 bg-muted/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-foreground">حركة زيارات موقع الويب والمنصة الرقمية</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">تحليل حركة المرور الشهرية والأداء التقني للموقع الرسمي</p>
                  </div>
                </div>

                <Button variant="default" size="sm" asChild className="gap-2 font-bold shadow-xs bg-sky-600 hover:bg-sky-700 text-white rounded-xl shrink-0 border-0">
                  <a href={selectedCompany.websiteUrl || "https://salla.sa"} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                    <span>زيارة موقع الويب الرسمي</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </a>
                </Button>
              </div>

              <CardContent className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-card rounded-2xl shadow-xs space-y-1.5">
                    <span className="text-muted-foreground text-xs font-bold block">إجمالي الزيارات الشهرية</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-black text-foreground">{selectedCompany.monthlyWebVisits || "5.2M+"}</span>
                      <Badge variant="secondary" className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border-0">
                        {selectedCompany.visitsMomChange || "+14.2% MoM"}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-card rounded-2xl shadow-xs space-y-1.5">
                    <span className="text-muted-foreground text-xs font-bold block">ميزانية البنية التحتية والتقنية</span>
                    <span className="text-xl font-black text-foreground block mt-1">{selectedCompany.itSpend || "$2.5M - $5.0M"}</span>
                    <span className="text-[10px] text-muted-foreground block font-medium">استثمار سنوي تقديري في السحابة</span>
                  </div>

                  <div className="p-4 bg-card rounded-2xl shadow-xs space-y-1.5">
                    <span className="text-muted-foreground text-xs font-bold block">المنتجات البرمجية النشطة</span>
                    <span className="text-xl font-black text-foreground block mt-1">{selectedCompany.activeTechProductsCount || 4} منظومات</span>
                    <span className="text-[10px] text-muted-foreground block font-medium">منصة المتاجر، المدفوعات، الشحن، التطبيقات</span>
                  </div>

                  <div className="p-4 bg-card rounded-2xl shadow-xs space-y-1.5">
                    <span className="text-muted-foreground text-xs font-bold block">الملكية الفكرية والعلامات</span>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs font-bold bg-muted/60 text-foreground border-0">
                        علامات: {selectedCompany.trademarksCount || 8}
                      </Badge>
                      <Badge variant="secondary" className="text-xs font-bold bg-muted/60 text-foreground border-0">
                        براءات: {selectedCompany.patentsCount || 2}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-5 bg-muted/30 rounded-2xl space-y-3">
              <span className="text-foreground text-xs font-bold block flex items-center gap-2">
                <Cpu className="h-4 w-4 text-sky-500" />
                <span>حزمة البنية التحتية والتقنيات المدمجة (Enterprise Tech Stack):</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCompany.sampleTechs && selectedCompany.sampleTechs.length > 0 ? selectedCompany.sampleTechs.map((tech, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-card text-foreground font-bold text-xs px-3 py-1.5 shadow-xs border-0">
                    {tech}
                  </Badge>
                )) : (
                  <>
                    <Badge variant="secondary" className="bg-card text-foreground font-bold text-xs px-3 py-1.5 shadow-xs border-0">AWS Multi-AZ Cloud Infrastructure</Badge>
                    <Badge variant="secondary" className="bg-card text-foreground font-bold text-xs px-3 py-1.5 shadow-xs border-0">Microservices Architecture</Badge>
                    <Badge variant="secondary" className="bg-card text-foreground font-bold text-xs px-3 py-1.5 shadow-xs border-0">React.js & TailwindCSS</Badge>
                    <Badge variant="secondary" className="bg-card text-foreground font-bold text-xs px-3 py-1.5 shadow-xs border-0">Laravel Enterprise Engine</Badge>
                    <Badge variant="secondary" className="bg-card text-foreground font-bold text-xs px-3 py-1.5 shadow-xs border-0">PCI-DSS Level 1 Gateway</Badge>
                    <Badge variant="secondary" className="bg-card text-foreground font-bold text-xs px-3 py-1.5 shadow-xs border-0">Salla Open REST APIs & Webhooks</Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

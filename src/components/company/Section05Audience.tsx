import { useState } from "react";
import {
  Users,
  Layers,
  UserCheck,
  ShieldAlert,
  Lightbulb,
  CheckCircle2,
  Compass,
  Zap,
  ShieldCheck,
  DollarSign,
  Award,
  Building2,
  Globe,
  Target,
  Cpu,
} from "lucide-react";
import { Company } from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProLockOverlay } from "./ProLockOverlay";

interface Props {
  selectedCompany: Company;
  viewTier: "public" | "pro";
  setViewTier: (tier: "public" | "pro") => void;
}

export function Section05Audience({ selectedCompany, viewTier, setViewTier }: Props) {
  const [activeAudienceTab, setActiveAudienceTab] = useState<"audience" | "benchmark">("audience");

  return (
    <Card id="main-section-5" className="border-0 shadow-sm shadow-slate-200/60 dark:shadow-none rounded-3xl overflow-hidden bg-card space-y-0 pt-0 relative">
      {/* Master Section Header Banner with Integrated Tabs */}
      <div className="p-5 sm:p-6 border-b border-border/40 bg-muted/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 flex items-center justify-center">
              <Users className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">مصفوفة العملاء والجمهور المستهدف</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">مصفوفة 8-Layer ICP للعميل المثالي، قنوات التواصل، ومصفوفة المقارنة والتمركز التنافسي الشامل</p>
            </div>
          </div>
        </div>

        {/* Integrated Sub-section Navigation Underline Tabs Bar */}
        <div className="pt-3 border-b border-border/30 overflow-x-auto">
          <div className="flex items-center gap-6 sm:gap-8 min-w-max pb-0 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setActiveAudienceTab("audience")}
              className={`relative pb-3 font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeAudienceTab === "audience"
                  ? "text-indigo-600 dark:text-indigo-400 font-extrabold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              }`}
            >
              <span>مصفوفة العملاء والشرائح</span>
              {activeAudienceTab === "audience" && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveAudienceTab("benchmark")}
              className={`relative pb-3 font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeAudienceTab === "benchmark"
                  ? "text-indigo-600 dark:text-indigo-400 font-extrabold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              }`}
            >
              <span>المقارنة والتمركز الاستراتيجي</span>
              {activeAudienceTab === "benchmark" && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Master Card Content Area */}
      <CardContent className="p-6 sm:p-7 relative">
        {/* IDEAL CUSTOMER PERSONAS & TARGET AUDIENCE TAB */}
        {activeAudienceTab === "audience" && (
          <div id="section-target-audience" className="space-y-6 relative">
            {viewTier === "public" && (
              <ProLockOverlay
                title="تحليل العملاء المثاليين (ICP Pro Analytics)"
                subtitle="التحليل الهيكلي ودوافع الشراء المفصلية للعملاء متاح حصرياً في الوضع الاحترافي."
                onUnlock={() => setViewTier("pro")}
              />
            )}

            {selectedCompany.targetAudienceProfile &&
            selectedCompany.targetAudienceProfile.idealCustomerPersonas &&
            Array.isArray(selectedCompany.targetAudienceProfile.idealCustomerPersonas) &&
            selectedCompany.targetAudienceProfile.idealCustomerPersonas.length > 0 ? (
              <>
                {/* MATRIX COMPARISON TABLE FOR MAXIMUM READABILITY */}
                <div className="rounded-2xl border border-border/30 bg-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse min-w-[750px]">
                      <thead>
                        <tr className="bg-muted/30 text-foreground border-b border-border/30">
                          <th className="py-4 px-5 w-64 min-w-[220px] text-xs font-black border-l border-border/30 bg-muted/20">
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                              <Layers className="h-4.5 w-4.5 shrink-0" />
                              <span>طبقات التقييم الاستراتيجي</span>
                            </div>
                          </th>
                          {selectedCompany.targetAudienceProfile.idealCustomerPersonas.map((persona, idx) => (
                            <th key={idx} className="py-4 px-6 text-right border-l border-border/20 last:border-l-0">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center shrink-0">
                                  0{idx + 1}
                                </div>
                                <div>
                                  <h5 className="text-sm font-black text-foreground tracking-tight">
                                    {persona.personaTitle || persona.customerSegment || `الشخصية 0${idx + 1}`}
                                  </h5>
                                  {persona.customerSegment && (
                                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold block mt-0.5">
                                      {persona.customerSegment}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 text-xs font-medium">
                        {/* ROW 1: Customer Profile & Role */}
                        <tr className="hover:bg-muted/10 transition-colors">
                          <td className="py-4 px-5 font-bold text-foreground border-l border-border/30 bg-muted/10 align-top space-y-1">
                            <div className="flex items-center gap-2 text-foreground font-black">
                              <UserCheck className="h-4 w-4 text-indigo-500 shrink-0" />
                              <span>ملف العميل والدور</span>
                            </div>
                            <span className="text-[11px] text-muted-foreground font-normal block">من هو العميل وما حجم نشاطه؟</span>
                          </td>
                          {selectedCompany.targetAudienceProfile.idealCustomerPersonas.map((persona, idx) => (
                            <td key={idx} className="py-4 px-6 border-l border-border/20 last:border-l-0 align-top space-y-2">
                              <p className="text-xs sm:text-sm text-foreground font-semibold leading-relaxed">
                                {persona.customerProfile || "توصيف ومجال عمل العميل"}
                              </p>
                              {persona.archetypeRole && (
                                <Badge variant="outline" className="text-[11px] font-bold bg-muted/40 text-muted-foreground border-border/40 px-2.5 py-0.5">
                                  {persona.archetypeRole}
                                </Badge>
                              )}
                            </td>
                          ))}
                        </tr>

                        {/* ROW 2: Pain Points */}
                        <tr className="hover:bg-muted/10 transition-colors">
                          <td className="py-4 px-5 font-bold text-foreground border-l border-border/30 bg-muted/10 align-top space-y-1">
                            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black">
                              <ShieldAlert className="h-4 w-4 shrink-0" />
                              <span>المشاكل والمعاناة</span>
                            </div>
                            <span className="text-[11px] text-muted-foreground font-normal block">ما الذي يعاني منه العميل؟</span>
                          </td>
                          {selectedCompany.targetAudienceProfile.idealCustomerPersonas.map((persona, idx) => (
                            <td key={idx} className="py-4 px-6 border-l border-border/20 last:border-l-0 align-top">
                              {persona.painPoints && Array.isArray(persona.painPoints) && persona.painPoints.length > 0 ? (
                                <ul className="space-y-2">
                                  {persona.painPoints.map((pain, pIdx) => (
                                    <li key={pIdx} className="text-xs sm:text-sm text-foreground font-semibold flex items-start gap-2 bg-rose-500/5 p-2.5 rounded-xl border border-border/20">
                                      <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                                      <span className="leading-relaxed">{pain}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-muted-foreground italic">غير محدد</span>
                              )}
                            </td>
                          ))}
                        </tr>

                        {/* ROW 3: Key Motivations */}
                        <tr className="hover:bg-muted/10 transition-colors">
                          <td className="py-4 px-5 font-bold text-foreground border-l border-border/30 bg-muted/10 align-top space-y-1">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black">
                              <Lightbulb className="h-4 w-4 shrink-0" />
                              <span>الدوافع ومحفزات الحل</span>
                            </div>
                            <span className="text-[11px] text-muted-foreground font-normal block">لماذا يبحث عن الحل والخدمة؟</span>
                          </td>
                          {selectedCompany.targetAudienceProfile.idealCustomerPersonas.map((persona, idx) => (
                            <td key={idx} className="py-4 px-6 border-l border-border/20 last:border-l-0 align-top">
                              {persona.keyMotivations && Array.isArray(persona.keyMotivations) && persona.keyMotivations.length > 0 ? (
                                <ul className="space-y-2">
                                  {persona.keyMotivations.map((mot, mIdx) => (
                                    <li key={mIdx} className="text-xs sm:text-sm text-foreground font-semibold flex items-start gap-2 bg-emerald-500/5 p-2.5 rounded-xl border border-border/20">
                                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                      <span className="leading-relaxed">{mot}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-muted-foreground italic">غير محدد</span>
                              )}
                            </td>
                          ))}
                        </tr>

                        {/* ROW 4: Buying Behavior */}
                        <tr className="hover:bg-muted/10 transition-colors">
                          <td className="py-4 px-5 font-bold text-foreground border-l border-border/30 bg-muted/10 align-top space-y-1">
                            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-black">
                              <Compass className="h-4 w-4 shrink-0" />
                              <span>سلوك وقنوات البحث</span>
                            </div>
                            <span className="text-[11px] text-muted-foreground font-normal block">كيف يبحث ويتسوق العميل؟</span>
                          </td>
                          {selectedCompany.targetAudienceProfile.idealCustomerPersonas.map((persona, idx) => (
                            <td key={idx} className="py-4 px-6 border-l border-border/20 last:border-l-0 align-top">
                              <div className="p-3 bg-sky-500/5 rounded-xl border border-border/20 space-y-1">
                                <p className="text-xs sm:text-sm text-foreground font-semibold leading-relaxed">
                                  {persona.buyingBehavior || "البحث عبر القنوات الرقمية والتوصيات المباشرة."}
                                </p>
                              </div>
                            </td>
                          ))}
                        </tr>

                        {/* ROW 5: Buying Triggers */}
                        <tr className="hover:bg-muted/10 transition-colors">
                          <td className="py-4 px-5 font-bold text-foreground border-l border-border/30 bg-muted/10 align-top space-y-1">
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black">
                              <Zap className="h-4 w-4 shrink-0" />
                              <span>محفز وتوقيت القرار</span>
                            </div>
                            <span className="text-[11px] text-muted-foreground font-normal block">متى يقرر الشراء والتحول؟</span>
                          </td>
                          {selectedCompany.targetAudienceProfile.idealCustomerPersonas.map((persona, idx) => (
                            <td key={idx} className="py-4 px-6 border-l border-border/20 last:border-l-0 align-top">
                              <div className="p-3 bg-amber-500/5 rounded-xl border border-border/20 space-y-1">
                                <p className="text-xs sm:text-sm text-foreground font-bold leading-relaxed">
                                  {persona.buyingTriggers || "عند رغبة التوسع أو خفض التكاليف التشغيلية."}
                                </p>
                              </div>
                            </td>
                          ))}
                        </tr>

                        {/* ROW 6: Decision Criteria */}
                        <tr className="hover:bg-muted/10 transition-colors">
                          <td className="py-4 px-5 font-bold text-foreground border-l border-border/30 bg-muted/10 align-top space-y-1">
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black">
                              <ShieldCheck className="h-4 w-4 shrink-0" />
                              <span>معايير اختيار المنصة</span>
                            </div>
                            <span className="text-[11px] text-muted-foreground font-normal block">لماذا يفضل المنصة ويشتري؟</span>
                          </td>
                          {selectedCompany.targetAudienceProfile.idealCustomerPersonas.map((persona, idx) => (
                            <td key={idx} className="py-4 px-6 border-l border-border/20 last:border-l-0 align-top">
                              {persona.decisionCriteria && Array.isArray(persona.decisionCriteria) && persona.decisionCriteria.length > 0 ? (
                                <ul className="space-y-1.5">
                                  {persona.decisionCriteria.map((crit, cIdx) => (
                                    <li key={cIdx} className="text-xs sm:text-sm text-foreground font-semibold flex items-start gap-2">
                                      <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                                      <span className="leading-relaxed">{crit}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-muted-foreground italic">غير محدد</span>
                              )}
                            </td>
                          ))}
                        </tr>

                        {/* ROW 7: Economic Value LTV & Alignment */}
                        <tr className="hover:bg-muted/10 transition-colors">
                          <td className="py-4 px-5 font-bold text-foreground border-l border-border/30 bg-muted/10 align-top space-y-1">
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black">
                              <DollarSign className="h-4 w-4 shrink-0" />
                              <span>القيمة الاقتصادية (LTV)</span>
                            </div>
                            <span className="text-[11px] text-muted-foreground font-normal block">كم يساوي العميل اقتصادياً؟</span>
                          </td>
                          {selectedCompany.targetAudienceProfile.idealCustomerPersonas.map((persona, idx) => (
                            <td key={idx} className="py-4 px-6 border-l border-border/20 last:border-l-0 align-top">
                              <div className="p-3 bg-muted/20 rounded-xl border border-border/20 space-y-1.5">
                                <span className="text-xs sm:text-sm font-extrabold text-foreground block">
                                  {persona.economicValueLtv || "قيمة اقتصادية تراكمية عالية"}
                                </span>
                                {persona.valueAlignment && (
                                  <p className="text-xs text-muted-foreground font-medium border-t border-border/20 pt-1.5 mt-1">
                                    {persona.valueAlignment}
                                  </p>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-6 text-center text-muted-foreground italic text-xs sm:text-sm font-medium">
                لم يتم إدخال بيانات الجمهور والعملاء المستهدفين بعد.
              </div>
            )}
          </div>
        )}

        {/* BENCHMARK COMPARISON MATRIX TAB */}
        {activeAudienceTab === "benchmark" && (
          <div id="section-benchmark-matrix" className="space-y-6 relative">
            {viewTier === "public" && (
              <ProLockOverlay
                title="المقارنة والتمركز الاستراتيجي (Strategic Benchmark Pro Matrix)"
                subtitle="جدول المقارنة والتمركز التنافسي المباشر متاح حصرياً في الوضع الاحترافي."
                onUnlock={() => setViewTier("pro")}
              />
            )}

            <div className="rounded-2xl border border-border/30 bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse min-w-[750px]">
                  <thead>
                    <tr className="bg-muted/30 text-foreground border-b border-border/30">
                      <th className="py-4 px-5 w-64 min-w-[220px] text-xs font-black border-l border-border/30 bg-muted/20">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                          <Layers className="h-4.5 w-4.5 shrink-0" />
                          <span>معايير المقارنة التنافسية</span>
                        </div>
                      </th>
                      <th className="py-4 px-6 text-right border-l border-border/20 bg-muted/10">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
                          <Award className="h-4 w-4 shrink-0" />
                          <span>{selectedCompany.name || "الشركة محل الدراسة"}</span>
                        </div>
                      </th>
                      <th className="py-4 px-6 text-right border-l border-border/20">
                        <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm">
                          <Building2 className="h-4 w-4 shrink-0" />
                          <span>المنافس الإقليمي المباشر (زد Zid)</span>
                        </div>
                      </th>
                      <th className="py-4 px-6 text-right">
                        <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm">
                          <Globe className="h-4 w-4 shrink-0" />
                          <span>المعيار العالمي (Shopify)</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 text-xs font-medium">
                    {/* ROW 1: Value Proposition */}
                    <tr className="hover:bg-muted/10 transition-colors">
                      <td className="py-4 px-5 font-bold text-foreground border-l border-border/30 bg-muted/10 align-top space-y-1">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black">
                          <Target className="h-4 w-4 shrink-0" />
                          <span>01. القيمة المضافة المحورية</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-normal block">الركيزة التنافسية والتخصص</span>
                      </td>
                      <td className="py-4 px-6 border-l border-border/20 bg-muted/5 align-top">
                        <p className="text-xs sm:text-sm text-foreground font-semibold leading-relaxed">
                          {selectedCompany.competitiveAdvantage || "منظومة متكاملة متصلة بالبنية التحتية المحلية (الدفع والشحن والتطبيقات)"}
                        </p>
                      </td>
                      <td className="py-4 px-6 border-l border-border/20 align-top">
                        <p className="text-xs sm:text-sm text-muted-foreground font-semibold leading-relaxed">
                          التركيز على مرونة التخصيص وواجهات التاجر الموجهة للمشاريع المتوسطة
                        </p>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <p className="text-xs sm:text-sm text-muted-foreground font-semibold leading-relaxed">
                          الانتشار العالمي الضخم، منظومة المطورين الشاملة، وموثوقية البنية التحتية
                        </p>
                      </td>
                    </tr>

                    {/* ROW 2: Tech Architecture */}
                    <tr className="hover:bg-muted/10 transition-colors">
                      <td className="py-4 px-5 font-bold text-foreground border-l border-border/30 bg-muted/10 align-top space-y-1">
                        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-black">
                          <Cpu className="h-4 w-4 shrink-0" />
                          <span>02. البنية التقنية والأنظمة</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-normal block">التقنيات والتكاملات البرمجية</span>
                      </td>
                      <td className="py-4 px-6 border-l border-border/20 bg-muted/5 align-top space-y-2">
                        <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                          {selectedCompany.techSolutionDetails?.architectureOverview || "بنية سحابية موزعة (Cloud Microservices) مع ربط APIs متطور"}
                        </p>
                        {selectedCompany.sampleTechs && selectedCompany.sampleTechs.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {selectedCompany.sampleTechs.map((tech, tIdx) => (
                              <Badge key={tIdx} variant="outline" className="text-[10px] font-bold bg-card border-border/40">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 border-l border-border/20 align-top">
                        <p className="text-xs sm:text-sm text-muted-foreground font-semibold leading-relaxed">
                          حلول سحابية مرنة تعتمد على التكامل مع موفري الخدمات الإقليميين
                        </p>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <p className="text-xs sm:text-sm text-muted-foreground font-semibold leading-relaxed">
                          بنية خوادم Edge عالية السرعة مع محرك ثيمات Liquid ولغة برمجية مخصصة
                        </p>
                      </td>
                    </tr>

                    {/* ROW 3: Target Segment */}
                    <tr className="hover:bg-muted/10 transition-colors">
                      <td className="py-4 px-5 font-bold text-foreground border-l border-border/30 bg-muted/10 align-top space-y-1">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black">
                          <Users className="h-4 w-4 shrink-0" />
                          <span>03. شريحة المستهدفين الأساسية</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-normal block">من يستفيد من المنصة بشكل مباشر؟</span>
                      </td>
                      <td className="py-4 px-6 border-l border-border/20 bg-muted/5 align-top">
                        <p className="text-xs sm:text-sm font-bold text-foreground leading-relaxed">
                          {selectedCompany.marketPosition || "التجار والمشاريع الناشئة والمتوسطة والعلامات التجارية الكبرى"}
                        </p>
                      </td>
                      <td className="py-4 px-6 border-l border-border/20 align-top">
                        <p className="text-xs sm:text-sm text-muted-foreground font-semibold leading-relaxed">
                          تجار التجزئة المحليين والرواد الراغبين في مرونة الربط التكتيكي
                        </p>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <p className="text-xs sm:text-sm text-muted-foreground font-semibold leading-relaxed">
                          جميع فئات التجارة العالمية من صانعي المحتوى حتى الشركات العملاقة Fortune 500
                        </p>
                      </td>
                    </tr>

                    {/* ROW 4: Growth Strategy */}
                    <tr className="hover:bg-muted/10 transition-colors">
                      <td className="py-4 px-5 font-bold text-foreground border-l border-border/30 bg-muted/10 align-top space-y-1">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black">
                          <Compass className="h-4 w-4 shrink-0" />
                          <span>04. قنوات النمو والتوسع</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-normal block">استراتيجية الاستحواذ والتمدد</span>
                      </td>
                      <td className="py-4 px-6 border-l border-border/20 bg-muted/5 align-top">
                        <p className="text-xs sm:text-sm font-bold text-foreground leading-relaxed">
                          {selectedCompany.expansionStrategy?.growthChannels?.join(" ، ") || "التوسع الإقليمي في دول الخليج، الشراكات الاستراتيجية، ومتجر التطبيقات"}
                        </p>
                      </td>
                      <td className="py-4 px-6 border-l border-border/20 align-top">
                        <p className="text-xs sm:text-sm text-muted-foreground font-semibold leading-relaxed">
                          التسويق الرقمي الفعال وحملات الاستحواذ على التجار الجدد
                        </p>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <p className="text-xs sm:text-sm text-muted-foreground font-semibold leading-relaxed">
                          النمو العابر للحدود (Cross-border E-commerce) والاستحواذات الاستراتيجية
                        </p>
                      </td>
                    </tr>

                    {/* ROW 5: Core Strength */}
                    <tr className="hover:bg-muted/10 transition-colors">
                      <td className="py-4 px-5 font-bold text-foreground border-l border-border/30 bg-muted/10 align-top space-y-1">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black">
                          <Zap className="h-4 w-4 shrink-0" />
                          <span>05. أهم نقاط القوة الاستراتيجية</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-normal block">أبرز ركائز التفوق</span>
                      </td>
                      <td className="py-4 px-6 border-l border-border/20 bg-muted/5 align-top">
                        {selectedCompany.swotAnalysis?.strengths && selectedCompany.swotAnalysis.strengths.length > 0 ? (
                          <ul className="space-y-1.5">
                            {selectedCompany.swotAnalysis.strengths.slice(0, 2).map((str, sIdx) => (
                              <li key={sIdx} className="text-xs sm:text-sm font-bold text-foreground flex items-start gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs sm:text-sm font-bold text-foreground">ثقة السوق والنمو التمويلي المرتفع</p>
                        )}
                      </td>
                      <td className="py-4 px-6 border-l border-border/20 align-top">
                        <p className="text-xs sm:text-sm text-muted-foreground font-semibold leading-relaxed">
                          السرعة في إطلاق الميزات الجديدة وتسهيل بدء المتجر
                        </p>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <p className="text-xs sm:text-sm text-muted-foreground font-semibold leading-relaxed">
                          القوة المالية الهائلة والقدرة على ابتكار معايير التجارة الإلكترونية
                        </p>
                      </td>
                    </tr>

                    {/* ROW 6: Funding & Valuation */}
                    <tr className="hover:bg-muted/10 transition-colors">
                      <td className="py-4 px-5 font-bold text-foreground border-l border-border/30 bg-muted/10 align-top space-y-1">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black">
                          <Award className="h-4 w-4 shrink-0" />
                          <span>06. الحجم المالي ومستوى التمويل</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-normal block">القدرة المالية والتقييم</span>
                      </td>
                      <td className="py-4 px-6 border-l border-border/20 bg-muted/5 align-top space-y-1">
                        <span className="text-xs sm:text-sm font-extrabold text-foreground block">
                          إجمالي التمويل: {selectedCompany.totalFundingAmount || "غير متاح"}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-semibold block">
                          الحالة: {selectedCompany.fundingStatus || "شركة خاصة موثوقة"}
                        </span>
                      </td>
                      <td className="py-4 px-6 border-l border-border/20 align-top space-y-1">
                        <span className="text-xs sm:text-sm font-semibold text-muted-foreground block">
                          جولات استثمارية إقليمية متعددة
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium block">
                          دعم من صناديق جريئة إقليمية
                        </span>
                      </td>
                      <td className="py-4 px-6 align-top space-y-1">
                        <span className="text-xs sm:text-sm font-semibold text-muted-foreground block">
                          شركة مساهمة عامة متداولة (Market Cap &gt; $50B)
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium block">
                          سيولة مالية هائلة للتوسع والأبحاث
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { Building, MapPin } from "lucide-react";
import { Company } from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProLockOverlay } from "./ProLockOverlay";

interface Props {
  selectedCompany: Company;
  viewTier: "public" | "pro";
  setViewTier: (tier: "public" | "pro") => void;
}

export function Section02Ecosystem({ selectedCompany, viewTier, setViewTier }: Props) {
  const [activeEcosystemTab, setActiveEcosystemTab] = useState<"competitors" | "suborgs" | "similar" | "sectors">("competitors");

  return (
    <Card id="main-section-2" className="border-0 shadow-sm shadow-slate-200/60 dark:shadow-none rounded-3xl overflow-hidden bg-card space-y-0 pt-0 relative">
      {/* Master Section Header Banner */}
      <div className="p-6 sm:p-7 bg-muted/30 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 shrink-0 flex items-center justify-center">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">المحيط التنافسي والهيكل التنظيمي</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">قوائم المنافسين المباشرين، الهيكل التنظيمي للشركات التابعة، الشركات المماثلة، والقطاعات السوقية المرتبطة</p>
            </div>
          </div>
        </div>

        {/* Underline Tabs Navigation */}
        <div className="flex gap-6 overflow-x-auto pt-2">
          <button
            type="button"
            onClick={() => setActiveEcosystemTab("competitors")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap relative ${
              activeEcosystemTab === "competitors"
                ? "text-violet-600 dark:text-violet-400 font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>المنافسون</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeEcosystemTab === "competitors"
                  ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                  : "bg-muted text-muted-foreground"
              }`}>
                {selectedCompany.topCompetitors ? selectedCompany.topCompetitors.length : 0}
              </span>
            </div>
            {activeEcosystemTab === "competitors" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-violet-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveEcosystemTab("suborgs")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap relative ${
              activeEcosystemTab === "suborgs"
                ? "text-violet-600 dark:text-violet-400 font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>الشركات التابعة</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeEcosystemTab === "suborgs"
                  ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                  : "bg-muted text-muted-foreground"
              }`}>
                {selectedCompany.subOrganizations.length}
              </span>
            </div>
            {activeEcosystemTab === "suborgs" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-violet-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveEcosystemTab("similar")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap relative ${
              activeEcosystemTab === "similar"
                ? "text-violet-600 dark:text-violet-400 font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>الشركات المماثلة</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeEcosystemTab === "similar"
                  ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                  : "bg-muted text-muted-foreground"
              }`}>
                {selectedCompany.similarCompaniesList ? selectedCompany.similarCompaniesList.length : 0}
              </span>
            </div>
            {activeEcosystemTab === "similar" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-violet-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveEcosystemTab("sectors")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap relative ${
              activeEcosystemTab === "sectors"
                ? "text-violet-600 dark:text-violet-400 font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>القطاعات المرتبطة</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeEcosystemTab === "sectors"
                  ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                  : "bg-muted text-muted-foreground"
              }`}>
                {selectedCompany.relatedSectorsList ? selectedCompany.relatedSectorsList.length : 0}
              </span>
            </div>
            {activeEcosystemTab === "sectors" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-violet-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Master Card Content Area */}
      <CardContent className="p-0 relative">
        {/* DIRECT COMPETITORS CARD CONTENT */}
        {activeEcosystemTab === "competitors" && (
          <div id="section-competitors" className="overflow-hidden">
            <div className="px-6 py-4 bg-muted/20 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-sm sm:text-base text-foreground">الشركات المشابهة والمنافسة</span>
              </div>
              <Badge variant="secondary" className="font-bold text-xs px-3 py-1 border-0">
                {selectedCompany.topCompetitors ? selectedCompany.topCompetitors.length : 0} شركات
              </Badge>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[600px] text-right text-xs sm:text-sm border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                    <th className="px-5 py-3">اسم الشركة</th>
                    <th className="px-5 py-3">قطاع العمل</th>
                    <th className="px-5 py-3">نوع المنافسة</th>
                    <th className="px-5 py-3 text-center">المكانة</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-foreground">
                  {selectedCompany.topCompetitors && selectedCompany.topCompetitors.length > 0 ? (
                    selectedCompany.topCompetitors.map((comp, idx) => (
                      <tr key={idx} className="bg-muted/30 hover:bg-muted/60 transition-colors rounded-xl overflow-hidden">
                        <td className="px-5 py-3.5 font-bold text-foreground rounded-r-xl">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                            <span>{comp}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">
                          {selectedCompany.categories?.[0] || "التجارة الإلكترونية (E-Commerce)"}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant="secondary" className="text-xs font-semibold bg-violet-500/10 text-violet-700 dark:text-violet-300 border-0">
                            منافس مباشر
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-center rounded-l-xl">
                          <Badge variant="secondary" className="text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0">
                            نشطة
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-muted-foreground italic font-medium">لا توجد شركات مشابهة مسجلة.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-ORGANIZATIONS TABLE CARD CONTENT */}
        {activeEcosystemTab === "suborgs" && (
          <div id="section-suborgs" className="overflow-hidden">
            <div className="px-6 py-4 bg-muted/20 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-sm sm:text-base text-foreground">الشركات التابعة والهيكل التنظيمي</span>
              </div>
              <Badge variant="secondary" className="font-bold text-xs px-3 py-1 border-0">
                {selectedCompany.subOrganizations.length} شركات تابعة
              </Badge>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[600px] text-right text-xs sm:text-sm border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                    <th className="px-5 py-3">اسم الكيان التابع</th>
                    <th className="px-5 py-3">نوع التبعية / التصنيف</th>
                    <th className="px-5 py-3 text-center">الحالة التشغيلية</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-foreground">
                  {selectedCompany.subOrganizations.map((so) => (
                    <tr key={so.id} className="bg-muted/30 hover:bg-muted/60 transition-colors rounded-xl overflow-hidden">
                      <td className="px-5 py-3.5 font-bold text-foreground rounded-r-xl">
                        <div className="flex items-center gap-2.5">
                          <Building className="h-4 w-4 text-violet-500 shrink-0" />
                          <span>{so.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant="secondary" className="text-xs font-semibold bg-muted/60 text-foreground border-0">
                          {so.type}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-center rounded-l-xl">
                        <Badge variant="secondary" className="text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0">
                          نشط
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {selectedCompany.subOrganizations.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-muted-foreground italic font-medium">لا توجد جهات تابعة مسجلة.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SIMILAR COMPANIES TABLE CARD CONTENT */}
        {activeEcosystemTab === "similar" && (
          <div id="section-similar-companies-table" className="overflow-hidden relative">
            {viewTier === "public" && (
              <ProLockOverlay
                title="جدول المنافسين والشركات المماثلة (Competitors Table)"
                subtitle="جدول التحليل المقارن والمنافسين المباشرين متاح حصرياً في الباقة الاحترافية."
                onUnlock={() => setViewTier("pro")}
              />
            )}
            <div className="px-6 py-4 bg-muted/20 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-sm sm:text-base text-foreground">الشركات المماثلة والبدائل</span>
              </div>
              <Badge variant="secondary" className="font-bold text-xs px-3 py-1 border-0">
                {selectedCompany.similarCompaniesList ? selectedCompany.similarCompaniesList.length : 0} شركات
              </Badge>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[600px] text-right text-xs sm:text-sm border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                    <th className="py-3 px-5">اسم الشركة</th>
                    <th className="py-3 px-5">المقر الرئيسي</th>
                    <th className="py-3 px-5">معدل التشابه</th>
                    <th className="py-3 px-5">التقييم / القيمة السوقية</th>
                    <th className="py-3 px-5">الميزة التنافسية الرئيسية</th>
                    <th className="py-3 px-5 text-center">الحالة التشغيلية</th>
                  </tr>
                </thead>
                <tbody className="font-medium">
                  {selectedCompany.similarCompaniesList && selectedCompany.similarCompaniesList.length > 0 ? (
                    selectedCompany.similarCompaniesList.map((comp) => (
                      <tr key={comp.id} className="bg-muted/30 hover:bg-muted/60 transition-colors rounded-xl overflow-hidden">
                        <td className="py-3.5 px-5 font-bold text-foreground rounded-r-xl">{comp.name}</td>
                        <td className="py-3.5 px-5 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span>{comp.hqLocation}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <Badge variant="secondary" className="text-xs font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border-0 px-2.5 py-1">
                            {comp.similarityScore}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-5 font-extrabold text-foreground">{comp.marketCapOrValuation}</td>
                        <td className="py-3.5 px-5 text-muted-foreground max-w-xs">{comp.keyAdvantage}</td>
                        <td className="py-3.5 px-5 text-center rounded-l-xl">
                          <Badge variant="secondary" className="text-xs font-semibold bg-muted/60 text-foreground border-0">
                            {comp.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-muted-foreground italic font-medium">
                        لا توجد شركات مماثلة مسجلة حالياً.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RELATED SECTORS TABLE CARD CONTENT */}
        {activeEcosystemTab === "sectors" && (
          <div id="section-related-sectors-table" className="overflow-hidden relative">
            {viewTier === "public" && (
              <ProLockOverlay
                title="القطاعات والأسواق المرتبطة (Sectors Intelligence)"
                subtitle="جدول التحليل الشجري للقطاعات وسوق الأسهم المعتمد متاح حصرياً للمشتركين."
                onUnlock={() => setViewTier("pro")}
              />
            )}
            <div className="px-6 py-4 bg-muted/20 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-sm sm:text-base text-foreground">القطاعات والأسواق المرتبطة</span>
              </div>
              <Badge variant="secondary" className="font-bold text-xs px-3 py-1 border-0">
                {selectedCompany.relatedSectorsList ? selectedCompany.relatedSectorsList.length : 0} قطاعات
              </Badge>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[600px] text-right text-xs sm:text-sm border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                    <th className="py-3 px-5">اسم القطاع</th>
                    <th className="py-3 px-5">حجم السوق العالمي</th>
                    <th className="py-3 px-5">معدل النمو (YoY)</th>
                    <th className="py-3 px-5">مستوى الارتباط</th>
                    <th className="py-3 px-5">أبرز التوجهات والتقنيات</th>
                  </tr>
                </thead>
                <tbody className="font-medium">
                  {selectedCompany.relatedSectorsList && selectedCompany.relatedSectorsList.length > 0 ? (
                    selectedCompany.relatedSectorsList.map((sec) => (
                      <tr key={sec.id} className="bg-muted/30 hover:bg-muted/60 transition-colors rounded-xl overflow-hidden">
                        <td className="py-3.5 px-5 font-bold text-foreground rounded-r-xl">{sec.sectorName}</td>
                        <td className="py-3.5 px-5 font-extrabold text-foreground">{sec.marketSize}</td>
                        <td className="py-3.5 px-5">
                          <Badge variant="secondary" className="text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0 px-2.5 py-1">
                            {sec.growthRateMom}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-5">
                          <Badge variant="secondary" className="text-xs font-semibold bg-muted/60 text-foreground border-0">
                            {sec.relevanceLevel}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-5 rounded-l-xl">
                          <div className="flex flex-wrap gap-1.5">
                            {sec.keyTrends.map((trend, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs font-medium bg-muted/80 px-2.5 py-1 border-0">
                                {trend}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted-foreground italic font-medium text-xs sm:text-sm">
                        لا توجد قطاعات مرتبطة مسجلة حالياً.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

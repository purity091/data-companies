import { useState } from "react";
import { Activity } from "lucide-react";
import { Company } from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  selectedCompany: Company;
}

export function Section03Funding({ selectedCompany }: Props) {
  const [activeFundingTab, setActiveFundingTab] = useState<"funding" | "investments">("funding");

  return (
    <Card id="main-section-3" className="border-0 shadow-sm shadow-slate-200/60 dark:shadow-none rounded-3xl overflow-hidden bg-card space-y-0 pt-0 relative">
      {/* Master Section Header Banner with Integrated Tabs */}
      <div className="p-6 sm:p-7 bg-muted/30 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">التمويل والمعاملات الاستثمارية</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">سجل جولات التمويل التاريخية، كبار المستثمرين المشاركين، والاستثمارات الخارجية الممنوحة</p>
            </div>
          </div>
        </div>

        {/* Integrated Sub-section Navigation Segmented Pill Controls */}
        <div className="p-1 bg-muted/80 rounded-2xl flex items-center gap-1.5 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveFundingTab("funding")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFundingTab === "funding"
                ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>جولات التمويل</span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
              activeFundingTab === "funding"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}>
              {selectedCompany.fundingRounds.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFundingTab("investments")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFundingTab === "investments"
                ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>الاستثمارات الممنوحة</span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
              activeFundingTab === "investments"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}>
              {selectedCompany.investments.length}
            </span>
          </button>
        </div>
      </div>

      {/* Master Card Content Area */}
      <CardContent className="p-0 relative">
        {/* FUNDING ROUNDS TAB CONTENT */}
        {activeFundingTab === "funding" && (
          <div id="section-funding" className="overflow-hidden">
            <div className="px-6 py-4 bg-muted/20 flex flex-row items-center justify-between">
              <span className="font-bold text-sm sm:text-base text-foreground">جولات التمويل والاستثمار</span>
              <Badge variant="secondary" className="font-bold text-xs px-3 py-1 border-0">
                {selectedCompany.fundingRounds.length} جولات
              </Badge>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[600px] text-right text-xs sm:text-sm border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                    <th className="px-5 py-3">التاريخ</th>
                    <th className="px-5 py-3">اسم المعاملة</th>
                    <th className="px-5 py-3 text-center">المستثمرون</th>
                    <th className="px-5 py-3">المبلغ المرفوع</th>
                    <th className="px-5 py-3">المستثمر الرئيسي</th>
                    <th className="px-5 py-3">نوع التمويل</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-foreground">
                  {selectedCompany.fundingRounds.map((fr) => (
                    <tr key={fr.id} className="bg-muted/30 hover:bg-muted/60 transition-colors rounded-xl overflow-hidden">
                      <td className="px-5 py-3.5 font-bold text-foreground rounded-r-xl">{fr.announcedDate}</td>
                      <td className="px-5 py-3.5">{fr.transactionName}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-muted-foreground">{fr.investorsCount}</td>
                      <td className="px-5 py-3.5 font-extrabold text-foreground">{fr.moneyRaised}</td>
                      <td className="px-5 py-3.5 text-muted-foreground font-semibold">{fr.leadInvestor}</td>
                      <td className="px-5 py-3.5 rounded-l-xl">
                        <Badge variant="secondary" className="text-xs font-semibold bg-muted/60 text-foreground border-0">
                          {fr.fundingType}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {selectedCompany.fundingRounds.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-muted-foreground italic font-medium">لا توجد جولات تمويل مسجلة.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVESTMENTS TAB CONTENT */}
        {activeFundingTab === "investments" && (
          <div id="section-investments" className="overflow-hidden">
            <div className="px-6 py-4 bg-muted/20 flex flex-row items-center justify-between">
              <span className="font-bold text-sm sm:text-base text-foreground">الاستثمارات والتمويلات الخارجية الممنوحة</span>
              <Badge variant="secondary" className="font-bold text-xs px-3 py-1 border-0">
                {selectedCompany.investments.length} استثمارات
              </Badge>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[600px] text-right text-xs sm:text-sm border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                    <th className="px-5 py-3">تاريخ الاستثمار</th>
                    <th className="px-5 py-3">المؤسسة المستهدفة</th>
                    <th className="px-5 py-3 text-center">مستثمر رئيسي</th>
                    <th className="px-5 py-3">جولة التمويل</th>
                    <th className="px-5 py-3">مبلغ الاستثمار</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-foreground">
                  {selectedCompany.investments.map((inv) => (
                    <tr key={inv.id} className="bg-muted/30 hover:bg-muted/60 transition-colors rounded-xl overflow-hidden">
                      <td className="px-5 py-3.5 font-bold text-foreground rounded-r-xl">{inv.announcedDate}</td>
                      <td className="px-5 py-3.5 text-foreground font-bold">{inv.orgName}</td>
                      <td className="px-5 py-3.5 text-center">
                        <Badge variant={inv.isLead ? "secondary" : "outline"} className="text-xs font-semibold border-0">
                          {inv.isLead ? "نعم" : "لا"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground font-medium">{inv.fundingRound}</td>
                      <td className="px-5 py-3.5 font-extrabold text-foreground rounded-l-xl">{inv.moneyRaised}</td>
                    </tr>
                  ))}
                  {selectedCompany.investments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-muted-foreground italic font-medium">لا توجد استثمارات مسجلة.</td>
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

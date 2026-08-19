import React from "react";
import { Card } from "@/components/ui/card";
import { Layers, FileJson, Building, Activity, Target, Users } from "lucide-react";

export const CompanySidebarTOC: React.FC = () => {
  return (
    <div className="hidden lg:block w-64 shrink-0 sticky top-24">
      <Card className="p-4 shadow-sm shadow-slate-200/50 dark:shadow-none bg-card rounded-2xl border-0">
        <div className="text-xs font-bold text-foreground uppercase tracking-wider px-3 py-2 bg-muted/40 rounded-xl flex items-center justify-between mb-3">
          <span>فهرس المحتويات (Index)</span>
          <Layers className="h-4 w-4 text-primary" />
        </div>

        <nav className="flex flex-col gap-3 py-1 text-xs">
          {/* Main Section 1 TOC */}
          <div className="space-y-1 pb-2">
            <a href="#main-section-1" className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-500/10 transition-colors">
              <FileJson className="h-4 w-4 text-sky-500 shrink-0" />
              <span>هوية ومعلومات الشركة</span>
            </a>
            <div className="mr-3 pr-2 flex flex-col gap-0.5 text-[11px]">
              <a href="#section-about" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                <span>حول ونشاطات الشركة</span>
              </a>
              <a href="#section-strategy" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                <span>النموذج الربحي والمكانة</span>
              </a>
              <a href="#section-details" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                <span>التفاصيل القانونية</span>
              </a>
              <a href="#section-tech" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                <span>بيانات التقنية والزيارات</span>
              </a>
            </div>
          </div>

          {/* Main Section 2 TOC */}
          <div className="space-y-1 py-2">
            <a href="#main-section-2" className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-bold text-violet-700 dark:text-violet-300 hover:bg-violet-500/10 transition-colors">
              <Building className="h-4 w-4 text-violet-500 shrink-0" />
              <span>المحيط التنافسي والهيكل</span>
            </a>
            <div className="mr-3 pr-2 flex flex-col gap-0.5 text-[11px]">
              <a href="#section-competitors" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                <span>الشركات المنافسة</span>
              </a>
              <a href="#section-suborgs" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                <span>الشركات التابعة</span>
              </a>
              <a href="#section-similar-companies-table" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                <span>الشركات المماثلة</span>
              </a>
              <a href="#section-related-sectors-table" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                <span>القطاعات المرتبطة</span>
              </a>
            </div>
          </div>

          {/* Main Section 3 TOC */}
          <div className="space-y-1 py-2">
            <a href="#main-section-3" className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 transition-colors">
              <Activity className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>التمويل والاستثمارات</span>
            </a>
            <div className="mr-3 pr-2 flex flex-col gap-0.5 text-[11px]">
              <a href="#section-funding" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>جولات التمويل</span>
              </a>
              <a href="#section-investments" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>الاستثمارات الممنوحة</span>
              </a>
            </div>
          </div>

          {/* Main Section 4 TOC */}
          <div className="space-y-1 py-2">
            <a href="#main-section-4" className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 transition-colors">
              <Target className="h-4 w-4 text-amber-500 shrink-0" />
              <span>التحليل الاستراتيجي (Pro)</span>
            </a>
            <div className="mr-3 pr-2 flex flex-col gap-0.5 text-[11px]">
              <a href="#section-swot" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>تحليل SWOT المالي</span>
              </a>
              <a href="#section-business-tech" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>نموذج العمل والحل</span>
              </a>
              <a href="#section-expansion" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>استراتيجية التوسع</span>
              </a>
              <a href="#section-lessons-evidence" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>الدروس وشواهد التوثيق</span>
              </a>
            </div>
          </div>

          {/* Main Section 5 TOC */}
          <div className="space-y-1 pt-2">
            <a href="#main-section-5" className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/10 transition-colors">
              <Users className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>مصفوفة العملاء والجمهور</span>
            </a>
            <div className="mr-3 pr-2 flex flex-col gap-0.5 text-[11px]">
              <a href="#section-target-audience" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>مصفوفة العملاء (ICP Matrix)</span>
              </a>
              <a href="#section-strategic-matrix" className="py-1 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>المقارنة الاستراتيجية الشاملة</span>
              </a>
            </div>
          </div>
        </nav>
      </Card>
    </div>
  );
};

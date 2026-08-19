import { useState } from "react";
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  Cpu,
  Zap,
  Globe,
  Rocket,
  Milestone,
  BookOpen,
  ShieldCheck,
  FileCheck,
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

export function Section04Strategy({ selectedCompany, viewTier, setViewTier }: Props) {
  const [activeStrategicTab, setActiveStrategicTab] = useState<"swot" | "tech" | "expansion" | "lessons">("swot");

  return (
    <Card id="main-section-4" className="border-0 shadow-sm shadow-slate-200/60 dark:shadow-none rounded-3xl overflow-hidden bg-card space-y-0 pt-0 relative">
      {/* Master Section Header Banner with Integrated Tabs */}
      <div className="p-6 sm:p-7 bg-muted/30 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 flex items-center justify-center">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">التحليل الاستراتيجي وهيكلية النمو</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">تحليل SWOT المالي، معمارية الحل البرمجي، استراتيجية التوسع وقنوات الاستحواذ، والدروس الاعتمادية</p>
            </div>
          </div>
        </div>

        {/* Integrated Sub-section Navigation Segmented Pill Controls */}
        <div className="p-1 bg-muted/80 rounded-2xl flex items-center gap-1.5 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveStrategicTab("swot")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeStrategicTab === "swot"
                ? "bg-card text-amber-600 dark:text-amber-400 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>تحليل SWOT المالي</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStrategicTab("tech")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeStrategicTab === "tech"
                ? "bg-card text-amber-600 dark:text-amber-400 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>نموذج العمل والحل</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStrategicTab("expansion")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeStrategicTab === "expansion"
                ? "bg-card text-amber-600 dark:text-amber-400 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>استراتيجية التوسع</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStrategicTab("lessons")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeStrategicTab === "lessons"
                ? "bg-card text-amber-600 dark:text-amber-400 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>الدروس وشواهد التوثيق</span>
          </button>
        </div>
      </div>

      {/* Master Card Content Area */}
      <CardContent className="p-6 sm:p-7 relative">
        {/* SWOT ANALYSIS TAB CONTENT */}
        {activeStrategicTab === "swot" && (
          <div id="section-swot" className="space-y-4 relative">
            {viewTier === "public" && (
              <ProLockOverlay
                title="تحليل SWOT المالي والتشغيلي (Pro SWOT)"
                subtitle="التحليل الرباعي النقدي لنقاط القوة والضعف والفرص والتهديدات متاح حصرياً في الباقة الاحترافية."
                onUnlock={() => setViewTier("pro")}
              />
            )}
            {selectedCompany.swotAnalysis ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. STRENGTHS */}
                <div className="p-5 rounded-2xl bg-muted/40 space-y-3.5">
                  <div className="flex items-center gap-2 pb-1">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">نقاط القوة (Strengths)</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {selectedCompany.swotAnalysis.strengths.map((item, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex items-start gap-2.5 font-medium">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. WEAKNESSES */}
                <div className="p-5 rounded-2xl bg-muted/40 space-y-3.5">
                  <div className="flex items-center gap-2 pb-1">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">نقاط الضعف (Weaknesses)</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {selectedCompany.swotAnalysis.weaknesses.map((item, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex items-start gap-2.5 font-medium">
                        <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. OPPORTUNITIES */}
                <div className="p-5 rounded-2xl bg-muted/40 space-y-3.5">
                  <div className="flex items-center gap-2 pb-1">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">الفرص المتاحة (Opportunities)</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {selectedCompany.swotAnalysis.opportunities.map((item, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex items-start gap-2.5 font-medium">
                        <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. THREATS */}
                <div className="p-5 rounded-2xl bg-muted/40 space-y-3.5">
                  <div className="flex items-center gap-2 pb-1">
                    <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">التهديدات والمخاطر (Threats)</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {selectedCompany.swotAnalysis.threats.map((item, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex items-start gap-2.5 font-medium">
                        <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-muted-foreground italic text-xs sm:text-sm font-medium">
                لا يوجد تحليل SWOT مسجل لهذه الشركة بعد.
              </div>
            )}
          </div>
        )}

        {/* BUSINESS MODEL & TECH SOLUTION TAB CONTENT */}
        {activeStrategicTab === "tech" && (
          <div id="section-business-tech" className="space-y-4 relative">
            {viewTier === "public" && (
              <ProLockOverlay
                title="نموذج العمل والحل التقني (Tech Architecture Pro)"
                subtitle="تفاصيل البنية التحتية والمزايا التشغيلية المعمارية متاحة حصرياً في الباقة الاحترافية."
                onUnlock={() => setViewTier("pro")}
              />
            )}
            {selectedCompany.techSolutionDetails ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left 5 Cols: Architecture & Infrastructure */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-muted/40 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">معمارية الحل والبنية السحابية</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                      {selectedCompany.techSolutionDetails.architectureOverview}
                    </p>
                  </div>

                  <div className="pt-2 space-y-1.5">
                    <span className="text-xs font-bold text-muted-foreground block uppercase tracking-wider">نوع البنية التحتية</span>
                    <Badge variant="secondary" className="text-xs font-bold bg-card border-0 px-3 py-1 shadow-xs">
                      {selectedCompany.techSolutionDetails.infrastructureType}
                    </Badge>
                  </div>
                </div>

                {/* Right 7 Cols: Key Tech Features */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-muted/40 space-y-3.5">
                  <div className="flex items-center gap-2 pb-1">
                    <Zap className="h-5 w-5 text-amber-500 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">المزايا التقنية التشغيلية المفصلية</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {selectedCompany.techSolutionDetails.keyFeatures.map((feature, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-card shadow-xs flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-semibold text-foreground leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-muted-foreground italic text-xs sm:text-sm font-medium">
                لم يتم إدخال بيانات الحل التقني بعد.
              </div>
            )}
          </div>
        )}

        {/* EXPANSION STRATEGY TAB CONTENT */}
        {activeStrategicTab === "expansion" && (
          <div id="section-expansion" className="space-y-6 relative">
            {viewTier === "public" && (
              <ProLockOverlay
                title="استراتيجية التوسع وقنوات النمو (Growth Strategy Pro)"
                subtitle="خارطة طريق المحطات التوسعية والأسواق المستهدفة متاحة حصرياً للمشتركين."
                onUnlock={() => setViewTier("pro")}
              />
            )}
            {selectedCompany.expansionStrategy ? (
              <>
                {/* Top 2 Pillar Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Target Markets Card */}
                  <div className="p-5 rounded-2xl bg-muted/40 space-y-3.5">
                    <div className="flex items-center gap-2 pb-1">
                      <Globe className="h-5 w-5 text-sky-500 shrink-0" />
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">الأسواق المستهدفة للتوسع الجغرافي</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedCompany.expansionStrategy.targetMarkets.map((market, idx) => (
                        <Badge key={idx} variant="secondary" className="px-3.5 py-1.5 text-xs font-bold bg-card border-0 shadow-xs">
                          {market}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Growth Channels Card */}
                  <div className="p-5 rounded-2xl bg-muted/40 space-y-3.5">
                    <div className="flex items-center gap-2 pb-1">
                      <Rocket className="h-5 w-5 text-amber-500 shrink-0" />
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">قنوات التوسع والاستحواذ الرئيسية</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedCompany.expansionStrategy.growthChannels.map((channel, idx) => (
                        <Badge key={idx} variant="secondary" className="px-3.5 py-1.5 text-xs font-bold bg-card text-amber-700 dark:text-amber-300 border-0 shadow-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Horizontal Timeline Milestones */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3.5">
                    <Milestone className="h-5 w-5 text-amber-500 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">محطات التوسع والنمو الاستراتيجي</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedCompany.expansionStrategy.strategicMilestones.map((m, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-muted/40 space-y-2.5 relative">
                        <div className="flex items-center justify-between">
                          <Badge variant="default" className="text-xs font-bold px-2.5 py-0.5 bg-amber-500 text-white border-0">
                            {m.year}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-bold">المرحلة 0{idx + 1}</span>
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-foreground">{m.title}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">{m.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-6 text-center text-muted-foreground italic text-xs sm:text-sm font-medium">
                لم يتم إدخال بيانات استراتيجية التوسع بعد.
              </div>
            )}
          </div>
        )}

        {/* LESSONS LEARNED & VERIFIED EVIDENCE TAB CONTENT */}
        {activeStrategicTab === "lessons" && (
          <div id="section-lessons-evidence" className="space-y-4 relative">
            {viewTier === "public" && (
              <ProLockOverlay
                title="الدروس وشواهد التوثيق (Evidence & Certifications)"
                subtitle="الشهادات المعتمدة وأفضل الممارسات المستفادة متاحة حصرياً للمشتركين."
                onUnlock={() => setViewTier("pro")}
              />
            )}
            {selectedCompany.lessonAndEvidence ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Left Column: Lessons Learned */}
                <div className="p-5 rounded-2xl bg-muted/40 space-y-3.5">
                  <div className="flex items-center gap-2 pb-1">
                    <BookOpen className="h-5 w-5 text-amber-500 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">الدروس المستفادة وأفضل الممارسات</h4>
                  </div>
                  <div className="space-y-3">
                    {selectedCompany.lessonAndEvidence.lessonsLearned.map((lesson, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-card shadow-xs flex items-start gap-3">
                        <span className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">{lesson}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Verified Certificates & Evidence */}
                <div className="p-5 rounded-2xl bg-muted/40 space-y-3.5">
                  <div className="flex items-center gap-2 pb-1">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">شواهد التوثيق والاعتمادات الرسمية</h4>
                  </div>
                  <div className="space-y-3.5">
                    {selectedCompany.lessonAndEvidence.verifiedDocuments.map((doc, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-card shadow-xs flex items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                            <h5 className="text-xs sm:text-sm font-bold text-foreground">{doc.title}</h5>
                          </div>
                          <span className="text-xs text-muted-foreground block font-medium">الجهة المصدرة: {doc.issuer} ({doc.date})</span>
                        </div>
                        <Badge variant="secondary" className="text-xs font-mono font-bold bg-muted shrink-0 px-2.5 py-1 border-0">
                          {doc.verifyCode}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-muted-foreground italic text-xs sm:text-sm font-medium">
                لم يتم إدخال الدروس وشواهد التوثيق بعد.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

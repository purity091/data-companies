/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from "react";
import {
  Upload,
  Download,
  Plus,
  Trash2,
  Copy,
  Search,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  Info,
  Globe,
  Building,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  Edit,
  Eye,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Company, FundingRound, Investment, KeyPerson, SubOrganization, ValidationIssue } from "./types";
import { INITIAL_COMPANIES } from "./data/initialCompanies";
import { CompanyProfile } from "./components/company/CompanyProfile";
import { CompanySection } from "./components/company/CompanySection";
import { Section01Identity } from "./components/company/Section01Identity";
import { Section02Ecosystem } from "./components/company/Section02Ecosystem";
import { Section03Funding } from "./components/company/Section03Funding";
import { Section04Strategy } from "./components/company/Section04Strategy";
import { Section05Audience } from "./components/company/Section05Audience";
import { CompanySidebarTOC } from "./components/company/CompanySidebarTOC";
import { CompanyEditor } from "./components/company/CompanyEditor";

export default function App() {
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [selectedId, setSelectedId] = useState<string>("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "edit">("preview");
  const [viewTier, setViewTier] = useState<"public" | "pro">("pro");
  const [editSection, setEditSection] = useState<"basic" | "performance" | "details" | "financials" | "team">("basic");

  // Custom states for adding items in tables
  const [newFr, setNewFr] = useState<Partial<FundingRound>>({ announcedDate: "", transactionName: "", investorsCount: 0, moneyRaised: "", leadInvestor: "", fundingType: "" });
  const [newInv, setNewInv] = useState<Partial<Investment>>({ announcedDate: "", orgName: "", isLead: false, fundingRound: "", moneyRaised: "" });
  const [newKp, setNewKp] = useState<Partial<KeyPerson>>({ name: "", title: "", photoUrl: "", pastRole: "" });
  const [newSo, setNewSo] = useState<Partial<SubOrganization>>({ name: "", logoUrl: "", type: "" });

  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isCompanyListExpanded, setIsCompanyListExpanded] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selected company compute
  const selectedCompany = useMemo(() => {
    return companies.find((c) => c.id === selectedId) || companies[0] || null;
  }, [companies, selectedId]);

  // Toast helper
  const showNotification = (text: string, type: "success" | "error") => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Safe ensuring fields on raw input data
  const safeNormalize = (c: any): Company => {
    return {
      id: c.id || String(Date.now() + Math.random()),
      name: c.name || "شركة جديدة غير مسماة",
      permalink: c.permalink || "",
      shortDescription: c.shortDescription || "",
      aboutDescription: c.aboutDescription || "",
      logoUrl: c.logoUrl || "",
      revenueModel: c.revenueModel || "",
      marketPosition: c.marketPosition || "",
      topCompetitors: Array.isArray(c.topCompetitors) ? c.topCompetitors : [],
      competitiveAdvantage: c.competitiveAdvantage || "",
      foundedDate: c.foundedDate || "",
      ipoStatus: c.ipoStatus || "",
      fundingStatus: c.fundingStatus || "",
      hqLocation: c.hqLocation || "",
      employeeRange: c.employeeRange || "",
      website: c.website || "",
      facebook: c.facebook || "",
      linkedin: c.linkedin || "",
      twitter: c.twitter || "",
      instagram: c.instagram || "",
      categories: Array.isArray(c.categories) ? c.categories : [],
      totalFundingAmount: c.totalFundingAmount || "",
      fundingRoundsCount: typeof c.fundingRoundsCount === "number" ? c.fundingRoundsCount : 0,
      legalName: c.legalName || "",
      alsoKnownAs: c.alsoKnownAs || "",
      operatingStatus: c.operatingStatus || "",
      exitsCount: typeof c.exitsCount === "number" ? c.exitsCount : 0,
      stockSymbol: c.stockSymbol || "",
      companyType: c.companyType || "",
      founders: Array.isArray(c.founders) ? c.founders : [],
      phoneNumber: c.phoneNumber || "",
      contactEmail: c.contactEmail || "",
      monthlyWebVisits: c.monthlyWebVisits || "",
      visitsMomChange: c.visitsMomChange || "",
      itSpend: c.itSpend || "",
      activeTechProductsCount: typeof c.activeTechProductsCount === "number" ? c.activeTechProductsCount : 0,
      sampleTechs: Array.isArray(c.sampleTechs) ? c.sampleTechs : [],
      patentsCount: typeof c.patentsCount === "number" ? c.patentsCount : 0,
      trademarksCount: typeof c.trademarksCount === "number" ? c.trademarksCount : 0,
      fundingRounds: Array.isArray(c.fundingRounds) ? c.fundingRounds : [],
      investments: Array.isArray(c.investments) ? c.investments : [],
      keyPeople: Array.isArray(c.keyPeople) ? c.keyPeople : [],
      subOrganizations: Array.isArray(c.subOrganizations) ? c.subOrganizations : [],
      swotAnalysis: c.swotAnalysis || { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      techSolutionDetails: c.techSolutionDetails || { architectureOverview: "", keyFeatures: [], infrastructureType: "" },
      expansionStrategy: c.expansionStrategy || { targetMarkets: [], growthChannels: [], strategicMilestones: [] },
      founderStory: c.founderStory || { founderName: "", backgroundSummary: "", foundingMotivation: "", fundingJourney: "" },
      lessonAndEvidence: c.lessonAndEvidence || { lessonsLearned: [], verifiedDocuments: [] },
      similarCompaniesList: Array.isArray(c.similarCompaniesList) ? c.similarCompaniesList : [],
      relatedSectorsList: Array.isArray(c.relatedSectorsList) ? c.relatedSectorsList : [],
      targetAudienceProfile: c.targetAudienceProfile || { idealCustomerPersonas: [], keyTouchpointChannels: [], decisionMakingCriteria: [] }
    };
  };

  // Filter companies based on search
  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return companies;
    const term = searchTerm.toLowerCase();
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.legalName.toLowerCase().includes(term) ||
        c.shortDescription.toLowerCase().includes(term)
    );
  }, [companies, searchTerm]);

  // Validation Rules Engine
  const validationResult = useMemo(() => {
    if (!selectedCompany) return { score: 0, issues: [] };
    const issues: ValidationIssue[] = [];
    let totalFields = 12;
    let validFields = 0;

    // Check basic fields
    if (!selectedCompany.name.trim() || selectedCompany.name === "شركة جديدة غير مسماة") {
      issues.push({ fieldName: "اسم الشركة", severity: "error", message: "اسم الشركة مطلوب وغير محدد.", section: "البيانات الأساسية" });
    } else validFields++;

    if (!selectedCompany.legalName.trim()) {
      issues.push({ fieldName: "الاسم القانوني الكامل", severity: "warning", message: "يفضل تحديد الاسم القانوني المعتمد في السجل التجاري.", section: "التفاصيل القانونية" });
    } else validFields++;

    if (!selectedCompany.shortDescription.trim()) {
      issues.push({ fieldName: "الوصف المختصر", severity: "error", message: "الوصف المختصر أساسي لعرض بطاقة الشركة.", section: "البيانات الأساسية" });
    } else validFields++;

    if (!selectedCompany.aboutDescription.trim()) {
      issues.push({ fieldName: "نبذة تفصيلية", severity: "warning", message: "إضافة نبذة موسعة تزيد من اكتمال ملف الشركة.", section: "البيانات الأساسية" });
    } else validFields++;

    if (!selectedCompany.website.trim()) {
      issues.push({ fieldName: "موقع الويب", severity: "warning", message: "موقع الويب غير مدرج.", section: "التواصل والويب" });
    } else validFields++;

    if (!selectedCompany.logoUrl.trim()) {
      issues.push({ fieldName: "رابط الشعار", severity: "info", message: "لم يتم وضع رابط شعار صورة للشركة.", section: "البيانات الأساسية" });
    } else validFields++;

    if (!selectedCompany.categories || selectedCompany.categories.length === 0) {
      issues.push({ fieldName: "التصنيفات", severity: "warning", message: "يجب اختيار تصنيف واحد على الأقل.", section: "البيانات الأساسية" });
    } else validFields++;

    if (!selectedCompany.revenueModel.trim()) {
      issues.push({ fieldName: "النموذج الربحي", severity: "warning", message: "النموذج الربحي غير محدد.", section: "المكانة والأداء" });
    } else validFields++;

    if (!selectedCompany.marketPosition.trim()) {
      issues.push({ fieldName: "المكانة السوقية", severity: "info", message: "المكانة السوقية غير موثقة.", section: "المكانة والأداء" });
    } else validFields++;

    if (!selectedCompany.totalFundingAmount.trim()) {
      issues.push({ fieldName: "إجمالي التمويل", severity: "info", message: "مبلغ التمويل التراكمي فارغ.", section: "الاستثمارات والمالية" });
    } else validFields++;

    if (!selectedCompany.contactEmail.trim() && !selectedCompany.phoneNumber.trim()) {
      issues.push({ fieldName: "معلومات الاتصال", severity: "warning", message: "لا تتوفر وسائل تواصل رسمية (بريد أو هاتف).", section: "التفاصيل القانونية" });
    } else validFields++;

    if (selectedCompany.fundingRounds.length === 0) {
      issues.push({ fieldName: "جولات التمويل", severity: "info", message: "لا تتوفر تفاصيل جولات تمويلية مسجلة.", section: "الاستثمارات والمالية" });
    } else validFields++;

    const score = Math.round((validFields / totalFields) * 100);
    return { score, issues };
  }, [selectedCompany]);

  // Actions: Handlers for state mutations
  const handleFieldChange = (field: keyof Company, value: any) => {
    if (!selectedCompany) return;
    setCompanies((prev) =>
      prev.map((c) => (c.id === selectedCompany.id ? { ...c, [field]: value } : c))
    );
  };

  const handleMultipleFieldsChange = (fields: Partial<Company>) => {
    if (!selectedCompany) return;
    setCompanies((prev) =>
      prev.map((c) => (c.id === selectedCompany.id ? { ...c, ...fields } : c))
    );
  };

  const handleCreateNewCompany = () => {
    const newCompany: Company = safeNormalize({
      id: String(Date.now()),
      name: "شركة جديدة " + (companies.length + 1),
      permalink: "new-company-" + (companies.length + 1),
      shortDescription: "أدخل وصف مختصر للشركة هنا...",
      aboutDescription: "أدخل نبذة تفصيلية هنا..."
    });
    setCompanies([newCompany, ...companies]);
    setSelectedId(newCompany.id);
    setActiveTab("edit");
    showNotification("تم إنشاء ملف شركة جديدة. قم بتعبئة بياناتها الآن.", "success");
  };

  const handleDuplicateCompany = () => {
    if (!selectedCompany) return;
    const duplicated: Company = {
      ...JSON.parse(JSON.stringify(selectedCompany)),
      id: String(Date.now()),
      name: `${selectedCompany.name} (نسخة مكررة)`,
      permalink: `${selectedCompany.permalink}-copy`
    };
    setCompanies([duplicated, ...companies]);
    setSelectedId(duplicated.id);
    showNotification("تم تكرار سجل الشركة بنجاح!", "success");
  };

  const handleDeleteCompany = () => {
    if (!selectedCompany) return;
    if (companies.length <= 1) {
      showNotification("لا يمكنك حذف الشركة الوحيدة المتبقية في القائمة.", "error");
      return;
    }
    const remaining = companies.filter((c) => c.id !== selectedCompany.id);
    setCompanies(remaining);
    setSelectedId(remaining[0].id);
    showNotification("تم حذف سجل الشركة بنجاح.", "success");
  };

  // Dynamic Array Actions: Funding Rounds
  const addFundingRound = () => {
    if (!selectedCompany || !newFr.announcedDate || !newFr.transactionName) {
      showNotification("يرجى ملء تاريخ الجولة واسمها على الأقل.", "error");
      return;
    }
    const round: FundingRound = {
      id: String(Date.now()),
      announcedDate: newFr.announcedDate || "",
      transactionName: newFr.transactionName || "",
      investorsCount: newFr.investorsCount || 0,
      moneyRaised: newFr.moneyRaised || "",
      leadInvestor: newFr.leadInvestor || "",
      fundingType: newFr.fundingType || ""
    };
    handleFieldChange("fundingRounds", [...selectedCompany.fundingRounds, round]);
    setNewFr({ announcedDate: "", transactionName: "", investorsCount: 0, moneyRaised: "", leadInvestor: "", fundingType: "" });
    showNotification("تمت إضافة جولة التمويل بنجاح.", "success");
  };

  const deleteFundingRound = (id: string) => {
    if (!selectedCompany) return;
    handleFieldChange("fundingRounds", selectedCompany.fundingRounds.filter((fr) => fr.id !== id));
    showNotification("تم حذف جولة التمويل.", "success");
  };

  // Dynamic Array Actions: Investments
  const addInvestment = () => {
    if (!selectedCompany || !newInv.orgName) {
      showNotification("يرجى إدخال اسم الشركة المستهدفة بالاستثمار.", "error");
      return;
    }
    const inv: Investment = {
      id: String(Date.now()),
      announcedDate: newInv.announcedDate || "غير محدد",
      orgName: newInv.orgName || "",
      isLead: !!newInv.isLead,
      fundingRound: newInv.fundingRound || "",
      moneyRaised: newInv.moneyRaised || ""
    };
    handleFieldChange("investments", [...selectedCompany.investments, inv]);
    setNewInv({ announcedDate: "", orgName: "", isLead: false, fundingRound: "", moneyRaised: "" });
    showNotification("تمت إضافة الاستثمار بنجاح.", "success");
  };

  const deleteInvestment = (id: string) => {
    if (!selectedCompany) return;
    handleFieldChange("investments", selectedCompany.investments.filter((i) => i.id !== id));
    showNotification("تم حذف سجل الاستثمار.", "success");
  };

  // Dynamic Array Actions: Key People
  const addKeyPerson = () => {
    if (!selectedCompany || !newKp.name || !newKp.title) {
      showNotification("يرجى كتابة الاسم والمسمى الوظيفي.", "error");
      return;
    }
    const kp: KeyPerson = {
      id: String(Date.now()),
      name: newKp.name || "",
      title: newKp.title || "",
      photoUrl: newKp.photoUrl || "",
      pastRole: newKp.pastRole || ""
    };
    handleFieldChange("keyPeople", [...selectedCompany.keyPeople, kp]);
    setNewKp({ name: "", title: "", photoUrl: "", pastRole: "" });
    showNotification("تمت إضافة القيادي بنجاح.", "success");
  };

  const deleteKeyPerson = (id: string) => {
    if (!selectedCompany) return;
    handleFieldChange("keyPeople", selectedCompany.keyPeople.filter((k) => k.id !== id));
    showNotification("تم حذف العضو من القائمة.", "success");
  };

  // Dynamic Array Actions: Sub Organizations
  const addSubOrg = () => {
    if (!selectedCompany || !newSo.name) {
      showNotification("يرجى كتابة اسم الشركة التابعة.", "error");
      return;
    }
    const so: SubOrganization = {
      id: String(Date.now()),
      name: newSo.name || "",
      logoUrl: newSo.logoUrl || "",
      type: newSo.type || ""
    };
    handleFieldChange("subOrganizations", [...selectedCompany.subOrganizations, so]);
    setNewSo({ name: "", logoUrl: "", type: "" });
    showNotification("تمت إضافة الجهة التابعة.", "success");
  };

  const deleteSubOrg = (id: string) => {
    if (!selectedCompany) return;
    handleFieldChange("subOrganizations", selectedCompany.subOrganizations.filter((s) => s.id !== id));
    showNotification("تم حذف الجهة التابعة.", "success");
  };

  // File Handlers: JSON Import & Export
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          const normalizedList = json.map(safeNormalize);
          setCompanies(normalizedList);
          if (normalizedList.length > 0) setSelectedId(normalizedList[0].id);
          showNotification(`تم استيراد قائمة تضم (${normalizedList.length}) شركات بنجاح!`, "success");
        } else if (typeof json === "object" && json !== null) {
          const normalized = safeNormalize(json);
          setCompanies([normalized, ...companies]);
          setSelectedId(normalized.id);
          showNotification(`تم استيراد شركة (${normalized.name}) بنجاح!`, "success");
        } else {
          showNotification("تنسيق ملف JSON غير مدعوم.", "error");
        }
      } catch (err) {
        showNotification("تعذر قراءة ملف JSON. تأكد من سلامة التنسيق.", "error");
      }
    };
    reader.readAsText(file);

    if (e.target) e.target.value = "";
  };

  // Export Free JSON
  const handleExportFreeJson = () => {
    if (!selectedCompany) return;
    const freeData = {
      id: selectedCompany.id,
      name: selectedCompany.name,
      permalink: selectedCompany.permalink,
      shortDescription: selectedCompany.shortDescription,
      aboutDescription: selectedCompany.aboutDescription,
      logoUrl: selectedCompany.logoUrl,
      website: selectedCompany.website,
      foundedDate: selectedCompany.foundedDate,
      hqLocation: selectedCompany.hqLocation,
      employeeRange: selectedCompany.employeeRange,
      categories: selectedCompany.categories,
      phoneNumber: selectedCompany.phoneNumber,
      contactEmail: selectedCompany.contactEmail,
      facebook: selectedCompany.facebook,
      linkedin: selectedCompany.linkedin,
      twitter: selectedCompany.twitter,
      instagram: selectedCompany.instagram
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(freeData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${selectedCompany.permalink || "company"}-free.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification("تم تصدير ملف JSON المجاني الأساسي!", "success");
  };

  // Export Pro JSON
  const handleExportProJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(companies, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `company-database-pro-export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification("تم تصدير سجل قاعدة البيانات الشامل (Pro JSON) بنجاح!", "success");
  };

  // Download Sample JSON structure
  const handleDownloadSample = () => {
    const sampleData = INITIAL_COMPANIES;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sampleData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sample-companies-template.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification("تم تحميل الهيكلية النموذجية (Sample Template).", "success");
  };

  // Add categories helpers
  const handleAddCategory = (catText: string) => {
    if (!catText.trim() || !selectedCompany) return;
    if (selectedCompany.categories.includes(catText.trim())) return;
    handleFieldChange("categories", [...selectedCompany.categories, catText.trim()]);
  };

  const handleRemoveCategory = (catText: string) => {
    if (!selectedCompany) return;
    handleFieldChange("categories", selectedCompany.categories.filter((c) => c !== catText));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background bg-grid-dots antialiased">
      {/* Top Professional Header Navigation */}
      <header className="sticky top-0 z-50 bg-card text-card-foreground border-b border-border/40 shadow-xs">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Logo and Brand Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 bg-primary rounded-xl shadow-xs flex items-center justify-center shrink-0">
                <FileJson className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base md:text-lg font-extrabold tracking-tight text-foreground truncate">مراقب جودة وحوكمة بيانات الشركات</h1>
                <p className="text-[11px] sm:text-xs text-muted-foreground font-medium truncate">منصة التحقق الهيكلي وضبط الجودة لمدخلي البيانات العربية والعالمية</p>
              </div>
            </div>

            {/* Global Control Actions - Scrollable on mobile without squishing */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 max-w-full shrink-0">
              <Button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold rounded-lg border transition whitespace-nowrap shrink-0 ${
                  isSidebarOpen
                    ? "bg-muted hover:bg-accent text-foreground border-border/40"
                    : "bg-primary/10 hover:bg-primary/20 text-primary border-primary/30"
                }`}
                title={isSidebarOpen ? "إخفاء القائمة الجانبية" : "إظهار القائمة الجانبية"}
              >
                {isSidebarOpen ? (
                  <>
                    <PanelLeftClose className="h-4 w-4" />
                    <span className="whitespace-nowrap">إخفاء القائمة</span>
                  </>
                ) : (
                  <>
                    <PanelLeftOpen className="h-4 w-4" />
                    <span className="whitespace-nowrap">إظهار القائمة</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleDownloadSample}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs bg-muted hover:bg-accent text-foreground font-bold rounded-lg border border-border/40 transition whitespace-nowrap shrink-0"
                title="تحميل هيكلية JSON المطلوبة للتعبئة"
              >
                <Download className="h-4 w-4" />
                <span className="whitespace-nowrap hidden md:inline">النموذج التوضيحي</span>
              </Button>

              {/* View Tier Switcher Segmented Control */}
              <div className="flex bg-muted p-1 rounded-lg border border-border/40 shadow-xs shrink-0">
                <Button
                  onClick={() => setViewTier("public")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                    viewTier === "public"
                      ? "bg-card text-foreground shadow-xs border border-border/40"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="تحويل المعاينة إلى وضع العرض العام المجاني"
                >
                  <Globe className="h-3.5 w-3.5 text-blue-500" />
                  <span className="whitespace-nowrap">مجاني</span>
                </Button>
                <Button
                  onClick={() => setViewTier("pro")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                    viewTier === "pro"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="تحويل المعاينة إلى الوضع الاحترافي الكامل للمشتركين"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span className="whitespace-nowrap">احترافي</span>
                </Button>
              </div>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition font-bold shadow-xs whitespace-nowrap shrink-0"
              >
                <Upload className="h-4 w-4" />
                <span className="whitespace-nowrap">استيراد JSON</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />

              {/* Two Export JSON Buttons */}
              <Button
                onClick={handleExportFreeJson}
                disabled={companies.length === 0}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs bg-muted hover:bg-accent text-foreground rounded-lg border border-border/40 transition font-bold disabled:opacity-50 whitespace-nowrap shrink-0"
                title="تصدير ملف JSON خفيف يحتوي فقط على البيانات الأساسية العامة"
              >
                <Download className="h-4 w-4 text-blue-600" />
                <span className="whitespace-nowrap hidden xl:inline">تصدير مجاني</span>
              </Button>

              <Button
                onClick={handleExportProJson}
                disabled={companies.length === 0}
                className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition font-bold shadow-xs disabled:opacity-50 whitespace-nowrap shrink-0"
                title="تصدير ملف JSON الشامل مع جميع تحليلات العملاء المثاليين وSWOT والجدول والتكنولوجيا"
              >
                <Download className="h-4 w-4 text-amber-300" />
                <span className="whitespace-nowrap">تصدير Pro JSON</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Notifications Panel */}
      {notification && (
        <div className="bg-slate-900 text-white border-b border-slate-800 transition-all shadow-md">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${notification.type === "success" ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
              <p>{notification.text}</p>
            </div>
            <Button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white px-2 py-0.5 rounded border border-slate-700 hover:border-slate-500 transition">إغلاق</Button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">

        {/* SIDEBAR: Company Selector & Direct QC overview list */}
        {isSidebarOpen && (
          <section className="w-full lg:w-80 flex flex-col gap-5 shrink-0">
            <div className="bg-card text-card-foreground p-5 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => setIsCompanyListExpanded(!isCompanyListExpanded)}
                >
                  <h2 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                    <span>قائمة الشركات المحملة</span>
                    <span className="text-xs bg-muted px-2.5 py-0.5 rounded-full text-muted-foreground font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">{companies.length}</span>
                  </h2>
                  {isCompanyListExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <Button
                  onClick={handleCreateNewCompany}
                  className="p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors border border-primary/20"
                  title="إضافة شركة جديدة من الصفر"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {isCompanyListExpanded && (
                <>
                  {/* Search filter input */}
                  <div className="relative mb-4">
                    <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="ابحث عن شركة بالاسم..."
                      className="w-full pl-3 pr-9 py-2 text-xs sm:text-sm bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                    />
                  </div>

                  {/* Company list details */}
                  <div className="space-y-2 max-h-80 lg:max-h-[440px] overflow-y-auto pr-0.5">
                    {filteredCompanies.map((c) => {
                      const isSelected = c.id === selectedId;

                      return (
                        <div
                          key={c.id}
                          onClick={() => {
                            setSelectedId(c.id);
                            showNotification(`تم تحديد الشركة: ${c.name}`, "success");
                          }}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                            isSelected
                              ? "bg-primary/10 border-primary/30 text-foreground font-medium"
                              : "bg-muted/50 hover:bg-accent border-transparent text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-md bg-card text-card-foreground border border-border flex items-center justify-center shrink-0 overflow-hidden p-1 shadow-xs">
                            {c.logoUrl ? (
                              <img src={c.logoUrl} alt={c.name} className="w-8 h-8 object-contain rounded-sm" referrerPolicy="no-referrer" />
                            ) : (
                              <Building className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold truncate leading-snug text-foreground">{c.name || "شركة بدون اسم"}</h3>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{c.legalName || "الاسم القانوني غير محدد"}</p>
                          </div>

                          {/* Status Badge */}
                          <div className="text-left shrink-0">
                            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-md block font-bold text-center whitespace-nowrap bg-muted text-muted-foreground border border-border">
                              {c.marketPosition || "غير محدد"}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {filteredCompanies.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-xs sm:text-sm font-medium">لا توجد نتائج بحث مطابقة.</div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* QC LOG PANEL: Dynamic checklist warning logs */}
            {selectedCompany && (
              <div className="bg-card text-card-foreground p-5 rounded-xl border border-border shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>تقرير حوكمة جودة البيانات</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <span className="font-bold text-muted-foreground">معدل الدقة:</span>
                    <span className={`font-bold px-2.5 py-0.5 rounded-md border text-xs whitespace-nowrap ${
                      validationResult.score > 85 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    }`}>
                      {validationResult.score}%
                    </span>
                  </div>
                </div>

                {/* Progress bar of data health */}
                <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      validationResult.score > 80 ? "bg-emerald-500" : validationResult.score > 50 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${validationResult.score}%` }}
                  />
                </div>

                {/* Validation Warning logs */}
                <div className="border-t border-border/50 pt-3 max-h-48 overflow-y-auto pr-0.5 space-y-2">
                  {validationResult.issues.length === 0 ? (
                    <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-700 dark:text-emerald-400">
                      <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                      <p className="text-xs leading-relaxed font-medium">بيانات الشركة مستوفية لكافة معايير الجودة والمطابقة والاعتماد البصري!</p>
                    </div>
                  ) : (
                    validationResult.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs flex gap-2.5 leading-relaxed ${
                          issue.severity === "error"
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400"
                            : issue.severity === "warning"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400"
                              : "bg-muted border-border text-foreground"
                        }`}
                      >
                        {issue.severity === "error" ? (
                          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        ) : issue.severity === "warning" ? (
                          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        ) : (
                          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold block mb-0.5 text-foreground">{issue.section} &raquo; {issue.fieldName}</span>
                          <span>{issue.message}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Quick instructions and helper */}
            <div className="bg-card text-card-foreground p-4.5 rounded-xl text-xs leading-relaxed border border-border shadow-xs">
              <h4 className="font-bold text-foreground mb-2.5 flex items-center gap-2 text-xs sm:text-sm">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span>إرشادات ضبط الجودة الذاتية:</span>
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground pr-1 text-xs">
                <li>قم برفع ملف الـ JSON الأساسي لتعديله.</li>
                <li>تفقد "معدل الدقة" قبل القيام بعملية الحفظ والتصدير.</li>
                <li>استخدم "محرر الحقول" لتصحيح النواقص المذكورة أعلاه.</li>
              </ul>
            </div>
          </section>
        )}

        {/* WORKSPACE & VIEW AREA: Switchable Interactive UI */}
        <section className="flex-1 flex flex-col gap-5 min-w-0">

          {/* Main workspace tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-border pb-3 gap-3">
            <div className="flex bg-muted p-1 rounded-lg border border-border">
              <Button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-md transition-all ${
                  activeTab === "preview"
                    ? "bg-card text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>معاينة صفحة العرض (منصة خطة)</span>
              </Button>
              <Button
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-md transition-all ${
                  activeTab === "edit"
                    ? "bg-card text-primary shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Edit className="h-4 w-4" />
                <span>محرر ومدخل الحقول (Structured Editor)</span>
              </Button>
            </div>

            {/* List and Selected actions */}
            {selectedCompany && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleDuplicateCompany}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm bg-muted hover:bg-accent text-foreground rounded-lg border border-border transition font-bold"
                  title="تكرار الشركة المحددة الحالية"
                >
                  <Copy className="h-4 w-4" />
                  <span>تكرار</span>
                </Button>
                <Button
                  onClick={handleDeleteCompany}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-500/20 transition font-bold"
                  title="حذف هذه الشركة من الذاكرة الحالية"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>حذف</span>
                </Button>
              </div>
            )}
          </div>

          {/* TAB 1: Ultra-Professional Visual Preview */}
          {activeTab === "preview" && selectedCompany && (
            <div className="flex flex-col gap-6">
              <CompanyProfile company={selectedCompany}>

                {/* Free Tier Notice Banner */}
                {viewTier === "public" && (
                  <div className="p-4.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">أنت تعاين الوضع المجاني (Free Public Tier)</h4>
                        <p className="text-muted-foreground mt-0.5">تظهر البيانات الأساسية فقط. يتم حجب التحليلات المتقدمة (ICP, SWOT, التنافسية). اشترك أو افتح الوضع الاحترافي لاستكمال الرؤى.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        onClick={handleExportFreeJson}
                        className="px-3.5 py-2 bg-card hover:bg-accent text-foreground font-bold text-xs sm:text-sm rounded-lg border border-border transition"
                      >
                        <Download className="h-4 w-4 text-blue-600" />
                        <span>تصدير المجاني</span>
                      </Button>
                      <Button
                        onClick={() => setViewTier("pro")}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm rounded-lg transition shadow-xs"
                      >
                        <span>فتح الوضع الاحترافي (Pro)</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Ultra-Clean Company Hero Header Section */}
                <Card id="section-summary" className="border border-border/40 shadow-xs bg-card rounded-2xl overflow-hidden">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-start md:items-center gap-5 sm:gap-6">
                        {/* Logo Frame */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted/30 border border-border/30 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-xs p-2">
                          {selectedCompany.logoUrl ? (
                            <img src={selectedCompany.logoUrl} alt={selectedCompany.name} className="w-full h-full object-contain rounded-xl" referrerPolicy="no-referrer" />
                          ) : (
                            <Building className="h-10 w-10 text-muted-foreground/60" />
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{selectedCompany.name}</h2>
                            <Badge variant="secondary" className="font-bold text-xs gap-1.5 px-3 py-1 border-0">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              <span>شركة معتمدة</span>
                            </Badge>
                          </div>

                          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed font-medium">{selectedCompany.shortDescription}</p>

                          {/* Category Tags */}
                          {selectedCompany.categories && selectedCompany.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {selectedCompany.categories.map((cat, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs font-semibold bg-muted/30 text-muted-foreground border-border/30 px-3 py-1">
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                        {selectedCompany.website && (
                          <a
                            href={selectedCompany.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto"
                          >
                            <Button variant="default" size="lg" className="w-full gap-2 font-bold shadow-xs px-5 text-sm">
                              <Globe className="h-4.5 w-4.5" />
                              <span>زيارة موقع الويب</span>
                              <ExternalLink className="h-4 w-4 opacity-70" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Layout Container: TOC Sidebar + Content Stack */}
                <div className="flex flex-col lg:flex-row items-start gap-6 relative">
                  {/* TOC Sidebar Index Component */}
                  <CompanySidebarTOC />

                  {/* Main Content Stack */}
                  <div className="flex-1 flex flex-col gap-8 w-full min-w-0">
                    <CompanySection sectionName="company-identity">
                      <Section01Identity selectedCompany={selectedCompany} />
                    </CompanySection>

                    <CompanySection sectionName="company-ecosystem">
                      <Section02Ecosystem
                        selectedCompany={selectedCompany}
                        viewTier={viewTier}
                        setViewTier={setViewTier}
                      />
                    </CompanySection>

                    <CompanySection sectionName="company-funding">
                      <Section03Funding
                        selectedCompany={selectedCompany}
                      />
                    </CompanySection>

                    <CompanySection sectionName="company-strategy">
                      <Section04Strategy
                        selectedCompany={selectedCompany}
                        viewTier={viewTier}
                        setViewTier={setViewTier}
                      />
                    </CompanySection>

                    <CompanySection sectionName="company-audience">
                      <Section05Audience
                        selectedCompany={selectedCompany}
                        viewTier={viewTier}
                        setViewTier={setViewTier}
                      />
                    </CompanySection>
                  </div>
                </div>

              </CompanyProfile>
            </div>
          )}

          {/* TAB 2: Smart Interactive Structured Editor */}
          {activeTab === "edit" && selectedCompany && (
            <CompanyEditor
              selectedCompany={selectedCompany}
              editSection={editSection}
              setEditSection={setEditSection}
              handleFieldChange={handleFieldChange}
              handleMultipleFieldsChange={handleMultipleFieldsChange}
              handleAddCategory={handleAddCategory}
              handleRemoveCategory={handleRemoveCategory}
              showNotification={showNotification}
              newFr={newFr}
              setNewFr={setNewFr}
              addFundingRound={addFundingRound}
              deleteFundingRound={deleteFundingRound}
              newInv={newInv}
              setNewInv={setNewInv}
              addInvestment={addInvestment}
              deleteInvestment={deleteInvestment}
              newKp={newKp}
              setNewKp={setNewKp}
              addKeyPerson={addKeyPerson}
              deleteKeyPerson={deleteKeyPerson}
              newSo={newSo}
              setNewSo={setNewSo}
              addSubOrg={addSubOrg}
              deleteSubOrg={deleteSubOrg}
            />
          )}

        </section>

      </main>

      {/* Footer container */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span>نظام ضبط الجودة مدعوم بالكامل باللغة العربية (RTL) وخط IBM Plex Sans Arabic.</span>
          </div>
          <div className="text-muted-foreground">
            <span>حقوق الطبع محفوظة © 2026. تم البناء والتدقيق وفقاً لأعلى معايير جودة البيانات للشركات التكنولوجية والمالية.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

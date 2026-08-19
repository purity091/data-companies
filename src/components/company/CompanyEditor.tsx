import React from "react";
import { Company, FundingRound, Investment, KeyPerson, SubOrganization } from "../../types";
import { Button } from "@/components/ui/button";
import { LLMImporter } from "./LLMImporter";
import { CheckCircle2, Trash2, Layers, Users, Building } from "lucide-react";

interface CompanyEditorProps {
  selectedCompany: Company;
  editSection: string;
  setEditSection: (section: string) => void;
  handleFieldChange: (field: keyof Company, value: any) => void;
  handleMultipleFieldsChange: (fields: Partial<Company>) => void;
  handleAddCategory: (category: string) => void;
  handleRemoveCategory: (category: string) => void;
  showNotification: (msg: string, type: "success" | "error") => void;
  newFr: Partial<FundingRound>;
  setNewFr: React.Dispatch<React.SetStateAction<Partial<FundingRound>>>;
  addFundingRound: () => void;
  deleteFundingRound: (id: string) => void;
  newInv: Partial<Investment>;
  setNewInv: React.Dispatch<React.SetStateAction<Partial<Investment>>>;
  addInvestment: () => void;
  deleteInvestment: (id: string) => void;
  newKp: Partial<KeyPerson>;
  setNewKp: React.Dispatch<React.SetStateAction<Partial<KeyPerson>>>;
  addKeyPerson: () => void;
  deleteKeyPerson: (id: string) => void;
  newSo: Partial<SubOrganization>;
  setNewSo: React.Dispatch<React.SetStateAction<Partial<SubOrganization>>>;
  addSubOrg: () => void;
  deleteSubOrg: (id: string) => void;
}

export const CompanyEditor: React.FC<CompanyEditorProps> = ({
  selectedCompany,
  editSection,
  setEditSection,
  handleFieldChange,
  handleMultipleFieldsChange,
  handleAddCategory,
  handleRemoveCategory,
  showNotification,
  newFr,
  setNewFr,
  addFundingRound,
  deleteFundingRound,
  newInv,
  setNewInv,
  addInvestment,
  deleteInvestment,
  newKp,
  setNewKp,
  addKeyPerson,
  deleteKeyPerson,
  newSo,
  setNewSo,
  addSubOrg,
  deleteSubOrg,
}) => {
  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Internal editor tabs */}
      <div className="flex bg-muted border-b border-border p-2 gap-2 overflow-x-auto">
        <Button
          onClick={() => setEditSection("basic")}
          className={`px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap border ${
            editSection === "basic"
              ? "bg-card text-card-foreground text-primary border-border shadow-xs"
              : "text-muted-foreground hover:text-foreground border-transparent hover:bg-slate-100"
          }`}
        >
          البيانات الأساسية ونبذة الشركة
        </Button>
        <Button
          onClick={() => setEditSection("performance")}
          className={`px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap border ${
            editSection === "performance"
              ? "bg-card text-card-foreground text-primary border-border shadow-xs"
              : "text-muted-foreground hover:text-foreground border-transparent hover:bg-slate-100"
          }`}
        >
          درجات الأداء والتقييمات
        </Button>
        <Button
          onClick={() => setEditSection("details")}
          className={`px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap border ${
            editSection === "details"
              ? "bg-card text-card-foreground text-primary border-border shadow-xs"
              : "text-muted-foreground hover:text-foreground border-transparent hover:bg-slate-100"
          }`}
        >
          التفاصيل القانونية وموقع الويب
        </Button>
        <Button
          onClick={() => setEditSection("financials")}
          className={`px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap border ${
            editSection === "financials"
              ? "bg-card text-card-foreground text-primary border-border shadow-xs"
              : "text-muted-foreground hover:text-foreground border-transparent hover:bg-slate-100"
          }`}
        >
          الاستثمارات والتمويلات
        </Button>
        <Button
          onClick={() => setEditSection("team")}
          className={`px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap border ${
            editSection === "team"
              ? "bg-card text-card-foreground text-primary border-border shadow-xs"
              : "text-muted-foreground hover:text-foreground border-transparent hover:bg-slate-100"
          }`}
        >
          القيادات والشركات التابعة
        </Button>
      </div>

      {/* EDITOR SUB-SECTIONS */}
      <div className="p-6">
        {/* 1. BASIC & ABOUT */}
        {editSection === "basic" && (
          <div className="space-y-4">
            <LLMImporter
              sectionTitle="البيانات الأساسية"
              jsonFormat={`{
  "name": "string",
  "permalink": "string",
  "shortDescription": "string",
  "aboutDescription": "string",
  "logoUrl": "string",
  "website": "string",
  "facebook": "string",
  "linkedin": "string",
  "twitter": "string",
  "instagram": "string",
  "categories": ["string"]
}`}
              onImport={(data) => handleMultipleFieldsChange(data)}
              onShowNotification={showNotification}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم الشركة (بالعربية أو الإنجليزية)</label>
                <input
                  type="text"
                  value={selectedCompany.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">معرف الرابط (Permalink)</label>
                <input
                  type="text"
                  value={selectedCompany.permalink}
                  onChange={(e) => handleFieldChange("permalink", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رابط الشعار (Logo URL)</label>
                <input
                  type="text"
                  value={selectedCompany.logoUrl}
                  onChange={(e) => handleFieldChange("logoUrl", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">موقع الويب الرئيسي</label>
                <input
                  type="text"
                  value={selectedCompany.website}
                  onChange={(e) => handleFieldChange("website", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">الوصف المختصر (Short Description)</label>
              <input
                type="text"
                value={selectedCompany.shortDescription}
                onChange={(e) => handleFieldChange("shortDescription", e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نبذة تفصيلية حول الشركة (About Description)</label>
              <textarea
                value={selectedCompany.aboutDescription}
                onChange={(e) => handleFieldChange("aboutDescription", e.target.value)}
                rows={4}
                className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
              />
            </div>

            {/* Categories chips handling */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">التصنيفات الحالية (اضغط للحذف):</label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-muted border border-slate-100 rounded-lg min-h-10">
                {selectedCompany.categories.map((c, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    onClick={() => handleRemoveCategory(c)}
                    className="bg-red-50 text-red-800 text-[10px] px-2 py-0.5 rounded-sm hover:bg-red-100 transition-colors"
                  >
                    {c} &times;
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 mt-1.5">
                <input
                  type="text"
                  id="new-category-input"
                  placeholder="أدخل تصنيف جديد..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCategory((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="px-3.5 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition flex-1"
                />
                <Button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("new-category-input") as HTMLInputElement;
                    if (input) {
                      handleAddCategory(input.value);
                      input.value = "";
                    }
                  }}
                  className="px-3 py-1 bg-slate-900 text-white text-xs rounded-lg hover:bg-black transition-colors"
                >
                  إضافة تصنيف
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 2. PERFORMANCE & SCORES */}
        {editSection === "performance" && (
          <div className="space-y-4">
            <LLMImporter
              sectionTitle="المكانة والمنافسة (الذكاء الاصطناعي)"
              jsonFormat={`{
  "revenueModel": "string",
  "marketPosition": "string",
  "topCompetitors": ["string"],
  "competitiveAdvantage": "string",
  "monthlyWebVisits": "string",
  "visitsMomChange": "string",
  "itSpend": "string",
  "activeTechProductsCount": "number",
  "patentsCount": "number",
  "trademarksCount": "number",
  "sampleTechs": ["string"]
}`}
              onImport={(data) => handleMultipleFieldsChange(data)}
              onShowNotification={showNotification}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">النموذج الربحي (Revenue Model)</label>
                <input
                  type="text"
                  value={selectedCompany.revenueModel || ""}
                  onChange={(e) => handleFieldChange("revenueModel", e.target.value)}
                  placeholder="مثال: B2B SaaS"
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المكانة السوقية (Market Position)</label>
                <input
                  type="text"
                  value={selectedCompany.marketPosition || ""}
                  onChange={(e) => handleFieldChange("marketPosition", e.target.value)}
                  placeholder="مثال: قائد سوقي، مبتدئ"
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">أبرز المنافسين (Top Competitors - افصل بينهم بفاصلة)</label>
                <input
                  type="text"
                  value={selectedCompany.topCompetitors?.join("، ") || ""}
                  onChange={(e) => handleFieldChange("topCompetitors", e.target.value.split("،").map(s => s.trim()).filter(Boolean))}
                  placeholder="شركة 1، شركة 2، شركة 3"
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الميزة التنافسية (Competitive Advantage)</label>
                <input
                  type="text"
                  value={selectedCompany.competitiveAdvantage || ""}
                  onChange={(e) => handleFieldChange("competitiveAdvantage", e.target.value)}
                  placeholder="ما الذي يميز هذه الشركة عن غيرها؟"
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الزيارات الشهرية للويب (Monthly Visits)</label>
                <input
                  type="text"
                  value={selectedCompany.monthlyWebVisits}
                  onChange={(e) => handleFieldChange("monthlyWebVisits", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">معدل التغيير الشهري للزيارات (Visits MoM Change)</label>
                <input
                  type="text"
                  value={selectedCompany.visitsMomChange}
                  onChange={(e) => handleFieldChange("visitsMomChange", e.target.value)}
                  placeholder="مثال: -2.19% أو +5.4%"
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الإنفاق المقدر على التقنية (IT Spend)</label>
                <input
                  type="text"
                  value={selectedCompany.itSpend}
                  onChange={(e) => handleFieldChange("itSpend", e.target.value)}
                  placeholder="مثال: $7.1B"
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. DETAILS & LEGAL */}
        {editSection === "details" && (
          <div className="space-y-4">
            <LLMImporter
              sectionTitle="التفاصيل القانونية والتنظيمية"
              jsonFormat={`{
  "legalName": "string",
  "alsoKnownAs": "string",
  "operatingStatus": "string",
  "employeeCountRange": "string",
  "companyType": "string",
  "exitsCount": "number",
  "stockSymbol": "string",
  "ipoStatus": "string",
  "contactEmail": "string",
  "phoneNumber": "string",
  "headquartersLocation": "string",
  "founders": ["string"]
}`}
              onImport={(data) => handleMultipleFieldsChange(data)}
              onShowNotification={showNotification}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الاسم القانوني الكامل</label>
                <input
                  type="text"
                  value={selectedCompany.legalName}
                  onChange={(e) => handleFieldChange("legalName", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">أسماء تجارية أخرى</label>
                <input
                  type="text"
                  value={selectedCompany.alsoKnownAs}
                  onChange={(e) => handleFieldChange("alsoKnownAs", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">سنة التأسيس</label>
                <input
                  type="text"
                  value={selectedCompany.foundedDate}
                  onChange={(e) => handleFieldChange("foundedDate", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نطاق الموظفين</label>
                <input
                  type="text"
                  value={selectedCompany.employeeRange}
                  onChange={(e) => handleFieldChange("employeeRange", e.target.value)}
                  placeholder="مثال: 10001+"
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">موقع المقر الرئيسي</label>
                <input
                  type="text"
                  value={selectedCompany.hqLocation}
                  onChange={(e) => handleFieldChange("hqLocation", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">حالة الاكتتاب (IPO Status)</label>
                <input
                  type="text"
                  value={selectedCompany.ipoStatus}
                  onChange={(e) => handleFieldChange("ipoStatus", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رمز السهم (مدرجة بالبورصة)</label>
                <input
                  type="text"
                  value={selectedCompany.stockSymbol}
                  onChange={(e) => handleFieldChange("stockSymbol", e.target.value)}
                  placeholder="مثال: NYSE:SAN"
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition ltr text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">حالة التشغيل</label>
                <input
                  type="text"
                  value={selectedCompany.operatingStatus}
                  onChange={(e) => handleFieldChange("operatingStatus", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف العام</label>
                <input
                  type="text"
                  value={selectedCompany.phoneNumber}
                  onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition ltr text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني للتواصل</label>
                <input
                  type="email"
                  value={selectedCompany.contactEmail}
                  onChange={(e) => handleFieldChange("contactEmail", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition ltr text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نوع الشركة</label>
                <input
                  type="text"
                  value={selectedCompany.companyType}
                  onChange={(e) => handleFieldChange("companyType", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">فيسبوك (URL)</label>
                <input
                  type="text"
                  value={selectedCompany.facebook}
                  onChange={(e) => handleFieldChange("facebook", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">لينكد إن (URL)</label>
                <input
                  type="text"
                  value={selectedCompany.linkedin}
                  onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">تويتر / إكس (URL)</label>
                <input
                  type="text"
                  value={selectedCompany.twitter}
                  onChange={(e) => handleFieldChange("twitter", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition ltr"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. FINANCIALS */}
        {editSection === "financials" && (
          <div className="space-y-6">
            <LLMImporter
              sectionTitle="المالية والاستثمارات"
              jsonFormat={`{
  "totalFundingAmount": "string",
  "fundingRounds": [
    {
      "id": "string",
      "date": "string",
      "roundType": "string",
      "moneyRaised": "string",
      "investorNames": ["string"],
      "leadInvestor": "string"
    }
  ],
  "investments": [
    {
      "id": "string",
      "date": "string",
      "companyName": "string",
      "fundingRound": "string",
      "moneyRaised": "string",
      "isLead": "boolean"
    }
  ]
}`}
              onImport={(data) => handleMultipleFieldsChange(data)}
              onShowNotification={showNotification}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">إجمالي مبلغ التمويل التراكمي</label>
                <input
                  type="text"
                  value={selectedCompany.totalFundingAmount}
                  onChange={(e) => handleFieldChange("totalFundingAmount", e.target.value)}
                  placeholder="مثال: $7.1B"
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">حالة التمويل الحالية</label>
                <input
                  type="text"
                  value={selectedCompany.fundingStatus}
                  onChange={(e) => handleFieldChange("fundingStatus", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
              </div>
            </div>

            {/* FUNDING ROUNDS MANAGER */}
            <div className="p-5 bg-muted border border-border rounded-xl shadow-xs">
              <h4 className="text-xs font-bold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>إدارة جولات التمويل الحالية</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4 bg-card text-card-foreground p-3.5 rounded-lg border border-border/60">
                <input
                  type="text"
                  placeholder="تاريخ الإعلان"
                  value={newFr.announcedDate || ""}
                  onChange={(e) => setNewFr({ ...newFr, announcedDate: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-md focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
                <input
                  type="text"
                  placeholder="اسم الجولة"
                  value={newFr.transactionName || ""}
                  onChange={(e) => setNewFr({ ...newFr, transactionName: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-md focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
                <input
                  type="number"
                  placeholder="عدد المستثمرين"
                  value={newFr.investorsCount || ""}
                  onChange={(e) => setNewFr({ ...newFr, investorsCount: Number(e.target.value) })}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-md focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
                <input
                  type="text"
                  placeholder="المبلغ المرفوع"
                  value={newFr.moneyRaised || ""}
                  onChange={(e) => setNewFr({ ...newFr, moneyRaised: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-md focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
                <input
                  type="text"
                  placeholder="مستثمر رئيسي"
                  value={newFr.leadInvestor || ""}
                  onChange={(e) => setNewFr({ ...newFr, leadInvestor: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-md focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
                <Button
                  type="button"
                  onClick={addFundingRound}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-md text-xs font-bold transition-all"
                >
                  إضافة جولة
                </Button>
              </div>

              <div className="space-y-2">
                {selectedCompany.fundingRounds.map((fr) => (
                  <div key={fr.id} className="flex items-center justify-between p-3 bg-card text-card-foreground border border-border/60 rounded-lg text-xs font-medium">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 flex-1">
                      <span className="font-bold text-foreground">{fr.announcedDate}</span>
                      <span className="text-slate-700">{fr.transactionName}</span>
                      <span className="text-muted-foreground">المستثمرون: {fr.investorsCount}</span>
                      <span className="font-bold text-primary">{fr.moneyRaised}</span>
                      <span className="text-slate-700">{fr.leadInvestor}</span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => deleteFundingRound(fr.id)}
                      className="text-red-500 hover:text-primary p-1.5 hover:bg-red-50 rounded-md transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* INVESTMENTS MANAGER */}
            <div className="p-5 bg-muted border border-border rounded-xl shadow-xs">
              <h4 className="text-xs font-bold text-foreground mb-4 flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-600" />
                <span>إدارة الاستثمارات الممنوحة من الشركة</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4 bg-card text-card-foreground p-3.5 rounded-lg border border-border/60">
                <input
                  type="text"
                  placeholder="التاريخ"
                  value={newInv.announcedDate || ""}
                  onChange={(e) => setNewInv({ ...newInv, announcedDate: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-md focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
                <input
                  type="text"
                  placeholder="اسم الشركة المستهدفة"
                  value={newInv.orgName || ""}
                  onChange={(e) => setNewInv({ ...newInv, orgName: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-md focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
                <input
                  type="text"
                  placeholder="المبلغ"
                  value={newInv.moneyRaised || ""}
                  onChange={(e) => setNewInv({ ...newInv, moneyRaised: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-md focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
                <div className="flex items-center gap-2 text-xs px-2 font-bold text-slate-700">
                  <input
                    type="checkbox"
                    id="is-lead-chk"
                    checked={!!newInv.isLead}
                    onChange={(e) => setNewInv({ ...newInv, isLead: e.target.checked })}
                    className="rounded text-primary focus:ring-[#ec0000]"
                  />
                  <label htmlFor="is-lead-chk">قائد الجولة؟</label>
                </div>
                <Button
                  type="button"
                  onClick={addInvestment}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-md text-xs font-bold transition-all"
                >
                  إضافة استثمار
                </Button>
              </div>

              <div className="space-y-2">
                {selectedCompany.investments.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 bg-card text-card-foreground border border-border/60 rounded-lg text-xs font-medium">
                    <div className="flex gap-4 flex-1">
                      <span className="font-bold text-foreground">{inv.announcedDate}</span>
                      <span className="font-semibold text-slate-800">{inv.orgName}</span>
                      <span className="text-muted-foreground">{inv.isLead ? "قائد الاستثمار" : "مشارك"}</span>
                      <span className="font-bold text-primary">{inv.moneyRaised}</span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => deleteInvestment(inv.id)}
                      className="text-red-500 hover:text-primary p-1.5 hover:bg-red-50 rounded-md transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. TEAM & SUB-ORGANIZATIONS */}
        {editSection === "team" && (
          <div className="space-y-6">
            <LLMImporter
              sectionTitle="فريق العمل والشركات التابعة"
              jsonFormat={`{
  "keyPeople": [
    {
      "id": "string",
      "name": "string",
      "title": "string",
      "pastRole": "string"
    }
  ],
  "subOrganizations": [
    {
      "id": "string",
      "name": "string",
      "type": "string"
    }
  ]
}`}
              onImport={(data) => handleMultipleFieldsChange(data)}
              onShowNotification={showNotification}
            />
            {/* KEY PEOPLE MANAGER */}
            <div className="p-5 bg-muted border border-border rounded-xl shadow-xs">
              <h4 className="text-xs font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span>إدارة فريق الإدارة والقيادات</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4 bg-card text-card-foreground p-3.5 rounded-lg border border-border/60">
                <input
                  type="text"
                  placeholder="الاسم بالكامل"
                  value={newKp.name || ""}
                  onChange={(e) => setNewKp({ ...newKp, name: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-md focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
                <input
                  type="text"
                  placeholder="المسمى الوظيفي"
                  value={newKp.title || ""}
                  onChange={(e) => setNewKp({ ...newKp, title: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-md focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
                <input
                  type="text"
                  placeholder="المنصب السابق (اختياري)"
                  value={newKp.pastRole || ""}
                  onChange={(e) => setNewKp({ ...newKp, pastRole: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-md focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
                <Button
                  type="button"
                  onClick={addKeyPerson}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-md text-xs font-bold transition-all"
                >
                  إضافة عضو جديد
                </Button>
              </div>

              <div className="space-y-2">
                {selectedCompany.keyPeople.map((kp) => (
                  <div key={kp.id} className="flex items-center justify-between p-3 bg-card text-card-foreground border border-border/60 rounded-lg text-xs font-medium">
                    <div className="flex gap-4 flex-1">
                      <span className="font-bold text-foreground">{kp.name}</span>
                      <span className="text-muted-foreground font-medium">{kp.title}</span>
                      {kp.pastRole && <span className="text-slate-400 truncate">السابق: {kp.pastRole}</span>}
                    </div>
                    <Button
                      type="button"
                      onClick={() => deleteKeyPerson(kp.id)}
                      className="text-red-500 hover:text-primary p-1.5 hover:bg-red-50 rounded-md transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* SUB-ORGANIZATIONS MANAGER */}
            <div className="p-5 bg-muted border border-border rounded-xl shadow-xs">
              <h4 className="text-xs font-bold text-foreground mb-4 flex items-center gap-2">
                <Building className="h-4 w-4 text-rose-600" />
                <span>إدارة الشركات والجهات التابعة (Sub-Organizations)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 bg-card text-card-foreground p-3.5 rounded-lg border border-border/60">
                <input
                  type="text"
                  placeholder="اسم الشركة التابعة"
                  value={newSo.name || ""}
                  onChange={(e) => setNewSo({ ...newSo, name: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-md focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
                <input
                  type="text"
                  placeholder="نوع التبعية (مثال: Subsidiary)"
                  value={newSo.type || ""}
                  onChange={(e) => setNewSo({ ...newSo, type: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-md focus:outline-hidden focus:border-primary focus:bg-card text-card-foreground transition"
                />
                <Button
                  type="button"
                  onClick={addSubOrg}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-md text-xs font-bold transition-all"
                >
                  إضافة جهة تابعة
                </Button>
              </div>

              <div className="space-y-2">
                {selectedCompany.subOrganizations.map((so) => (
                  <div key={so.id} className="flex items-center justify-between p-3 bg-card text-card-foreground border border-border/60 rounded-lg text-xs font-medium">
                    <div className="flex gap-4 flex-1">
                      <span className="font-bold text-foreground">{so.name}</span>
                      <span className="text-muted-foreground">{so.type}</span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => deleteSubOrg(so.id)}
                      className="text-red-500 hover:text-primary p-1.5 hover:bg-red-50 rounded-md transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

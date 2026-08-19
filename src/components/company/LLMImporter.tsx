import { useState } from "react";
import { Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { sectionTitle: string; jsonFormat: string; onImport: (data: unknown) => void; onShowNotification: (msg: string, type: "success" | "error") => void };

export function LLMImporter({ sectionTitle, jsonFormat, onImport, onShowNotification }: Props) {
  const [jsonText, setJsonText] = useState("");
  const prompt = `أحتاج لاستخراج بيانات "${sectionTitle}" لشركة معينة. يرجى تزويدي بالبيانات بتنسيق JSON دقيق وفق الهيكل التالي:\n${jsonFormat}\nتأكد من إرجاع JSON صالح فقط.`;
  const handleImport = () => { try { const raw = jsonText.trim().replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```$/, ""); onImport(JSON.parse(raw)); setJsonText(""); onShowNotification("تم استيراد البيانات بنجاح!", "success"); } catch { onShowNotification("فشل في تحليل JSON، يرجى التأكد من صحة التنسيق.", "error"); } };
  return <div className="mb-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl"><div className="flex items-center justify-between mb-3"><h4 className="text-xs font-bold text-indigo-900 flex items-center gap-2"><Sparkles className="h-4 w-4 text-indigo-600" />مساعد الذكاء الاصطناعي ({sectionTitle})</h4><Button onClick={() => { navigator.clipboard.writeText(prompt); onShowNotification("تم نسخ التعليمات بنجاح!", "success"); }} className="text-xs bg-card text-card-foreground border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5"><Copy className="h-3.5 w-3.5" />نسخ التعليمة</Button></div><div className="flex gap-2"><input type="text" value={jsonText} onChange={e => setJsonText(e.target.value)} placeholder="ألصق كود JSON المستخرج هنا..." className="flex-1 px-3 py-2 text-xs bg-card border border-indigo-200 rounded-lg text-left ltr" /><Button onClick={handleImport} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg">استيراد وتعبئة</Button></div></div>;
}

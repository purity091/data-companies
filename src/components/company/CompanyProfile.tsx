import { ReactNode } from "react";
import { Company } from "../../types";

/** الحاوية العامة لصفحة ملف الشركة؛ يمكن نقلها مع أقسامها لأي تطبيق آخر. */
export function CompanyProfile({ company, children }: { company: Company; children: ReactNode }) {
  return <article className="company-profile" data-company-id={company.id}>{children}</article>;
}

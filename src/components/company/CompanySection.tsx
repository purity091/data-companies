import { ReactNode } from "react";

type Props = { sectionName: string; children: ReactNode };

/** غلاف موحد لأقسام ملف الشركة، ويسهّل نقل أي قسم إلى تطبيق آخر. */
export function CompanySection({ sectionName, children }: Props) {
  return <section data-company-section={sectionName}>{children}</section>;
}

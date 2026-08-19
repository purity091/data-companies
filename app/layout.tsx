import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Companies",
  description: "قاعدة بيانات الشركات العالمية",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

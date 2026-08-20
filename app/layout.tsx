import type { Metadata } from "next";
import "./globals.css";
import { AppVersionBanner } from "@/components/AppVersionBanner";
import { getAppVersion } from "@/lib/app-version";

export const metadata: Metadata = {
  title: "Global Companies",
  description: "قاعدة بيانات الشركات العالمية",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body suppressHydrationWarning>
        <AppVersionBanner installed={getAppVersion()} />
        {children}
      </body>
    </html>
  );
}

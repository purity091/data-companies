"use client";

import { GitBranch, RefreshCw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { AppVersionInfo } from "@/lib/app-version";

type LatestCommit = {
  sha: string;
  shortSha: string;
  message: string;
  date: string | null;
  url: string;
};

type VersionResponse = {
  installed: AppVersionInfo;
  latest: LatestCommit | null;
  repository: string;
  status: "up_to_date" | "update_available" | "unknown";
};

export function AppVersionBanner({ installed }: { installed: AppVersionInfo }) {
  const [version, setVersion] = useState<VersionResponse | null>(null);
  // Keep the first client render identical to the server render. The initial
  // GitHub check starts in the effect after hydration.
  const [checking, setChecking] = useState(false);

  const checkVersion = useCallback(async () => {
    setChecking(true);
    try {
      const response = await fetch("/api/version", { cache: "no-store" });
      if (!response.ok) throw new Error("version check failed");
      setVersion(await response.json() as VersionResponse);
    } catch {
      setVersion(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void checkVersion();
  }, [checkVersion]);

  const current = version?.installed ?? installed;
  const status = version?.status ?? "unknown";
  const statusLabel = checking
    ? "جارٍ فحص GitHub"
    : status === "up_to_date"
      ? "محدث"
      : status === "update_available"
        ? "توجد نسخة أحدث"
        : "تعذر التحقق من GitHub";
  const statusClass = status === "up_to_date"
    ? "bg-emerald-100 text-emerald-800"
    : status === "update_available"
      ? "bg-amber-100 text-amber-900"
      : "bg-slate-100 text-slate-700";

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 shadow-sm" dir="rtl">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5 font-black text-slate-800"><GitBranch className="size-3.5 text-sky-700" /> نسخة التطبيق</span>
          <span dir="ltr" className="rounded bg-slate-100 px-2 py-0.5 font-mono font-bold text-slate-700">{current.shortSha}</span>
          <span className={`rounded-full px-2.5 py-1 font-bold ${statusClass}`}>{statusLabel}</span>
          {version?.latest && (
            <a href={version.latest.url} target="_blank" rel="noreferrer" className="hover:text-sky-700">
              آخر GitHub: <b dir="ltr" className="font-mono">{version.latest.shortSha}</b>
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          {version?.latest?.message && <span className="hidden max-w-[360px] truncate text-slate-400 sm:inline">{version.latest.message}</span>}
          <button type="button" onClick={() => void checkVersion()} disabled={checking} className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-bold text-slate-500 hover:bg-slate-100 hover:text-sky-700 disabled:opacity-50" title="فحص آخر نسخة على GitHub">
            {checking ? <RefreshCw className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
            تحديث
          </button>
        </div>
      </div>
    </div>
  );
}

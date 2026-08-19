"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type ImportResult = {
  data?: { fetched: number; created: number; updated: number };
  error?: string;
  code?: string;
};

export function TrustMrrImportButton({ onImported }: { onImported?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function importTenCompanies() {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/imports/trustmrr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxPages: 1 }),
      });
      const body = (await response.json()) as ImportResult;

      if (!response.ok) {
        throw new Error(
          body.code === "DATABASE_NOT_CONFIGURED"
            ? "يرجى إعداد اتصال قاعدة البيانات أولًا."
            : body.error || "تعذر استيراد الشركات.",
        );
      }

      const result = body.data;
      setMessage(`تم استيراد ${result?.fetched ?? 0} شركات: ${result?.created ?? 0} جديدة و${result?.updated ?? 0} محدثة.`);
      onImported?.();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "تعذر استيراد الشركات.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button type="button" variant="secondary" onClick={() => void importTenCompanies()} disabled={loading}>
        {loading ? "جارٍ استيراد 10 شركات..." : "استيراد 10 شركات من TrustMRR"}
      </Button>
      {message && <p className="max-w-xs text-right text-xs font-medium text-emerald-700">{message}</p>}
      {error && <p className="max-w-xs text-right text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

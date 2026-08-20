import { NextResponse } from "next/server";
import { databaseNotConfiguredResponse, isDatabaseConfigured, isPreviewMode } from "@/lib/database-status";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { INITIAL_COMPANY_CATALOG } from "@/modules/catalog/initial-company-catalog";

function slugify(value: string) {
  return value.trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 180);
}

function describeImportError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (!error || typeof error !== "object") return "تعذر استيراد الشركات الأولية";

  const details = error as Record<string, unknown>;
  return [details.message, details.details, details.hint, details.code]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join(" | ") || "تعذر استيراد الشركات الأولية";
}

export async function POST() {
  if (isPreviewMode()) {
    return NextResponse.json({ mode: "preview", created: 0, existing: INITIAL_COMPANY_CATALOG.length, total: INITIAL_COMPANY_CATALOG.length });
  }
  if (!isDatabaseConfigured()) return databaseNotConfiguredResponse();

  try {
    const client = getSupabaseAdmin();
    const { error: countryError } = await client
      .from("countries")
      .upsert({ code: "SA", name: "السعودية" }, { onConflict: "code", ignoreDuplicates: true });
    if (countryError) throw countryError;

    const { data: country, error: countryLookupError } = await client
      .from("countries")
      .select("id")
      .eq("code", "SA")
      .single();
    if (countryLookupError || !country) throw countryLookupError ?? new Error("تعذر تجهيز دولة السعودية");

    const domains = [...new Set(INITIAL_COMPANY_CATALOG.map((item) => item.domain))];
    const { error: industryError } = await client.from("industries").upsert(
      domains.map((name) => ({ name, slug: slugify(name) })),
      { onConflict: "name", ignoreDuplicates: true },
    );
    if (industryError) throw industryError;

    const { data: industries, error: industryLookupError } = await client
      .from("industries")
      .select("id, name")
      .in("name", domains);
    if (industryLookupError) throw industryLookupError;
    const industryByName = new Map((industries ?? []).map((industry) => [industry.name, industry.id]));

    const slugs = INITIAL_COMPANY_CATALOG.map((item) => slugify(item.name));
    const { data: existing, error: existingError } = await client.from("companies").select("slug").in("slug", slugs);
    if (existingError) throw existingError;
    const existingSlugs = new Set((existing ?? []).map((company) => company.slug));
    const now = new Date().toISOString();
    const rows = INITIAL_COMPANY_CATALOG
      .filter((item) => !existingSlugs.has(slugify(item.name)))
      .map((item) => ({
        slug: slugify(item.name),
        name: item.name,
        description: `المجال: ${item.domain}\nالتصنيف: ${item.classification}`,
        websiteUrl: item.websiteUrl,
        countryId: country.id,
        industryId: industryByName.get(item.domain) ?? null,
        updatedAt: now,
      }));

    if (rows.length) {
      const { error: insertError } = await client.from("companies").insert(rows);
      if (insertError) throw insertError;
    }

    return NextResponse.json({ mode: "database", created: rows.length, existing: INITIAL_COMPANY_CATALOG.length - rows.length, total: INITIAL_COMPANY_CATALOG.length });
  } catch (error) {
    const details = describeImportError(error);
    console.error("[initial-companies] import failed", error);
    return NextResponse.json(
      {
        error: "تعذر استيراد الشركات الأولية",
        details: process.env.NODE_ENV === "production" ? undefined : details,
      },
      { status: 500 },
    );
  }
}

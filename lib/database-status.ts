import { NextResponse } from "next/server";

export function isDatabaseConfigured(): boolean {
  return Boolean(
    (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.trim() &&
      (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim(),
  );
}

export function isPreviewMode(): boolean {
  const explicitMode = process.env.PREVIEW_MODE?.trim().toLowerCase();
  if (explicitMode === "true") return true;
  if (explicitMode === "false") return false;

  // Local development should be immediately viewable after npm install.
  // Production never falls back to in-memory data automatically.
  return process.env.NODE_ENV !== "production" && !isDatabaseConfigured();
}

export function databaseNotConfiguredResponse() {
  const missing = [
    !(process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.trim() ? "SUPABASE_URL" : null,
    !(process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim() ? "SUPABASE_SECRET_KEY" : null,
  ].filter(Boolean);

  return NextResponse.json(
    {
      error: "Database is not configured",
      code: "DATABASE_NOT_CONFIGURED",
      message: "Set SUPABASE_URL and SUPABASE_SECRET_KEY, or enable PREVIEW_MODE before using the API.",
      missing,
    },
    { status: 503 },
  );
}

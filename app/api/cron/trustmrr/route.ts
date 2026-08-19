import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-error";
import { databaseNotConfiguredResponse, isDatabaseConfigured } from "@/lib/database-status";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { importTrustMrr } from "@/modules/imports/trustmrr.importer";

export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) return process.env.NODE_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
  if (!isDatabaseConfigured()) return databaseNotConfiguredResponse();

  const client = getSupabaseAdmin();
  const now = new Date();
  const nowIso = now.toISOString();

  try {
    const { data: state, error: stateError } = await client
      .from("trustmrr_import_state")
      .select("id, enabled, next_page, locked_until")
      .eq("id", 1)
      .maybeSingle();
    if (stateError) throw stateError;
    if (!state) throw new Error("trustmrr_import_state is missing; run its migration first");
    if (!state.enabled) return NextResponse.json({ skipped: true, reason: "disabled" });
    if (state.locked_until && new Date(state.locked_until).getTime() > now.getTime()) {
      return NextResponse.json({ skipped: true, reason: "previous run is still active" }, { status: 202 });
    }

    const lockUntil = new Date(now.getTime() + 55_000).toISOString();
    const { data: lock, error: lockError } = await client
      .from("trustmrr_import_state")
      .update({ locked_until: lockUntil, updated_at: nowIso })
      .eq("id", 1)
      .or(`locked_until.is.null,locked_until.lt.${nowIso}`)
      .select("id")
      .maybeSingle();
    if (lockError) throw lockError;
    if (!lock) return NextResponse.json({ skipped: true, reason: "locked by another run" }, { status: 202 });

    const startPage = Math.max(Number(state.next_page) || 1, 1);
    try {
      const result = await importTrustMrr({ maxPages: 1, startPage });
      // Never restart from page 1 automatically. Once the API reports that
      // there are no more pages, preserve the last page and pause the worker.
      const completed = !result.hasMore;
      const nextPage = result.hasMore ? startPage + 1 : startPage;
      const { error: updateError } = await client.from("trustmrr_import_state").update({
        enabled: !completed,
        next_page: nextPage,
        locked_until: null,
        last_run_at: new Date().toISOString(),
        last_fetched: result.fetched,
        last_created: result.created,
        last_updated: result.updated,
        last_error: null,
        updated_at: new Date().toISOString(),
      }).eq("id", 1);
      if (updateError) throw updateError;
      return NextResponse.json({ data: { ...result, startPage, nextPage, completed } });
    } catch (error) {
      await client.from("trustmrr_import_state").update({
        locked_until: null,
        last_run_at: new Date().toISOString(),
        last_error: error instanceof Error ? error.message : "Unknown import error",
        updated_at: new Date().toISOString(),
      }).eq("id", 1);
      throw error;
    }
  } catch (error) {
    return apiErrorResponse(error);
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { apiErrorResponse } from "@/lib/api-error";
import { databaseNotConfiguredResponse, isDatabaseConfigured, isPreviewMode } from "@/lib/database-status";
import { importTrustMrr } from "@/modules/imports/trustmrr.importer";

const requestSchema = z.object({
  maxPages: z.number().int().min(1).max(100).default(1),
  sort: z.string().trim().min(1).max(40).default("revenue-desc"),
  onSale: z.boolean().optional(),
  category: z.string().trim().min(1).max(40).optional(),
  teamSize: z.string().trim().min(1).max(10).optional(),
  fundingStatus: z.enum(["bootstrapped", "vc-funded"]).optional(),
});

export async function POST(request: Request) {
  try {
    if (isPreviewMode() || !isDatabaseConfigured()) return databaseNotConfiguredResponse();

    const expectedToken = process.env.TRUSTMRR_IMPORT_TOKEN?.trim();
    const suppliedToken = request.headers.get("x-import-token");
    const hasValidToken = Boolean(expectedToken && suppliedToken === expectedToken);
    const requestOrigin = request.headers.get("origin");
    const sameOrigin = requestOrigin === new URL(request.url).origin;

    // The in-app button uses a same-origin request. External scripts must use
    // the optional server-to-server token, which is never exposed to the browser.
    if (process.env.NODE_ENV === "production" && !hasValidToken && !sameOrigin) {
      return NextResponse.json({ error: "Use the application button or provide a valid import token" }, { status: 401 });
    }

    const payload = requestSchema.parse(await request.json().catch(() => ({})));
    const result = await importTrustMrr(payload);
    return NextResponse.json({ data: result });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

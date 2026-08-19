import { NextResponse } from "next/server";
import { z } from "zod";
import { apiErrorResponse } from "@/lib/api-error";
import { databaseNotConfiguredResponse, isDatabaseConfigured, isPreviewMode } from "@/lib/database-status";
import { importTrustMrrDetail } from "@/modules/imports/trustmrr.importer";

const requestSchema = z.object({ slug: z.string().trim().min(1).max(180) });

export async function POST(request: Request) {
  try {
    if (isPreviewMode() || !isDatabaseConfigured()) return databaseNotConfiguredResponse();
    const { slug } = requestSchema.parse(await request.json());
    const result = await importTrustMrrDetail(slug);
    return NextResponse.json({ data: result });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

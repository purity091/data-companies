import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-error";
import { databaseNotConfiguredResponse, isDatabaseConfigured, isPreviewMode } from "@/lib/database-status";
import { catalogService } from "@/modules/catalog/catalog.service";
import { serializeCompany } from "@/modules/companies/company.mapper";
import { previewStore } from "@/modules/preview/preview.store";

export async function GET() {
  if (isPreviewMode()) return NextResponse.json({ mode: "preview", data: previewStore.listIndustries() });
  if (!isDatabaseConfigured()) return databaseNotConfiguredResponse();

  try {
    return NextResponse.json({ data: serializeCompany(await catalogService.list("industries")) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

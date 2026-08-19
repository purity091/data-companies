import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-error";
import { isDatabaseConfigured, isPreviewMode } from "@/lib/database-status";
import { serializeCompany } from "@/modules/companies/company.mapper";
import { companyService } from "@/modules/companies/company.service";
import { companyIdSchema, companyUpdateSchema } from "@/modules/companies/company.validation";
import { previewStore } from "@/modules/preview/preview.store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (isPreviewMode()) {
    try {
      const company = previewStore.getCompany(id);
      return NextResponse.json({ mode: "preview", data: company });
    } catch (error) {
      return apiErrorResponse(error);
    }
  }

  if (isDatabaseConfigured()) {
    try {
      const company = await companyService.getCompany(companyIdSchema.parse(id));
      if (company) {
        return NextResponse.json({ data: serializeCompany(company) });
      }
    } catch (dbError) {
      console.warn("Database lookup failed, falling back to preview store:", dbError);
    }
  }

  // Fallback to preview store for previewing any company ID (e.g., 199)
  try {
    const fallbackCompany = previewStore.getCompany(id);
    return NextResponse.json({ mode: "preview", data: fallbackCompany });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (isPreviewMode()) {
    try {
      const payload = companyUpdateSchema.parse(await request.json());
      const company = previewStore.updateCompany(id, payload);
      return NextResponse.json({ mode: "preview", data: company });
    } catch (error) {
      return apiErrorResponse(error);
    }
  }

  if (isDatabaseConfigured()) {
    try {
      const payload = companyUpdateSchema.parse(await request.json());
      const company = await companyService.updateCompany(companyIdSchema.parse(id), payload);
      if (company) {
        return NextResponse.json({ data: serializeCompany(company) });
      }
    } catch (dbError) {
      console.warn("Database update failed, falling back to preview store:", dbError);
    }
  }

  try {
    const payload = companyUpdateSchema.parse(await request.json());
    const company = previewStore.updateCompany(id, payload);
    return NextResponse.json({ mode: "preview", data: company });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

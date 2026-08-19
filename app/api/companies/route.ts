import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-error";
import { databaseNotConfiguredResponse, isDatabaseConfigured, isPreviewMode } from "@/lib/database-status";
import { serializeCompany } from "@/modules/companies/company.mapper";
import { companyService } from "@/modules/companies/company.service";
import { companyCreateSchema, companyListQuerySchema } from "@/modules/companies/company.validation";
import { previewStore } from "@/modules/preview/preview.store";

export async function GET(request: Request) {
  if (isPreviewMode()) {
    try {
      const url = new URL(request.url);
      const query = companyListQuerySchema.parse(Object.fromEntries(url.searchParams.entries()));
      const result = previewStore.listCompanies({ limit: query.limit, query: query.q, countryId: query.countryId, industryId: query.industryId, cursor: companyService.parseCursor(query.cursor) });
      return NextResponse.json({ mode: "preview", data: result.data, total: result.total, pagination: { nextCursor: result.nextCursor, hasMore: result.hasMore } });
    } catch (error) {
      return apiErrorResponse(error);
    }
  }

  if (!isDatabaseConfigured()) return databaseNotConfiguredResponse();

  try {
    const url = new URL(request.url);
    const query = companyListQuerySchema.parse(Object.fromEntries(url.searchParams.entries()));

    const result = await companyService.listCompanies({
      limit: query.limit,
      query: query.q,
      countryId: query.countryId,
      industryId: query.industryId,
      cursor: companyService.parseCursor(query.cursor),
    });

    return NextResponse.json({
      data: result.data.map(serializeCompany),
      total: result.total,
      pagination: {
        nextCursor: result.nextCursor,
        hasMore: result.hasMore,
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  if (isPreviewMode()) {
    try {
      const payload = companyCreateSchema.parse(await request.json());
      return NextResponse.json({ mode: "preview", data: previewStore.createCompany(payload) }, { status: 201 });
    } catch (error) {
      return apiErrorResponse(error);
    }
  }

  if (!isDatabaseConfigured()) return databaseNotConfiguredResponse();

  try {
    const payload = companyCreateSchema.parse(await request.json());
    const company = await companyService.createCompany(payload);

    return NextResponse.json({ data: serializeCompany(company) }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

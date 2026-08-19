import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-error";
import { databaseNotConfiguredResponse, isDatabaseConfigured, isPreviewMode } from "@/lib/database-status";
import { serializeCompany } from "@/modules/companies/company.mapper";
import { companyIdSchema } from "@/modules/companies/company.validation";
import { investorsService } from "@/modules/investors/investors.service";
import { investorLinkSchema } from "@/modules/investors/investors.validation";
import { previewStore } from "@/modules/preview/preview.store";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  if (isPreviewMode()) {
    const { id } = await context.params;
    const investors = previewStore.listInvestors(id);
    if (!investors) return NextResponse.json({ error: "Company not found" }, { status: 404 });
    return NextResponse.json({ mode: "preview", data: investors });
  }

  if (!isDatabaseConfigured()) return databaseNotConfiguredResponse();

  try {
    const { id } = await context.params;
    const investors = await investorsService.listByCompany(companyIdSchema.parse(id));
    return NextResponse.json({ data: serializeCompany(investors) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  if (isPreviewMode()) {
    try {
      const { id } = await context.params;
      const investor = previewStore.addInvestor(id, investorLinkSchema.parse(await request.json()));
      if (!investor) return NextResponse.json({ error: "Company not found" }, { status: 404 });
      return NextResponse.json({ mode: "preview", data: investor }, { status: 201 });
    } catch (error) {
      return apiErrorResponse(error);
    }
  }

  if (!isDatabaseConfigured()) return databaseNotConfiguredResponse();

  try {
    const { id } = await context.params;
    const input = investorLinkSchema.parse(await request.json());
    const investor = await investorsService.linkToCompany(companyIdSchema.parse(id), input);
    return NextResponse.json({ data: serializeCompany(investor) }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

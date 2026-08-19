import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-error";
import { databaseNotConfiguredResponse, isDatabaseConfigured, isPreviewMode } from "@/lib/database-status";
import { serializeCompany } from "@/modules/companies/company.mapper";
import { companyIdSchema } from "@/modules/companies/company.validation";
import { peopleRepository } from "@/modules/people/people.repository";
import { personCreateSchema } from "@/modules/people/people.validation";
import { previewStore } from "@/modules/preview/preview.store";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  if (isPreviewMode()) {
    const { id } = await context.params;
    const people = previewStore.listPeople(id);
    if (!people) return NextResponse.json({ error: "Company not found" }, { status: 404 });
    return NextResponse.json({ mode: "preview", data: people });
  }

  if (!isDatabaseConfigured()) return databaseNotConfiguredResponse();

  try {
    const { id } = await context.params;
    const people = await peopleRepository.listByCompany(companyIdSchema.parse(id));
    return NextResponse.json({ data: serializeCompany(people) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  if (isPreviewMode()) {
    try {
      const { id } = await context.params;
      const person = previewStore.addPerson(id, personCreateSchema.parse(await request.json()));
      if (!person) return NextResponse.json({ error: "Company not found" }, { status: 404 });
      return NextResponse.json({ mode: "preview", data: person }, { status: 201 });
    } catch (error) {
      return apiErrorResponse(error);
    }
  }

  if (!isDatabaseConfigured()) return databaseNotConfiguredResponse();

  try {
    const { id } = await context.params;
    const input = personCreateSchema.parse(await request.json());
    const person = await peopleRepository.create(companyIdSchema.parse(id), input);
    return NextResponse.json({ data: serializeCompany(person) }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

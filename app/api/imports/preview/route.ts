import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-error";
import { parseLlmImport } from "@/modules/imports/llm-import.parser";
import { llmPreviewRequestSchema } from "@/modules/imports/llm-import.validation";

export async function POST(request: Request) {
  try {
    const payload = llmPreviewRequestSchema.parse(await request.json());
    const result = parseLlmImport(payload.rawText);
    return NextResponse.json({
      data: result.company,
      enrichment: result.enrichment,
      format: result.format,
      issues: result.issues,
      canCommit: Boolean(result.company && !result.issues.some((issue) => issue.severity === "error")),
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

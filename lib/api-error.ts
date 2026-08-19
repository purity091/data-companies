import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.flatten(),
      },
      { status: 400 },
    );
  }

  if (error instanceof Error && error.message === "Invalid cursor") {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code?: unknown }).code);
    const message = error instanceof Error ? error.message : String((error as { message?: unknown }).message ?? "");

    if (code === "PGRST205" || code === "42P01") {
      return NextResponse.json(
        {
          error: "Database migration is incomplete",
          details: process.env.NODE_ENV === "production" ? undefined : message,
        },
        { status: 503 },
      );
    }

    if (code === "23505") {
      return NextResponse.json({ error: "A unique field already exists" }, { status: 409 });
    }

    if (code === "P2025" || code === "PGRST116") {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    if (code === "23503") {
      return NextResponse.json({ error: "Referenced company does not exist" }, { status: 400 });
    }
  }

  console.error(error);
  return NextResponse.json(
    {
      error: "Internal server error",
      details: process.env.NODE_ENV === "production" && !(error instanceof Error)
        ? undefined
        : process.env.NODE_ENV === "production"
          ? undefined
          : error instanceof Error
            ? error.message
            : String(error),
    },
    { status: 500 },
  );
}

import { z } from "zod";

const cursorPayloadSchema = z.object({
  createdAt: z.string().datetime(),
  id: z.string().regex(/^\d+$/),
});

export type CompanyCursor = z.infer<typeof cursorPayloadSchema>;

export function encodeCursor(value: CompanyCursor): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

export function decodeCursor(value: string): CompanyCursor {
  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    return cursorPayloadSchema.parse(JSON.parse(decoded));
  } catch {
    throw new Error("Invalid cursor");
  }
}

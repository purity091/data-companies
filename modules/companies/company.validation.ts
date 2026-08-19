import { z } from "zod";

const optionalBigIntId = z
  .union([
    z.string().regex(/^\d+$/, "Must be a numeric id").transform((value) => BigInt(value)),
    z.bigint(),
  ])
  .nullable()
  .optional();

const optionalUrl = z.string().trim().url().max(2048).nullable().optional();

export const companyCreateSchema = z.object({
  name: z.string().trim().min(1).max(255),
  slug: z.string().trim().min(1).max(180).regex(/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u).optional(),
  legalName: z.string().trim().max(255).nullable().optional(),
  description: z.string().trim().max(65535).nullable().optional(),
  websiteUrl: optionalUrl,
  foundedYear: z.number().int().min(1000).max(2200).nullable().optional(),
  countryId: optionalBigIntId,
  industryId: optionalBigIntId,
});

export const companyUpdateSchema = companyCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const companyListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(1).optional(),
  ),
  q: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(255).optional(),
  ),
  countryId: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().regex(/^\d+$/, "Must be a numeric country id").transform((value) => BigInt(value)).optional(),
  ),
  industryId: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().regex(/^\d+$/, "Must be a numeric industry id").transform((value) => BigInt(value)).optional(),
  ),
});

export const companyIdSchema = z.string().regex(/^\d+$/, "Invalid company id").transform((value) => BigInt(value));

export type CompanyCreatePayload = z.infer<typeof companyCreateSchema>;
export type CompanyUpdatePayload = z.infer<typeof companyUpdateSchema>;

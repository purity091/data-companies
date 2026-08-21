import { z } from "zod";
import { llmEnrichmentBundleSchema } from "./llm-enrichment.validation";

const nullableText = (max: number) => z.string().trim().max(max).nullable().optional();

export const llmPersonSchema = z.object({
  fullName: z.string().trim().min(1).max(255),
  jobTitle: nullableText(255),
  linkedinUrl: nullableText(2048),
});

export const llmInvestorSchema = z.object({
  name: z.string().trim().min(1).max(255),
  slug: nullableText(180),
  websiteUrl: nullableText(2048),
});

export const llmSourceSchema = z.object({
  title: z.string().trim().max(255).nullable().optional(),
  url: z.preprocess(
    (value) => {
      if (typeof value === "string" && value.trim()) {
        const raw = value.trim();
        return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      }
      return value;
    },
    z.string().trim().max(2048),
  ),
});

export const llmCompanySchema = z.object({
  name: z.string().trim().min(1).max(255),
  legalName: nullableText(255),
  description: nullableText(65535),
  websiteUrl: nullableText(2048),
  foundedYear: z.number().int().min(1000).max(2200).nullable().optional(),
  countryName: nullableText(255),
  industryName: nullableText(255),
  people: z.array(llmPersonSchema).max(100).default([]),
  investors: z.array(llmInvestorSchema).max(100).default([]),
  markets: z.array(z.string().trim().min(1).max(255)).max(100).default([]),
  sources: z.array(llmSourceSchema).max(100).default([]),
});

export const llmPreviewRequestSchema = z.object({
  rawText: z.string().trim().min(1).max(500_000),
});

export const llmCommitRequestSchema = z.object({
  company: llmCompanySchema,
  companyId: z.string().trim().min(1).optional(),
  enrichment: llmEnrichmentBundleSchema.optional(),
});

export type LlmCompany = z.infer<typeof llmCompanySchema>;
export type LlmPerson = z.infer<typeof llmPersonSchema>;
export type LlmInvestor = z.infer<typeof llmInvestorSchema>;

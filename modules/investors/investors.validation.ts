import { z } from "zod";

export const investorLinkSchema = z.object({
  name: z.string().trim().min(1).max(255),
  slug: z.string().trim().max(180).regex(/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u).optional(),
  websiteUrl: z.string().trim().url().max(2048).nullable().optional(),
});

export type InvestorLinkPayload = z.infer<typeof investorLinkSchema>;

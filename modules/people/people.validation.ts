import { z } from "zod";

export const personCreateSchema = z.object({
  fullName: z.string().trim().min(1).max(255),
  jobTitle: z.string().trim().max(255).nullable().optional(),
  linkedinUrl: z.string().trim().url().max(2048).nullable().optional(),
});

export type PersonCreatePayload = z.infer<typeof personCreateSchema>;

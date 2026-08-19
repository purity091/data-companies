import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { PersonCreatePayload } from "./people.validation";

export class PeopleRepository {
  async listByCompany(companyId: bigint) {
    const { data, error } = await getSupabaseAdmin()
      .from("people")
      .select("id, fullName, jobTitle, linkedinUrl, companyId, createdAt, updatedAt")
      .eq("companyId", companyId.toString())
      .order("fullName")
      .order("id");
    if (error) throw error;
    return data ?? [];
  }

  async create(companyId: bigint, input: PersonCreatePayload) {
    const { data, error } = await getSupabaseAdmin()
      .from("people")
      .insert({
        companyId: companyId.toString(),
        fullName: input.fullName,
        jobTitle: input.jobTitle ?? null,
        linkedinUrl: input.linkedinUrl ?? null,
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async upsertFromImport(companyId: bigint, input: PersonCreatePayload) {
    const client = getSupabaseAdmin();
    const { data: existing, error: lookupError } = await client
      .from("people")
      .select("id")
      .eq("companyId", companyId.toString())
      .ilike("fullName", input.fullName.trim())
      .limit(1)
      .maybeSingle();
    if (lookupError) throw lookupError;

    if (existing) {
      const { data, error } = await client.from("people").update({
        jobTitle: input.jobTitle ?? null,
        linkedinUrl: input.linkedinUrl ?? null,
        updatedAt: new Date().toISOString(),
      }).eq("id", String(existing.id)).select().single();
      if (error) throw error;
      return data;
    }

    return this.create(companyId, input);
  }
}

export const peopleRepository = new PeopleRepository();

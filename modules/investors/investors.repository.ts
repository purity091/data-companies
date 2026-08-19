import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { InvestorLinkPayload } from "./investors.validation";

export class InvestorsRepository {
  async listByCompany(companyId: bigint) {
    const { data, error } = await getSupabaseAdmin()
      .from("company_investors")
      .select("companyId, investorId, investedAt, investor:investors(id, slug, name, websiteUrl)")
      .eq("companyId", companyId.toString());
    if (error) throw error;
    return data ?? [];
  }

  async linkToCompany(companyId: bigint, input: InvestorLinkPayload & { slug: string }) {
    const client = getSupabaseAdmin();
    const { data: investor, error: investorError } = await client
      .from("investors")
      .upsert(
        { slug: input.slug, name: input.name, websiteUrl: input.websiteUrl ?? null, updatedAt: new Date().toISOString() },
        { onConflict: "slug" },
      )
      .select("id, slug, name, websiteUrl")
      .single();
    if (investorError) throw investorError;

    const { data, error } = await client
      .from("company_investors")
      .upsert(
        { companyId: companyId.toString(), investorId: String(investor.id) },
        { onConflict: "companyId,investorId" },
      )
      .select("companyId, investorId, investedAt, investor:investors(id, slug, name, websiteUrl)")
      .single();
    if (error) throw error;
    return data;
  }
}

export const investorsRepository = new InvestorsRepository();

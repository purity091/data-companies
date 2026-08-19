import { getSupabaseAdmin } from "@/lib/supabase/admin";

export class MarketsRepository {
  async linkToCompany(companyId: bigint, marketId: bigint) {
    const { data, error } = await getSupabaseAdmin()
      .from("company_markets")
      .upsert({ companyId: companyId.toString(), marketId: marketId.toString() }, { onConflict: "companyId,marketId" })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export const marketsRepository = new MarketsRepository();

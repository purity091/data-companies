import { getSupabaseAdmin } from "@/lib/supabase/admin";

const lookupLimit = 500;

export type CatalogItem = { id: bigint; code?: string; slug?: string; name: string };

function normalize(row: Record<string, any>): CatalogItem {
  return { id: BigInt(String(row.id)), code: row.code, slug: row.slug, name: String(row.name) };
}

export class CatalogRepository {
  async listCountries() {
    const { data, error } = await getSupabaseAdmin().from("countries").select("id, code, name").order("name").limit(lookupLimit);
    if (error) throw error;
    return (data ?? []).map(normalize);
  }

  async listIndustries() {
    const { data, error } = await getSupabaseAdmin().from("industries").select("id, slug, name").order("name").limit(lookupLimit);
    if (error) throw error;
    return (data ?? []).map(normalize);
  }

  async listMarkets() {
    const { data, error } = await getSupabaseAdmin().from("markets").select("id, slug, name").order("name").limit(lookupLimit);
    if (error) throw error;
    return (data ?? []).map(normalize);
  }
}

export const catalogRepository = new CatalogRepository();

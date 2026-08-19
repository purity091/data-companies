import { decodeCursor, encodeCursor } from "@/lib/cursor";
import { companyRepository } from "./company.repository";
import type { CompanyCreateInput, CompanyListInput, CompanyUpdateInput } from "./company.types";

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);

  return slug || `company-${Date.now()}`;
}

async function uniqueSlug(value: string, currentId?: bigint): Promise<string> {
  const base = slugify(value);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await companyRepository.findBySlug(candidate);
    if (!existing || existing.id === currentId) return candidate;

    const suffixText = `-${suffix++}`;
    candidate = `${base.slice(0, 180 - suffixText.length)}${suffixText}`;
  }
}

export class CompanyService {
  async listCompanies(input: CompanyListInput) {
    const result = await companyRepository.list(input);
    const last = result.data.at(-1);

    return {
      data: result.data,
      total: result.total,
      nextCursor:
        result.hasMore && last
          ? encodeCursor({ createdAt: last.createdAt.toISOString(), id: last.id.toString() })
          : null,
      hasMore: result.hasMore,
    };
  }

  async getCompany(id: bigint) {
    return companyRepository.findById(id);
  }

  async createCompany(input: CompanyCreateInput) {
    const slug = await uniqueSlug(input.slug || input.name);
    return companyRepository.create({ ...input, slug });
  }

  async updateCompany(id: bigint, input: CompanyUpdateInput) {
    const data = { ...input };

    if (data.slug) {
      data.slug = await uniqueSlug(data.slug, id);
    }

    return companyRepository.update(id, data);
  }

  parseCursor(value?: string) {
    return value ? decodeCursor(value) : undefined;
  }
}

export const companyService = new CompanyService();

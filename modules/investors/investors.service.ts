import { investorsRepository } from "./investors.repository";
import type { InvestorLinkPayload } from "./investors.validation";

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);

  return slug || `investor-${Date.now()}`;
}

export class InvestorsService {
  listByCompany(companyId: bigint) {
    return investorsRepository.listByCompany(companyId);
  }

  linkToCompany(companyId: bigint, input: InvestorLinkPayload) {
    return investorsRepository.linkToCompany(companyId, {
      ...input,
      slug: input.slug || slugify(input.name),
    });
  }
}

export const investorsService = new InvestorsService();

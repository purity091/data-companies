import type { LlmCompany } from "./llm-import.validation";
import type { LlmEnrichmentBundle } from "./llm-enrichment.validation";

export function mergeEnrichmentIntoCompany(bundle: LlmEnrichmentBundle, fallback: Partial<LlmCompany> = {}): LlmCompany {
  // The parser normalizes company keys before merging. A direct caller with a
  // mismatch should still keep the fields that can be used safely.
  const identity = bundle.identity;
  if (!identity?.name && !fallback.name) throw new Error("يلزم اسم الشركة في مرحلة الهوية عند إنشاء شركة جديدة");
  const business = bundle.business;
  const peopleFinance = bundle.peopleFinance;

  return {
    name: identity?.name ?? fallback.name ?? "",
    legalName: identity?.legalName ?? fallback.legalName ?? null,
    description: identity?.description ?? fallback.description ?? null,
    websiteUrl: identity?.websiteUrl ?? fallback.websiteUrl ?? null,
    foundedYear: identity?.foundedYear ?? fallback.foundedYear ?? null,
    countryName: identity?.countryName ?? fallback.countryName ?? null,
    industryName: identity?.industryName ?? fallback.industryName ?? null,
    people: (peopleFinance?.people ?? fallback.people ?? []).map((person) => {
      if (!("fullName" in person)) return person;
      return {
        fullName: person.fullName,
        jobTitle: person.jobTitle ?? null,
        linkedinUrl: person.linkedinUrl ?? null,
      };
    }),
    investors: (peopleFinance?.investors ?? fallback.investors ?? []).map((investor) => {
      if (!("name" in investor)) return investor;
      return {
        name: investor.name,
        slug: investor.slug ?? null,
        websiteUrl: investor.websiteUrl ?? null,
      };
    }),
    markets: business?.markets ?? fallback.markets ?? [],
    sources: [...new Map([
      ...(identity?.sources ?? []),
      ...(business?.sources ?? []),
      ...(peopleFinance?.sources ?? []),
      ...(bundle.evidence?.sources ?? []),
    ]
      .filter((source) => source.url)
      .map((source) => [source.url as string, { title: source.title || "مصدر", url: source.url as string }]))
      .values()],
  };
}

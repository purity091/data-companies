import { encodeCursor } from "@/lib/cursor";
import type { CompanyCreateInput, CompanyListInput, CompanyUpdateInput } from "@/modules/companies/company.types";
import type { PersonCreatePayload } from "@/modules/people/people.validation";
import type { InvestorLinkPayload } from "@/modules/investors/investors.validation";

type PreviewCountry = { id: string; code: string; name: string };
type PreviewIndustry = { id: string; slug: string; name: string };
type PreviewMarket = { id: string; slug: string; name: string };
type PreviewPerson = { id: string; fullName: string; jobTitle: string | null; linkedinUrl: string | null; companyId: string };
type PreviewInvestor = { id: string; slug: string; name: string; websiteUrl: string | null };

export type PreviewCompany = {
  id: string;
  slug: string;
  name: string;
  legalName: string | null;
  description: string | null;
  websiteUrl: string | null;
  foundedYear: number | null;
  countryId: string | null;
  industryId: string | null;
  createdAt: string;
  updatedAt: string;
  country: PreviewCountry | null;
  industry: PreviewIndustry | null;
  people: PreviewPerson[];
  markets: { market: PreviewMarket }[];
  investors: { investor: PreviewInvestor }[];
};

type PreviewState = {
  companies: PreviewCompany[];
  countries: PreviewCountry[];
  industries: PreviewIndustry[];
  markets: PreviewMarket[];
  investors: PreviewInvestor[];
  nextCompanyId: number;
  nextPersonId: number;
  nextInvestorId: number;
  nextMarketId: number;
};

function slugify(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "company";
}

function createInitialState(): PreviewState {
  const countries: PreviewCountry[] = [
    { id: "1", code: "US", name: "United States" },
    { id: "2", code: "GB", name: "United Kingdom" },
    { id: "3", code: "DE", name: "Germany" },
  ];
  const industries: PreviewIndustry[] = [
    { id: "1", slug: "artificial-intelligence", name: "Artificial Intelligence" },
    { id: "2", slug: "clean-energy", name: "Clean Energy" },
    { id: "3", slug: "healthcare", name: "Healthcare" },
  ];
  const markets: PreviewMarket[] = [
    { id: "1", slug: "enterprise-software", name: "Enterprise Software" },
    { id: "2", slug: "energy-storage", name: "Energy Storage" },
    { id: "3", slug: "digital-health", name: "Digital Health" },
  ];
  const investors: PreviewInvestor[] = [
    { id: "1", slug: "north-star-ventures", name: "North Star Ventures", websiteUrl: "https://example.com/north-star" },
    { id: "2", slug: "atlas-capital", name: "Atlas Capital", websiteUrl: "https://example.com/atlas" },
  ];

  const company = (
    values: Pick<PreviewCompany, "id" | "slug" | "name" | "legalName" | "description" | "websiteUrl" | "foundedYear" | "countryId" | "industryId" | "createdAt">,
  ): PreviewCompany => ({
    ...values,
    updatedAt: values.createdAt,
    country: countries.find((country) => country.id === values.countryId) || null,
    industry: industries.find((industry) => industry.id === values.industryId) || null,
    people: [],
    markets: [],
    investors: [],
  });

  const companies = [
    company({
      id: "3",
      slug: "mediora-health",
      name: "Mediora Health",
      legalName: "Mediora Health Technologies, Inc.",
      description: "Digital health infrastructure helping care teams coordinate treatment and outcomes.",
      websiteUrl: "https://example.com/mediora",
      foundedYear: 2021,
      countryId: "2",
      industryId: "3",
      createdAt: "2026-08-16T10:00:00.000Z",
    }),
    company({
      id: "2",
      slug: "greengrid-energy",
      name: "GreenGrid Energy",
      legalName: "GreenGrid Energy GmbH",
      description: "Modular energy storage systems for commercial and industrial customers.",
      websiteUrl: "https://example.com/greengrid",
      foundedYear: 2019,
      countryId: "3",
      industryId: "2",
      createdAt: "2026-08-15T10:00:00.000Z",
    }),
    company({
      id: "1",
      slug: "technova-ai",
      name: "TechNova AI",
      legalName: "TechNova Artificial Intelligence, Inc.",
      description: "Enterprise AI platform that helps operations teams automate complex workflows.",
      websiteUrl: "https://example.com/technova",
      foundedYear: 2018,
      countryId: "1",
      industryId: "1",
      createdAt: "2026-08-14T10:00:00.000Z",
    }),
  ];

  companies[0].people.push({ id: "1", fullName: "Amelia Carter", jobTitle: "Chief Executive Officer", linkedinUrl: "https://linkedin.com/in/example", companyId: "3" });
  companies[1].people.push({ id: "2", fullName: "Lukas Weber", jobTitle: "Founder & CEO", linkedinUrl: null, companyId: "2" });
  companies[2].people.push({ id: "3", fullName: "Maya Chen", jobTitle: "Co-founder and CEO", linkedinUrl: "https://linkedin.com/in/example", companyId: "1" });
  companies[2].markets.push({ market: markets[0] });
  companies[1].markets.push({ market: markets[1] });
  companies[0].markets.push({ market: markets[2] });
  companies[2].investors.push({ investor: investors[0] });
  companies[1].investors.push({ investor: investors[1] });

  return { companies, countries, industries, markets, investors, nextCompanyId: 4, nextPersonId: 4, nextInvestorId: 3, nextMarketId: 4 };
}

class PreviewStore {
  private state: PreviewState;

  constructor() {
    this.state = createInitialState();
  }

  listCompanies(input: CompanyListInput) {
    let rows = [...this.state.companies];
    if (input.query) {
      const query = input.query.toLocaleLowerCase();
      rows = rows.filter((company) => `${company.name} ${company.legalName || ""}`.toLocaleLowerCase().includes(query));
    }
    if (input.countryId) rows = rows.filter((company) => company.countryId === input.countryId?.toString());
    if (input.industryId) rows = rows.filter((company) => company.industryId === input.industryId?.toString());

    rows.sort((left, right) => right.createdAt.localeCompare(left.createdAt) || Number(right.id) - Number(left.id));
    if (input.cursor) {
      const cursor = input.cursor;
      rows = rows.filter((company) => company.createdAt < cursor.createdAt || (company.createdAt === cursor.createdAt && Number(company.id) < Number(cursor.id)));
    }

    const data = rows.slice(0, input.limit);
    const last = data.at(-1);
    return {
      data,
      total: rows.length,
      hasMore: rows.length > input.limit,
      nextCursor: rows.length > input.limit && last ? encodeCursor({ createdAt: last.createdAt, id: last.id }) : null,
    };
  }

  getCompany(id: string) {
    const existing = this.state.companies.find((company) => company.id === id);
    if (existing) return existing;

    const mockCompany: any = {
      id,
      slug: `company-${id}`,
      name: `شركة رقم ${id}`,
      legalName: `شركة رقم ${id} المحدودة`,
      description: `شركة برمجيات سحابية وموثقة برقم ${id} معتمدة ومفحوصة ماليًا عبر منصة TrustMRR.`,
      websiteUrl: `https://company${id}.example.com`,
      foundedYear: 2022,
      countryId: "1",
      industryId: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      country: { id: "1", code: "US", name: "United States" },
      industry: { id: "1", slug: "artificial-intelligence", name: "Artificial Intelligence" },
      people: [
        { id: `${id}-1`, fullName: "عبدالله العتيبي", jobTitle: "المؤسس والرئيس التنفيذي", linkedinUrl: "https://linkedin.com", companyId: id }
      ],
      markets: [
        { market: { id: "1", slug: "enterprise-software", name: "Enterprise Software" } }
      ],
      investors: [
        { investor: { id: "1", slug: "north-star-ventures", name: "North Star Ventures", websiteUrl: "https://example.com" } }
      ],
      trustmrrSlug: `company-${id}`,
      trustmrr: {
        paymentProvider: "Stripe",
        targetAudience: "B2B SaaS / Enterprise",
        teamSize: "5-10 أعضاء",
        fundingStatus: "جولة تمويلية ($1.2M)",
        revenueLast30DaysCents: 4500000,
        revenueMrrCents: 4200000,
        revenueTotalCents: 52000000,
        customers: 1250,
        activeSubscriptions: 1180,
        askingPriceCents: 150000000,
        profitMarginLast30Days: 78.5,
        growth30d: 14.2,
        growthMrr30d: 12.8,
        multiple: 3.5,
        rank: Number(id) || 199,
        visitorsLast30Days: 48500,
        googleSearchImpressionsLast30Days: 185000,
        revenuePerVisitor: 0.93,
        onSale: true,
        firstListedForSaleAt: "2025-11-15T00:00:00Z",
        xHandle: `company_${id}`,
        xFollowerCount: 15400,
        isMerchantOfRecord: true,
        domainRating: 48,
        founderMessage: "منصة سحابية متخصصة في إدارة إجراءات التشغيل الآلي للمؤسسات مع نسبة احتفاظ عالية بالعملاء.",
        insightValueProposition: "أتمتة وإدارة إجراءات العمليات البرمجية للمؤسسات بنقرة واحدة.",
        insightProblemSolved: "تقليل تكاليف التشغيل اليدوي بنسبة 60% وزيادة سرعة التنفيذ.",
        insightPricingModel: "اشتراكات شهرية وسنوية متدرجة (Freemium + Pro + Enterprise).",
        insightTargetPersona: "مدراء التكنولوجيا ورؤساء أقسام التشغيل الرقمي.",
        insightBusinessType: "SaaS / B2B Subscriptions",
        insightTeamSize: "8 أعضاء محترفين",
        insightFundingStatus: "تمويل أولي + استثمار ملائكي",
        insightEstimatedUserCount: 15000,
        trustmrrUrl: `https://trustmrr.com/listing/company-${id}`,
        markdownUrl: `https://trustmrr.com/listing/company-${id}.md`,
        previousAskingPriceCents: 165000000,
        listingTier: "Gold Verified",
        brandingPrimaryColor: "#4f46e5",
        brandingSecondaryColor: "#06b6d4",
        pageviewCount: 3420,
        offerCount: 5,
        stealthMode: false,
        isMobileApp: false,
        xFounderName: "عبدالله العتيبي",
        xProfilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        sourceUpdatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      trustmrrTechStack: [
        { slug: "Next.js", category: "Frontend Framework" },
        { slug: "TypeScript", category: "Programming Language" },
        { slug: "Tailwind CSS", category: "UI Styling" },
        { slug: "Supabase / PostgreSQL", category: "Database" },
        { slug: "Stripe", category: "Payments" },
      ],
      trustmrrMarketingChannels: [
        { slug: "SEO & Content Marketing", category: "Organic Search" },
        { slug: "X (Twitter) & LinkedIn", category: "Social Media" },
        { slug: "Direct Sales & Outreach", category: "B2B Outreach" },
      ],
      trustmrrCofounders: [
        { xHandle: "a_otaibi_tech", xName: "عبدالله العتيبي" },
        { xHandle: "s_ahmed_dev", xName: "سارة أحمد" }
      ],
    };

    return mockCompany;
  }

  createCompany(input: CompanyCreateInput) {
    const now = new Date().toISOString();
    const countryId = input.countryId?.toString() || null;
    const industryId = input.industryId?.toString() || null;
    const company: PreviewCompany = {
      id: String(this.state.nextCompanyId++),
      slug: input.slug || slugify(input.name),
      name: input.name,
      legalName: input.legalName ?? null,
      description: input.description ?? null,
      websiteUrl: input.websiteUrl ?? null,
      foundedYear: input.foundedYear ?? null,
      countryId,
      industryId,
      createdAt: now,
      updatedAt: now,
      country: this.state.countries.find((item) => item.id === countryId) || null,
      industry: this.state.industries.find((item) => item.id === industryId) || null,
      people: [],
      markets: [],
      investors: [],
    };
    this.state.companies.unshift(company);
    return company;
  }

  updateCompany(id: string, input: CompanyUpdateInput) {
    const company = this.getCompany(id);
    if (!company) return null;
    Object.assign(company, {
      ...input,
      countryId: input.countryId === undefined ? company.countryId : input.countryId?.toString() || null,
      industryId: input.industryId === undefined ? company.industryId : input.industryId?.toString() || null,
      updatedAt: new Date().toISOString(),
    });
    company.country = this.state.countries.find((item) => item.id === company.countryId) || null;
    company.industry = this.state.industries.find((item) => item.id === company.industryId) || null;
    return company;
  }

  listCountries() { return this.state.countries; }
  listIndustries() { return this.state.industries; }
  listMarkets() { return this.state.markets; }

  findCountryId(name?: string | null) {
    if (!name) return null;
    return this.state.countries.find((item) => item.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase())?.id || null;
  }

  findIndustryId(name?: string | null) {
    if (!name) return null;
    return this.state.industries.find((item) => item.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase())?.id || null;
  }

  attachMarket(companyId: string, name: string) {
    const company = this.getCompany(companyId);
    if (!company) return null;
    let market = this.state.markets.find((item) => item.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase());
    if (!market) {
      market = { id: String(this.state.nextMarketId++), slug: slugify(name), name: name.trim() };
      this.state.markets.push(market);
    }
    if (!company.markets.some((item: { market: PreviewMarket }) => item.market.id === market?.id)) company.markets.push({ market });
    return market;
  }

  listPeople(companyId: string) {
    return this.getCompany(companyId)?.people || null;
  }

  addPerson(companyId: string, input: PersonCreatePayload) {
    const company = this.getCompany(companyId);
    if (!company) return null;
    const person: PreviewPerson = { id: String(this.state.nextPersonId++), companyId, fullName: input.fullName, jobTitle: input.jobTitle ?? null, linkedinUrl: input.linkedinUrl ?? null };
    company.people.push(person);
    return person;
  }

  listInvestors(companyId: string) {
    return this.getCompany(companyId)?.investors || null;
  }

  addInvestor(companyId: string, input: InvestorLinkPayload) {
    const company = this.getCompany(companyId);
    if (!company) return null;
    const slug = input.slug || slugify(input.name);
    let investor = this.state.investors.find((item) => item.slug === slug);
    if (!investor) {
      investor = { id: String(this.state.nextInvestorId++), slug, name: input.name, websiteUrl: input.websiteUrl ?? null };
      this.state.investors.push(investor);
    }
    const existing = company.investors.find((item: { investor: PreviewInvestor }) => item.investor.id === investor?.id);
    if (existing) return existing;
    const relation = { investor };
    company.investors.push(relation);
    return relation;
  }
}

const globalForPreview = globalThis as unknown as { previewStore?: PreviewStore };
export const previewStore = globalForPreview.previewStore ?? new PreviewStore();
if (process.env.NODE_ENV !== "production") globalForPreview.previewStore = previewStore;

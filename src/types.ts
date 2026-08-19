/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FundingRound {
  id: string;
  announcedDate: string;
  transactionName: string;
  investorsCount: number;
  moneyRaised: string;
  leadInvestor: string;
  fundingType: string;
}

export interface Investment {
  id: string;
  announcedDate: string;
  orgName: string;
  isLead: boolean;
  fundingRound: string;
  moneyRaised: string;
}

export interface KeyPerson {
  id: string;
  name: string;
  title: string;
  photoUrl: string;
  pastRole?: string;
}

export interface SubOrganization {
  id: string;
  name: string;
  logoUrl: string;
  type: string;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface TechSolutionDetails {
  architectureOverview: string;
  keyFeatures: string[];
  infrastructureType: string;
}

export interface ExpansionStrategy {
  targetMarkets: string[];
  growthChannels: string[];
  strategicMilestones: { year: string; title: string; description: string }[];
}

export interface FounderStory {
  founderName: string;
  backgroundSummary: string;
  foundingMotivation: string;
  fundingJourney: string;
}

export interface LessonAndEvidence {
  lessonsLearned: string[];
  verifiedDocuments: { title: string; issuer: string; date: string; verifyCode: string }[];
}

export interface SimilarCompany {
  id: string;
  name: string;
  hqLocation: string;
  similarityScore: string;
  marketCapOrValuation: string;
  keyAdvantage: string;
  status: string;
}

export interface RelatedSector {
  id: string;
  sectorName: string;
  marketSize: string;
  growthRateMom: string;
  relevanceLevel: string;
  keyTrends: string[];
}

export interface IdealCustomerPersona {
  // 8-Layer Professional Customer Segmentation Framework
  customerSegment?: string;       // 1. شريحة العميل (من هو العميل؟)
  customerProfile?: string;       // 2. ملف العميل (العمر، الموقع، النشاط، الحجم...)
  painPoints: string[];          // 3. المشكلة (ماذا يعاني؟)
  keyMotivations: string[];      // 4. الدافع (لماذا يريد الحل؟)
  buyingBehavior?: string;        // 5. السلوك (كيف يبحث ويشتري؟)
  buyingTriggers: string;        // 6. محفز الشراء (متى يقرر؟)
  decisionCriteria?: string[];   // 7. معايير الاختيار (لماذا يختارك؟)
  economicValueLtv?: string;     // 8. القيمة الاقتصادية (كم يساوي العميل؟ LTV / CAC)

  // Backward compatibility fields
  personaTitle?: string;
  archetypeRole?: string;
  commonObjections?: string;
  valueAlignment?: string;
}

export interface TargetAudience {
  idealCustomerPersonas: IdealCustomerPersona[];
  brainstormingSummary?: string;
  keyTouchpointChannels: string[];
  decisionMakingCriteria: string[];
}

export interface Company {
  id: string;
  name: string;
  permalink: string;
  shortDescription: string;
  aboutDescription: string;
  logoUrl: string;
  revenueModel: string;
  marketPosition: string;
  topCompetitors: string[];
  competitiveAdvantage: string;
  foundedDate: string;
  ipoStatus: string;
  fundingStatus: string;
  hqLocation: string;
  employeeRange: string;
  website: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  categories: string[];
  totalFundingAmount: string;
  fundingRoundsCount: number;
  legalName: string;
  alsoKnownAs: string;
  operatingStatus: string;
  exitsCount: number;
  stockSymbol: string;
  companyType: string;
  founders: string[];
  phoneNumber: string;
  contactEmail: string;
  monthlyWebVisits: string;
  visitsMomChange: string;
  itSpend: string;
  activeTechProductsCount: number;
  sampleTechs: string[];
  patentsCount: number;
  trademarksCount: number;
  fundingRounds: FundingRound[];
  investments: Investment[];
  keyPeople: KeyPerson[];
  subOrganizations: SubOrganization[];
  swotAnalysis?: SWOTAnalysis;
  techSolutionDetails?: TechSolutionDetails;
  expansionStrategy?: ExpansionStrategy;
  founderStory?: FounderStory;
  lessonAndEvidence?: LessonAndEvidence;
  similarCompaniesList?: SimilarCompany[];
  relatedSectorsList?: RelatedSector[];
  targetAudienceProfile?: TargetAudience;
}

export interface ValidationIssue {
  severity: "error" | "warning" | "info";
  section: string;
  fieldName: string;
  message: string;
}

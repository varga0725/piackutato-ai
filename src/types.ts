// This file contains all the type definitions for the application

export type AnalysisType = 'product' | 'topic' | 'website';

export interface Source {
  uri: string;
  title: string;
}

export enum PointCategory {
  PRICE = 'PRICE',
  QUALITY = 'QUALITY',
  MARKETING = 'MARKETING',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  INNOVATION = 'INNOVATION',
  BRAND_REPUTATION = 'BRAND_REPUTATION',
  OTHER = 'OTHER',
}

export interface CompetitorPoint {
  text: string;
  category: PointCategory;
}

export type Sentiment = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

export type PricingTier = 'AFFORDABLE' | 'MID_RANGE极' | 'PREMIUM' | 'NOT_AVAILABLE';

export interface Competitor {
  name: string;
  strengths: CompetitorPoint[];
  weaknesses: CompetitorPoint[];
  sentiment: Sentiment;
  pricingSummary: PricingTier;
  isMainCompetitor?: boolean;
}

export type ImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface SWOTPoint {
  text: string;
  impact: ImpactLevel;
  relatedCompetitor?: string;
}

export interface SWOTAnalysis {
  strengths: SWOTPoint[];
  weaknesses: SWOTPoint[];
  opportunities: SWOTPoint[];
  threats极: SWOTPoint[];
}

export interface BuyerPersona {
    name: string;
    age: number;
    occupation: string;
    bio: string;
    motivations: string[];
    frustrations: string[];
    communicationChannels: string[];
    quote: string;
}

export interface TrendDataPoint {
    month: string;
    value: number;
}

export interface MarketTrend {
    name: string;
    dataPoints: TrendDataPoint[];
}

export interface RegionData {
    name: string;
    intensity: number;
}

export interface AnalysisResult {
  analysisText: string;
  competitors: Competitor[];
  swotAnalysis: SWOTAnalysis;
  sources: Source[];
  marketOverview: {
    marketSize: string;
    growthRate: string;
    sentiment: Sentiment;
  };
  trends: MarketTrend[];
  personas: BuyerPersona[];
  regions: RegionData[];
  keywords: string[];
  contentSuggestions: string[];
}

export type BusinessPlanTemplate = 'DEFAULT' | 'LEAN_STARTUP' | 'GROWTH' | 'PREMIUM';

export interface FinancialPoint {
    item: string;
    cost: string;
}

export interface FinancialPlan {
    initialInvestment: FinancialPoint[];
    monthlyOperationalCosts: FinancialPoint[];
    revenueProjections: FinancialPoint[];
}

export interface FundingOption {
    type: string;
    advantages: string[];
    disadvantages: string[];
}

export interface BusinessPlan {
    id: string;
    title: string;
    strategyFocus: string;
    executiveSummary: string;
    marketingStrategy: string[];
    financialPlan: FinancialPlan;
    riskAssessment: string[];
    fundingOptions: FundingOption[];
}

export interface MarketEntryPhase {
    phaseTitle: string;
    description: string;
    keyActions: string[];
    considerations?: string[];
}

export interface MarketEntryProcess {
    strategicOverview: string;
    phases: MarketEntryPhase[];
}

export interface UVP {
    headline: string;
    subheadline: string;
    keywords: string[];
}

export interface AnalysisSummary {
  mainTakeaway: string;
  topCompetitorToWatch: {
    name: string;
    reason: string;
  };
  biggestOpportunity: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface SocialMediaPost {
    platform: 'Facebook' | 'Instagram';
    content: string;
    hashtags: string[];
    imagePrompt: string;
}

export interface BlogPostOutline {
    title: string;
    introduction: string;
    sections: { title: string; points: string[] }[];
    conclusion: string;
    seoKeywords: string[];
    imagePrompt: string;
}

export interface AdCopy {
    platform: 'Google Ads' | 'Facebook Ads';
    headline: string;
    description: string;
    imagePrompt: string;
}

export interface MarketingContent {
    socialMediaPosts: SocialMediaPost[];
    blogPostOutline: BlogPostOutline;
    adCopies: AdCopy[];
}

export interface MarketingChannel {
    name: string;
    description: string;
    platforms: string[];
}

export interface CampaignIdea {
    name:string;
    description: string;
}

export interface CalendarEntry {
    day: 'Hétfő' | 'Kedd' | 'Szerda' | 'Csütörtök' | 'Péntek' | 'Szombat' | 'Vasárnap' | 'Naponta' | 'Hétköznap' | 'Hétvégén';
    time: string;
    activity: string;
    platform: string;
    notes: string;
}

export interface MarketingStrategy {
    strategicOverview: string;
    suggestedChannels: MarketingChannel[];
    coreMessaging: {
        mainMessage: string;
        taglines: string[];
    };
    campaignIdeas: CampaignIdea[];
    keyPerformanceIndicators: string[];
    marketingCalendar: CalendarEntry[];
}

export interface SavedAnalysis {
  id: string;
  projectName: string;
  savedAt: string;
  result: AnalysisResult;
  userInput: string;
  analysisType: AnalysisType;
  marketingStrategy?: MarketingStrategy;
}

export interface ColorPalette {
    hex: string;
    name: string;
}

export interface FontPairing {
    headlineFont: {
        name: string;
        url: string;
    };
    bodyFont: {
        name: string;
        url: string;
    };
}

export interface BrandIdentity {
    colorPalette: ColorPalette[];
    fontPairing: Font极Pairing;
    moodBoardDescription: string;
}

export enum ProductNameCategory {
    DESCRIPTIVE = 'DESCRIPTIVE',
    EVOCATIVE = 'EVOCATIVE',
    MODERN = 'MODERN',
    PLAYFUL = 'PLAYFUL',
    PREMIUM = 'PREMIUM',
}

export interface ProductNameSuggestion {
    name: string;
    reasoning: string;
}

export type ProductNameSuggestions = Record<ProductNameCategory, ProductNameSuggestion[]>;
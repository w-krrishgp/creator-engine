import { CreatorProfile, Opportunity } from "./creator";

export type OpportunityFilterTab =
  | "All"
  | "Best Matches"
  | "Brand Deals"
  | "Sponsorships"
  | "UGC"
  | "Affiliate"
  | "Collaborations";

export interface CreatorStatsData {
  followers: number | null;
  followersFormatted: string;
  averageViews: number | null;
  averageViewsFormatted: string;
  engagementRate: number | null;
  engagementRateFormatted: string;
  contentTypesFormatted: string;
  platforms: string[];
}

export interface CreatorIntelligenceMetrics {
  creatorScore: number;
  nicheFit: number;
  audienceQuality: number;
  engagement: number;
  commercialPotential: number;
  isAiGenerated: boolean;
  calibrationModel: string;
}

export interface ApplicationPipelineStep {
  id: "saved" | "draft" | "sent" | "response" | "negotiation" | "accepted";
  label: string;
  count: number;
}

export interface AIInsightData {
  id: string;
  category: string;
  headline: string;
  insight: string;
  actionText: string;
  actionHref: string;
  confidenceScore?: number;
  generatedAt?: string;
}

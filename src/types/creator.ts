export type PlatformType = "Instagram" | "LinkedIn" | "YouTube" | "TikTok" | "X";

export type CreatorStageType = "Nano (1k-10k)" | "Micro (10k-50k)" | "Mid-Tier (50k-200k)" | "Macro (200k+)";

export interface CreatorProfile {
  id: "rahul" | "priya" | string;
  name: string;
  handle: string;
  avatar: string;
  title: string;
  niche: string;
  primaryPlatform: PlatformType;
  followerCount: number;
  engagementRate: number; // e.g. 4.8 (%)
  audienceDemographic: string;
  contentFormat: string;
  creatorStage: CreatorStageType;
  primaryGoal: string;
  monthlyIncomeTarget: number; // in USD or INR equivalent
  bio: string;
  location: string;
  topics: string[];
  activeDealsCount: number;
  estimatedPipelineValue: number;
  monthlyGrowthRate: number; // e.g. 12.4 (%)
  avgImpressionsPerPost: number;
  mediaKitLink?: string;
}

export interface Opportunity {
  id: string;
  brand: string;
  brandLogo: string;
  brandCategory: string;
  title: string;
  description: string;
  niche: string[];
  platform: PlatformType | "Multi-Platform";
  minFollowers: number;
  budgetRange: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  deliverables: string[];
  status: "Available" | "Applied" | "Under Review" | "Saved";
  appliedDate?: string;
  perks?: string[];
  targetAudience: string;
  sponsoredTag: boolean;
}

export interface CompatibilityBreakdown {
  score: number;
  nicheScore: number;
  platformScore: number;
  followerScore: number;
  goalScore: number;
  explanation: string;
  qualifies: boolean;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  tag: string;
}

export interface ReferenceProfile {
  name: string;
  handle: string;
  platform: PlatformType;
  lesson: string;
  statsHighlight: string;
}

export interface RoadmapPhase {
  id: string;
  days: "30 Days" | "60 Days" | "90 Days";
  phaseTitle: string;
  phaseObjective: string;
  milestones: RoadmapMilestone[];
  contentGaps: string[];
  skillsToImprove: string[];
  topicOpportunities: string[];
  referenceProfiles: ReferenceProfile[];
}

export interface MonetisationChannel {
  id: string;
  category: "brand_collaborations" | "affiliate_marketing" | "consulting_services" | "digital_products" | "pr_speaking";
  title: string;
  subtitle: string;
  badge: string;
  suitabilityScore: number; // 0-100
  whyItSuits: string;
  estimatedPotential: string;
  complexity: "Beginner" | "Intermediate" | "Advanced";
  readinessStatus: "Ready to Launch" | "High Opportunity" | "Scale Phase";
  launchChecklist: string[];
  realisticCaveats: string;
  suggestedFirstStep: string;
}

export interface ActionItem {
  id: string;
  creatorId: string;
  title: string;
  category: "Growth" | "Monetisation" | "Brand Pitch" | "Audience Trust";
  priority: "High" | "Medium" | "Low";
  reason: string;
  deadline: string;
  estimatedTime: string;
  completed: boolean;
}

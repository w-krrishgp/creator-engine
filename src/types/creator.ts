export type PlatformType = "Instagram" | "LinkedIn" | "YouTube" | "TikTok" | "X";

export type CreatorStageType = "Nano (1k-10k)" | "Micro (10k-50k)" | "Mid-Tier (50k-200k)" | "Macro (200k+)";

export type ExperienceLevelType = "Emerging (< 1 yr)" | "Growing (1-3 yrs)" | "Established (3+ yrs)";

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  title: string;
  niche: string;
  primaryPlatform: PlatformType;
  followerCount: number;
  secondaryPlatform?: PlatformType | "";
  secondaryFollowers?: number;
  engagementRate: number; // e.g. 4.8 (%)
  audienceDemographic: string;
  contentFormat: string;
  contentFrequency?: string;
  creatorStage: CreatorStageType;
  experienceLevel?: ExperienceLevelType;
  primaryGoal: string;
  monetisationGoals?: string[];
  monthlyIncomeTarget: number; // in USD or INR equivalent
  bio: string;
  location: string;
  topics: string[];
  activeDealsCount: number;
  estimatedPipelineValue: number;
  monthlyGrowthRate: number; // e.g. 12.4 (%)
  avgImpressionsPerPost: number;
  mediaKitLink?: string;
  isManuallyReported?: boolean;
  isOnboarded?: boolean;
  positioningStatement?: string;

  // Extended onboarding profile fields
  email?: string;
  country?: string;
  website?: string;
  platforms?: string[];
  contentTypes?: string[];
  contentDescription?: string;
  averageViews?: number;
  averageLikes?: number;
  averageComments?: number;
  audienceAge?: string;
  audienceLocation?: string;
  audienceDescription?: string;
  opportunityPreferences?: string[];
  collaborationType?: string;
  monthlyIncomeGoal?: number;
  preferredIndustries?: string;

  // Derived readiness & compatibility scores
  creatorScore?: number;
  nicheFitScore?: number;
  audienceQualityScore?: number;
  engagementScore?: number;
  commercialPotentialScore?: number;

  // YouTube Specific Fields (Database & Architecture)
  youtube_channel_id?: string;
  youtube_channel_url?: string;
  youtube_channel_title?: string;
  youtube_subscriber_count?: number;
  youtube_total_views?: number;
  youtube_video_count?: number;
  youtube_data_updated_at?: string;
  youtube_connected?: boolean;
  youtube_recent_videos?: YouTubeVideoSummary[];
  content_themes?: string[];
  creator_intelligence?: CreatorIntelligenceData;
  connectedAccounts?: ConnectedAccount[];
}

export interface YouTubeVideoSummary {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration?: string;
}

export interface YouTubeChannelData {
  channelId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelUrl: string;
  handle: string;
  subscriberCount: number;
  totalViews: number;
  videoCount: number;
  country?: string;
  publishedAt?: string;
  averageViews: number;
  averageLikes: number;
  averageComments: number;
  engagementRate: number; // calculated by Creator Engine
  postingFrequency?: string;
  recentVideos: YouTubeVideoSummary[];
}

export interface CreatorIntelligenceData {
  primaryNiche: string;
  secondaryNiches: string[];
  contentThemes: string[];
  audienceIntent?: string;
  creatorStrengths: string[];
  potentialMonetizationCategories: string[];
  brandCategories: string[];
  opportunityPreferences?: string[];
  calculatedScore?: number;
}

export interface ConnectedAccount {
  id: string;
  userId?: string;
  platform: "youtube" | "instagram" | "tiktok" | "linkedin" | "x" | "twitch";
  platformUserId: string;
  username: string;
  profileUrl: string;
  connectedAt: string;
  lastSyncedAt: string;
  status: "active" | "disconnected" | "expired";
  channelTitle?: string;
  avatarUrl?: string;
}

export interface YouTubeImportPreview {
  youtubeData: YouTubeChannelData;
  creatorIntelligence: CreatorIntelligenceData;
  suggestedProfile: Partial<CreatorProfile>;
}

export interface OnboardingFormData {
  // Step 1: About You
  name: string;
  handle: string;
  email: string;
  avatar?: string;
  location: string;
  country: string;
  website?: string;

  // Step 2: Your Content
  niche: string;
  platforms: string[];
  contentTypes: string[];
  contentDescription: string;

  // Step 3: Your Audience
  primaryPlatform: PlatformType;
  followerCount: number;
  averageViews: number;
  averageLikes?: number;
  averageComments?: number;
  engagementRate: number;
  audienceAge: string;
  audienceLocation: string;
  audienceDescription: string;

  // Step 4: Your Goals
  opportunityPreferences: string[];
  collaborationType: "Paid" | "Affiliate" | "Product" | "Both paid and product" | "Any" | string;
  monthlyIncomeGoal?: number;
  preferredIndustries?: string;

  // Legacy / compatibility fields
  creatorStage?: CreatorStageType;
  experienceLevel?: ExperienceLevelType;
  bio?: string;
  contentFormat?: string;
  contentFrequency?: string;
  primaryGoal?: string;
  monetisationGoals?: string[];
  monthlyIncomeTarget?: number;
  secondaryPlatform?: PlatformType | "";
  secondaryFollowers?: number;
  audienceDemographic?: string;
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
  applicationId?: string;
  appliedFee?: string;
  appliedNotes?: string;
  perks?: string[];
  targetAudience: string;
  targetLocation?: string;
  eligibilityRequirements: string[];
  minEngagementRate?: number;
  sponsoredTag: boolean;
}

export interface EligibilityCheckItem {
  id: string;
  name: string;
  passed: boolean;
  requirement: string;
  actual: string;
  isHardRequirement: boolean;
  failReason?: string;
}

export interface CompatibilityBreakdown {
  score: number;
  nicheScore: number;
  platformScore: number;
  followerScore: number;
  audienceScore: number;
  goalScore: number;
  explanation: string;
  reasons: string[];
  qualifies: boolean; // hard eligibility: passes all hard requirements
  eligibilityChecks: EligibilityCheckItem[];
  failedHardRequirements: string[];
  passedRequirements: string[];
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  tag: string;
}

export interface ContentGapItem {
  gap: string;
  reason: string;
  impactLevel?: "Critical" | "High" | "Medium";
}

export interface SkillPriorityItem {
  skill: string;
  category: "Content Production" | "Commercial & Pitching" | "Audience Retention" | "Legal & Compliance" | "Strategy";
  priority: "Critical" | "High" | "Medium";
  actionStep: string;
}

export interface TopicOpportunityItem {
  title: string;
  hookAngle: string;
  suggestedFormat: string;
  targetAudience: string;
}

export interface ReferenceProfile {
  name: string;
  handle: string;
  platform: PlatformType;
  lesson: string;
  statsHighlight: string;
  url?: string;
  isVerifiedLink?: boolean;
}

export interface RoadmapPhase {
  id: string;
  days: "30 Days" | "60 Days" | "90 Days";
  phaseTitle: string;
  phaseObjective: string;
  milestones: RoadmapMilestone[];
  contentGaps: (string | ContentGapItem)[];
  skillsToImprove: (string | SkillPriorityItem)[];
  topicOpportunities: (string | TopicOpportunityItem)[];
  referenceProfiles: ReferenceProfile[];
}

export interface MonetisationChannel {
  id: string;
  category: "brand_collaborations" | "affiliate_marketing" | "consulting_services" | "digital_products" | "pr_speaking";
  title: string;
  subtitle: string;
  badge: string;
  suitabilityScore: number; // 0-100
  suitabilityExplanation?: string;
  whyItSuits: string;
  prerequisites?: string[];
  suggestedFirstStep: string;
  potentialRisks?: string;
  estimatedPotential: string;
  illustrativePriceRange?: string;
  complexity: "Beginner" | "Intermediate" | "Advanced";
  readinessStatus: "Ready to Launch" | "High Opportunity" | "Scale Phase";
  launchChecklist: string[];
  realisticCaveats: string;
}

export type ActionStatus = "Not started" | "In progress" | "Completed";

export interface ActionItem {
  id: string;
  creatorId: string;
  title: string;
  category: "Growth" | "Monetisation" | "Brand Pitch" | "Audience Trust";
  priority: "High" | "Medium" | "Low";
  reason: string;
  deadline: string;
  estimatedTime: string;
  status: ActionStatus;
  completed: boolean;
  relatedType?: "roadmap" | "opportunity" | "monetisation" | "goal";
  relatedId?: string;
  relatedTitle?: string;
  relatedLink?: string;
}

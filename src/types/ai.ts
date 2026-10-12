export interface CreatorPositioningRecommendation {
  thesis: string;
  targetAudience: string;
  differentiator: string;
  elevatorPitch: string;
}

export interface ContentGapRecommendation {
  gap: string;
  reason: string;
  impactLevel: "Critical" | "High" | "Medium";
}

export interface SkillPriorityRecommendation {
  skill: string;
  category: "Content Production" | "Commercial & Pitching" | "Audience Retention" | "Legal & Compliance" | "Strategy";
  priority: "Critical" | "High" | "Medium";
  actionStep: string;
}

export interface TopicOpportunityRecommendation {
  title: string;
  hookAngle: string;
  suggestedFormat: string;
  targetAudience: string;
}

export interface GrowthMilestoneRecommendation {
  title: string;
  description: string;
  tag: string;
}

export interface GrowthRoadmapPhaseRecommendation {
  days: "30 Days" | "60 Days" | "90 Days";
  phaseTitle: string;
  phaseObjective: string;
  milestones: GrowthMilestoneRecommendation[];
  contentGaps: ContentGapRecommendation[];
  skillsToImprove: SkillPriorityRecommendation[];
  topicOpportunities: TopicOpportunityRecommendation[];
}

export interface MonetisationPathwayRecommendation {
  channelTitle: string;
  category: "brand_collaborations" | "affiliate_marketing" | "consulting_services" | "digital_products" | "pr_speaking";
  suitabilityScore: number;
  whyItSuits: string;
  suggestedFirstStep: string;
  estimatedPotential: string;
  readinessStatus: "Ready to Launch" | "High Opportunity" | "Scale Phase";
  launchChecklist: string[];
}

export interface ActionExplanationRecommendation {
  title: string;
  category: "Growth" | "Monetisation" | "Brand Pitch" | "Audience Trust";
  priority: "High" | "Medium" | "Low";
  reason: string;
  deadline: string;
  estimatedTime: string;
  relatedType?: "roadmap" | "opportunity" | "monetisation" | "goal";
  relatedTitle?: string;
}

export interface AiRecommendationsResponse {
  success: boolean;
  isDemoMode: boolean;
  generatedAt: string;
  creatorId: string;
  modelUsed?: string;
  positioning: CreatorPositioningRecommendation;
  growthRoadmap: GrowthRoadmapPhaseRecommendation[];
  monetisationPathways: MonetisationPathwayRecommendation[];
  nextActions: ActionExplanationRecommendation[];
  error?: string;
  warning?: string;
}

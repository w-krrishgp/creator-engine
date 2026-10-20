import { CreatorProfile } from "@/types/creator";
import { AiRecommendationsResponse } from "@/types/ai";

export function generateFallbackRecommendations(
  creator: CreatorProfile,
  warningReason?: string
): AiRecommendationsResponse {
  return generateDynamicCreatorRecommendations(creator, warningReason);
}

function generateDynamicCreatorRecommendations(
  creator: CreatorProfile,
  warningReason?: string
): AiRecommendationsResponse {
  const platform = creator.primaryPlatform || "YouTube";
  const formattedFollowers = (creator.followerCount || 0).toLocaleString();
  const estimatedPotentialInr = creator.followerCount > 100000 ? "₹75,000 – ₹1,80,000" : "₹25,000 – ₹60,000";

  return {
    success: true,
    isDemoMode: false,
    generatedAt: new Date().toISOString(),
    creatorId: creator.id,
    modelUsed: "Tailored Engine (Deterministic)",
    warning: warningReason,
    positioning: {
      thesis: `Establishing commanding authority in ${creator.niche} across ${platform} by converting ${formattedFollowers} audience reach into high-retention community engagement.`,
      targetAudience: creator.audienceDemographic || `Dedicated followers and enthusiasts in ${creator.niche}`,
      differentiator: `High-conviction content delivery, verifiable domain expertise in ${creator.niche}, and systematic audience retention on ${platform}.`,
      elevatorPitch: `I create high-impact ${platform} content in ${creator.niche} that delivers actionable value to an engaged audience.`,
    },
    growthRoadmap: [
      {
        days: "30 Days",
        phaseTitle: "Content Cadence & Conversion Funnel Optimization",
        phaseObjective: `Establish a consistent 3x-weekly ${platform} publishing rhythm and optimize profile conversions.`,
        milestones: [
          {
            title: `Audit ${platform} Channel / Profile Positioning`,
            description: "Refine header banner, pinned media, and description copy to clearly state value proposition.",
            tag: "Profile Funnel",
          },
          {
            title: "Standardize Retention Hook Framework",
            description: "Test 3 variations of the opening 3-second hook to maximize completion and algorithmic watch time.",
            tag: "Content Engine",
          },
          {
            title: "Implement Audience Lead Capture Asset",
            description: "Create a downloadable resource or community link to transition viewers into owned community subscribers.",
            tag: "Community",
          },
        ],
        contentGaps: [
          {
            gap: "Hook drop-off within initial seconds",
            reason: "Algorithms heavily reward initial retention. Weak hooks lead to premature scroll-aways.",
            impactLevel: "Critical",
          },
          {
            gap: "Inconsistent call-to-action on top-performing content",
            reason: "Viewer momentum is lost without a clear next action step at the end of content.",
            impactLevel: "High",
          },
        ],
        skillsToImprove: [
          {
            skill: "Audience Retention Editing & Pacing",
            category: "Content Production",
            priority: "Critical",
            actionStep: "Review retention charts on past media and cut dead pauses in the first 30 seconds.",
          },
        ],
        topicOpportunities: [
          {
            title: `The Ultimate Beginner's Guide to ${creator.niche}`,
            hookAngle: "Break down the most common misconception in the space with clear evidence.",
            suggestedFormat: platform === "YouTube" ? "12-minute deep-dive video" : "Carousel / Reel",
            targetAudience: "New entrants & enthusiasts",
          },
        ],
      },
      {
        days: "60 Days",
        phaseTitle: "Series Franchising & Strategic Collaborations",
        phaseObjective: `Develop a recurring content series on ${platform} and secure initial brand integrations.`,
        milestones: [
          {
            title: "Launch Branded Recurring Weekly Series",
            description: "Establish a recognized episodic franchise that viewers anticipate each week.",
            tag: "Franchising",
          },
          {
            title: "Assemble Standardized Creator Media Kit",
            description: "Prepare verified statistics sheet with demographics, average views, and transparent sponsorship packages.",
            tag: "Commercial",
          },
        ],
        contentGaps: [
          {
            gap: "Absence of episodic or recurring formats",
            reason: "Serial content increases repeat viewers and builds algorithmic affinity across uploads.",
            impactLevel: "High",
          },
        ],
        skillsToImprove: [
          {
            skill: "Commercial Rate Negotiation",
            category: "Commercial & Pitching",
            priority: "High",
            actionStep: "Calculate baseline CPM rate and build multi-deliverable packages instead of one-off posts.",
          },
        ],
        topicOpportunities: [
          {
            title: `What Nobody Tells You About ${creator.niche}`,
            hookAngle: "Expose industry secrets or behind-the-scenes realities.",
            suggestedFormat: "Deep-dive analysis",
            targetAudience: "Core community",
          },
        ],
      },
      {
        days: "90 Days",
        phaseTitle: "Diversified Monetisation & Revenue Expansion",
        phaseObjective: "Activate multi-tier revenue streams across sponsorships, affiliate programs, and digital products.",
        milestones: [
          {
            title: "Deploy Automated Affiliate Storefront",
            description: "Integrate trackable partner links in all video descriptions and bio links.",
            tag: "Monetisation",
          },
          {
            title: "Pitch 5 Tier-1 Brands for Quarter Retainers",
            description: "Move from single sponsored mentions to 3-month strategic brand partnerships.",
            tag: "Sponsorships",
          },
        ],
        contentGaps: [
          {
            gap: "Single-channel monetization dependency",
            reason: "Relying purely on platform ad revenue leaves creators vulnerable to algorithm shifts.",
            impactLevel: "Medium",
          },
        ],
        skillsToImprove: [
          {
            skill: "Community Ownership & CRM",
            category: "Strategy",
            priority: "High",
            actionStep: "Build automated newsletter or Discord pipeline to interact directly with core fans.",
          },
        ],
        topicOpportunities: [
          {
            title: `My Complete Workflow & System in 2026`,
            hookAngle: "Transparent breakdown of tools, process, and hard-earned lessons.",
            suggestedFormat: "Masterclass format",
            targetAudience: "Aspiring creators and industry peers",
          },
        ],
      },
    ],
    monetisationPathways: [
      {
        channelTitle: "Dedicated & Integrated Brand Partnerships",
        category: "brand_collaborations",
        suitabilityScore: 92,
        whyItSuits: `Strong engagement in ${creator.niche} makes your audience valuable to relevant advertisers.`,
        suggestedFirstStep: "Draft a 1-page media kit with verified view statistics and sample deliverables.",
        estimatedPotential: `${estimatedPotentialInr} / month`,
        readinessStatus: "Ready to Launch",
        launchChecklist: [
          "Create standard rate card with usage rights included",
          "Assemble past performance screenshots and analytics proof",
          "Identify 10 brands already sponsoring creators in your category",
        ],
      },
      {
        channelTitle: "Curated Affiliate Deals & Gear Kits",
        category: "affiliate_marketing",
        suitabilityScore: 84,
        whyItSuits: `Turn viewers inquiring about your tools and recommendations into passive commissions.`,
        suggestedFirstStep: "Set up affiliate accounts for your top 5 recommended products.",
        estimatedPotential: "₹15,000 – ₹40,000 / month",
        readinessStatus: "High Opportunity",
        launchChecklist: [
          "Disclose all affiliate relationships per ASCI/FTC rules",
          "Add persistent link tree in video/post bios",
        ],
      },
    ],
    nextActions: [
      {
        title: `Optimize ${platform} bio and channel branding`,
        category: "Growth",
        priority: "High",
        reason: "First impression is critical for converting random viewers into loyal subscribers.",
        deadline: "In 2 days",
        estimatedTime: "45 mins",
        relatedType: "roadmap",
        relatedTitle: "Content Cadence & Conversion Funnel Optimization",
      },
      {
        title: "Standardize media kit with verified platform metrics",
        category: "Brand Pitch",
        priority: "High",
        reason: "Legitimate sponsors require verified reach and demographic proof before approving budgets.",
        deadline: "In 4 days",
        estimatedTime: "1 hour",
        relatedType: "monetisation",
        relatedTitle: "Dedicated & Integrated Brand Partnerships",
      },
    ],
  };
}

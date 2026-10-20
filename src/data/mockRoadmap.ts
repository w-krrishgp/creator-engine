import { RoadmapPhase } from "@/types/creator";

export const MOCK_ROADMAPS: Record<string, RoadmapPhase[]> = {
  creator: [
    {
      id: "creator-phase-1",
      days: "30 Days",
      phaseTitle: "Audience Calibration & Format Standardization",
      phaseObjective:
        "Standardize 3 core video templates, optimize profile conversion funnel, and establish a repeatable publishing rhythm focusing on creative tech and productivity setups.",
      milestones: [
        {
          id: "m1",
          title: "Audit Channel Positioning & Pinned Showcase",
          description: "Refine channel banner, about page, and pinned showcase video highlighting key production workflows.",
          completed: true,
          tag: "Profile Funnel",
        },
        {
          id: "m2",
          title: "Standardize Retention Hook Framework",
          description: "Implement bold on-screen hooks in the first 3 seconds to boost average percentage viewed above 55%.",
          completed: true,
          tag: "Content Engine",
        },
        {
          id: "m3",
          title: "Setup Link-in-Bio Digital Lead Magnet",
          description: "Build an automated Notion desk setup guide to capture newsletter subscribers before launching paid products.",
          completed: false,
          tag: "Lead Capture",
        },
        {
          id: "m4",
          title: "Develop Media Kit & Rate Card v1",
          description: "Compile demographic data (20-35 age group, 5.2% engagement, 34k avg views) and set baseline sponsorship rate at ₹25,000/integration.",
          completed: false,
          tag: "Brand Readiness",
        },
      ],
      contentGaps: [
        {
          gap: "Video hooks drop off in the first 5 seconds; missing immediate visual payoff",
          reason: "YouTube algorithm weighs first-30-second retention heavily. Without immediate payoff or motion graphics, viewer drop-off limits algorithmic recommendation velocity.",
          impactLevel: "Critical",
        },
        {
          gap: "Descriptions lack standardized affiliate gear disclosure and resource links",
          reason: "High viewer intent for hardware setups is lost without direct, trackable affiliate gear links.",
          impactLevel: "High",
        },
        {
          gap: "Community tab and YouTube Shorts are underutilized between long-form uploads",
          reason: "Shorts and community polls keep algorithm signals warm between scheduled long-form releases.",
          impactLevel: "Medium",
        },
      ],
      skillsToImprove: [
        {
          skill: "Dynamic Motion Graphics & Retention Editing",
          category: "Content Production",
          priority: "Critical",
          actionStep: "Master DaVinci Resolve text animations and jump-cut audio sound design to eliminate dead air.",
        },
        {
          skill: "Brand Inbound Negotiation & Usage Rights",
          category: "Commercial & Pitching",
          priority: "High",
          actionStep: "Adopt ASCI compliant rate cards with separate organic vs paid usage multipliers.",
        },
      ],
      topicOpportunities: [
        {
          title: "Minimalist Workspace Setup Under ₹50,000",
          hookAngle: "Showcase a clean budget workstation build with cable management tips.",
          suggestedFormat: "Long-form Video + Breakdown Carousel",
          targetAudience: "College students & remote professionals",
        },
        {
          title: "Top 5 AI Productivity Tools That Actually Save Hours",
          hookAngle: "Real benchmark comparisons testing actual time saved on real tasks.",
          suggestedFormat: "Shorts series + Deep dive demo",
          targetAudience: "Knowledge workers and digital creators",
        },
      ],
      referenceProfiles: [
        {
          name: "MKBHD (Studio)",
          handle: "@mkbhd",
          platform: "YouTube",
          lesson: "Clear editorial pacing with consistent visual identity builds unparalleled brand trust.",
          statsHighlight: "18.5M subscribers • 4.5% engagement",
          url: "https://youtube.com/@mkbhd",
          isVerifiedLink: true,
        },
        {
          name: "Ali Abdaal",
          handle: "@aliabdaal",
          platform: "YouTube",
          lesson: "Repurpose long-form tech reviews into lead-magnet digital templates and courses.",
          statsHighlight: "5.4M subscribers • Multi-tier monetization",
          url: "https://youtube.com/@aliabdaal",
          isVerifiedLink: true,
        },
      ],
    },
    {
      id: "creator-phase-2",
      days: "60 Days",
      phaseTitle: "Monetisation Engine & Commercial Sponsorships",
      phaseObjective:
        "Diversify revenue from ad-hoc sponsorships into predictable monthly brand retainer deals and affiliate hardware commissions.",
      milestones: [
        {
          id: "m5",
          title: "Pitch 10 Hardware & SaaS Brands with Dynamic Decks",
          description: "Send personalized pitches with custom integration concepts to vetted brands in the Creator Opportunities marketplace.",
          completed: false,
          tag: "Brand Pitching",
        },
        {
          id: "m6",
          title: "Deploy Trackable Gear Affiliate Hub",
          description: "Consolidate all recommended gear, desk accessories, and software discounts into a dedicated public kit page.",
          completed: false,
          tag: "Affiliate Engine",
        },
        {
          id: "m7",
          title: "Sign First Retainer Deal with Net-15 Terms",
          description: "Close a 3-month recurring integration package with 50% advance to stabilize monthly revenue cashflow.",
          completed: false,
          tag: "Commercial Milestone",
        },
      ],
      contentGaps: [
        {
          gap: "Lack of comparison benchmarks against competitor alternatives",
          reason: "High-intent buyers looking to purchase hardware look specifically for direct head-to-head comparisons before buying.",
          impactLevel: "High",
        },
      ],
      skillsToImprove: [
        {
          skill: "Commercial Deal Structuring",
          category: "Commercial & Pitching",
          priority: "High",
          actionStep: "Package integrated sponsorships with dedicated community posts and link-in-bio placements.",
        },
      ],
      topicOpportunities: [
        {
          title: "Ultimate Creator Audio Setup Comparison (Budget vs Pro)",
          hookAngle: "Blind microphone test across different acoustic spaces.",
          suggestedFormat: "Comprehensive Video Review",
          targetAudience: "Podcasters & video creators",
        },
      ],
      referenceProfiles: [
        {
          name: "Sara Dietschy",
          handle: "@saradietschy",
          platform: "YouTube",
          lesson: "Authentic studio vlogs convert into long-term brand integrations with tech lifestyle brands.",
          statsHighlight: "900k subscribers • Creator studio series",
          url: "https://youtube.com/@saradietschy",
          isVerifiedLink: true,
        },
      ],
    },
    {
      id: "creator-phase-3",
      days: "90 Days",
      phaseTitle: "Digital Products & High-Ticket Consulting",
      phaseObjective:
        "Launch high-margin owned digital assets (creator workflow presets & 1:1 setup consulting) to achieve ₹75,000/month target.",
      milestones: [
        {
          id: "m8",
          title: "Launch 'Creator Workspace OS' Notion Template",
          description: "Package internal production pipeline into a ₹999 digital product for aspiring creators.",
          completed: false,
          tag: "Digital Product",
        },
        {
          id: "m9",
          title: "Introduce 1:1 Creator Strategy & Setup Audits",
          description: "Offer premium 60-minute studio and equipment consulting sessions at ₹3,500/slot.",
          completed: false,
          tag: "Consulting",
        },
      ],
      contentGaps: [],
      skillsToImprove: [],
      topicOpportunities: [],
      referenceProfiles: [],
    },
  ],
};

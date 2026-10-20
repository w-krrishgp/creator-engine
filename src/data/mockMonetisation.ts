import { MonetisationChannel } from "@/types/creator";

export const MOCK_MONETISATION_CHANNELS: Record<string, MonetisationChannel[]> = {
  creator: [
    {
      id: "creator-brand-collabs",
      category: "brand_collaborations",
      title: "Sponsored Tech Integrations & Dedicated Reviews",
      subtitle: "Sponsored video integrations with tech hardware, audio gear, and productivity software brands",
      badge: "Highest Inbound Demand",
      suitabilityScore: 94,
      suitabilityExplanation:
        "High commercial demand in tech and productivity niches; hardware manufacturers and software SaaS tools actively allocate monthly budgets for creators with high-intent audiences.",
      whyItSuits:
        "Your 25,000 YouTube subscribers and 12,000 Instagram followers have a focused demographic (tech enthusiasts & creators, 20-35). Brands value authentic workflow showcases over generic ads.",
      prerequisites: [
        "Media Kit v1 featuring verified 5.2% engagement rate & 34,000 average post impressions",
        "Clear brief approval and revision agreement (max 1 creative revision to protect delivery timeline)",
        "Understanding of digital usage rights (30-day organic vs paid ad whitelisting)",
        "Strict adherence to ASCI influencer disclosure guidelines (#Ad or #Sponsored)",
      ],
      suggestedFirstStep:
        "Send customized pitch decks with 2 short-form video concept hooks to 5 tech hardware brands that actively sponsor workspace setups.",
      potentialRisks:
        "Brands often pay on Net 30 to Net 60-day terms. Over-sponsoring feed content risks audience fatigue and suppresses organic algorithmic reach by up to 30%.",
      estimatedPotential: "₹40,000 – ₹90,000 / month",
      illustrativePriceRange: "₹25,000 – ₹45,000 per Dedicated Video / Integration",
      complexity: "Intermediate",
      readinessStatus: "Ready to Launch",
      launchChecklist: [
        "Compile demographic proof slides (76% tech professionals, 20-35 age bracket)",
        "Set transparent rate card: ₹25,000 for 60-90s integration, ₹45,000 for dedicated video",
        "Draft professional outbound pitch template targeting brand marketing leads",
        "Establish revision boundaries and payment milestones (50% advance on brief approval)",
      ],
      realisticCaveats:
        "Sponsorship income fluctuates quarterly. Maintain strict editorial integrity by testing every product personally before agreeing to feature it.",
    },
    {
      id: "creator-affiliate-links",
      category: "affiliate_marketing",
      title: "Curated Tech Gear & SaaS Affiliate Engine",
      subtitle: "Hardware affiliate links, desk setup discount codes, and recurring software referral commissions",
      badge: "Immediate Passive Revenue",
      suitabilityScore: 88,
      suitabilityExplanation:
        "High organic buying intent on hardware and software recommendations; viewers actively seek direct product links and discounts in descriptions and comments.",
      whyItSuits:
        "Viewers frequently ask about your microphone, monitor arm, and editing software. Direct affiliate links turn questions into high-margin passive commission.",
      prerequisites: [
        "Approved creator affiliate accounts (Amazon Associates, Impact, ShareASale, Rewardful)",
        "Centralized Kit.co or Bento link-in-bio page for quick mobile reference",
        "Proper ASCI and platform affiliate disclaimers in video descriptions",
      ],
      suggestedFirstStep:
        "Add trackable gear links to the top of all past high-traffic video descriptions and pin a 'My Studio Setup' link.",
      potentialRisks:
        "Cookie windows vary (24 hours on Amazon vs 30 days for SaaS). Income is tied directly to video view volume.",
      estimatedPotential: "₹15,000 – ₹35,000 / month",
      illustrativePriceRange: "5% – 25% recurring commission per sale",
      complexity: "Beginner",
      readinessStatus: "Ready to Launch",
      launchChecklist: [
        "Apply to top 5 tech affiliate programs",
        "Build a clean 'Studio Gear' Notion/Kit page",
        "Add standard affiliate disclaimer template to YouTube upload defaults",
      ],
      realisticCaveats:
        "Requires consistent evergreen views. Only recommend gear you genuinely rely on to maintain creator credibility.",
    },
    {
      id: "creator-digital-products",
      category: "digital_products",
      title: "Creator Presets, LUTs & Notion Workflows",
      subtitle: "Custom video editing presets, sound effects packs, and workspace management Notion templates",
      badge: "Highest Profit Margins",
      suitabilityScore: 86,
      suitabilityExplanation:
        "Zero marginal cost of reproduction with 95%+ profit margins. Directly monetizes the creative craft that viewers already admire.",
      whyItSuits:
        "Aspiring creators looking at your high production quality want your exact editing workflow and color grading presets.",
      prerequisites: [
        "Digital storefront on Gumroad, Lemon Squeezy, or Cosmotown",
        "High-converting landing page with before-and-after video demos",
        "Automated delivery system with customer onboarding documentation",
      ],
      suggestedFirstStep:
        "Package your top 3 DaVinci Resolve / Premiere color presets into a ₹499 starter pack.",
      potentialRisks:
        "Customer support for beginner technical installation questions takes time away from content creation.",
      estimatedPotential: "₹25,000 – ₹60,000 / month",
      illustrativePriceRange: "₹499 – ₹1,999 per digital asset",
      complexity: "Intermediate",
      readinessStatus: "High Opportunity",
      launchChecklist: [
        "Export and test presets across multiple cameras and lighting conditions",
        "Record 3-minute installation walkthrough video",
        "Set up Gumroad checkout with UPI / Stripe support",
      ],
      realisticCaveats:
        "Launches need active promotion in video end-screens and pinned comments to sustain consistent sales.",
    },
    {
      id: "creator-consulting-coaching",
      category: "consulting_services",
      title: "1:1 Creator Studio & Workflow Audits",
      subtitle: "Personalized 60-minute studio design, audio optimization, and content system consultations",
      badge: "High Ticket Value",
      suitabilityScore: 82,
      suitabilityExplanation:
        "High revenue per transaction requiring zero upfront inventory. Ideal for bootstrapping immediate cashflow.",
      whyItSuits:
        "Semi-pro creators and founders want direct tailored advice on building their YouTube studio without wasting thousands on wrong equipment.",
      prerequisites: [
        "Cal.com or Calendly booking flow with upfront payment integration",
        "Structured 60-minute audit framework with written action plan deliverable",
      ],
      suggestedFirstStep:
        "Offer 3 discounted beta consultation slots at ₹2,500 to collect testimonials and build case studies.",
      potentialRisks:
        "Directly trades time for money; difficult to scale beyond 10-15 hours per month without burnout.",
      estimatedPotential: "₹20,000 – ₹50,000 / month",
      illustrativePriceRange: "₹3,500 – ₹7,500 per 60-minute session",
      complexity: "Intermediate",
      readinessStatus: "Ready to Launch",
      launchChecklist: [
        "Create intake questionnaire asking for client setup photos and current bottlenecks",
        "Set up automated Google Meet link generation with calendar sync",
        "Design a 1-page PDF Setup Recommendation summary template",
      ],
      realisticCaveats:
        "Cap available weekly slots to protect content creation time.",
    },
    {
      id: "creator-pr-speaking",
      category: "pr_speaking",
      title: "Creator Workshops & Panel Speaking",
      subtitle: "Keynotes and hands-on workshops at creator summits, university tech fests, and brand launch events",
      badge: "Authority & Network Builder",
      suitabilityScore: 78,
      suitabilityExplanation:
        "Builds high-level industry authority and direct relationships with brand decision makers.",
      whyItSuits:
        "Events and college tech fests actively seek energetic creators who can demystify content production and modern media tools.",
      prerequisites: [
        "Dedicated speaking one-sheet PDF highlighting topics and past appearances",
        "Short 2-minute speaker highlight reel demonstrating stage presence",
      ],
      suggestedFirstStep:
        "Reach out to regional creator meetups and campus tech festivals with two workshop topics.",
      potentialRisks:
        "Speaking engagements can be sporadic with long payment cycles.",
      estimatedPotential: "₹15,000 – ₹40,000 / engagement",
      illustrativePriceRange: "₹20,000 – ₹50,000 per keynote / workshop",
      complexity: "Advanced",
      readinessStatus: "Scale Phase",
      launchChecklist: [
        "Record high-quality video footage from any upcoming live sessions",
        "Define 2 signature talk outlines: 'Production Hacks for Modern Creators' and 'The 2026 Solo Media Engine'",
      ],
      realisticCaveats:
        "Primarily useful for brand authority and network expansion rather than recurring monthly cash flow.",
    },
  ],
};

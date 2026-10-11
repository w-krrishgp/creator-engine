import { MonetisationChannel } from "@/types/creator";

export const MOCK_MONETISATION_CHANNELS: Record<string, MonetisationChannel[]> = {
  rahul: [
    {
      id: "brand-collabs",
      category: "brand_collaborations",
      title: "Micro-Sponsorships & Dedicated Reels",
      subtitle: "Sponsored short-form integrations with supplement and apparel brands",
      badge: "Highest Inbound Demand",
      suitabilityScore: 94,
      whyItSuits:
        "Your 15,000 Instagram followers have a focused demographic (college students, 18-24). D2C brands actively hunt for micro-influencers with >4% engagement because your audience trust is 3x higher than macro celebrity creators.",
      estimatedPotential: "₹20,000 – ₹45,000 / month (Illustrative)",
      complexity: "Intermediate",
      readinessStatus: "Ready to Launch",
      launchChecklist: [
        "Create a clean 1-page PDF Media Kit highlighting 4.8% engagement rate & 29.4k avg impressions",
        "Set transparent rate card: ₹12,000 for 1x Reel, ₹18,000 for Reel + 3 Story frames bundle",
        "Draft a professional outbound pitch email template targeting marketing managers",
        "Establish a clear brief approval and revision process with brands before filming",
      ],
      realisticCaveats:
        "Brands pay on 30 to 60-day credit terms. Income fluctuates seasonally (surges in January New Year & summer fitness drives). Requires maintaining strict editorial control so you don't alienate organic followers.",
      suggestedFirstStep: "Send pitch decks to 5 D2C brands that already sponsor similar fitness reels.",
    },
    {
      id: "affiliate-links",
      category: "affiliate_marketing",
      title: "High-Intent Affiliate Links & Discount Codes",
      subtitle: "Supplement codes, gym wear, and home workout gear commissions",
      badge: "Immediate Passive Revenue",
      suitabilityScore: 88,
      whyItSuits:
        "Followers constantly ask 'which protein powder is safe on a budget?' in your DMs. A curated coupon code provides an immediate, low-friction response while generating 10-15% commission per order.",
      estimatedPotential: "₹8,000 – ₹18,000 / month (Illustrative)",
      complexity: "Beginner",
      readinessStatus: "Ready to Launch",
      launchChecklist: [
        "Sign up for MyProtein / HealthKart affiliate portals with your creator handle",
        "Set up an organized Linktree / Beacons page grouping supplements, cheap resistance bands, and pantry staples",
        "Pin a 'Supplements FAQ' Story Highlight featuring your active discount code",
        "Always provide transparent disclosure (#Affiliate or 'Earns a small commission at no extra cost to you')",
      ],
      realisticCaveats:
        "Requires consistent story reminders and swipe-up clicks. Passive income ramps gradually; you need repeat buyer retention rather than one-time hype.",
      suggestedFirstStep: "Apply for 2 fitness brand affiliate programs and pin link in your bio.",
    },
    {
      id: "digital-products",
      category: "digital_products",
      title: "Low-Ticket Student Workout & Diet Guides",
      subtitle: "Downloadable PDF blueprints & Notion meal planning templates",
      badge: "High Margin Opportunity",
      suitabilityScore: 82,
      whyItSuits:
        "College students have limited disposable income for expensive personal trainers (₹3,000/mo), but will eagerly pay ₹299 to ₹499 for a proven 'Hostel Bulking Blueprint' tested in actual college messes.",
      estimatedPotential: "₹15,000 – ₹35,000 / month (Illustrative)",
      complexity: "Intermediate",
      readinessStatus: "High Opportunity",
      launchChecklist: [
        "Package your 12 best budget recipes and a 3-day dumbbell split into a structured Canva/PDF guide",
        "Set up instant automated fulfillment on Gumroad, Instamojo, or Topmate",
        "Tease free sample pages in your carousel slides to validate demand",
        "Offer 100% money-back satisfaction guarantee to eliminate buyer hesitation",
      ],
      realisticCaveats:
        "High initial creation effort. You must continuously drive organic traffic via Reels since digital products have zero brand discoverability without your promotion.",
      suggestedFirstStep: "Survey your Instagram Stories: 'Would you pay ₹299 for a complete hostel grocery & workout guide?'",
    },
    {
      id: "consulting-coaching",
      category: "consulting_services",
      title: "1:1 Online Fitness Coaching (Small Cohort)",
      subtitle: "Personalized WhatsApp workout monitoring and weekly form audits",
      badge: "High Touch / Low Volume",
      suitabilityScore: 70,
      whyItSuits:
        "A small segment of your audience wants direct personal accountability. Capping coaching to 5-10 clients provides high per-client revenue without overwhelming your college schedule.",
      estimatedPotential: "₹15,000 – ₹25,000 / month (Illustrative)",
      complexity: "Advanced",
      readinessStatus: "High Opportunity",
      launchChecklist: [
        "Design a 6-week progressive overload split template tailored to hostel equipment",
        "Set up client intake Google Form to screen for medical history and training goals",
        "Price at ₹2,500/month per client for weekly video form check and habit tracking",
        "Cap intake at 8 clients max to prevent service quality decline",
      ],
      realisticCaveats:
        "Trades your time directly for money. Client churn is high if expectations aren't managed. Requires liability disclaimer and exercise certification recommended.",
      suggestedFirstStep: "Open 3 beta coaching spots at a 50% discount in your broadcast channel.",
    },
    {
      id: "pr-speaking",
      category: "pr_speaking",
      title: "Campus Talks & College Fest Fitness Jams",
      subtitle: "Guest judging, youth health talks, and university gym workshops",
      badge: "Authority & Local Influence",
      suitabilityScore: 65,
      whyItSuits:
        "Universities and youth cultural fests invite regional fitness influencers for youth wellness panels and athletic competitions, offering honorariums and high-credibility offline exposure.",
      estimatedPotential: "₹5,000 – ₹15,000 / event (Illustrative)",
      complexity: "Beginner",
      readinessStatus: "Scale Phase",
      launchChecklist: [
        "Reach out to college gym secretaries and cultural fest organizing committees in Bengaluru",
        "Prepare a 20-minute punchy presentation: 'Fitness Fundamentals for Academic High Performers'",
        "Record stage appearances for high-authority social proof reels",
      ],
      realisticCaveats:
        "Often offered initially in exchange for travel and exposure rather than heavy honorariums. Irregular event schedule tied to college fest seasons (Oct-March).",
      suggestedFirstStep: "Offer a free 30-min guest workshop at your local university gym society.",
    },
  ],
  priya: [
    {
      id: "consulting-advisory",
      category: "consulting_services",
      title: "1:1 Tech Professional Wealth & Equity Advisory",
      subtitle: "Paid deep-dive sessions on ESOP valuation, tax regime, and index portfolios",
      badge: "Core Revenue Engine",
      suitabilityScore: 98,
      whyItSuits:
        "Your LinkedIn audience comprises senior engineers and product managers earning ₹25L–₹70L+ annually who lack time to optimize their finances. They willingly pay ₹5,000 to ₹15,000 for 1:1 clarity from an ex-Deloitte strategist.",
      estimatedPotential: "₹60,000 – ₹100,000 / month (Illustrative)",
      complexity: "Intermediate",
      readinessStatus: "Ready to Launch",
      launchChecklist: [
        "Set up a dedicated Topmate / Calendly booking page with clear pre-session questionnaire",
        "Package a 60-min advisory call + bespoke 2-page summary PDF for ₹4,999 introductory pricing",
        "Publish 3 anonymized client case studies demonstrating tax savings achieved",
        "Add booking link to your LinkedIn Featured section and profile call-to-action button",
      ],
      realisticCaveats:
        "You must maintain strict compliance: operate as educational strategy and financial wellness coaching unless SEBI RIA registered. High calendar commitment per client.",
      suggestedFirstStep: "Pin a client testimonial carousel and open 5 strategy slots for this month.",
    },
    {
      id: "b2b-brand-collabs",
      category: "brand_collaborations",
      title: "FinTech & WealthTech Co-Branded Analysis",
      subtitle: "Sponsored in-depth analysis carousels and whitepapers with credible brokers & fintechs",
      badge: "High-Ticket B2B Rates",
      suitabilityScore: 92,
      whyItSuits:
        "Fintech brands (Zerodha, Wint Wealth, Smallcase) pay premium rates ($500–$1,000+ / ₹40k–₹80k per post) on LinkedIn because your 8,000 followers are high-intent affluent earners with high customer lifetime value (LTV).",
      estimatedPotential: "₹40,000 – ₹80,000 / month (Illustrative)",
      complexity: "Intermediate",
      readinessStatus: "Ready to Launch",
      launchChecklist: [
        "Curate a B2B media deck focusing on audience seniority (65% Senior/Lead Engineers & Tech Managers)",
        "Pitch Content Heads and Growth Leads at SEBI-regulated fintech platforms",
        "Offer structured deliverables: 1 deep-dive research PDF carousel + 1 thought leadership text post",
        "Require transparent brand disclosure in compliance with ASCI influencer guidelines",
      ],
      realisticCaveats:
        "Fintech partnerships require meticulous compliance and legal review. One inaccurate claim can jeopardize brand trust and your professional reputation.",
      suggestedFirstStep: "Pitch Wint Wealth and Zerodha Varsity with 2 specific educational article briefs.",
    },
    {
      id: "pr-corporate-speaking",
      category: "pr_speaking",
      title: "Corporate Financial Wellness Workshops",
      subtitle: "Paid 60-minute remote or onsite seminars for tech companies and startups",
      badge: "Enterprise Pipeline",
      suitabilityScore: 89,
      whyItSuits:
        "Tech startups and enterprises allocate HR wellness budgets for financial literacy sessions during tax planning quarters (Jan-March) to help employees understand RSUs and Form 16.",
      estimatedPotential: "₹25,000 – ₹50,000 / session (Illustrative)",
      complexity: "Intermediate",
      readinessStatus: "High Opportunity",
      launchChecklist: [
        "Draft a 1-page workshop syllabus: 'Demystifying RSUs, ESOPs & Tax Planning for Engineering Teams'",
        "Leverage your LinkedIn network to connect with VP HR and People Operations leaders",
        "Record a 2-minute speaker reel summarizing key takeaways",
        "Offer post-workshop Q&A office hours for attendees",
      ],
      realisticCaveats:
        "Enterprise procurement cycles can take 4-8 weeks to approve vendor payments. Corporate budgets peak right around Q3 and Q4 fiscal transitions.",
      suggestedFirstStep: "Message 10 HR Heads at mid-sized tech startups with your 1-page workshop syllabus.",
    },
    {
      id: "digital-products",
      category: "digital_products",
      title: "Automated Tech Wealth Notion Hub & Spreadsheets",
      subtitle: "Pre-built portfolio rebalancing sheet & ESOP tax calculator templates",
      badge: "Scalable Passive Assets",
      suitabilityScore: 84,
      whyItSuits:
        "Tech workers love structured Notion databases and automated Google Sheets. A bulletproof 'Tech Compensation & Portfolio Tracker' sells effortlessly for ₹999 to ₹1,499.",
      estimatedPotential: "₹20,000 – ₹40,000 / month (Illustrative)",
      complexity: "Beginner",
      readinessStatus: "High Opportunity",
      launchChecklist: [
        "Build an automated Google Sheet with Google Finance formulas for asset allocation and rebalancing",
        "Create a 5-minute video tutorial walking through setup and usage",
        "Host the template on Gumroad or Topmate with pay-what-you-want starting at ₹999",
        "Feature a free preview tab in your weekly newsletter",
      ],
      realisticCaveats:
        "Risk of unauthorized file sharing. Requires periodic formula updates when tax slabs or dividend rules change.",
      suggestedFirstStep: "Create a 3-minute video showing your personal wealth tracking sheet in action.",
    },
    {
      id: "affiliate-marketing",
      category: "affiliate_marketing",
      title: "Fintech Platform & Advisory Tool Referrals",
      subtitle: "Selective referral partnerships with registered wealth and tax filing tools",
      badge: "Secondary Stream",
      suitabilityScore: 72,
      whyItSuits:
        "Recommending tax filing software (e.g., ClearTax) or research platforms (e.g., Trendlyne, Tickertape) that you genuinely use adds incremental income.",
      estimatedPotential: "₹8,000 – ₹18,000 / month (Illustrative)",
      complexity: "Beginner",
      readinessStatus: "High Opportunity",
      launchChecklist: [
        "Audit products you already pay for to identify legitimate referral programs",
        "Provide in-depth unboxing or comparison articles rather than spamming referral links",
        "Include mandatory risk disclosures for financial instruments",
      ],
      realisticCaveats:
        "Never promote speculative instruments (crypto trading bots, binary options, unregulated P2P). Reputation loss in finance is irreversible.",
      suggestedFirstStep: "Integrate your favorite tax filing tool partner link into your upcoming tax comparison post.",
    },
  ],
};

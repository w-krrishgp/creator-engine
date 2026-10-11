import { MonetisationChannel } from "@/types/creator";

export const MOCK_MONETISATION_CHANNELS: Record<string, MonetisationChannel[]> = {
  rahul: [
    {
      id: "rahul-brand-collabs",
      category: "brand_collaborations",
      title: "Micro-Sponsorships & Dedicated Reels",
      subtitle: "Sponsored short-form integrations with fitness supplement and athletic apparel brands",
      badge: "Highest Inbound Demand",
      suitabilityScore: 94,
      suitabilityExplanation:
        "Highest commercial demand in Indian fitness; D2C brands actively deploy monthly micro-influencer budgets for creators with >4% engagement because student dorm setups deliver 3x higher trust than glossy studio shoots.",
      whyItSuits:
        "Your 15,000 Instagram followers have a focused demographic (college students, 18-24). D2C protein and healthy snack brands hunt for micro-creators with verified engagement because your audience trust is significantly higher than celebrity influencers.",
      prerequisites: [
        "Media Kit v1 featuring verified 4.8% engagement rate & 29.4k average post impressions",
        "Clear brief approval and revision agreement (max 1 creative revision to protect delivery time)",
        "Understanding of digital usage rights (30-day organic vs paid ad whitelisting)",
        "Strict adherence to ASCI influencer disclosure guidelines (#Ad or #Sponsored)",
      ],
      suggestedFirstStep:
        "Send customized pitch decks with 2 short-form video concept hooks to 5 D2C health snack brands that already sponsor fitness reels.",
      potentialRisks:
        "Brands pay on Net 30 to Net 60-day credit terms. Over-sponsoring feed posts risks audience fatigue and suppresses organic explore distribution by up to 35%.",
      estimatedPotential: "₹20,000 – ₹45,000 / month (Illustrative benchmark)",
      illustrativePriceRange: "₹12,000 – ₹18,000 per Reel + Story bundle",
      complexity: "Intermediate",
      readinessStatus: "Ready to Launch",
      launchChecklist: [
        "Compile demographic proof slides (82% male, 18-24, 78% tier-1/2 Indian cities)",
        "Set transparent rate card: ₹12,000 for 1x Reel, ₹18,000 for Reel + 3 Story frames bundle",
        "Draft professional outbound pitch template targeting brand marketing leads",
        "Establish revision boundaries and payment milestones (50% advance on brief approval)",
      ],
      realisticCaveats:
        "Sponsorship income fluctuates seasonally (surges in January New Year & summer fitness drives). Maintain strict editorial integrity so you never recommend products you wouldn't take yourself.",
    },
    {
      id: "rahul-affiliate-links",
      category: "affiliate_marketing",
      title: "Curated Supplement & Fitness Gear Links",
      subtitle: "Supplement discount codes, home workout gear, and pantry essential commissions",
      badge: "Immediate Passive Revenue",
      suitabilityScore: 88,
      suitabilityExplanation:
        "High organic buying intent on budget fitness recommendations; followers actively seek product recommendations in comments and DMs.",
      whyItSuits:
        "Followers constantly ask 'which protein powder is safe on a budget?' in your DMs. A curated coupon code provides an immediate, low-friction response while generating 10-15% commission per order.",
      prerequisites: [
        "Approved creator accounts on platforms (MyProtein, MuscleBlaze, Amazon Influencer)",
        "Organized link-in-bio storefront grouping student pantry essentials and gym accessories",
        "Clear statutory commission disclosures (#Affiliate or 'Earns commission at zero extra cost to you')",
      ],
      suggestedFirstStep:
        "Apply for 2 fitness brand affiliate programs and pin a categorized 'Supplements FAQ' Story Highlight.",
      potentialRisks:
        "Low commission percentage (8-15%) requires steady purchase volume. Promoting ineffective or spiked supplements destroys community trust permanently.",
      estimatedPotential: "₹8,000 – ₹18,000 / month (Illustrative benchmark)",
      illustrativePriceRange: "10% – 15% net commission on tracked cart checkouts",
      complexity: "Beginner",
      readinessStatus: "Ready to Launch",
      launchChecklist: [
        "Sign up for MyProtein / HealthKart affiliate portals with your creator handle",
        "Set up an organized Beacons or Linktree grouping supplements, resistance bands, and pantry staples",
        "Pin a 'Supplements FAQ' Story Highlight featuring your active discount code",
        "Always provide transparent disclosure (#Affiliate or commission notice)",
      ],
      realisticCaveats:
        "Requires consistent story reminders and swipe-up clicks. Passive income ramps gradually; you need repeat buyer retention rather than one-time hype.",
    },
    {
      id: "rahul-digital-products",
      category: "digital_products",
      title: "Low-Ticket Student Nutrition & Workout Blueprint",
      subtitle: "Downloadable PDF blueprints & Notion meal planning templates for hostel students",
      badge: "High Margin Scalability",
      suitabilityScore: 85,
      suitabilityExplanation:
        "95%+ profit margins with zero marginal delivery cost; perfect fit for price-sensitive students who cannot afford ongoing private trainers.",
      whyItSuits:
        "College students have limited disposable income for expensive personal trainers (₹3,000/mo), but will eagerly pay ₹299 to ₹499 for a proven 'Hostel Bulking Blueprint' tested in actual college messes.",
      prerequisites: [
        "Structured 25-page Canva/PDF guide with grocery shopping cheatsheets and dorm recipes",
        "Automated checkout and instant delivery link (via Cosmofeed, Topmate, or Gumroad)",
        "Free sample pages integrated into Instagram carousel slides to prove value",
      ],
      suggestedFirstStep:
        "Survey your Instagram Stories: 'Would you pay ₹299 for a complete hostel grocery & workout guide?' to validate initial pre-orders.",
      potentialRisks:
        "High initial creation effort. Digital products have zero organic discoverability without continuous promotional Reels.",
      estimatedPotential: "₹15,000 – ₹35,000 / month (Illustrative benchmark)",
      illustrativePriceRange: "₹299 – ₹499 one-time download price",
      complexity: "Intermediate",
      readinessStatus: "High Opportunity",
      launchChecklist: [
        "Package your 12 best budget recipes and a 3-day dumbbell split into a structured Canva/PDF guide",
        "Set up instant automated fulfillment on Gumroad, Instamojo, or Topmate",
        "Tease free sample pages in your carousel slides to validate demand",
        "Offer 100% money-back satisfaction guarantee to eliminate buyer hesitation",
      ],
      realisticCaveats:
        "Requires ongoing traffic generation via organic content. Protect against unauthorized PDF sharing by providing Notion access or watermarking.",
    },
    {
      id: "rahul-consulting-coaching",
      category: "consulting_services",
      title: "1:1 Online Hostel Fitness & Form Coaching",
      subtitle: "Personalized WhatsApp workout monitoring and weekly form audits for student beginners",
      badge: "High Touch / High Value",
      suitabilityScore: 74,
      suitabilityExplanation:
        "High per-client revenue (₹2,500/mo), but limited scalability because it trades personal hours directly for income during exams.",
      whyItSuits:
        "A small segment of your audience wants direct personal accountability. Capping coaching to 5-8 clients provides predictable recurring income without conflicting with your college classes.",
      prerequisites: [
        "6-week progressive overload split template tailored to hostel equipment",
        "Client intake form screening for medical history, past injuries, and dietary constraints",
        "Exercise liability waiver and basic fitness coaching credentials",
      ],
      suggestedFirstStep:
        "Open 3 beta coaching spots at a 50% discount to your most active broadcast channel members to test delivery workflow.",
      potentialRisks:
        "Directly trades your time for money. Client churn is high if habits aren't reinforced daily. Requires strict boundaries on WhatsApp messaging hours.",
      estimatedPotential: "₹15,000 – ₹25,000 / month (Illustrative benchmark)",
      illustrativePriceRange: "₹2,500 – ₹3,500 / month per client (capped at 8 clients)",
      complexity: "Advanced",
      readinessStatus: "High Opportunity",
      launchChecklist: [
        "Design a 6-week progressive overload split template tailored to hostel equipment",
        "Set up client intake Google Form to screen for medical history and training goals",
        "Price at ₹2,500/month per client for weekly video form check and habit tracking",
        "Cap intake at 8 clients max to prevent service quality decline",
      ],
      realisticCaveats:
        "Client churn is high if expectations aren't managed early. Requires liability disclaimer and exercise certification strongly recommended.",
    },
    {
      id: "rahul-pr-speaking",
      category: "pr_speaking",
      title: "Campus Talks & College Fest Fitness Jams",
      subtitle: "Guest judging, youth health talks, and university gym workshops",
      badge: "Local Authority",
      suitabilityScore: 68,
      suitabilityExplanation:
        "Exceptional local brand authority and high-trust social proof reels, but irregular seasonal income tied to college festival calendars.",
      whyItSuits:
        "Universities and youth cultural fests invite regional fitness creators for youth wellness panels and athletic competitions, offering honorariums and high-credibility offline exposure.",
      prerequisites: [
        "20-minute structured presentation: 'Fitness Fundamentals for Academic High Performers'",
        "Speaker one-pager with audience reach metrics, past event photos, and workshop topics",
        "High-energy stage presence and crowd engagement skills",
      ],
      suggestedFirstStep:
        "Reach out to college gym secretaries and youth festival organizing committees across Bengaluru with a guest workshop proposal.",
      potentialRisks:
        "Student organizing committees frequently propose unpaid 'exposure'. Events cluster heavily between October and March.",
      estimatedPotential: "₹5,000 – ₹15,000 / event appearance (Illustrative honorarium)",
      illustrativePriceRange: "₹5,000 – ₹15,000 per 45-minute interactive campus session",
      complexity: "Beginner",
      readinessStatus: "Scale Phase",
      launchChecklist: [
        "Reach out to college gym secretaries and cultural fest organizing committees in Bengaluru",
        "Prepare a 20-minute punchy presentation: 'Fitness Fundamentals for Academic High Performers'",
        "Record stage appearances for high-authority social proof reels",
      ],
      realisticCaveats:
        "Often offered initially in exchange for travel and exposure rather than heavy honorariums. Irregular event schedule tied to college fest seasons.",
    },
  ],

  priya: [
    {
      id: "priya-consulting-advisory",
      category: "consulting_services",
      title: "1:1 Tech Professional Wealth & Equity Advisory",
      subtitle: "Paid deep-dive sessions on ESOP valuation, tax regime optimization, and index portfolios",
      badge: "Core Revenue Engine",
      suitabilityScore: 98,
      suitabilityExplanation:
        "Highest revenue efficiency and conversion rate for Priya's specific audience demographic; corporate tech workers readily pay for quantitative financial clarity from an ex-Deloitte analyst.",
      whyItSuits:
        "Your LinkedIn audience comprises senior engineers and product managers earning ₹25L–₹70L+ annually who lack time to optimize their finances. They willingly pay ₹5,000 to ₹15,000 for 1:1 clarity from an ex-Deloitte strategist.",
      prerequisites: [
        "Pre-session intake questionnaire vetting client salary, ESOP vesting, and tax regime status",
        "Standardized 2-page deliverable memo: Personal Wealth Architecture & Tax Optimization Blueprint",
        "Clear legal boundary operating as educational financial coaching unless SEBI RIA registered",
      ],
      suggestedFirstStep:
        "Publish an anonymized client case study showing a ₹1.8 Lakh tax saving and open 5 strategy slots on Topmate.",
      potentialRisks:
        "Time commitment scales linearly with clients. Strict compliance required to avoid providing individualized stock-picking advice without an RIA license.",
      estimatedPotential: "₹60,000 – ₹100,000 / month (Illustrative benchmark)",
      illustrativePriceRange: "₹4,999 – ₹12,000 per 60-min private advisory deep dive",
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
    },
    {
      id: "priya-b2b-brand-collabs",
      category: "brand_collaborations",
      title: "FinTech & WealthTech Co-Branded Analysis",
      subtitle: "Sponsored in-depth analysis carousels and whitepapers with credible brokers & fintechs",
      badge: "High-Ticket B2B Rates",
      suitabilityScore: 92,
      suitabilityExplanation:
        "B2B tech and finance CPMs are among the highest across social platforms; micro creators with corporate credentials command enterprise rates.",
      whyItSuits:
        "Fintech brands (Zerodha, Wint Wealth, Smallcase) pay premium rates ($500–$1,000+ / ₹40k–₹80k per post) on LinkedIn because your 8,000 followers are high-intent affluent earners with high customer lifetime value (LTV).",
      prerequisites: [
        "Corporate media deck focusing on audience seniority (65% Senior/Lead Engineers & Tech Managers)",
        "Understanding of SEBI regulations on investment product promotion and ASCI guidelines",
        "Proven ability to produce rigorous, research-backed PDF carousels rather than superficial promotional copy",
      ],
      suggestedFirstStep:
        "Pitch Growth Leads at 3 SEBI-regulated fintech platforms with 2 specific educational co-authored briefs.",
      potentialRisks:
        "Meticulous legal and compliance review cycles (3-4 weeks). Promoting flawed or predatory financial products carries severe, irreversible reputation damage.",
      estimatedPotential: "₹40,000 – ₹80,000 / month (Illustrative benchmark)",
      illustrativePriceRange: "₹35,000 – ₹70,000 per sponsored research carousel",
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
    },
    {
      id: "priya-pr-corporate-speaking",
      category: "pr_speaking",
      title: "Corporate Financial Wellness Workshops",
      subtitle: "Paid 60-minute remote or onsite seminars for tech companies and startups",
      badge: "Enterprise Pipeline",
      suitabilityScore: 90,
      suitabilityExplanation:
        "High revenue per session (₹25k–₹50k) with high conversion into individual executive consulting clients; directly funded by corporate HR L&D budgets.",
      whyItSuits:
        "Tech startups and enterprises allocate HR wellness budgets for financial literacy sessions during tax planning quarters (Jan-March) to help employees understand RSUs and Form 16.",
      prerequisites: [
        "1-page corporate workshop proposal: 'Demystifying RSUs, ESOPs & Tax Planning for Engineering Teams'",
        "Direct outreach to VP HR and People Operations leaders across your LinkedIn network",
        "Structured 45-minute slide deck with live anonymous Q&A",
      ],
      suggestedFirstStep:
        "Direct message 10 HR Heads at mid-sized tech startups with your 1-page workshop syllabus.",
      potentialRisks:
        "Enterprise procurement cycles can take 4-8 weeks to approve vendor payments. Corporate budgets peak right around Q3 and Q4 fiscal transitions.",
      estimatedPotential: "₹25,000 – ₹50,000 / session (Illustrative benchmark)",
      illustrativePriceRange: "₹25,000 – ₹50,000 per 60-min corporate keynote workshop",
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
    },
    {
      id: "priya-digital-products",
      category: "digital_products",
      title: "Automated Tech Wealth Notion Hub & Spreadsheets",
      subtitle: "Pre-built portfolio rebalancing sheet & ESOP tax calculator templates",
      badge: "Scalable Passive Assets",
      suitabilityScore: 86,
      suitabilityExplanation:
        "Zero marginal cost of reproduction and high perceived utility among analytical engineers who love structured databases.",
      whyItSuits:
        "Tech workers love structured Notion databases and automated Google Sheets. A bulletproof 'Tech Compensation & Portfolio Tracker' sells effortlessly for ₹999 to ₹1,499.",
      prerequisites: [
        "Automated Google Sheet with Google Finance formulas for asset allocation and rebalancing",
        "5-minute video tutorial walking through setup and tax slab configuration",
        "Fulfillment via Topmate or Gumroad with pay-what-you-want starting at ₹999",
      ],
      suggestedFirstStep:
        "Record a 2-minute LinkedIn video showing your personal wealth tracking sheet in action with a waitlist link.",
      potentialRisks:
        "Risk of unauthorized file sharing. Requires periodic formula updates when tax slabs or dividend taxation rules change in the annual budget.",
      estimatedPotential: "₹20,000 – ₹40,000 / month (Illustrative benchmark)",
      illustrativePriceRange: "₹999 – ₹1,499 per template license",
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
    },
    {
      id: "priya-affiliate-marketing",
      category: "affiliate_marketing",
      title: "Fintech Platform & Advisory Tool Referrals",
      subtitle: "Selective referral partnerships with registered wealth and tax filing tools",
      badge: "Secondary Stream",
      suitabilityScore: 72,
      suitabilityExplanation:
        "Solid secondary income stream; highly effective when recommending tools you personally use for your own portfolio.",
      whyItSuits:
        "Recommending tax filing software (e.g., ClearTax) or research platforms (e.g., Trendlyne, Tickertape) that you genuinely use adds incremental income without client management overhead.",
      prerequisites: [
        "Audit products you already pay for to identify legitimate referral programs",
        "In-depth unboxing or comparison articles rather than spamming referral links",
        "Mandatory risk disclosures for financial instruments",
      ],
      suggestedFirstStep:
        "Publish a tax filing software comparison article featuring your verified partner referral link.",
      potentialRisks:
        "Never promote speculative instruments (crypto trading bots, binary options, unregulated P2P). Reputation loss in finance is irreversible.",
      estimatedPotential: "₹8,000 – ₹18,000 / month (Illustrative benchmark)",
      illustrativePriceRange: "₹500 – ₹1,500 per qualified signup referral",
      complexity: "Beginner",
      readinessStatus: "High Opportunity",
      launchChecklist: [
        "Audit products you already pay for to identify legitimate referral programs",
        "Provide in-depth unboxing or comparison articles rather than spamming referral links",
        "Include mandatory risk disclosures for financial instruments",
      ],
      realisticCaveats:
        "Never promote speculative instruments (crypto trading bots, binary options, unregulated P2P). Reputation loss in finance is irreversible.",
    },
  ],
};

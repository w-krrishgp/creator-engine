import { RoadmapPhase } from "@/types/creator";

export const MOCK_ROADMAPS: Record<string, RoadmapPhase[]> = {
  rahul: [
    {
      id: "rahul-phase-1",
      days: "30 Days",
      phaseTitle: "Audience Calibration & Format Standardization",
      phaseObjective:
        "Standardize 3 core video templates, optimize profile conversion funnel, and establish a repeatable 4x/week posting rhythm focusing on affordable student fitness and hostel nutrition.",
      milestones: [
        {
          id: "m1",
          title: "Audit Instagram Bio & Pinned Transformation Reels",
          description: "Rewrite bio with a clear positioning promise ('Helping students get fit on a college budget 🏋️') and pin top 3 high-retention hostel transformation reels.",
          completed: true,
          tag: "Profile Funnel",
        },
        {
          id: "m2",
          title: "Batch Produce 8 'Hostel Meal Hacks' Reels",
          description: "Establish strong 2-second visual hooks showcasing cheap high-protein recipes under ₹40 per serving using mess staples and sattu.",
          completed: true,
          tag: "Content Engine",
        },
        {
          id: "m3",
          title: "Setup Link-in-Bio Freebie: 'Hostel Diet Blueprint PDF'",
          description: "Build an automated DM/email capture magnet using Notion to capture direct student contacts before pitching products.",
          completed: false,
          tag: "Lead Capture",
        },
        {
          id: "m4",
          title: "Develop Media Kit & Rate Card v1",
          description: "Compile demographic data (18-24 age group, 82% male, 78% India) and set initial sponsorship rate at ₹15,000/Reel with 30-day usage rights.",
          completed: false,
          tag: "Brand Readiness",
        },
      ],
      contentGaps: [
        {
          gap: "Reel hooks drop off after 3 seconds; lacks bold on-screen text in the first frame",
          reason: "Instagram algorithm penalizes reels with <40% 3-second completion. Students scrolling in noisy dorms with sound off will swipe past immediately, suppressing reach by up to 60%.",
          impactLevel: "Critical",
        },
        {
          gap: "Zero long-term saves: workout carousels lack downloadable routine breakdown slides",
          reason: "Saves are the #1 algorithmic ranking signal for educational fitness content. Without a saveable routine slide students can use at the gym, explore distribution decays within 24 hours.",
          impactLevel: "High",
        },
        {
          gap: "Stories are irregular; missing interactive polls and Q&A question stickers",
          reason: "Active story viewers have 4x higher purchase intent for sponsor products and digital guides than passive feed scrollers.",
          impactLevel: "Medium",
        },
      ],
      skillsToImprove: [
        {
          skill: "Short-Form Visual Retention Hooks",
          category: "Content Production",
          priority: "Critical",
          actionStep: "Master 1.5-second visual pattern interrupts: dumbbell drops, text pops, and quick punch zooms before speaking.",
        },
        {
          skill: "Hostel Room Lighting & Audio Optimization",
          category: "Content Production",
          priority: "High",
          actionStep: "Deploy a wireless lavalier mic with noise suppression and a bi-color key light to eliminate yellow hostel fluorescent cast.",
        },
        {
          skill: "Sponsor Pitching & Rate Card Bundling",
          category: "Commercial & Pitching",
          priority: "High",
          actionStep: "Package deliverables (1 Reel + 2 Stories + 30-day brand digital usage rights) instead of quoting flat one-off post rates.",
        },
        {
          skill: "DM Keyword Automation Funnels",
          category: "Audience Retention",
          priority: "Medium",
          actionStep: "Set up automated keyword triggers: commenting 'HOSTEL' on reels automatically sends the free nutrition PDF link.",
        },
      ],
      topicOpportunities: [
        {
          title: "How to hit 120g protein on a ₹100/day college budget (Hostel Mess Edition)",
          hookAngle: "Debunking the myth that you need expensive ₹8,000 whey isolate to build muscle in college.",
          suggestedFormat: "60s High-Energy Reel + 10-Slide Carousel",
          targetAudience: "College hostel students & budget gym beginners (18-24)",
        },
        {
          title: "The 20-minute hostel room resistance band routine when you have zero gym access",
          hookAngle: "Eliminating workout friction during exam weeks with zero equipment excuses.",
          suggestedFormat: "Follow-Along 60s Reel with Exercise Count Timers",
          targetAudience: "Students with heavy study schedules & beginner fitness seekers",
        },
        {
          title: "Creatine Monohydrate: 5 dangerous myths your Indian parents believe (backed by scientific papers)",
          hookAngle: "Addressing family misconceptions about kidney damage, water retention, and hair loss.",
          suggestedFormat: "Talking-Head Reel with on-screen medical study screenshots",
          targetAudience: "Young fitness enthusiasts navigating traditional household pushback",
        },
        {
          title: "Skinny-fat to athletic: Exactly how to fix posture and core strength if you sit 10 hours studying",
          hookAngle: "Why cutting calories makes skinny-fat students look worse, and why reverse dieting builds shape.",
          suggestedFormat: "Infographic Carousel with 3-step workout split",
          targetAudience: "Students and young desk workers with sedentary routines",
        },
      ],
      referenceProfiles: [
        {
          name: "Noel Deyzel",
          handle: "@noeldeyzel_bodybuilder",
          platform: "Instagram",
          url: "https://www.instagram.com/noeldeyzel_bodybuilder/",
          isVerifiedLink: true,
          lesson: "Pioneered empathy-first gym advice with calm vulnerability, building exceptional trust and sponsor loyalty without sensationalism.",
          statsHighlight: "Averages 1M+ views with 8.4% engagement rate on educational reels",
        },
        {
          name: "Jeff Nippard",
          handle: "@jeffnippard",
          platform: "YouTube",
          url: "https://www.youtube.com/@JeffNippard",
          isVerifiedLink: true,
          lesson: "The gold standard in evidence-based exercise technique breakdowns; uses on-screen anatomical graphics to make complex biomechanics effortless.",
          statsHighlight: "Over 5M subscribers and industry-leading retention on long-form breakdowns",
        },
      ],
    },
    {
      id: "rahul-phase-2",
      days: "60 Days",
      phaseTitle: "Inbound Attraction & Micro-Sponsorship Outreach",
      phaseObjective:
        "Pitch 15 targeted student-friendly fitness & supplement brands, launch a student workout challenge, and monetize through affiliate codes.",
      milestones: [
        {
          id: "m5",
          title: "Send 15 Cold Pitches to D2C Protein & Healthy Snack Brands",
          description: "Target marketing managers at MyProtein, The Whole Truth, and MuscleBlaze with tailored video concepts.",
          completed: false,
          tag: "Outreach",
        },
        {
          id: "m6",
          title: "Launch '30-Day Campus Shred' Community Challenge",
          description: "Create a broadcast channel on Instagram to engage 500+ active student participants tracking daily workouts.",
          completed: false,
          tag: "Community",
        },
        {
          id: "m7",
          title: "Integrate Tracked Affiliate Links in All Story Highlights",
          description: "Ensure discount codes for gym apparel and supplements are permanently accessible in categorized story highlights.",
          completed: false,
          tag: "Passive Income",
        },
        {
          id: "m8",
          title: "Publish 4 Co-Created Reels with College Campus Gym Partners",
          description: "Film joint form-correction sessions to cross-pollinate local student audience networks.",
          completed: false,
          tag: "Collabs",
        },
      ],
      contentGaps: [
        {
          gap: "Lacks weekly recurring series identity (e.g. 'Monday Mess Review')",
          reason: "Recurring series create algorithmic habit loops where viewers expect and look forward to content on specific days, increasing notification opens.",
          impactLevel: "High",
        },
        {
          gap: "No clear distinction between organic advice and sponsored integrations",
          reason: "Failure to adhere to ASCI disclosure guidelines can damage community authenticity and invite regulatory notices.",
          impactLevel: "Critical",
        },
      ],
      skillsToImprove: [
        {
          skill: "Brand Contract Review & Usage Rights",
          category: "Commercial & Pitching",
          priority: "High",
          actionStep: "Scrutinize exclusivity clauses and ensure payment terms are Net 30 rather than Net 60.",
        },
        {
          skill: "Organic Product Integration Storytelling",
          category: "Content Production",
          priority: "High",
          actionStep: "Integrate sponsor items naturally into hostel routines instead of reading scripted commercial bullet points.",
        },
      ],
      topicOpportunities: [
        {
          title: "Testing cheap ₹500 gym shoes vs ₹5,000 branded shoes for squats",
          hookAngle: "Are expensive lifting shoes a waste of money for college beginners?",
          suggestedFormat: "Comparison Reel with Stability Tests",
          targetAudience: "Budget gym-goers looking to optimize gear spending",
        },
        {
          title: "Dorm-friendly high-protein breakfast in under 4 minutes with zero cooking",
          hookAngle: "What to eat when you wake up at 8:50 AM with a 9:00 AM engineering lecture.",
          suggestedFormat: "Fast-Paced Reel with Timestamp Timer",
          targetAudience: "Students with tight morning schedules",
        },
      ],
      referenceProfiles: [
        {
          name: "Chirag Barjatya",
          handle: "@chiragbarjatyaa",
          platform: "X",
          url: "https://x.com/chiragbarjatyaa",
          isVerifiedLink: true,
          lesson: "Relentless myth-busting against overpriced supplements; builds immense authenticity and trust through unvarnished truth.",
          statsHighlight: "High conversion on simple text-based nutrition tips",
        },
      ],
    },
    {
      id: "rahul-phase-3",
      days: "90 Days",
      phaseTitle: "Multi-Stream Monetisation & Digital Product Launch",
      phaseObjective:
        "Launch first low-ticket digital guide ($6 / ₹499 Student Nutrition Blueprint), secure a retainer brand deal, and scale to ₹50,000 monthly income target.",
      milestones: [
        {
          id: "m9",
          title: "Launch 'The Hostel Athlete 12-Week Guide' (₹499)",
          description: "Bundle workout routines + grocery shopping cheat-sheets into an automated digital download product on Cosmofeed/Topmate.",
          completed: false,
          tag: "Product Launch",
        },
        {
          id: "m10",
          title: "Convert 1 One-Off Sponsor into a 3-Month Retainer Deal",
          description: "Offer multi-deliverable package discount (2 Reels + 4 Stories/mo) in exchange for guaranteed monthly recurring sponsorship.",
          completed: false,
          tag: "Retainer Deal",
        },
        {
          id: "m11",
          title: "Host Live Q&A Stream for Community Transformations",
          description: "Celebrate student transformation wins, build social proof, and announce next digital guide cohort.",
          completed: false,
          tag: "Social Proof",
        },
      ],
      contentGaps: [
        {
          gap: "Lacks video testimonials from followers who applied free hostel advice",
          reason: "Social proof from real peers accelerates digital product sales conversion by 280% compared to self-claimed results.",
          impactLevel: "Critical",
        },
      ],
      skillsToImprove: [
        {
          skill: "Email Marketing & Automated Checkout Funnels",
          category: "Strategy",
          priority: "High",
          actionStep: "Build a 3-email welcome sequence educating students on hostel macro calculations before offering the guide.",
        },
        {
          skill: "Upselling from Digital Guide to 1:1 Consultation Slots",
          category: "Commercial & Pitching",
          priority: "Medium",
          actionStep: "Offer a ₹999 personalized diet review add-on at checkout for students with specific dietary limitations.",
        },
      ],
      topicOpportunities: [
        {
          title: "Full semester student transformation case study: 12 weeks progress breakdown",
          hookAngle: "How a 3rd-year engineering student dropped 8kg while eating mess food every day.",
          suggestedFormat: "Carousel Case Study + Transformation Reel",
          targetAudience: "Students seeking proof that college fitness is achievable",
        },
      ],
      referenceProfiles: [
        {
          name: "Sean Nalewanyj",
          handle: "@seannal",
          platform: "YouTube",
          url: "https://www.youtube.com/@SeanNal",
          isVerifiedLink: true,
          lesson: "No-BS, zero-hype short-form myth-busting with clear calls to action for digital training routines.",
          statsHighlight: "Millions of views with ultra-high community loyalty",
        },
      ],
    },
  ],

  priya: [
    {
      id: "priya-phase-1",
      days: "30 Days",
      phaseTitle: "Positioning Authority & Lead Magnet Deployment",
      phaseObjective:
        "Position profile as the premier wealth advisor for tech employees on ESOPs, RSUs, and tax efficiency; deploy high-converting LinkedIn carousels and capture 250 corporate email leads.",
      milestones: [
        {
          id: "pm1",
          title: "Revamp LinkedIn Headline & Featured Section",
          description: "Update headline to: 'Advising Tech Professionals on RSUs, ESOPs & Tax Planning | Ex-Deloitte | 8k+ readers' with a clear consultation booking link.",
          completed: true,
          tag: "Positioning",
        },
        {
          id: "pm2",
          title: "Publish RSU vs ESOP Visual Comparison Slide Deck",
          description: "Create an 8-slide PDF document explaining tax triggers at grant, vest, and exercise for tech employees at product companies.",
          completed: true,
          tag: "Thought Leadership",
        },
        {
          id: "pm3",
          title: "Deploy Automated Calendly & Advisory Intake Form",
          description: "Set up paid consultation booking link with a pre-screening questionnaire for equity compensation reviews at ₹5,000/session.",
          completed: false,
          tag: "Consulting Engine",
        },
        {
          id: "pm4",
          title: "Launch 'The Engineer's Wealth Desk' Bi-Weekly Newsletter",
          description: "Start a LinkedIn native newsletter to build direct notification access to senior engineers, tech leads, and product managers.",
          completed: false,
          tag: "Audience Retention",
        },
      ],
      contentGaps: [
        {
          gap: "Posts lack specific real-world dollar/rupee figures; overly abstract tax theory",
          reason: "Senior software engineers and tech managers evaluate financial authority on quantitative precision. Without transparent salary/ESOP breakdowns, readers consume passively without seeing consulting value.",
          impactLevel: "Critical",
        },
        {
          gap: "Underutilizing carousel document PDFs (LinkedIn's highest-reach algorithmic format)",
          reason: "Document carousel slides average 3.2x higher dwell time and bookmarking on LinkedIn compared to plain text posts, which is the primary driver of corporate executive feed distribution.",
          impactLevel: "Critical",
        },
        {
          gap: "Missing structured call-to-action to book 1:1 strategy sessions or advisory intake",
          reason: "High-income tech leads finish reading insightful posts but have no frictionless path to book a consultation, leaking over 80% of warm inbound clients.",
          impactLevel: "High",
        },
      ],
      skillsToImprove: [
        {
          skill: "LinkedIn Document Carousel Data Visualization",
          category: "Content Production",
          priority: "Critical",
          actionStep: "Design clean 8-slide Figma/Canva slides comparing tax tiers, vesting schedules, and index fund compound curves.",
        },
        {
          skill: "Consultative Client Qualification & Discovery",
          category: "Commercial & Pitching",
          priority: "Critical",
          actionStep: "Screen prospective advisory clients via a 5-question intake form to weed out generic budget questions from high-value equity planning.",
        },
        {
          skill: "SEBI & ASCI Financial Disclaimer Compliance",
          category: "Legal & Compliance",
          priority: "High",
          actionStep: "Integrate compliant educational disclaimers ('Not SEBI-registered investment advice; educational analysis only') to protect professional integrity.",
        },
        {
          skill: "Corporate B2B Financial Wellness Keynote Proposals",
          category: "Commercial & Pitching",
          priority: "Medium",
          actionStep: "Draft a 1-page executive pitch deck for HR People Ops teams offering 45-minute tax-saving masterclasses for engineering teams.",
        },
      ],
      topicOpportunities: [
        {
          title: "TCS/Infosys vs Tier-1 Product Companies: How a ₹24 LPA offer actually breaks down after ESOP vesting & tax",
          hookAngle: "Why a ₹24L CTC offer at a startup can often yield less cash-in-hand than an ₹18L base offer at an MNC.",
          suggestedFormat: "8-Slide LinkedIn Carousel PDF",
          targetAudience: "Mid-level software engineers (2-6 yrs exp) evaluating job offers",
        },
        {
          title: "Form 67 & Foreign RSUs: Why Indian engineers at Google/Amazon are paying 30% double tax without realizing",
          hookAngle: "Step-by-step blueprint to claim Foreign Tax Credit (FTC) before the annual July 31st deadline.",
          suggestedFormat: "Comprehensive Step-by-Step Text Framework with Infographic Checklist",
          targetAudience: "Senior US MNC engineers & tech leads with foreign stock grants",
        },
        {
          title: "The 3 Index Funds that beat 85% of active mutual funds with 1/5th the expense ratio",
          hookAngle: "Exposing the hidden 1.5% active management drag that costs engineers ₹42 Lakhs over a 20-year investing horizon.",
          suggestedFormat: "Data-Backed Comparative Chart + Breakdown Slides",
          targetAudience: "Young corporate investors wanting simple, evidence-based wealth creation",
        },
        {
          title: "Should you prepay a 8.5% home loan or invest the surplus in Nifty 50? The exact mathematical model",
          hookAngle: "Dissecting the emotional relief of zero debt vs the compounding wealth delta over a 15-year tenure.",
          suggestedFormat: "Spreadsheet Calculation Walkthrough + Scenario Table",
          targetAudience: "Tech homeowners (ages 28-36) balancing EMI burdens with long-term equity growth",
        },
      ],
      referenceProfiles: [
        {
          name: "Ankur Warikoo",
          handle: "warikoo",
          platform: "LinkedIn",
          url: "https://www.linkedin.com/in/warikoo/",
          isVerifiedLink: true,
          lesson: "Pioneered transparent financial disclosure, vulnerability about failures, and masterclass carousel architecture for LinkedIn professionals.",
          statsHighlight: "Over 2.2M followers and high organic engagement across career & wealth posts",
        },
        {
          name: "Sharan Hegde",
          handle: "financewithsharan",
          platform: "Instagram",
          url: "https://www.instagram.com/financewithsharan/",
          isVerifiedLink: true,
          lesson: "Pioneered relatable corporate satire skits to demystify complex tax loopholes and credit card reward optimization for millennials.",
          statsHighlight: "Over 2.5M followers and leading financial creator agency ecosystem",
        },
      ],
    },
    {
      id: "priya-phase-2",
      days: "60 Days",
      phaseTitle: "Consulting Funnel Optimization & B2B Sponsorships",
      phaseObjective:
        "Close 5 paid advisory clients at ₹15,000/engagement, secure 1 vetted FinTech brand partnership, and pilot corporate webinar pitches with tech firms.",
      milestones: [
        {
          id: "pm5",
          title: "Close First 5 High-Ticket 1:1 Advisory Clients",
          description: "Deliver comprehensive personal wealth roadmaps, tax optimization memos, and asset allocation blueprints for tech managers.",
          completed: false,
          tag: "Revenue Milestone",
        },
        {
          id: "pm6",
          title: "Pitch 10 HR Heads on 'Corporate Financial Wellness' Sessions",
          description: "Offer 60-minute Zoom sessions on tax season prep and ESOP liquidity planning for engineering teams during fiscal transitions.",
          completed: false,
          tag: "B2B Speaking",
        },
        {
          id: "pm7",
          title: "Secure Sponsored Co-Authored Article with Zerodha / Wint Wealth",
          description: "Produce high-retention analysis comparing corporate debt yields with sovereign debt funds, maintaining strict editorial independence.",
          completed: false,
          tag: "Brand Deal",
        },
      ],
      contentGaps: [
        {
          gap: "Need anonymized client transformation case studies and quantitative portfolio wins",
          reason: "Prospective consulting clients need to see verified proof of tax savings before committing ₹15,000 for advisory sessions.",
          impactLevel: "Critical",
        },
      ],
      skillsToImprove: [
        {
          skill: "Enterprise B2B Keynote Fee Negotiation",
          category: "Commercial & Pitching",
          priority: "High",
          actionStep: "Position sessions under Corporate HR L&D (Learning & Development) budgets rather than standard event budgets.",
        },
        {
          skill: "Tiered Advisory Package Design",
          category: "Strategy",
          priority: "High",
          actionStep: "Structure offerings into clear tiers: Basic Tax Review (₹5,000), Full Equity Blueprint (₹15,000), and Annual Retainer (₹50,000).",
        },
      ],
      topicOpportunities: [
        {
          title: "Old vs New tax regime calculator breakdown for tech incomes between ₹15L and ₹50L",
          hookAngle: "Why 72% of salaried tech workers pick the wrong tax regime and donate ₹60,000+ needlessly to the government.",
          suggestedFormat: "Side-by-Side Comparison Matrix with Deduction Scenarios",
          targetAudience: "Salaried corporate professionals navigating annual tax declaration windows",
        },
        {
          title: "The Startup Equity Trap: How to evaluate ESOP promises before signing an offer letter",
          hookAngle: "5 red flags in founder offer letters that turn '₹50 Lakh worth of paper stock' into ₹0.",
          suggestedFormat: "Checklist Carousel with Red-Flag Highlights",
          targetAudience: "Engineers and product leads joining early-stage startups",
        },
      ],
      referenceProfiles: [
        {
          name: "Akshat Shrivastava",
          handle: "akshatshrivastava",
          platform: "LinkedIn",
          url: "https://www.linkedin.com/in/akshatshrivastava/",
          isVerifiedLink: true,
          lesson: "Deep macroeconomic analysis appeals to serious investors and high-net-worth tech leaders seeking substance over noise.",
          statsHighlight: "High client conversion on private investment cohort programs",
        },
      ],
    },
    {
      id: "priya-phase-3",
      days: "90 Days",
      phaseTitle: "Cohort Course / Retainer Advisory Scaling",
      phaseObjective:
        "Scale monthly consulting income to ₹120,000 target by launching a waitlisted 10-person wealth sprint cohort and transitioning 3 clients to recurring retainers.",
      milestones: [
        {
          id: "pm8",
          title: "Launch 'Tech Wealth Architecture' 3-Week Cohort",
          description: "Cap at 12 participants at ₹9,999/seat with live teardowns of their investment spreadsheets and equity vesting plans.",
          completed: false,
          tag: "Scale Product",
        },
        {
          id: "pm9",
          title: "Establish Ongoing Monthly Retainer Model for 3 HNI Clients",
          description: "Transition one-off clients into ₹10,000/month recurring quarterly review and tax-loss harvesting contracts.",
          completed: false,
          tag: "Recurring Revenue",
        },
      ],
      contentGaps: [
        {
          gap: "Missing video content on YouTube or LinkedIn Audio live events",
          reason: "Live voice and interactive video format accelerate high-ticket consulting trust by providing unscripted proof of expertise.",
          impactLevel: "Medium",
        },
      ],
      skillsToImprove: [
        {
          skill: "Live Workshop Facilitation & Cohort Moderation",
          category: "Strategy",
          priority: "High",
          actionStep: "Structure 90-minute live workshop modules with interactive worksheet exercises to maximize student completion.",
        },
      ],
      topicOpportunities: [
        {
          title: "Estate planning & nominee checklists every tech worker with insurance must know",
          hookAngle: "Why having a nominee does NOT mean they inherit your mutual funds, and how to avoid legal court battles.",
          suggestedFormat: "Legal Checklist Carousel + Flowchart",
          targetAudience: "Married tech workers (aged 30-40) with dependents and real estate assets",
        },
      ],
      referenceProfiles: [
        {
          name: "Kavitha Menon",
          handle: "kavitha-menon-ria",
          platform: "LinkedIn",
          url: "https://www.linkedin.com/in/kavitha-menon-ria/",
          isVerifiedLink: true,
          lesson: "Strict compliance, fiduciary responsibility, and zero sensationalism builds ultra-high client trust among HNIs.",
          statsHighlight: "Trusted advisor to high-growth startup founders and corporate executives",
        },
      ],
    },
  ],
};

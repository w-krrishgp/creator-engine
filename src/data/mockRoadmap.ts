import { RoadmapPhase } from "@/types/creator";

export const MOCK_ROADMAPS: Record<string, RoadmapPhase[]> = {
  rahul: [
    {
      id: "rahul-phase-1",
      days: "30 Days",
      phaseTitle: "Audience Calibration & Format Standardization",
      phaseObjective:
        "Standardize 3 core video templates, optimize profile conversion funnel, and establish a repeatable 4x/week posting rhythm.",
      milestones: [
        {
          id: "m1",
          title: "Audit Instagram Bio & Pinned Reels",
          description: "Rewrite bio with a clear promise ('Dorm room fitness for students') and pin top 3 high-retention transformation reels.",
          completed: true,
          tag: "Profile Funnel",
        },
        {
          id: "m2",
          title: "Batch Produce 8 'Hostel Meal Hacks' Reels",
          description: "Establish strong 2-second visual hooks showcasing cheap high-protein recipes under ₹40 per serving.",
          completed: true,
          tag: "Content Engine",
        },
        {
          id: "m3",
          title: "Setup Link-in-Bio Freebie: 'Hostel Diet Blueprint PDF'",
          description: "Build an email/DM capture magnet using StanStore or Notion to start capturing direct community contacts.",
          completed: false,
          tag: "Lead Capture",
        },
        {
          id: "m4",
          title: "Develop Media Kit & Rate Card v1",
          description: "Compile demographic data (18-24 age group, 82% male, 78% India) and set initial sponsorship rate at ₹15,000/Reel.",
          completed: false,
          tag: "Brand Readiness",
        },
      ],
      contentGaps: [
        "Reel hooks drop off after 3 seconds; lacks text captions on screen in first frame",
        "Zero long-term saves: workout carousels lack downloadable routine breakdown slides",
        "Stories are irregular; missing interactive polls and Q&A question stickers",
      ],
      skillsToImprove: [
        "Direct-response visual hooks (zooms, sound effects, text pop-ups)",
        "Lighting & audio in noisy hostel environments (wireless lav mic setup)",
        "Brand collaboration pitching & negotiation etiquette",
      ],
      topicOpportunities: [
        "How to hit 120g protein with only college mess food + sattu",
        "Resistance band push workout inside a 10x10 hostel room",
        "Creatine monohydrate: 5 misconceptions Indian parents have",
        "Overcoming skinny-fat physiques for college desk workers",
      ],
      referenceProfiles: [
        {
          name: "Sahil Khan / FitWithSahil",
          handle: "@fitwithsahil",
          platform: "Instagram",
          lesson: "Masters hyper-relatable campus humor blended with legit exercise science and clear 3-step actionable advice.",
          statsHighlight: "Averages 120k views on budget food reels",
        },
        {
          name: "Chirag Barjatya",
          handle: "@chiragbarjatyaa",
          platform: "X",
          lesson: "Relentless myth-busting against overpriced supplements; builds immense authenticity and trust.",
          statsHighlight: "High conversion on simple text-based nutrition tips",
        },
      ],
    },
    {
      id: "rahul-phase-2",
      days: "60 Days",
      phaseTitle: "Inbound Attraction & Micro-Sponsorship Outreach",
      phaseObjective:
        "Pitch 15 targeted fitness & supplement brands, launch a student workout challenge, and monetize through affiliate codes.",
      milestones: [
        {
          id: "m5",
          title: "Send 15 Cold Pitches to D2C Protein & Snack Brands",
          description: "Target marketing managers at MyProtein, The Whole Truth, and MuscleBlaze with tailored video concepts.",
          completed: false,
          tag: "Outreach",
        },
        {
          id: "m6",
          title: "Launch '30-Day Campus Shred' Community Challenge",
          description: "Create a broadcast channel on Instagram to engage 500+ active student participants.",
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
      ],
      contentGaps: [
        "Need co-authored Reels with fellow campus creators to cross-pollinate reach",
        "Lacks weekly recurring series identity (e.g. 'Monday Mess Review')",
      ],
      skillsToImprove: [
        "Brand contract review: usage rights, exclusivity clauses, and payment terms (Net 30 vs Net 60)",
        "Creating organic-feeling product integrations without looking overly promotional",
      ],
      topicOpportunities: [
        "Testing cheap ₹500 gym shoes vs ₹5,000 branded shoes for squats",
        "Dorm-friendly high-protein breakfast in under 4 minutes",
        "5 form mistakes destroying your rotator cuffs during bench press",
      ],
      referenceProfiles: [
        {
          name: "Noel Deyzel",
          handle: "@noeldeyzel_bodybuilder",
          platform: "Instagram",
          lesson: "Vulnerability and genuine mentorship creates lifelong fans who eagerly support your sponsor partners.",
          statsHighlight: "Exceptional sponsor retention rate",
        },
      ],
    },
    {
      id: "rahul-phase-3",
      days: "90 Days",
      phaseTitle: "Multi-Stream Monetisation & Digital Product Launch",
      phaseObjective:
        "Launch first low-ticket digital guide ($9 / ₹499), secure a retainer brand deal, and scale to ₹50,000 monthly income target.",
      milestones: [
        {
          id: "m8",
          title: "Launch 'The Hostel Athlete 12-Week Guide' eBook/Notion",
          description: "Bundle workout routines + grocery shopping cheat-sheets into an automated digital download product.",
          completed: false,
          tag: "Product Launch",
        },
        {
          id: "m9",
          title: "Convert 1 One-off Sponsor into a 3-Month Retainer Deal",
          description: "Offer multi-deliverable package discount in exchange for guaranteed monthly recurring sponsorship.",
          completed: false,
          tag: "Retainer Deal",
        },
        {
          id: "m10",
          title: "Host Live Q&A Stream for Community Transformations",
          description: "Celebrate participant progress, build social proof, and announce next cohort.",
          completed: false,
          tag: "Social Proof",
        },
      ],
      contentGaps: [
        "Lacks video testimonials from followers who tested his free advice",
      ],
      skillsToImprove: [
        "Email marketing automation and landing page conversion rate optimization",
        "Upselling from low-ticket digital guide to 1:1 consultation slots",
      ],
      topicOpportunities: [
        "Full semester student transformation case study: 12 weeks progress breakdown",
        "How I stay in shape during 14-hour exam study weeks",
      ],
      referenceProfiles: [
        {
          name: "Jeff Nippard",
          handle: "@jeffnippard",
          platform: "YouTube",
          lesson: "The gold standard in evidence-based program design and high-converting science-backed guides.",
          statsHighlight: "Multi-million digital program sales",
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
        "Position profile as the go-to advisor for tech employees on ESOPs, RSUs, and tax efficiency; capture 250 corporate email leads.",
      milestones: [
        {
          id: "pm1",
          title: "Revamp LinkedIn Headline & Featured Section",
          description: "Update headline to: 'Advising Tech Professionals on RSUs, ESOPs & Tax Planning | Ex-Deloitte | 8k+ readers'.",
          completed: true,
          tag: "Positioning",
        },
        {
          id: "pm2",
          title: "Publish RSU vs ESOP Visual Comparison Slide Deck",
          description: "Create an 8-slide PDF document explaining tax triggers at grant, vest, and exercise for tech employees.",
          completed: true,
          tag: "Thought Leadership",
        },
        {
          id: "pm3",
          title: "Deploy Automated Calendly & Advisory Intake Form",
          description: "Set up paid consultation booking link with pre-screening questionnaire for equity compensation reviews.",
          completed: false,
          tag: "Consulting Engine",
        },
        {
          id: "pm4",
          title: "Launch 'The Engineer's Wealth Desk' Bi-Weekly Newsletter",
          description: "Start LinkedIn native newsletter to build direct notification access to senior engineers and PMs.",
          completed: false,
          tag: "Audience Retention",
        },
      ],
      contentGaps: [
        "Posts lack specific real-world dollar/rupee examples; need anonymized salary case studies",
        "Underutilizing carousel document posts (LinkedIn's highest-reach algorithmic format)",
        "Missing clear bottom-of-post call-to-action to book 1:1 strategy calls",
      ],
      skillsToImprove: [
        "High-converting LinkedIn hook frameworks that stop the corporate feed scroll",
        "Discovery call qualification: vetting out non-serious inquiries in under 10 minutes",
        "Structuring corporate financial wellness keynote proposals",
      ],
      topicOpportunities: [
        "TCS / Infosys vs Tier-1 Product Firm: How compensation packages actually break down",
        "Why you are paying 30% extra tax on foreign company RSUs without Form 67",
        "The 5 index funds that replicate 90% of active mutual funds with 1/5th the expense ratio",
        "How a 29-year-old software engineer built a ₹1 Cr portfolio starting with zero family wealth",
      ],
      referenceProfiles: [
        {
          name: "Ankur Warikoo",
          handle: "warikoo",
          platform: "LinkedIn",
          lesson: "Exceptional visual storytelling and transparent financial disclosure creates instant credibility.",
          statsHighlight: "Over 2M followers and high engagement rate",
        },
        {
          name: "Sharan Hegde",
          handle: "financewithsharan",
          platform: "Instagram",
          lesson: "Turning boring tax laws into engaging narrative skits; scalable creator agency model.",
          statsHighlight: "Leading financial influencer in South Asia",
        },
      ],
    },
    {
      id: "priya-phase-2",
      days: "60 Days",
      phaseTitle: "Consulting Funnel Optimization & B2B Sponsorships",
      phaseObjective:
        "Close 5 paid advisory clients at ₹15,000/engagement, secure 1 B2B fintech campaign, and pilot corporate webinar pitches.",
      milestones: [
        {
          id: "pm5",
          title: "Close First 5 High-Ticket 1:1 Consulting Clients",
          description: "Deliver detailed personal wealth roadmap, tax optimization memo, and asset allocation strategy.",
          completed: false,
          tag: "Revenue Milestone",
        },
        {
          id: "pm6",
          title: "Pitch 10 HR Leads on 'Corporate Financial Wellness' Workshops",
          description: "Offer 60-minute Zoom sessions on tax season prep for engineering teams during FY26-27 transition.",
          completed: false,
          tag: "B2B Speaking",
        },
        {
          id: "pm7",
          title: "Secure Sponsored Co-Authored Article with Zerodha / Wint Wealth",
          description: "Produce high-retention analysis comparing corporate debt yields with sovereign debt funds.",
          completed: false,
          tag: "Brand Deal",
        },
      ],
      contentGaps: [
        "Need client transformation case studies and quotes (with anonymized financial data)",
      ],
      skillsToImprove: [
        "Negotiating B2B speaking fees with enterprise HR procurement teams",
        "Designing tiered consulting packages (e.g. Basic Review vs Full Annual Retainer)",
      ],
      topicOpportunities: [
        "Old vs New tax regime calculator breakdown for incomes between ₹15L and ₹50L",
        "Should you prepay your home loan or invest the surplus in Nifty 50? The math unveiled",
      ],
      referenceProfiles: [
        {
          name: "Akshat Shrivastava",
          handle: "akshatshrivastava",
          platform: "LinkedIn",
          lesson: "Deep macroeconomic analysis appeals to serious investors and high-net-worth tech leaders.",
          statsHighlight: "High client conversion on private investment cohort",
        },
      ],
    },
    {
      id: "priya-phase-3",
      days: "90 Days",
      phaseTitle: "Cohort Course / Retainer Advisory Scaling",
      phaseObjective:
        "Scale monthly consulting income to ₹120,000 target by launching a waitlisted 10-person wealth sprint cohort.",
      milestones: [
        {
          id: "pm8",
          title: "Launch 'Tech Wealth Architecture' 3-Week Cohort",
          description: "Cap at 12 participants at ₹9,999/seat with live teardowns of their investment spreadsheets.",
          completed: false,
          tag: "Scale Product",
        },
        {
          id: "pm9",
          title: "Establish Ongoing Monthly Retainer Model for 3 HNI Clients",
          description: "Transition one-off clients into ₹10,000/month recurring quarterly review contracts.",
          completed: false,
          tag: "Recurring Revenue",
        },
      ],
      contentGaps: [
        "Missing video content on YouTube or LinkedIn Audio events",
      ],
      skillsToImprove: [
        "Community moderation and live workshop facilitation",
      ],
      topicOpportunities: [
        "Estate planning & nominee checklists every tech worker with insurance must know",
        "The mathematical truth about NPS (National Pension System): Is the tax deduction worth the lock-in?",
      ],
      referenceProfiles: [
        {
          name: "Kavitha Menon",
          handle: "kavitha-menon-ria",
          platform: "LinkedIn",
          lesson: "Strict compliance, fiduciary responsibility, and zero sensationalism builds ultra-high client trust.",
          statsHighlight: "Trusted advisor to high-growth startup founders",
        },
      ],
    },
  ],
};

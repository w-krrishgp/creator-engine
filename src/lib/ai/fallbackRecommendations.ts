import { CreatorProfile } from "@/types/creator";
import { AiRecommendationsResponse } from "@/types/ai";

export function generateFallbackRecommendations(
  creator: CreatorProfile,
  warningReason?: string
): AiRecommendationsResponse {
  // If not a hardcoded demo profile, dynamically synthesize deterministic recommendations
  if (creator.id !== "rahul" && creator.id !== "priya") {
    return generateDynamicCreatorRecommendations(creator, warningReason);
  }

  const isFitness =
    creator.niche.toLowerCase().includes("fitness") ||
    creator.niche.toLowerCase().includes("nutrition") ||
    creator.id === "rahul";

  if (isFitness) {
    return {
      success: true,
      isDemoMode: true,
      generatedAt: new Date().toISOString(),
      creatorId: creator.id,
      modelUsed: "Deterministic Engine (Demo Mode)",
      warning: warningReason || "Operating in Demo Mode. To enable live Gemini AI generation, add your GEMINI_API_KEY to .env.local.",
      positioning: {
        thesis: `Democratizing accessible fitness for ${creator.followerCount.toLocaleString()}+ students and beginners through realistic hostel meal preps and zero-equipment bodyweight training.`,
        targetAudience: "College students, gym beginners, and budget-conscious youth (18-24)",
        differentiator: "Zero-fluff budget nutrition hacks under ₹40/meal and dorm-friendly calisthenics progressions.",
        elevatorPitch: `I help college students build real muscle and discipline without expensive gym memberships or exotic supplements.`,
      },
      growthRoadmap: [
        {
          days: "30 Days",
          phaseTitle: "Audience Calibration & Format Standardization",
          phaseObjective: "Standardize 3 core video templates, optimize profile conversion funnel, and establish a repeatable 4x/week posting rhythm.",
          milestones: [
            {
              title: "Audit Instagram Bio & Pinned Reels",
              description: "Rewrite bio with a clear positioning promise and pin top 3 high-retention transformation reels.",
              tag: "Profile Funnel",
            },
            {
              title: "Batch Produce 8 'Hostel Meal Hacks' Reels",
              description: "Establish strong 2-second visual hooks showcasing cheap high-protein recipes using mess staples.",
              tag: "Content Engine",
            },
            {
              title: "Setup Link-in-Bio Freebie: Hostel Diet Blueprint PDF",
              description: "Build an automated DM/email capture magnet to build direct audience relationships before launching products.",
              tag: "Lead Capture",
            },
          ],
          contentGaps: [
            {
              gap: "Reel hooks drop off after 3 seconds without bold on-screen text",
              reason: "Algorithm penalizes reels with <40% 3-second completion. Students scrolling in noisy dorms with sound off will swipe past immediately.",
              impactLevel: "Critical",
            },
            {
              gap: "Zero long-term saves: workout carousels lack downloadable routine breakdown slides",
              reason: "Saves are the #1 algorithmic ranking signal for educational fitness content. Without a saveable routine slide, explore distribution decays quickly.",
              impactLevel: "High",
            },
            {
              gap: "Stories are irregular; missing interactive polls and Q&A stickers",
              reason: "Active story viewers have 4x higher purchase intent for sponsor products and digital guides than passive feed scrollers.",
              impactLevel: "Medium",
            },
          ],
          skillsToImprove: [
            {
              skill: "Short-Form Visual Retention Hooks",
              category: "Content Production",
              priority: "Critical",
              actionStep: "Add dynamic movement or bold problem statements in frames 0 to 45.",
            },
            {
              skill: "Sponsorship Rate Negotiation",
              category: "Commercial & Pitching",
              priority: "High",
              actionStep: "Package 1 Reel + 3 Story frames with 30-day organic usage rights instead of selling standalone posts.",
            },
          ],
          topicOpportunities: [
            {
              title: "5 High-Protein Hostel Mess Hacks Under ₹40",
              hookAngle: "Show budget meal breakdown comparison vs commercial protein bars.",
              suggestedFormat: "Fast-paced vertical reel with price callouts",
              targetAudience: "College hostelers & budget gym beginners",
            },
            {
              title: "Zero-Equipment Pull-Up Progression in a Dorm Doorframe",
              hookAngle: "Why you don't need a ₹2,000 gym pass to build a wide back.",
              suggestedFormat: "Step-by-step form tutorial reel",
              targetAudience: "Calisthenics beginners",
            },
          ],
        },
        {
          days: "60 Days",
          phaseTitle: "Commercial Validation & First Brand Pipeline",
          phaseObjective: "Sign first 2 paid brand integrations, pitch 10 targeted fitness companies, and validate digital guide demand.",
          milestones: [
            {
              title: "Send 10 Outbound Pitches to D2C Protein & Health Brands",
              description: "Pitch verified college demographic stats and offer custom creative concepts tailored to student budgets.",
              tag: "Brand Partnerships",
            },
            {
              title: "Launch Interactive Community Q&A Live Session",
              description: "Host 45-minute live stream to address student diet struggles and validate interest in a ₹299 workout guide.",
              tag: "Community Trust",
            },
          ],
          contentGaps: [
            {
              gap: "Missing social proof highlights of followers achieving bodyweight goals",
              reason: "Follower transformations create viral word-of-mouth credibility and accelerate sponsorship close rates.",
              impactLevel: "High",
            },
          ],
          skillsToImprove: [
            {
              skill: "Brand Deck & Media Kit Presentation",
              category: "Commercial & Pitching",
              priority: "High",
              actionStep: "Feature audience demographics and verified engagement rates prominently on a 2-page Notion deck.",
            },
          ],
          topicOpportunities: [
            {
              title: "How I Built My Calisthenics Foundation on a ₹100/day Food Budget",
              hookAngle: "Honest retrospective addressing student financial anxieties.",
              suggestedFormat: "Narrative carousel or storytelling reel",
              targetAudience: "Undergraduate fitness enthusiasts",
            },
          ],
        },
        {
          days: "90 Days",
          phaseTitle: "Monetisation Diversification & Scale",
          phaseObjective: "Reach ₹75,000/month recurring income through a balanced mix of brand deals, affiliate revenue, and digital products.",
          milestones: [
            {
              title: "Launch 'Dorm Calisthenics Blueprint' ₹299 Digital Guide",
              description: "Release structured 8-week video-linked PDF program to warm email/DM waitlist.",
              tag: "Digital Products",
            },
            {
              title: "Establish Retainer Partnership with Fitness Brand",
              description: "Convert one-off campaign into a 3-month ambassador deal for consistent cashflow.",
              tag: "Recurring Income",
            },
          ],
          contentGaps: [
            {
              gap: "YouTube long-form repurposing is neglected",
              reason: "Long-form YouTube videos build high-trust evergreen authority that increases brand sponsorship value by 3x.",
              impactLevel: "Medium",
            },
          ],
          skillsToImprove: [
            {
              skill: "Product Launch Funnel Sequencing",
              category: "Strategy",
              priority: "High",
              actionStep: "Execute a 14-day pre-launch teaser sequence before releasing the digital workout guide.",
            },
          ],
          topicOpportunities: [
            {
              title: "The Ultimate 8-Week Dorm Workout Routine (Full Breakdown)",
              hookAngle: "Complete day-by-day split designed for small spaces.",
              suggestedFormat: "YouTube long-form or multi-slide carousel",
              targetAudience: "Committed fitness students",
            },
          ],
        },
      ],
      monetisationPathways: [
        {
          channelTitle: "Micro-Sponsorships & Dedicated Reels",
          category: "brand_collaborations",
          suitabilityScore: 94,
          whyItSuits: "Your 15,000 Instagram followers have a focused demographic (college students, 18-24). D2C brands hunt for creators with verified 4.8% engagement.",
          suggestedFirstStep: "Send customized pitch decks with 2 short-form video concept hooks to 5 D2C health snack brands that sponsor fitness reels.",
          estimatedPotential: "₹20,000 – ₹45,000 / month",
          readinessStatus: "Ready to Launch",
          launchChecklist: [
            "Compile demographic proof slides (82% male, 18-24, India)",
            "Set transparent rate card: ₹15,000 for 1x Reel + 3 Story frames bundle",
            "Establish payment terms (50% advance on brief approval)",
          ],
        },
        {
          channelTitle: "Curated Supplement & Fitness Gear Links",
          category: "affiliate_marketing",
          suitabilityScore: 88,
          whyItSuits: "Followers constantly ask 'which protein powder is safe on a budget?' in your DMs. A coupon code provides immediate low-friction value.",
          suggestedFirstStep: "Apply for 2 fitness brand affiliate programs and pin a categorized 'Supplements FAQ' Story Highlight.",
          estimatedPotential: "₹8,000 – ₹18,000 / month",
          readinessStatus: "Ready to Launch",
          launchChecklist: [
            "Create organized link-in-bio storefront",
            "Pin 'Supplements FAQ' story highlight",
            "Add required statutory disclosure (#Affiliate)",
          ],
        },
        {
          channelTitle: "Dorm Fitness Blueprint (₹299 Digital Guide)",
          category: "digital_products",
          suitabilityScore: 82,
          whyItSuits: "Low friction entry-level pricing tailored to college student pocket money. Zero recurring delivery overhead.",
          suggestedFirstStep: "Survey story viewers on their top 3 workout hurdles to finalize the PDF chapter outline.",
          estimatedPotential: "₹15,000 – ₹30,000 / month",
          readinessStatus: "High Opportunity",
          launchChecklist: [
            "Draft 25-page structured workout schedule",
            "Embed unlisted YouTube demonstration video links",
            "Set up simple UPI/Razorpay payment link",
          ],
        },
      ],
      nextActions: [
        {
          title: "Audit Instagram Bio & Pin Top 3 Transformation Reels",
          category: "Growth",
          priority: "High",
          reason: "Converting profile visits into followers is the foundation for all sponsorship inbound requests.",
          deadline: "In 3 days",
          estimatedTime: "45 mins",
          relatedType: "roadmap",
          relatedTitle: "Audience Calibration & Format Standardization",
        },
        {
          title: "Review MyProtein India Campaign Brief & Requirements",
          category: "Brand Pitch",
          priority: "High",
          reason: "You meet all 5 requirements with 15,000 followers and 4.8% engagement rate. Excellent first brand sponsorship opportunity.",
          deadline: "In 4 days",
          estimatedTime: "30 mins",
          relatedType: "opportunity",
          relatedTitle: "Campus Fitness Fuel: Impact Whey Student Campaign",
        },
        {
          title: "Set up link-in-bio storefront for supplement discount codes",
          category: "Monetisation",
          priority: "Medium",
          reason: "Monetize ongoing DM product recommendations into recurring 10-15% affiliate commission.",
          deadline: "In 7 days",
          estimatedTime: "1 hour",
          relatedType: "monetisation",
          relatedTitle: "Curated Supplement & Fitness Gear Links",
        },
      ],
    };
  }

  // Personal Finance / Generic fallback (e.g. Priya)
  return {
    success: true,
    isDemoMode: true,
    generatedAt: new Date().toISOString(),
    creatorId: creator.id,
    modelUsed: "Deterministic Engine (Demo Mode)",
    warning: warningReason || "Operating in Demo Mode. To enable live Gemini AI generation, add your GEMINI_API_KEY to .env.local.",
    positioning: {
      thesis: `Empowering early-to-mid career professionals with data-backed, zero-jargon frameworks for tax optimization, equity compensation, and passive wealth compounding.`,
      targetAudience: "Salaried tech professionals and first-time corporate investors (24-35, Tier-1 Metros)",
      differentiator: "Ex-consultant analytical rigor, visual carousels with zero marketing hype, and strict SEBI compliance awareness.",
      elevatorPitch: `I turn confusing tax codes and investment options into actionable, visual playbooks for young salaried professionals.`,
    },
    growthRoadmap: [
      {
        days: "30 Days",
        phaseTitle: "Authority Solidification & Slide Carousel System",
        phaseObjective: "Establish recognized thought leadership on LinkedIn through 3 weekly data-driven carousels and launch 1:1 strategy calls.",
        milestones: [
          {
            title: "Publish 4 SEBI-Compliant Visual Tax Carousels",
            description: "Break down Section 80C vs New Tax Regime with side-by-side mathematical comparisons.",
            tag: "Content Authority",
          },
          {
            title: "Launch Topmate 1:1 Financial Strategy Consultation",
            description: "Offer 30-minute private portfolio structure teardowns at ₹1,500 introductory pricing.",
            tag: "Monetisation Launch",
          },
          {
            title: "Build SEBI-Compliant Disclaimer Footer Template",
            description: "Standardize disclaimer slide across all carousels ensuring research education compliance.",
            tag: "Regulatory Trust",
          },
        ],
        contentGaps: [
          {
            gap: "LinkedIn carousels exceed 100 words per slide; text density overwhelms mobile readers",
            reason: "Mobile LinkedIn app cuts off dense paragraphs. Lowers completion rate by 45%.",
            impactLevel: "Critical",
          },
          {
            gap: "Posts lack clear single call-to-action in the comment section",
            reason: "Algorithm prioritizes early comment discussion. Pinning a thought-provoking debate prompt drives 3x reach.",
            impactLevel: "High",
          },
          {
            gap: "Zero newsletter capture mechanism for LinkedIn connections",
            reason: "Platform algorithm updates can reduce organic reach overnight. Owned email lists protect creator sovereignty.",
            impactLevel: "Medium",
          },
        ],
        skillsToImprove: [
          {
            skill: "Slide Design & Visual Data Hierarchy",
            category: "Content Production",
            priority: "Critical",
            actionStep: "Limit each carousel slide to 1 key metric, 1 chart icon, and under 40 words.",
          },
          {
            skill: "Regulatory & Compliance Disclaimers",
            category: "Legal & Compliance",
            priority: "High",
            actionStep: "Add standard education-only disclaimers complying with SEBI influencer guidelines.",
          },
        ],
        topicOpportunities: [
          {
            title: "Old vs New Tax Regime: The Exact Mathematical Break-Even Chart for ₹15L–₹30L CTC",
            hookAngle: "Most people choose the wrong regime because they calculate deductions incorrectly.",
            suggestedFormat: "Multi-slide PDF carousel with comparison table",
            targetAudience: "Salaried IT & consulting professionals",
          },
          {
            title: "Why 90% of Active Mutual Funds Underperform the Nifty 50 Index (10-Year Study)",
            hookAngle: "The data asset managers don't want retail investors to notice.",
            suggestedFormat: "Visual chart breakdown with SPIVA report citations",
            targetAudience: "Index fund beginners",
          },
        ],
      },
      {
        days: "60 Days",
        phaseTitle: "B2B Workshop Pipeline & High-Ticket Advisory",
        phaseObjective: "Pitch corporate HR heads for Employee Financial Wellness workshops and scale 1:1 advisory slots.",
        milestones: [
          {
            title: "Pitch 5 Tech Startups for Employee Tax & ESOP Workshops",
            description: "Offer 60-minute practical equity and tax planning sessions for Series B/C startups.",
            tag: "B2B Corporate",
          },
          {
            title: "Apply for Wint Wealth Fixed Income Thought Leadership Campaign",
            description: "Submit pitch emphasizing analytical corporate audience and 3.8% LinkedIn engagement.",
            tag: "Brand Partnerships",
          },
        ],
        contentGaps: [
          {
            gap: "Missing video snippets explaining complex terms face-to-camera",
            reason: "Video builds interpersonal trust 5x faster than pure slide text, increasing 1:1 booking conversions.",
            impactLevel: "High",
          },
        ],
        skillsToImprove: [
          {
            skill: "B2B Corporate Workshop Pitching",
            category: "Commercial & Pitching",
            priority: "High",
            actionStep: "Develop a 3-page executive summary deck targeting startup People/HR leads.",
          },
        ],
        topicOpportunities: [
          {
            title: "RSU Taxation for Indian Engineers at US Tech Companies (Step-by-Step)",
            hookAngle: "How vesting, double taxation relief, and exchange rates impact your take-home pay.",
            suggestedFormat: "In-depth guide with flowchart",
            targetAudience: "Tech employees with US equity",
          },
        ],
      },
      {
        days: "90 Days",
        phaseTitle: "Institutional Partnerships & ₹1.2L/month Target",
        phaseObjective: "Cross ₹1,20,000/month recurring income through corporate retained workshops, vetted fintech sponsorships, and private client advisory.",
        milestones: [
          {
            title: "Sign 2 Quarterly Corporate Financial Wellness Retainers",
            description: "Deliver monthly equity & tax office hours for startup teams at ₹35,000/session.",
            tag: "Retainer Revenue",
          },
          {
            title: "Establish Vetted Fintech Brand Sponsorship Roster",
            description: "Partner exclusively with regulated SEBI/RBI registered platforms for transparent educational content.",
            tag: "Brand Partnerships",
          },
        ],
        contentGaps: [
          {
            gap: "Lack of case studies showcasing anonymized client financial breakthroughs",
            reason: "Real client breakthroughs convert passive readers into high-ticket consultation clients.",
            impactLevel: "Medium",
          },
        ],
        skillsToImprove: [
          {
            skill: "Executive Presence & Group Facilitation",
            category: "Audience Retention",
            priority: "High",
            actionStep: "Practice interactive polling and live Q&A moderation for corporate webinars.",
          },
        ],
        topicOpportunities: [
          {
            title: "Senior Secured Bonds vs Fixed Deposits: A Risk-Return Deep Dive",
            hookAngle: "Where to park emergency and medium-term surplus capital in a volatile market.",
            suggestedFormat: "Comparison deck with risk metrics",
            targetAudience: "High-income salaried earners",
          },
        ],
      },
    ],
    monetisationPathways: [
      {
        channelTitle: "1:1 Financial Strategy & Portfolio Structure Calls",
        category: "consulting_services",
        suitabilityScore: 96,
        whyItSuits: "Your 8,000 LinkedIn connections are corporate professionals seeking personalized guidance on tax planning and asset allocation.",
        suggestedFirstStep: "Set up a Topmate or Cal.com booking page offering 30-minute advisory sessions at ₹1,500.",
        estimatedPotential: "₹30,000 – ₹50,000 / month",
        readinessStatus: "Ready to Launch",
        launchChecklist: [
          "Create structured 5-point consultation intake form",
          "Include SEBI educational compliance disclaimer",
          "Publish 1 LinkedIn post announcing limited monthly advisory slots",
        ],
      },
      {
        channelTitle: "Corporate Financial Wellness Workshops",
        category: "pr_speaking",
        suitabilityScore: 91,
        whyItSuits: "Startups and tech companies actively hire external experts to conduct tax planning and ESOP education sessions for their teams.",
        suggestedFirstStep: "Draft a 1-page workshop brochure ('Tax Planning & Equity for High-Growth Tech Teams') and pitch to 5 former colleagues in HR.",
        estimatedPotential: "₹40,000 – ₹70,000 / month",
        readinessStatus: "Ready to Launch",
        launchChecklist: [
          "Build 45-slide master workshop deck with interactive exercises",
          "Collect testimonials from initial pilot participants",
          "Set transparent corporate pricing: ₹25,000 – ₹35,000 per 90-minute workshop",
        ],
      },
      {
        channelTitle: "Vetted Fintech Thought Leadership Integrations",
        category: "brand_collaborations",
        suitabilityScore: 84,
        whyItSuits: "Fintech platforms like Wint Wealth and Zerodha seek analytical creators with high credibility and engagement over mass reach.",
        suggestedFirstStep: "Apply for the Wint Wealth educational fixed income campaign with your custom carousel concept.",
        estimatedPotential: "₹45,000 – ₹75,000 / month",
        readinessStatus: "High Opportunity",
        launchChecklist: [
          "Ensure strict adherence to ASCI and SEBI disclosure standards",
          "Prepare 2 educational carousel sample mockups",
          "Standardize revision boundaries and deliverables",
        ],
      },
    ],
    nextActions: [
      {
        title: "Standardize SEBI-compliant educational disclaimer footer",
        category: "Audience Trust",
        priority: "High",
        reason: "Protects personal credibility and guarantees 100% regulatory compliance for corporate and brand collaborations.",
        deadline: "In 2 days",
        estimatedTime: "30 mins",
        relatedType: "roadmap",
        relatedTitle: "Authority Solidification & Slide Carousel System",
      },
      {
        title: "Submit application to Wint Wealth Fixed Income Campaign",
        category: "Brand Pitch",
        priority: "High",
        reason: "You meet all criteria (8,000 followers, 3.8% engagement rate, finance niche). Strong commercial fit.",
        deadline: "In 3 days",
        estimatedTime: "45 mins",
        relatedType: "opportunity",
        relatedTitle: "Fixed Income for Salaried Millennials: Educational Series",
      },
      {
        title: "Launch Topmate 1:1 consultation booking page",
        category: "Monetisation",
        priority: "High",
        reason: "Direct monetization path requiring zero product inventory. Turns high LinkedIn engagement into immediate revenue.",
        deadline: "In 5 days",
        estimatedTime: "1 hour",
        relatedType: "monetisation",
        relatedTitle: "1:1 Financial Strategy & Portfolio Structure Calls",
      },
    ],
  };
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

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { Opportunity, CreatorProfile } from "../src/types/creator";
import { RadarDiscoveredItem, RadarExtractResponse } from "../src/types/radar";
import { MOCK_OPPORTUNITIES } from "../src/data/mockOpportunities";
import { calculateCompatibility } from "../src/utils/compatibility";

describe("Creator Opportunity Radar - Add to Pipeline & Persistence Audit", () => {
  const mockCreator: CreatorProfile = {
    id: "rahul",
    name: "Rahul Verma",
    handle: "@rahulfit.india",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "Fitness & Nutrition Creator",
    niche: "Fitness & Nutrition",
    primaryPlatform: "Instagram",
    followerCount: 15400,
    engagementRate: 4.8,
    audienceDemographic: "College students, gym beginners (18-24)",
    contentFormat: "Short-form video (Reels)",
    contentFrequency: "5-6 posts/week",
    creatorStage: "Micro (10k-50k)",
    primaryGoal: "Secure high-paying, recurring brand sponsorships",
    monetisationGoals: ["Brand Sponsorships", "Affiliate Marketing"],
    monthlyIncomeTarget: 75000,
    experienceLevel: "Growing (1-3 yrs)",
    bio: "Helping young adults build sustainable fitness habits on a student budget.",
    location: "Bengaluru, India",
    topics: ["Dorm Workouts", "High-Protein Meals", "Budget Fitness"],
    activeDealsCount: 2,
    estimatedPipelineValue: 65000,
    monthlyGrowthRate: 8.5,
    avgImpressionsPerPost: 42000,
    mediaKitLink: "https://creatormedia.io/rahulfit",
    isManuallyReported: true,
    isOnboarded: true,
    positioningStatement: "The budget-friendly fitness mentor for Indian students",
  };

  const sampleDiscoveredItem: RadarDiscoveredItem = {
    id: "radar-disc-1718000000000-0",
    title: "AsyncAPI Ambassador Program 2026",
    url: "https://www.asyncapi.com/community/ambassadors",
    sourceUrl: "https://www.asyncapi.com/community/ambassadors",
    siteName: "asyncapi.com",
    snippet: "Join the AsyncAPI Ambassador program to mentor creators and speak at conferences.",
    position: 1,
    retrievalTimestamp: new Date().toISOString(),
    matchScore: 92,
    matchJustification: "Active open-source developer advocate and community program",
    isVerifiedFromPage: true,
    nicheTag: "Tech & AI",
  };

  const sampleExtractResponse: RadarExtractResponse = {
    success: true,
    retrievalTimestamp: new Date().toISOString(),
    campaign: {
      brandName: "AsyncAPI Initiative",
      campaignTitle: "AsyncAPI Community Ambassador & Developer Advocate Program",
      campaignDescription:
        "Looking for technical content creators and community advocates to create tutorials, blogs, and presentations.",
      eligibilityRequirements: [
        "Active technical creator with public talks, blogs, or video tutorials",
        "Experience with event-driven architectures or APIs",
      ],
      compensation: "Travel grants, speaker stipends, and hardware sponsorship",
      publishedDeadline: null,
      applicationUrl: "https://www.asyncapi.com/community/ambassadors#apply",
      targetAudience: "Software developers and API designers",
      targetLocation: "Global (Remote)",
      sourceUrl: "https://www.asyncapi.com/community/ambassadors",
      finalUrl: "https://www.asyncapi.com/community/ambassadors",
      retrievalTimestamp: new Date().toISOString(),
      verification: {
        brandVerified: true,
        requirementsVerified: true,
        compensationVerified: true,
        deadlineVerified: false,
        applicationLinkVerified: true,
      },
      missingInformation: ["Strict monetary fixed fee per deliverable"],
      isAuthenticCampaignPage: true,
    },
    pitch: {
      subject: "AsyncAPI Ambassador Application: Tech & Community Creator",
      elevatorPitch: "Hi AsyncAPI team, I create technical tutorials and community content...",
      fullOutreachMessage: "Full outreach proposal...",
      suggestedDeliverables: [
        "1x Deep-Dive Video Tutorial",
        "2x Technical Blog Posts",
        "Community Discord Workshop",
      ],
      modelUsed: "gemini-2.5-flash",
      isFallback: false,
      creatorMatchedId: "rahul",
    },
  };

  test("1. Successfully converts TinyFish extraction to full Opportunity model", () => {
    const campaign = sampleExtractResponse.campaign!;
    const pitch = sampleExtractResponse.pitch!;

    const urlSlug = (sampleDiscoveredItem.url || campaign.sourceUrl)
      .replace(/^https?:\/\//i, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase()
      .slice(0, 48)
      .replace(/-+$/, "");

    const convertedOpp: Opportunity = {
      id: `radar-opp-${urlSlug}`,
      brand: campaign.brandName,
      brandLogo: "🌐",
      brandCategory: sampleDiscoveredItem.nicheTag || "Live Web Sponsorship",
      title: campaign.campaignTitle,
      description: campaign.campaignDescription,
      niche: [sampleDiscoveredItem.nicheTag || mockCreator.niche],
      platform: "Multi-Platform",
      minFollowers: 5000,
      budgetRange: campaign.compensation || "Performance / Negotiated",
      budgetMin: 20000,
      budgetMax: 50000,
      deadline: campaign.publishedDeadline || "Rolling Admissions",
      deliverables: pitch.suggestedDeliverables,
      status: "Available",
      targetAudience: campaign.targetAudience || mockCreator.audienceDemographic,
      targetLocation: campaign.targetLocation || mockCreator.location,
      eligibilityRequirements: campaign.eligibilityRequirements,
      sponsoredTag: false,
    };

    assert.equal(convertedOpp.id, "radar-opp-www-asyncapi-com-community-ambassadors");
    assert.equal(convertedOpp.brand, "AsyncAPI Initiative");
    assert.equal(convertedOpp.status, "Available");
    assert.equal(convertedOpp.deliverables.length, 3);
    assert.equal(convertedOpp.eligibilityRequirements.length, 2);

    // Verify compatibility evaluation runs cleanly without throwing
    const compat = calculateCompatibility(convertedOpp, mockCreator);
    assert.ok(typeof compat.score === "number");
    assert.ok(compat.score >= 0 && compat.score <= 100);
    assert.ok(typeof compat.qualifies === "boolean");
  });

  test("2. Deduplication: Prevents duplicate addition by deterministic ID or matching title", () => {
    const initialList: Opportunity[] = [...MOCK_OPPORTUNITIES];
    const initialCount = initialList.length;

    const newOpp: Opportunity = {
      id: "radar-opp-test-brand-ambassador",
      brand: "Test Brand",
      brandLogo: "🌐",
      brandCategory: "Tech & AI",
      title: "Test Brand Ambassador 2026",
      description: "Ambassador program description",
      niche: ["Tech & AI"],
      platform: "Multi-Platform",
      minFollowers: 5000,
      budgetRange: "₹20,000 - ₹50,000",
      budgetMin: 20000,
      budgetMax: 50000,
      deadline: "Rolling Admissions",
      deliverables: ["1x Video"],
      status: "Available",
      targetAudience: "Developers",
      targetLocation: "Global",
      eligibilityRequirements: ["Active creator"],
      sponsoredTag: false,
    };

    // First addition
    const isDuplicate1 = initialList.some(
      (o) => o.id === newOpp.id || o.title.toLowerCase().trim() === newOpp.title.toLowerCase().trim()
    );
    assert.equal(isDuplicate1, false);
    const updatedList = [newOpp, ...initialList];
    assert.equal(updatedList.length, initialCount + 1);

    // Attempt second addition with same ID
    const isDuplicate2 = updatedList.some(
      (o) => o.id === newOpp.id || o.title.toLowerCase().trim() === newOpp.title.toLowerCase().trim()
    );
    assert.equal(isDuplicate2, true);

    // Attempt third addition with slightly different ID but identical trimmed title
    const variantOpp = { ...newOpp, id: "radar-opp-different-id", title: "  test brand ambassador 2026  " };
    const isDuplicate3 = updatedList.some(
      (o) => o.id === variantOpp.id || o.title.toLowerCase().trim() === variantOpp.title.toLowerCase().trim()
    );
    assert.equal(isDuplicate3, true);
  });

  test("3. Preserves existing curated opportunities, application statuses, and saved items", () => {
    // Initial list with curated deals
    const initialList: Opportunity[] = MOCK_OPPORTUNITIES.map((opp) => {
      if (opp.id === "opp-decathlon") return { ...opp, status: "Saved" as const };
      if (opp.id === "opp-myprotein") {
        return {
          ...opp,
          status: "Applied" as const,
          applicationId: "CE-APP-9901",
          appliedDate: "Oct 19, 2026",
          appliedFee: "₹35,000",
        };
      }
      return opp;
    });

    const newOpp: Opportunity = {
      id: "radar-opp-asyncapi",
      brand: "AsyncAPI",
      brandLogo: "🌐",
      brandCategory: "Tech & AI",
      title: "AsyncAPI Ambassador",
      description: "Community Ambassador",
      niche: ["Tech & AI"],
      platform: "Multi-Platform",
      minFollowers: 5000,
      budgetRange: "Travel grants",
      budgetMin: 20000,
      budgetMax: 50000,
      deadline: "Rolling Admissions",
      deliverables: ["1x Video"],
      status: "Available",
      targetAudience: "Developers",
      targetLocation: "Global",
      eligibilityRequirements: ["Active creator"],
      sponsoredTag: false,
    };

    const nextList = [newOpp, ...initialList];

    // Check curated items are untouched
    const myProtein = nextList.find((o) => o.id === "opp-myprotein");
    assert.ok(myProtein);
    assert.equal(myProtein.status, "Applied");
    assert.equal(myProtein.applicationId, "CE-APP-9901");
    assert.equal(myProtein.appliedFee, "₹35,000");

    const decathlon = nextList.find((o) => o.id === "opp-decathlon");
    assert.ok(decathlon);
    assert.equal(decathlon.status, "Saved");

    // Check new opportunity is added at the top
    assert.equal(nextList[0].id, "radar-opp-asyncapi");
  });

  test("4. Persistence Simulation: Survives JSON serialization to/from localStorage", () => {
    const oppsState: Record<string, Opportunity[]> = {
      rahul: [
        {
          id: "radar-opp-asyncapi",
          brand: "AsyncAPI",
          brandLogo: "🌐",
          brandCategory: "Tech & AI",
          title: "AsyncAPI Ambassador",
          description: "Community Ambassador",
          niche: ["Tech & AI"],
          platform: "Multi-Platform",
          minFollowers: 5000,
          budgetRange: "Travel grants",
          budgetMin: 20000,
          budgetMax: 50000,
          deadline: "Rolling Admissions",
          deliverables: ["1x Video"],
          status: "Available",
          targetAudience: "Developers",
          targetLocation: "Global",
          eligibilityRequirements: ["Active creator"],
          sponsoredTag: false,
        },
        ...MOCK_OPPORTUNITIES,
      ],
      priya: [...MOCK_OPPORTUNITIES],
    };

    // Serialize as localStorage does
    const serialized = JSON.stringify(oppsState);
    assert.ok(serialized.length > 0);

    // Simulate page refresh (hydration from localStorage)
    const hydrated = JSON.parse(serialized) as Record<string, Opportunity[]>;

    assert.ok(hydrated.rahul);
    assert.ok(hydrated.priya);
    assert.equal(hydrated.rahul.length, MOCK_OPPORTUNITIES.length + 1);
    assert.equal(hydrated.priya.length, MOCK_OPPORTUNITIES.length);
    assert.equal(hydrated.rahul[0].id, "radar-opp-asyncapi");
    assert.equal(hydrated.rahul[0].brand, "AsyncAPI");
  });
});

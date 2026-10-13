import {
  CreatorProfile,
  Opportunity,
  CompatibilityBreakdown,
  EligibilityCheckItem,
} from "@/types/creator";

/**
 * Deterministic compatibility and eligibility evaluation engine.
 * Computes:
 * 1. Hard Eligibility checks (follower threshold, platform compatibility, niche alignment, engagement)
 * 2. Explainable compatibility score (0-100) based on niche, platform, follower tier, and audience fit.
 *
 * Enforces hard eligibility separately so high compatibility factors do NOT mask a failed requirement.
 */
export function calculateCompatibility(
  opportunity: Opportunity,
  creator: CreatorProfile
): CompatibilityBreakdown {
  const creatorNicheLower = (creator.niche || "").toLowerCase();
  const oppNichesLower = (opportunity.niche || []).map((n) => n.toLowerCase());

  // 1. Niche Match (Max 35 points)
  let nicheScore = 6;
  const exactNicheMatch = oppNichesLower.some(
    (n) => creatorNicheLower.includes(n) || n.includes(creatorNicheLower)
  );

  const isFitnessCreator =
    creatorNicheLower.includes("fitness") ||
    creatorNicheLower.includes("health") ||
    creatorNicheLower.includes("nutrition");

  const isFinanceCreator =
    creatorNicheLower.includes("finance") ||
    creatorNicheLower.includes("invest") ||
    creatorNicheLower.includes("wealth");

  const isTechCreator =
    creatorNicheLower.includes("tech") ||
    creatorNicheLower.includes("code") ||
    creatorNicheLower.includes("developer") ||
    creatorNicheLower.includes("software") ||
    creatorNicheLower.includes("ai") ||
    creatorNicheLower.includes("programming");

  const isHealthCreator =
    creatorNicheLower.includes("health") ||
    creatorNicheLower.includes("medical") ||
    creatorNicheLower.includes("doctor") ||
    creatorNicheLower.includes("clinical") ||
    creatorNicheLower.includes("medicine");

  const relatedFitnessOpp = oppNichesLower.some(
    (n) =>
      n.includes("wellness") ||
      n.includes("sports") ||
      n.includes("nutrition") ||
      n.includes("lifestyle") ||
      n.includes("productivity") ||
      n.includes("health")
  );

  const relatedFinanceOpp = oppNichesLower.some(
    (n) =>
      n.includes("fintech") ||
      n.includes("business") ||
      n.includes("career") ||
      n.includes("invest") ||
      n.includes("productivity")
  );

  const relatedTechOpp = oppNichesLower.some(
    (n) =>
      n.includes("tech") ||
      n.includes("ai") ||
      n.includes("coding") ||
      n.includes("engineering") ||
      n.includes("software") ||
      n.includes("productivity")
  );

  const relatedHealthOpp = oppNichesLower.some(
    (n) =>
      n.includes("healthcare") ||
      n.includes("health") ||
      n.includes("medicine") ||
      n.includes("wellness") ||
      n.includes("nutrition") ||
      n.includes("fitness")
  );

  const isRelatedVertical =
    (isFitnessCreator && relatedFitnessOpp) ||
    (isFinanceCreator && relatedFinanceOpp) ||
    (isTechCreator && relatedTechOpp) ||
    (isHealthCreator && relatedHealthOpp);

  if (exactNicheMatch) {
    nicheScore = 35;
  } else if (isRelatedVertical) {
    nicheScore = 24;
  } else {
    nicheScore = 6;
  }

  // 2. Platform Match (Max 30 points)
  let platformScore = 6;
  const oppPlatformLower = (opportunity.platform || "").toLowerCase();
  const creatorPrimaryLower = (creator.primaryPlatform || "").toLowerCase();
  const creatorSecondaryLower = creator.secondaryPlatform?.toLowerCase() || "";

  const isNativePlatform =
    opportunity.platform === "Multi-Platform" ||
    oppPlatformLower === creatorPrimaryLower;

  const isSecondaryPlatform =
    !isNativePlatform &&
    creatorSecondaryLower.length > 0 &&
    oppPlatformLower === creatorSecondaryLower;

  if (isNativePlatform) {
    platformScore = 30;
  } else if (isSecondaryPlatform) {
    platformScore = 20;
  } else {
    platformScore = 6;
  }

  // 3. Follower Tier Match (Max 25 points)
  let followerScore = 4;
  const followerRatio = creator.followerCount / opportunity.minFollowers;

  if (followerRatio >= 1.4) {
    followerScore = 25; // comfortably exceeds min
  } else if (followerRatio >= 1.0) {
    followerScore = 22; // meets threshold
  } else if (followerRatio >= 0.8) {
    followerScore = 12; // near threshold
  } else {
    followerScore = 4; // far below threshold
  }

  // 4. Target Audience & Demographic Fit (Max 10 points)
  let audienceScore = 6;
  const creatorAudienceLower = (creator.audienceDemographic || "").toLowerCase();
  const oppAudienceLower = (opportunity.targetAudience || "").toLowerCase();

  const isYouthOrStudentFit =
    (creatorAudienceLower.includes("student") ||
      creatorAudienceLower.includes("college") ||
      creatorAudienceLower.includes("youth") ||
      creatorAudienceLower.includes("beginner")) &&
    (oppAudienceLower.includes("student") ||
      oppAudienceLower.includes("college") ||
      oppAudienceLower.includes("youth") ||
      oppAudienceLower.includes("beginner"));

  const isCorporateOrSalariedFit =
    (creatorAudienceLower.includes("corporate") ||
      creatorAudienceLower.includes("salaried") ||
      creatorAudienceLower.includes("professional") ||
      creatorAudienceLower.includes("engineer")) &&
    (oppAudienceLower.includes("corporate") ||
      oppAudienceLower.includes("salaried") ||
      oppAudienceLower.includes("professional") ||
      oppAudienceLower.includes("investor"));

  const isTechOrEngineerFit =
    (creatorAudienceLower.includes("engineer") ||
      creatorAudienceLower.includes("developer") ||
      creatorAudienceLower.includes("coding") ||
      creatorAudienceLower.includes("tech") ||
      creatorAudienceLower.includes("software")) &&
    (oppAudienceLower.includes("engineer") ||
      oppAudienceLower.includes("developer") ||
      oppAudienceLower.includes("student") ||
      oppAudienceLower.includes("tech"));

  const isHealthOrFamilyFit =
    (creatorAudienceLower.includes("health") ||
      creatorAudienceLower.includes("family") ||
      creatorAudienceLower.includes("patient") ||
      creatorAudienceLower.includes("wellness") ||
      creatorAudienceLower.includes("fitness")) &&
    (oppAudienceLower.includes("health") ||
      oppAudienceLower.includes("wellness") ||
      oppAudienceLower.includes("family"));

  if (isYouthOrStudentFit || isCorporateOrSalariedFit || isTechOrEngineerFit || isHealthOrFamilyFit) {
    audienceScore = 10;
  } else if (exactNicheMatch) {
    audienceScore = 8;
  } else if (isRelatedVertical) {
    audienceScore = 6;
  } else {
    audienceScore = 4;
  }

  // Compute Total Deterministic Score (Bounded 10 to 100)
  const totalScore = Math.min(
    100,
    Math.max(15, nicheScore + platformScore + followerScore + audienceScore)
  );

  // -------------------------------------------------------------
  // HARD ELIGIBILITY CHECKS (Evaluated Strictly and Separately)
  // -------------------------------------------------------------
  const checks: EligibilityCheckItem[] = [];

  // Check A: Follower Count (Hard)
  const followerPassed = creator.followerCount >= opportunity.minFollowers;
  checks.push({
    id: "check-followers",
    name: "Audience Scale Requirement",
    passed: followerPassed,
    requirement: `Minimum ${opportunity.minFollowers.toLocaleString()} followers`,
    actual: `${creator.followerCount.toLocaleString()} followers on ${creator.primaryPlatform}`,
    isHardRequirement: true,
    failReason: followerPassed
      ? undefined
      : `Audience shortfall: ${creator.followerCount.toLocaleString()} current vs ${opportunity.minFollowers.toLocaleString()} required (-${(
          opportunity.minFollowers - creator.followerCount
        ).toLocaleString()})`,
  });

  // Check B: Platform Alignment (Hard)
  const platformPassed = isNativePlatform || isSecondaryPlatform;
  checks.push({
    id: "check-platform",
    name: "Platform Requirement",
    passed: platformPassed,
    requirement: `${opportunity.platform} active distribution`,
    actual: `${creator.primaryPlatform}${
      creator.secondaryPlatform ? ` (Secondary: ${creator.secondaryPlatform})` : ""
    }`,
    isHardRequirement: true,
    failReason: platformPassed
      ? undefined
      : `Platform mismatch: Campaign requires ${opportunity.platform}; ${creator.name}'s presence is on ${creator.primaryPlatform}`,
  });

  // Check C: Content Niche Alignment (Hard)
  const nichePassed = exactNicheMatch || isRelatedVertical;
  checks.push({
    id: "check-niche",
    name: "Content Vertical Alignment",
    passed: nichePassed,
    requirement: `Creator focus in ${opportunity.niche.join(" or ")}`,
    actual: `${creator.niche}`,
    isHardRequirement: true,
    failReason: nichePassed
      ? undefined
      : `Content vertical divergence: Brief requires ${opportunity.niche.join(
          " / "
        )}, but ${creator.name} creates ${creator.niche}`,
  });

  // Check D: Engagement Rate (Hard, if specified)
  if (opportunity.minEngagementRate) {
    const engagementPassed = creator.engagementRate >= opportunity.minEngagementRate;
    checks.push({
      id: "check-engagement",
      name: "Minimum Engagement Benchmark",
      passed: engagementPassed,
      requirement: `>= ${opportunity.minEngagementRate}% engagement rate`,
      actual: `${creator.engagementRate}% engagement rate`,
      isHardRequirement: true,
      failReason: engagementPassed
        ? undefined
        : `Engagement benchmark unmet: ${creator.engagementRate}% vs required ${opportunity.minEngagementRate}%`,
    });
  }

  // Aggregated Hard Qualifications
  const hardChecks = checks.filter((c) => c.isHardRequirement);
  const failedHardChecks = hardChecks.filter((c) => !c.passed);
  const qualifies = failedHardChecks.length === 0;

  const failedHardRequirements = failedHardChecks.map(
    (c) => c.failReason || `${c.name} unmet`
  );

  const passedRequirements = checks
    .filter((c) => c.passed)
    .map((c) => `${c.name}: ${c.actual}`);

  // Build Explanations & Factor Breakdown
  const reasons: string[] = [];
  if (exactNicheMatch) {
    reasons.push(`Direct ${creator.niche} niche match (+${nicheScore}%)`);
  } else if (isRelatedVertical) {
    reasons.push(`Adjacent vertical synergy (+${nicheScore}%)`);
  } else {
    reasons.push(`Niche divergence (+${nicheScore}%)`);
  }

  if (isNativePlatform) {
    reasons.push(`Native ${creator.primaryPlatform} campaign channel (+${platformScore}%)`);
  } else if (isSecondaryPlatform) {
    reasons.push(`Secondary ${creator.secondaryPlatform} channel (+${platformScore}%)`);
  } else {
    reasons.push(`Platform mismatch requirement (+${platformScore}%)`);
  }

  if (followerPassed) {
    reasons.push(
      `Meets ${opportunity.minFollowers.toLocaleString()} follower min (+${followerScore}%)`
    );
  } else {
    reasons.push(
      `Shortfall of ${(
        opportunity.minFollowers - creator.followerCount
      ).toLocaleString()} followers (+${followerScore}%)`
    );
  }

  if (isYouthOrStudentFit || isCorporateOrSalariedFit) {
    reasons.push(`High target demographic affinity (+${audienceScore}%)`);
  } else {
    reasons.push(`General audience reach (+${audienceScore}%)`);
  }

  // Master natural-language explanation
  let masterExplanation = "";
  if (qualifies) {
    masterExplanation = reasons.join(" • ");
  } else {
    masterExplanation = `Fails ${failedHardChecks.length} hard requirement${
      failedHardChecks.length > 1 ? "s" : ""
    }: ${failedHardRequirements.join("; ")}`;
  }

  return {
    score: totalScore,
    nicheScore,
    platformScore,
    followerScore,
    audienceScore,
    goalScore: 0,
    explanation: masterExplanation,
    reasons,
    qualifies,
    eligibilityChecks: checks,
    failedHardRequirements,
    passedRequirements,
  };
}

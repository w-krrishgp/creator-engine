import { CreatorProfile, Opportunity, CompatibilityBreakdown } from "@/types/creator";

export function calculateCompatibility(
  opportunity: Opportunity,
  creator: CreatorProfile
): CompatibilityBreakdown {
  // 1. Niche Match (Max 35 points)
  let nicheScore = 10;
  const creatorNicheLower = creator.niche.toLowerCase();
  const oppNichesLower = opportunity.niche.map((n) => n.toLowerCase());

  const exactNicheMatch = oppNichesLower.some(
    (n) => creatorNicheLower.includes(n) || n.includes(creatorNicheLower)
  );

  const relatedFitness =
    creatorNicheLower.includes("fitness") || creatorNicheLower.includes("health");
  const relatedFinance =
    creatorNicheLower.includes("finance") || creatorNicheLower.includes("invest");

  if (exactNicheMatch) {
    nicheScore = 35;
  } else if (
    (relatedFitness && oppNichesLower.some((n) => n.includes("wellness") || n.includes("sports") || n.includes("nutrition"))) ||
    (relatedFinance && oppNichesLower.some((n) => n.includes("business") || n.includes("fintech") || n.includes("career")))
  ) {
    nicheScore = 26;
  } else {
    nicheScore = 8;
  }

  // 2. Platform Match (Max 30 points)
  let platformScore = 8;
  if (
    opportunity.platform === "Multi-Platform" ||
    opportunity.platform.toLowerCase() === creator.primaryPlatform.toLowerCase()
  ) {
    platformScore = 30;
  } else {
    platformScore = 8;
  }

  // 3. Follower Tier Match (Max 25 points)
  let followerScore = 5;
  const qualifies = creator.followerCount >= opportunity.minFollowers;

  if (creator.followerCount >= opportunity.minFollowers * 1.5) {
    followerScore = 25; // comfortably exceeds min
  } else if (creator.followerCount >= opportunity.minFollowers) {
    followerScore = 22; // meets threshold
  } else if (creator.followerCount >= opportunity.minFollowers * 0.8) {
    followerScore = 14; // near threshold
  } else {
    followerScore = 5;
  }

  // 4. Creator Goal Alignment (Max 10 points)
  let goalScore = 6;
  const goalLower = creator.primaryGoal.toLowerCase();
  if (goalLower.includes("monetis") || goalLower.includes("brand") || goalLower.includes("sponsor")) {
    goalScore = 10;
  } else if (goalLower.includes("consult") || goalLower.includes("client")) {
    // If brand opportunity is B2B or fintech consulting aligned
    if (opportunity.niche.some((n) => n.toLowerCase().includes("b2b") || n.toLowerCase().includes("finance"))) {
      goalScore = 10;
    } else {
      goalScore = 7;
    }
  } else {
    goalScore = 8;
  }

  const totalScore = Math.min(100, Math.max(20, nicheScore + platformScore + followerScore + goalScore));

  const reasons: string[] = [];
  if (nicheScore >= 30) {
    reasons.push(`Direct ${creator.niche} niche match (+${nicheScore}%)`);
  } else if (nicheScore >= 20) {
    reasons.push(`Adjacent vertical match (+${nicheScore}%)`);
  } else {
    reasons.push(`Niche divergence (+${nicheScore}%)`);
  }

  if (platformScore === 30) {
    reasons.push(`Native ${creator.primaryPlatform} focus (+30%)`);
  } else {
    reasons.push(`Cross-platform requirement (+${platformScore}%)`);
  }

  if (qualifies) {
    reasons.push(`Meets ${opportunity.minFollowers.toLocaleString()} follower min (+${followerScore}%)`);
  } else {
    reasons.push(`Below target requirement of ${opportunity.minFollowers.toLocaleString()} (+${followerScore}%)`);
  }

  reasons.push(`Aligned to "${creator.primaryGoal}" (+${goalScore}%)`);

  return {
    score: totalScore,
    nicheScore,
    platformScore,
    followerScore,
    goalScore,
    explanation: reasons.join(" • "),
    qualifies,
  };
}

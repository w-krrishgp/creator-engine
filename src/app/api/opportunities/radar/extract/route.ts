import { NextRequest, NextResponse } from "next/server";
import { fetchTinyFish, isTinyFishConfigured, TinyFishError } from "@/lib/tinyfish/client";
import { validateSafePublicUrl } from "@/lib/tinyfish/urlSafety";
import { GoogleGenAI } from "@google/genai";
import { CreatorProfile } from "@/types/creator";
import {
  RadarExtractResponse,
  RadarExtractedCampaign,
  RadarGeneratedPitch,
} from "@/types/radar";

const DEFAULT_TIMEOUT_MS = 20000;

/**
 * Deterministic heuristic fallback extractor when Gemini is unavailable.
 * Ensures zero hallucinations and strict adherence to text truth.
 */
function heuristicExtract(
  markdownText: string,
  pageTitle: string | undefined,
  targetUrl: string,
  finalUrl: string,
  timestamp: string
): RadarExtractedCampaign {
  const lower = markdownText.toLowerCase();

  // 1. Brand name extraction from title or URL
  let brandName = "Brand Partner";
  if (pageTitle && pageTitle.trim()) {
    const titleParts = pageTitle.split(/[-|:–•]/);
    brandName = titleParts[0].trim().slice(0, 40);
  } else {
    try {
      const parsed = new URL(finalUrl || targetUrl);
      const hostParts = parsed.hostname.replace(/^www\./, "").split(".");
      brandName = hostParts[0].charAt(0).toUpperCase() + hostParts[0].slice(1);
    } catch {
      brandName = "Brand Partner";
    }
  }

  // 2. Identify potential application URL
  let applicationUrl: string | null = null;
  const linkMatches = markdownText.match(/https?:\/\/[^\s)"]+/g) || [];
  for (const l of linkMatches) {
    const lLower = l.toLowerCase();
    if (
      lLower.includes("apply") ||
      lLower.includes("form") ||
      lLower.includes("creator") ||
      lLower.includes("ambassador") ||
      lLower.includes("join")
    ) {
      applicationUrl = l;
      break;
    }
  }

  // 3. Scan for compensation indicators (strict, no fabrication)
  let compensation: string | null = null;
  let compensationVerified = false;
  const currencyMatch = markdownText.match(/(?:₹|\$|€|£|INR|USD)\s?[\d,]+(?:\s?-\s?(?:₹|\$|€|£|INR|USD)?\s?[\d,]+)?/i);
  if (currencyMatch) {
    compensation = currencyMatch[0].trim();
    compensationVerified = true;
  } else if (lower.includes("free product") || lower.includes("gifting") || lower.includes("complimentary")) {
    compensation = "Product Gifting / In-Kind";
    compensationVerified = true;
  } else if (lower.includes("commission") || lower.includes("affiliate")) {
    compensation = "Performance Commission / Affiliate";
    compensationVerified = true;
  }

  // 4. Scan for deadline indicators
  let publishedDeadline: string | null = null;
  let deadlineVerified = false;
  const deadlineMatch = markdownText.match(/(?:deadline|apply by|closing date|ends on)[:\s]+([A-Za-z]+ \d{1,2},? \d{4}|\d{1,2}\/\d{1,2}\/\d{2,4})/i);
  if (deadlineMatch) {
    publishedDeadline = deadlineMatch[1].trim();
    deadlineVerified = true;
  }

  // 5. Requirements extraction from bullet lines
  const requirements: string[] = [];
  const lines = markdownText.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if ((trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed)) && trimmed.length > 15) {
      const clean = trimmed.replace(/^[-*\d.]+\s*/, "").trim();
      const cleanLower = clean.toLowerCase();
      if (
        cleanLower.includes("follower") ||
        cleanLower.includes("creator") ||
        cleanLower.includes("audience") ||
        cleanLower.includes("engagement") ||
        cleanLower.includes("platform") ||
        cleanLower.includes("age") ||
        cleanLower.includes("country")
      ) {
        requirements.push(clean.slice(0, 160));
        if (requirements.length >= 5) break;
      }
    }
  }

  const missingInfo: string[] = [];
  if (!compensationVerified) {
    missingInfo.push("Compensation not specified on page (may be negotiated based on deliverables).");
  }
  if (!deadlineVerified) {
    missingInfo.push("Specific deadline not stated on page (likely rolling admissions or ongoing).");
  }
  if (requirements.length === 0) {
    missingInfo.push("Explicit numeric follower/engagement requirements not detailed in public brief.");
  }

  return {
    brandName,
    campaignTitle: pageTitle || `${brandName} Creator Program`,
    campaignDescription: markdownText.slice(0, 300).replace(/^[#\s]+/, "").trim() + "...",
    eligibilityRequirements: requirements.length > 0 ? requirements : ["See official page for complete qualification guidelines."],
    compensation,
    publishedDeadline,
    applicationUrl: applicationUrl || finalUrl || targetUrl,
    targetAudience: null,
    targetLocation: null,
    sourceUrl: targetUrl,
    finalUrl: finalUrl || targetUrl,
    retrievalTimestamp: timestamp,
    verification: {
      brandVerified: brandName !== "Brand Partner",
      requirementsVerified: requirements.length > 0,
      compensationVerified,
      deadlineVerified,
      applicationLinkVerified: applicationUrl !== null,
    },
    missingInformation: missingInfo,
    sourcePageTitle: pageTitle,
    isAuthenticCampaignPage: true,
    rawExcerpt: markdownText.slice(0, 1500),
  };
}

/**
 * Reuses Google Gemini to extract factual campaign data and draft a tailored creator pitch.
 */
async function aiExtractAndSynthesize(
  markdownText: string,
  pageTitle: string | undefined,
  targetUrl: string,
  finalUrl: string,
  timestamp: string,
  creator?: CreatorProfile
): Promise<{ campaign: RadarExtractedCampaign; pitch?: RadarGeneratedPitch }> {
  const apiKey = process.env.GEMINI_API_KEY;
  const isGeminiAvailable = apiKey && apiKey.trim().length > 0 && !apiKey.includes("placeholder");

  if (!isGeminiAvailable) {
    const fallbackCampaign = heuristicExtract(markdownText, pageTitle, targetUrl, finalUrl, timestamp);
    const fallbackPitch = creator ? generateFallbackPitch(fallbackCampaign, creator) : undefined;
    return { campaign: fallbackCampaign, pitch: fallbackPitch };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    const excerpt = markdownText.slice(0, 8000); // Guard payload size

    const prompt = `
You are the Brand Partnership Strategist for Creator Engine.
Carefully inspect the following live webpage content retrieved from "${targetUrl}".

WEBPAGE METADATA:
- Title: ${pageTitle || "Untitled"}
- Source URL: ${targetUrl}
- Final URL: ${finalUrl}

WEBPAGE EXTRACTED TEXT:
"""
${excerpt}
"""

${creator ? `
CREATOR PROFILE TO TAILOR OUTREACH FOR:
- Name: ${creator.name} (${creator.handle})
- Niche: ${creator.niche}
- Primary Platform: ${creator.primaryPlatform} (${creator.followerCount.toLocaleString()} followers, ${creator.engagementRate}% engagement)
- Bio: ${creator.bio}
- Location: ${creator.location}
- Content Style: ${creator.contentFormat || "Reels & short-form video"}
- Target Audience: ${creator.audienceDemographic || "Engaged community"}
` : ""}

CRITICAL RULES:
1. ONLY extract information that is explicitly stated in the webpage text.
2. If compensation is NOT stated, return null. Do NOT invent a budget.
3. If deadline is NOT stated, return null. Do NOT invent a date.
4. If minimum followers or requirements are NOT stated, return empty array. Do NOT invent eligibility rules.
5. Identify whether this page is actually an authentic brand partnership / creator sponsorship / ambassador page.

Return a valid JSON object matching this EXACT schema:
{
  "brandName": "Exact Brand Name from text",
  "campaignTitle": "Title of creator program or sponsorship",
  "campaignDescription": "Concise 2-3 sentence summary of what the brand is looking for",
  "eligibilityRequirements": ["Requirement 1 found in text", "Requirement 2 found in text"],
  "compensation": "Stated budget or product gifting, or null if unmentioned",
  "publishedDeadline": "Stated deadline date or null if not mentioned",
  "applicationUrl": "Direct application link if found in text or null",
  "targetAudience": "Target audience mentioned by brand or null",
  "targetLocation": "Geographic restriction if stated or null",
  "isAuthenticCampaignPage": true,
  "missingInformation": [
    "List fields that were completely absent from the source page"
  ]
  ${creator ? `,
  "pitch": {
    "subject": "Professional email/DM subject line tailored to the brand",
    "elevatorPitch": "Compelling 2-sentence hook highlighting the creator's fit",
    "fullOutreachMessage": "Polished, editable 3-paragraph outreach proposal incorporating the creator's real metrics and specific ideas for the brand",
    "suggestedDeliverables": ["Deliverable 1 tailored to campaign", "Deliverable 2 tailored to campaign"],
    "suggestedFeeRange": "Estimated fair market fee based on creator follower count (clearly labeled as estimate)"
  }` : ""}
}
`;

    const candidateModels = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.8-flash"];
    let aiResponseText = "";
    let modelUsed = candidateModels[0];

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });
        if (response?.text) {
          aiResponseText = response.text;
          modelUsed = model;
          break;
        }
      } catch (e) {
        console.warn(`Gemini model ${model} extraction attempt error:`, e instanceof Error ? e.message : String(e));
      }
    }

    if (!aiResponseText) {
      throw new Error("Empty response from candidate Gemini models");
    }

    const parsed = JSON.parse(aiResponseText);

    const brandName = typeof parsed.brandName === "string" && parsed.brandName.trim() ? parsed.brandName : "Brand Partner";
    const compensation = typeof parsed.compensation === "string" ? parsed.compensation : null;
    const publishedDeadline = typeof parsed.publishedDeadline === "string" ? parsed.publishedDeadline : null;
    const requirements = Array.isArray(parsed.eligibilityRequirements) ? parsed.eligibilityRequirements.filter((r: unknown): r is string => typeof r === "string") : [];
    const missingInfo = Array.isArray(parsed.missingInformation) ? parsed.missingInformation.filter((m: unknown): m is string => typeof m === "string") : [];

    const campaign: RadarExtractedCampaign = {
      brandName,
      campaignTitle: typeof parsed.campaignTitle === "string" ? parsed.campaignTitle : `${brandName} Creator Program`,
      campaignDescription: typeof parsed.campaignDescription === "string" ? parsed.campaignDescription : excerpt.slice(0, 250),
      eligibilityRequirements: requirements.length > 0 ? requirements : ["See official page for qualification guidelines."],
      compensation,
      publishedDeadline,
      applicationUrl: typeof parsed.applicationUrl === "string" ? parsed.applicationUrl : finalUrl || targetUrl,
      targetAudience: typeof parsed.targetAudience === "string" ? parsed.targetAudience : null,
      targetLocation: typeof parsed.targetLocation === "string" ? parsed.targetLocation : null,
      sourceUrl: targetUrl,
      finalUrl: finalUrl || targetUrl,
      retrievalTimestamp: timestamp,
      verification: {
        brandVerified: brandName !== "Brand Partner",
        requirementsVerified: requirements.length > 0,
        compensationVerified: compensation !== null,
        deadlineVerified: publishedDeadline !== null,
        applicationLinkVerified: Boolean(parsed.applicationUrl),
      },
      missingInformation: missingInfo,
      sourcePageTitle: pageTitle,
      isAuthenticCampaignPage: Boolean(parsed.isAuthenticCampaignPage ?? true),
      rawExcerpt: excerpt.slice(0, 1500),
    };

    let pitch: RadarGeneratedPitch | undefined;
    if (creator && parsed.pitch) {
      pitch = {
        subject: typeof parsed.pitch.subject === "string" ? parsed.pitch.subject : `Collaboration Inquiry: ${creator.name} x ${brandName}`,
        elevatorPitch: typeof parsed.pitch.elevatorPitch === "string" ? parsed.pitch.elevatorPitch : "",
        fullOutreachMessage: typeof parsed.pitch.fullOutreachMessage === "string" ? parsed.pitch.fullOutreachMessage : "",
        suggestedDeliverables: Array.isArray(parsed.pitch.suggestedDeliverables)
          ? parsed.pitch.suggestedDeliverables.filter((d: unknown): d is string => typeof d === "string")
          : ["1x Dedicated Video Integration", "2x Story Callouts"],
        suggestedFeeRange: typeof parsed.pitch.suggestedFeeRange === "string" ? parsed.pitch.suggestedFeeRange : undefined,
        modelUsed,
        isFallback: false,
        creatorMatchedId: creator.id,
      };
    } else if (creator) {
      pitch = generateFallbackPitch(campaign, creator);
    }

    return { campaign, pitch };
  } catch (err: unknown) {
    console.warn("Gemini extraction error; falling back to deterministic extraction:", err instanceof Error ? err.message : String(err));
    const fallbackCampaign = heuristicExtract(markdownText, pageTitle, targetUrl, finalUrl, timestamp);
    const fallbackPitch = creator ? generateFallbackPitch(fallbackCampaign, creator) : undefined;
    return { campaign: fallbackCampaign, pitch: fallbackPitch };
  }
}

function generateFallbackPitch(campaign: RadarExtractedCampaign, creator: CreatorProfile): RadarGeneratedPitch {
  const brand = campaign.brandName || "Partnership";
  return {
    subject: `Partnership Inquiry: ${creator.name} (@${creator.handle.replace("@", "")}) x ${brand}`,
    elevatorPitch: `Hi ${brand} team, I'm ${creator.name}, a ${creator.niche} creator reaching ${creator.followerCount.toLocaleString()} engaged followers on ${creator.primaryPlatform} (${creator.engagementRate}% engagement rate).`,
    fullOutreachMessage: `Hi ${brand} Team,\n\nI recently came across your ${campaign.campaignTitle} and love your focus. As a dedicated ${creator.niche} creator on ${creator.primaryPlatform} with ${creator.followerCount.toLocaleString()} verified followers (${creator.engagementRate}% engagement), my audience aligns directly with your mission.\n\nFor this collaboration, I would love to create authentic content demonstrating your products in real-world scenarios that drive meaningful community action.\n\nLooking forward to connecting on deliverables and timeline!\n\nBest regards,\n${creator.name}\n${creator.handle}`,
    suggestedDeliverables: [
      `1x Dedicated ${creator.primaryPlatform} Feature`,
      `2x Interactive Story / Community Shares`,
      `Trackable link in bio for 14 days`,
    ],
    suggestedFeeRange: `₹${Math.round(creator.followerCount * 1.5).toLocaleString()} – ₹${Math.round(creator.followerCount * 2.8).toLocaleString()} (Estimated Fair Value)`,
    modelUsed: "deterministic-creator-template",
    isFallback: true,
    creatorMatchedId: creator.id,
  };
}

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          retrievalTimestamp: new Date().toISOString(),
          error: "INVALID_JSON",
          details: "Invalid JSON request payload.",
        } satisfies RadarExtractResponse,
        { status: 400 }
      );
    }

    const rawUrl = typeof body.url === "string" ? body.url.trim() : "";
    const creatorProfile = (body.creatorProfile && typeof body.creatorProfile === "object" ? body.creatorProfile : undefined) as CreatorProfile | undefined;

    // 1. SSRF & URL Safety Validation
    const urlCheck = validateSafePublicUrl(rawUrl);
    if (!urlCheck.safe || !urlCheck.normalizedUrl) {
      return NextResponse.json(
        {
          success: false,
          retrievalTimestamp: new Date().toISOString(),
          error: "UNSAFE_URL",
          details: urlCheck.reason || "The requested URL is not a permitted public web endpoint.",
        } satisfies RadarExtractResponse,
        { status: 400 }
      );
    }

    // 2. Check TinyFish API key configuration
    if (!isTinyFishConfigured()) {
      return NextResponse.json(
        {
          success: false,
          retrievalTimestamp: new Date().toISOString(),
          error: "TINYFISH_UNCONFIGURED",
          details: "TINYFISH_API_KEY is not configured in .env.local. Add your key from agent.tinyfish.ai to enable live web extraction.",
        } satisfies RadarExtractResponse,
        { status: 200 } // Graceful return
      );
    }

    // 3. Execute TinyFish Fetch
    const fetchResponse = await fetchTinyFish(
      [urlCheck.normalizedUrl],
      {
        format: "markdown",
        ttl: 0, // Force fresh live extraction
        purpose: "Extract brand partnership, creator eligibility, compensation, and application details",
      },
      DEFAULT_TIMEOUT_MS
    );

    const timestamp = new Date().toISOString();

    if (fetchResponse.results.length === 0) {
      const errorMsg = fetchResponse.errors[0]?.error || "TinyFish was unable to extract readable content from this webpage.";
      return NextResponse.json(
        {
          success: false,
          retrievalTimestamp: timestamp,
          error: "FETCH_FAILED",
          details: errorMsg,
        } satisfies RadarExtractResponse,
        { status: 502 }
      );
    }

    const fetchedItem = fetchResponse.results[0];
    const markdownText = fetchedItem.text || "";

    if (!markdownText.trim()) {
      return NextResponse.json(
        {
          success: false,
          retrievalTimestamp: timestamp,
          error: "EMPTY_CONTENT",
          details: "The destination page returned no readable text or is behind an impenetrable paywall/login barrier.",
        } satisfies RadarExtractResponse,
        { status: 422 }
      );
    }

    // 4. Synthesize factual extraction and tailored pitch
    const { campaign, pitch } = await aiExtractAndSynthesize(
      markdownText,
      fetchedItem.title,
      urlCheck.normalizedUrl,
      fetchedItem.final_url || urlCheck.normalizedUrl,
      timestamp,
      creatorProfile
    );

    return NextResponse.json({
      success: true,
      retrievalTimestamp: timestamp,
      campaign,
      pitch,
    } satisfies RadarExtractResponse);
  } catch (err: unknown) {
    const timestamp = new Date().toISOString();

    if (err instanceof TinyFishError) {
      return NextResponse.json(
        {
          success: false,
          retrievalTimestamp: timestamp,
          error: err.code,
          details: err.message,
        } satisfies RadarExtractResponse,
        { status: err.statusCode || 500 }
      );
    }

    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        success: false,
        retrievalTimestamp: timestamp,
        error: "INTERNAL_ERROR",
        details: `Failed to extract webpage context: ${message}`,
      } satisfies RadarExtractResponse,
      { status: 500 }
    );
  }
}

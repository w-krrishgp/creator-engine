import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { CreatorProfile } from "@/types/creator";
import { AiRecommendationsResponse } from "@/types/ai";
import { generateFallbackRecommendations } from "@/lib/ai/fallbackRecommendations";
import { verifyAndConsumeAiQuota } from "@/lib/subscription/serverGate";


type UnknownRecord = Record<string, unknown>;

/**
 * Validates and cleans raw AI output into a well-structured AiRecommendationsResponse.
 */
function validateAndSanitizeAiOutput(
  rawJsonInput: unknown,
  creator: CreatorProfile,
  modelName: string
): AiRecommendationsResponse {
  const rawJson = (rawJsonInput && typeof rawJsonInput === "object" ? rawJsonInput : {}) as UnknownRecord;
  const rawPositioning = (rawJson.positioning && typeof rawJson.positioning === "object" ? rawJson.positioning : {}) as UnknownRecord;
  const fallback = generateFallbackRecommendations(creator);

  const positioning = {
    thesis: typeof rawPositioning.thesis === "string" && rawPositioning.thesis.trim().length > 0
      ? rawPositioning.thesis
      : fallback.positioning.thesis,
    targetAudience: typeof rawPositioning.targetAudience === "string" && rawPositioning.targetAudience.trim().length > 0
      ? rawPositioning.targetAudience
      : fallback.positioning.targetAudience,
    differentiator: typeof rawPositioning.differentiator === "string" && rawPositioning.differentiator.trim().length > 0
      ? rawPositioning.differentiator
      : fallback.positioning.differentiator,
    elevatorPitch: typeof rawPositioning.elevatorPitch === "string" && rawPositioning.elevatorPitch.trim().length > 0
      ? rawPositioning.elevatorPitch
      : fallback.positioning.elevatorPitch,
  };

  const growthRoadmap = Array.isArray(rawJson.growthRoadmap) && rawJson.growthRoadmap.length > 0
    ? (rawJson.growthRoadmap as UnknownRecord[]).map((phase, index) => {
        const fallbackPhase = fallback.growthRoadmap[index] || fallback.growthRoadmap[0];
        const days = typeof phase?.days === "string" && ["30 Days", "60 Days", "90 Days"].includes(phase.days)
          ? (phase.days as "30 Days" | "60 Days" | "90 Days")
          : fallbackPhase.days;

        return {
          days,
          phaseTitle: typeof phase?.phaseTitle === "string" ? phase.phaseTitle : fallbackPhase.phaseTitle,
          phaseObjective: typeof phase?.phaseObjective === "string" ? phase.phaseObjective : fallbackPhase.phaseObjective,
          milestones: Array.isArray(phase?.milestones) && phase.milestones.length > 0
            ? (phase.milestones as UnknownRecord[]).map((m) => ({
                title: typeof m?.title === "string" ? m.title : "Key Execution Milestone",
                description: typeof m?.description === "string" ? m.description : "",
                tag: typeof m?.tag === "string" ? m.tag : "Growth",
              }))
            : fallbackPhase.milestones,
          contentGaps: Array.isArray(phase?.contentGaps) && phase.contentGaps.length > 0
            ? (phase.contentGaps as UnknownRecord[]).map((g) => ({
                gap: typeof g?.gap === "string" ? g.gap : (typeof g === "string" ? g : "Content cadence gap"),
                reason: typeof g?.reason === "string" ? g.reason : "Impacting engagement retention.",
                impactLevel: typeof g?.impactLevel === "string" && ["Critical", "High", "Medium"].includes(g.impactLevel)
                  ? (g.impactLevel as "Critical" | "High" | "Medium")
                  : ("High" as const),
              }))
            : fallbackPhase.contentGaps,
          skillsToImprove: Array.isArray(phase?.skillsToImprove) && phase.skillsToImprove.length > 0
            ? (phase.skillsToImprove as UnknownRecord[]).map((s) => ({
                skill: typeof s?.skill === "string" ? s.skill : (typeof s === "string" ? s : "Core skill priority"),
                category: typeof s?.category === "string" && ["Content Production", "Commercial & Pitching", "Audience Retention", "Legal & Compliance", "Strategy"].includes(s.category)
                  ? (s.category as "Content Production" | "Commercial & Pitching" | "Audience Retention" | "Legal & Compliance" | "Strategy")
                  : ("Content Production" as const),
                priority: typeof s?.priority === "string" && ["Critical", "High", "Medium"].includes(s.priority)
                  ? (s.priority as "Critical" | "High" | "Medium")
                  : ("High" as const),
                actionStep: typeof s?.actionStep === "string" ? s.actionStep : "Implement daily practice routine.",
              }))
            : fallbackPhase.skillsToImprove,
          topicOpportunities: Array.isArray(phase?.topicOpportunities) && phase.topicOpportunities.length > 0
            ? (phase.topicOpportunities as UnknownRecord[]).map((t) => ({
                title: typeof t?.title === "string" ? t.title : "High Impact Content Angle",
                hookAngle: typeof t?.hookAngle === "string" ? t.hookAngle : "Address core audience pain point.",
                suggestedFormat: typeof t?.suggestedFormat === "string" ? t.suggestedFormat : "Short-form video",
                targetAudience: typeof t?.targetAudience === "string" ? t.targetAudience : creator.audienceDemographic,
              }))
            : fallbackPhase.topicOpportunities,
        };
      })
    : fallback.growthRoadmap;

  const monetisationPathways = Array.isArray(rawJson.monetisationPathways) && rawJson.monetisationPathways.length > 0
    ? (rawJson.monetisationPathways as UnknownRecord[]).map((m, index) => {
        const fallbackChannel = fallback.monetisationPathways[index] || fallback.monetisationPathways[0];
        const validCategories = ["brand_collaborations", "affiliate_marketing", "consulting_services", "digital_products", "pr_speaking"];
        const category = typeof m?.category === "string" && validCategories.includes(m.category)
          ? (m.category as "brand_collaborations" | "affiliate_marketing" | "consulting_services" | "digital_products" | "pr_speaking")
          : fallbackChannel.category;

        return {
          channelTitle: typeof m?.channelTitle === "string" ? m.channelTitle : fallbackChannel.channelTitle,
          category,
          suitabilityScore: typeof m?.suitabilityScore === "number" && m.suitabilityScore >= 0 && m.suitabilityScore <= 100
            ? Math.round(m.suitabilityScore)
            : fallbackChannel.suitabilityScore,
          whyItSuits: typeof m?.whyItSuits === "string" ? m.whyItSuits : fallbackChannel.whyItSuits,
          suggestedFirstStep: typeof m?.suggestedFirstStep === "string" ? m.suggestedFirstStep : fallbackChannel.suggestedFirstStep,
          estimatedPotential: typeof m?.estimatedPotential === "string" ? m.estimatedPotential : fallbackChannel.estimatedPotential,
          readinessStatus: typeof m?.readinessStatus === "string" && ["Ready to Launch", "High Opportunity", "Scale Phase"].includes(m.readinessStatus)
            ? (m.readinessStatus as "Ready to Launch" | "High Opportunity" | "Scale Phase")
            : fallbackChannel.readinessStatus,
          launchChecklist: Array.isArray(m?.launchChecklist) && m.launchChecklist.length > 0
            ? (m.launchChecklist as unknown[]).map((c) => String(c))
            : fallbackChannel.launchChecklist,
        };
      })
    : fallback.monetisationPathways;

  const nextActions = Array.isArray(rawJson.nextActions) && rawJson.nextActions.length > 0
    ? (rawJson.nextActions as UnknownRecord[]).map((a, index) => {
        const fallbackAction = fallback.nextActions[index] || fallback.nextActions[0];
        const validCategories = ["Growth", "Monetisation", "Brand Pitch", "Audience Trust"];
        const category = typeof a?.category === "string" && validCategories.includes(a.category)
          ? (a.category as "Growth" | "Monetisation" | "Brand Pitch" | "Audience Trust")
          : fallbackAction.category;

        return {
          title: typeof a?.title === "string" ? a.title : fallbackAction.title,
          category,
          priority: typeof a?.priority === "string" && ["High", "Medium", "Low"].includes(a.priority)
            ? (a.priority as "High" | "Medium" | "Low")
            : ("High" as const),
          reason: typeof a?.reason === "string" ? a.reason : fallbackAction.reason,
          deadline: typeof a?.deadline === "string" ? a.deadline : "In 5 days",
          estimatedTime: typeof a?.estimatedTime === "string" ? a.estimatedTime : "45 mins",
          relatedType: typeof a?.relatedType === "string" && ["roadmap", "opportunity", "monetisation", "goal"].includes(a.relatedType)
            ? (a.relatedType as "roadmap" | "opportunity" | "monetisation" | "goal")
            : fallbackAction.relatedType,
          relatedTitle: typeof a?.relatedTitle === "string" ? a.relatedTitle : fallbackAction.relatedTitle,
        };
      })
    : fallback.nextActions;

  return {
    success: true,
    isDemoMode: false,
    generatedAt: new Date().toISOString(),
    creatorId: creator.id,
    modelUsed: modelName,
    positioning,
    growthRoadmap,
    monetisationPathways,
    nextActions,
  };
}

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const isApiKeyMissingOrPlaceholder =
    !apiKey ||
    apiKey.trim() === "" ||
    apiKey.includes("placeholder") ||
    apiKey.includes("your-gemini-api-key");

  return NextResponse.json({
    configured: !isApiKeyMissingOrPlaceholder,
    model: "gemini-3.8-flash",
  });
}

export async function POST(req: NextRequest) {
  let requestCreator: CreatorProfile | null = null;
  try {
    const body = await req.json();
    requestCreator = body?.creator as CreatorProfile;
    const creator = requestCreator;

    if (!creator || !creator.id || !creator.name) {
      return NextResponse.json(
        { error: "Invalid request payload: creator object is required." },
        { status: 400 }
      );
    }

    // SERVER-SIDE SUBSCRIPTION & QUOTA GATEKEEPER
    // Enforces verified subscription and quota limits directly on the server.
    // Never trusts client-supplied plan parameters.
    const quotaCheck = await verifyAndConsumeAiQuota(creator.id);
    if (!quotaCheck.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: "QUOTA_EXCEEDED",
          message: quotaCheck.reason,
          planId: quotaCheck.verifiedSub.planId,
          planName: quotaCheck.verifiedSub.plan.name,
          aiUsage: quotaCheck.verifiedSub.aiUsage,
          aiLimit: quotaCheck.verifiedSub.aiLimit,
          usageResetAt: quotaCheck.verifiedSub.usageResetAt,
          upgradeRequired: quotaCheck.verifiedSub.planId === "normal" ? "pro" : "pro_plus",
        },
        { status: 403 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isApiKeyMissingOrPlaceholder =
      !apiKey ||
      apiKey.trim() === "" ||
      apiKey.includes("placeholder") ||
      apiKey.includes("your-gemini-api-key");

    if (isApiKeyMissingOrPlaceholder) {
      // Gracefully return deterministic demo recommendations without crashing
      const fallback = generateFallbackRecommendations(
        creator,
        "Operating in Demo Mode: GEMINI_API_KEY is not configured in .env.local. Showing high-fidelity deterministic recommendations."
      );
      return NextResponse.json(fallback);
    }

    // Build focused prompt
    const prompt = `
You are the Chief Creator Strategist for Creator Engine.
Analyze the following verified creator profile and generate tailored, high-impact growth and commercial recommendations.

CREATOR PROFILE DATA:
- Name: ${creator.name} (${creator.handle})
- Niche: ${creator.niche}
- Primary Platform: ${creator.primaryPlatform} (${creator.followerCount.toLocaleString()} followers)
- Secondary Platform: ${creator.secondaryPlatform || "None"} (${(creator.secondaryFollowers || 0).toLocaleString()} followers)
- Engagement Rate: ${creator.engagementRate}%
- Creator Stage: ${creator.creatorStage}
- Experience Level: ${creator.experienceLevel || "Growing"}
- Primary Goal: ${creator.primaryGoal}
- Monthly Income Target: ₹${creator.monthlyIncomeTarget.toLocaleString()} / mo
- Bio & Focus: ${creator.bio}
- Location: ${creator.location}
- Topics Covered: ${(creator.topics || []).join(", ")}

CRITICAL GOVERNANCE REQUIREMENTS:
1. Do NOT invent brand campaigns or alter campaign eligibility requirements. Brand campaign matching and eligibility checks are governed strictly by deterministic rules. Focus solely on creator positioning, content gaps, skill priorities, topic opportunities, 30/60/90-day execution milestones, monetisation channels, and reasoned next actions.
2. Return ONLY a single valid JSON object with the following structure (no markdown wrappers):
{
  "positioning": {
    "thesis": "Concise market thesis summarizing why this creator wins in their niche",
    "targetAudience": "Specific audience demographic and persona description",
    "differentiator": "Core unique advantage or hook",
    "elevatorPitch": "1-sentence conversational pitch"
  },
  "growthRoadmap": [
    {
      "days": "30 Days",
      "phaseTitle": "Phase 1 title",
      "phaseObjective": "Concrete objective for first 30 days",
      "milestones": [
        { "title": "Milestone title", "description": "Specific execution detail", "tag": "Category Tag" }
      ],
      "contentGaps": [
        { "gap": "Identified gap description", "reason": "Algorithmic or psychological reason why this hurts performance", "impactLevel": "Critical" }
      ],
      "skillsToImprove": [
        { "skill": "Skill name", "category": "Content Production", "priority": "Critical", "actionStep": "Concrete practice step" }
      ],
      "topicOpportunities": [
        { "title": "Topic title", "hookAngle": "Hook angle or psychological hook", "suggestedFormat": "Format type", "targetAudience": "Audience sub-segment" }
      ]
    },
    {
      "days": "60 Days",
      "phaseTitle": "Phase 2 title",
      "phaseObjective": "Concrete objective for days 31-60",
      "milestones": [ { "title": "...", "description": "...", "tag": "..." } ],
      "contentGaps": [ { "gap": "...", "reason": "...", "impactLevel": "High" } ],
      "skillsToImprove": [ { "skill": "...", "category": "Commercial & Pitching", "priority": "High", "actionStep": "..." } ],
      "topicOpportunities": [ { "title": "...", "hookAngle": "...", "suggestedFormat": "...", "targetAudience": "..." } ]
    },
    {
      "days": "90 Days",
      "phaseTitle": "Phase 3 title",
      "phaseObjective": "Concrete objective for days 61-90",
      "milestones": [ { "title": "...", "description": "...", "tag": "..." } ],
      "contentGaps": [ { "gap": "...", "reason": "...", "impactLevel": "Medium" } ],
      "skillsToImprove": [ { "skill": "...", "category": "Strategy", "priority": "High", "actionStep": "..." } ],
      "topicOpportunities": [ { "title": "...", "hookAngle": "...", "suggestedFormat": "...", "targetAudience": "..." } ]
    }
  ],
  "monetisationPathways": [
    {
      "channelTitle": "e.g. Micro-Sponsorships & Dedicated Reels",
      "category": "brand_collaborations",
      "suitabilityScore": 92,
      "whyItSuits": "Direct reason tailored to their audience and metrics",
      "suggestedFirstStep": "First tangible action to test this revenue stream",
      "estimatedPotential": "₹20,000 – ₹45,000 / month",
      "readinessStatus": "Ready to Launch",
      "launchChecklist": ["Step 1", "Step 2", "Step 3"]
    }
  ],
  "nextActions": [
    {
      "title": "Clear action title",
      "category": "Growth",
      "priority": "High",
      "reason": "Detailed strategic reason explaining why this action matters right now",
      "deadline": "In 3 days",
      "estimatedTime": "45 mins",
      "relatedType": "roadmap",
      "relatedTitle": "Phase 1: Foundation"
    }
  ]
}
`;

    // Attempt Gemini call with candidate models and timeout safety
    const ai = new GoogleGenAI({ apiKey });
    const candidateModels = ["gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite"];
    let responseText = "";
    let modelUsed = candidateModels[0];

    for (const model of candidateModels) {
      try {
        const callPromise = ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Model ${model} timed out after 20 seconds`)), 20000)
        );

        const response = (await Promise.race([callPromise, timeoutPromise])) as { text?: string } | undefined;
        if (response?.text) {
          responseText = response.text;
          modelUsed = model;
          break;
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`Gemini generation with ${model} encountered notice:`, message);
      }
    }

    if (!responseText) {
      throw new Error("Unable to obtain response text from Gemini candidate models");
    }

    // Clean JSON response (strip markdown wrappers if model emitted them)
    let cleanedJsonText = responseText.trim();
    if (cleanedJsonText.startsWith("```json")) {
      cleanedJsonText = cleanedJsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanedJsonText.startsWith("```")) {
      cleanedJsonText = cleanedJsonText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const parsedJson = JSON.parse(cleanedJsonText);
    const sanitizedResult = validateAndSanitizeAiOutput(parsedJson, creator, modelUsed);

    return NextResponse.json({
      ...sanitizedResult,
      usage: {
        aiUsage: quotaCheck.verifiedSub.aiUsage,
        aiLimit: quotaCheck.verifiedSub.aiLimit,
        aiRemaining: quotaCheck.verifiedSub.aiRemaining,
        usageResetAt: quotaCheck.verifiedSub.usageResetAt,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Gemini API Error in /api/recommendations:", message);

    // If an error or rate limit occurs, gracefully fall back to deterministic response
    // rather than breaking the application experience
    const fallback = generateFallbackRecommendations(
      requestCreator || {
        id: "demo",
        name: "Creator",
        handle: "@creator",
        avatar: "",
        title: "Content Creator",
        niche: "Content Creation",
        followerCount: 10000,
        primaryPlatform: "Instagram",
        creatorStage: "Micro (10k-50k)",
        engagementRate: 4.0,
        audienceDemographic: "General audience",
        contentFormat: "Short-form video",
        primaryGoal: "Audience growth",
        monthlyIncomeTarget: 50000,
        bio: "Creator",
        location: "India",
        topics: ["Content Strategy"],
        activeDealsCount: 0,
        estimatedPipelineValue: 0,
        monthlyGrowthRate: 5.0,
        avgImpressionsPerPost: 15000,
      },
      `Gemini service notice: ${message || "Temporarily unavailable"}. Switched to deterministic recommendations.`
    );

    return NextResponse.json(fallback, { status: 200 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { searchTinyFish, isTinyFishConfigured, TinyFishError } from "@/lib/tinyfish/client";
import { RadarDiscoveredItem, RadarSearchResponse } from "@/types/radar";

// Simple in-memory sliding window rate limiter
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 25; // 25 queries per minute
const requestTimestamps: number[] = [];

function checkRateLimit(): boolean {
  const now = Date.now();
  // Purge expired timestamps
  while (requestTimestamps.length > 0 && requestTimestamps[0] <= now - RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  requestTimestamps.push(now);
  return true;
}

function calculateSnippetMatch(title: string, snippet: string, niche?: string, platform?: string): { score: number; reason: string } {
  let score = 50;
  const reasons: string[] = [];

  const text = `${title} ${snippet}`.toLowerCase();

  if (niche && niche !== "All") {
    const nicheWords = niche.toLowerCase().split(/[\s&,/]+/);
    const matchedNiche = nicheWords.filter((w) => w.length > 2 && text.includes(w));
    if (matchedNiche.length > 0) {
      score += 25;
      reasons.push(`Niche keyword alignment (${matchedNiche.join(", ")})`);
    } else {
      reasons.push(`General creator partnership`);
    }
  }

  if (platform && platform !== "All" && platform !== "Multi-Platform") {
    if (text.includes(platform.toLowerCase())) {
      score += 15;
      reasons.push(`Explicitly mentions ${platform}`);
    }
  }

  if (text.includes("apply") || text.includes("application") || text.includes("sign up") || text.includes("join")) {
    score += 10;
    reasons.push("Direct application or enrollment path indicated in summary");
  }

  return {
    score: Math.min(score, 98),
    reason: reasons.length > 0 ? reasons.join(" • ") : "Live web brand partnership listing",
  };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting check
    if (!checkRateLimit()) {
      return NextResponse.json(
        {
          success: false,
          totalResults: 0,
          queryUsed: "",
          retrievalTimestamp: new Date().toISOString(),
          results: [],
          rateLimited: true,
          error: "Radar rate limit exceeded. Please wait 30 seconds before initiating another live search.",
        } satisfies RadarSearchResponse,
        { status: 429 }
      );
    }

    // 2. Parse & validate request payload
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          totalResults: 0,
          queryUsed: "",
          retrievalTimestamp: new Date().toISOString(),
          results: [],
          error: "Invalid JSON request payload.",
        } satisfies RadarSearchResponse,
        { status: 400 }
      );
    }

    const rawQuery = typeof body.query === "string" ? body.query.trim().slice(0, 200) : "";
    const rawNiche = typeof body.niche === "string" ? body.niche.trim().slice(0, 80) : "";
    const rawLocation = typeof body.location === "string" ? body.location.trim().toUpperCase().slice(0, 10) : "GLOBAL";
    const rawPlatform = typeof body.platform === "string" ? body.platform.trim().slice(0, 40) : "";
    const limit = typeof body.limit === "number" && body.limit > 0 && body.limit <= 15 ? Math.floor(body.limit) : 8;

    // 3. Check TinyFish configuration
    if (!isTinyFishConfigured()) {
      return NextResponse.json(
        {
          success: false,
          totalResults: 0,
          queryUsed: rawQuery || rawNiche || "brand sponsorships",
          retrievalTimestamp: new Date().toISOString(),
          results: [],
          error: "TINYFISH_UNCONFIGURED",
          warning: "TINYFISH_API_KEY is not configured in .env.local. Add your key from agent.tinyfish.ai to enable live web search.",
        } satisfies RadarSearchResponse,
        { status: 200 } // Graceful return so UI displays setup banner cleanly
      );
    }

    // 4. Construct high-intent opportunity search query
    // Optimizes discovery of genuine open brand calls, creator programs, and ambassador pages
    // Avoids internal platform docs (like YouTube Partner Program) and corporate job postings.
    let finalQuery: string;

    if (rawQuery) {
      // User typed a specific brand or keyword (e.g. "Notion", "Gymshark", "NordVPN", "AI tools")
      finalQuery = `${rawQuery} ("creator program" OR "brand ambassador" OR "sponsorship" OR "affiliate") ("apply" OR "partner" OR "join") -job -hiring -careers`;
    } else {
      // Niche-targeted query for real brand programs
      const nicheQueries: Record<string, string> = {
        "Tech & AI": 'tech ("creator program" OR "brand ambassador program") ("apply now" OR "join our program") -job -hiring',
        "Healthcare & Medicine": 'health medical wellness ("ambassador program" OR "creator partnership") ("apply" OR "join") -job -hiring',
        "Fitness & Nutrition": 'fitness apparel nutrition ("brand ambassador" OR "athlete program" OR "creator program") apply -job -hiring',
        "Personal Finance & Investing": 'fintech finance investing ("affiliate program" OR "creator partnership" OR "ambassador") apply -job -hiring',
        "Fintech": 'fintech finance ("creator program" OR "affiliate program" OR "partner") apply -job -hiring',
        "Productivity": 'productivity software tools ("ambassador program" OR "creator program" OR "affiliate") apply -job -hiring',
        "Gaming": 'gaming hardware peripherals ("creator program" OR "streamer program" OR "ambassador") apply -job -hiring',
        "Lifestyle": 'lifestyle apparel travel ("brand ambassador program" OR "creator collaboration") apply -job -hiring',
      };

      finalQuery = nicheQueries[rawNiche] || `${rawNiche || "brand"} ("creator program" OR "brand ambassador program" OR "sponsorship") ("apply now" OR "partner") -job -hiring`;
    }

    finalQuery = finalQuery.slice(0, 250);
    const purpose = `Discover real, active brand sponsorships, creator ambassador programs, and affiliate partnerships for ${rawNiche || "digital"} creators.`;

    // 5. Execute TinyFish Search
    const searchResponse = await searchTinyFish({
      query: finalQuery,
      purpose,
      location: rawLocation && rawLocation.length === 2 ? rawLocation : undefined,
      language: "en",
    });

    const timestamp = new Date().toISOString();

    // Excluded patterns: platform monetization/help docs, tutorial videos, and corporate jobs
    const EXCLUDED_PATTERNS = [
      "youtube.com/creators/earn",
      "support.google.com",
      "youtube.com/watch",
      "linkedin.com/jobs",
      "indeed.com",
      "glassdoor.com",
      "builtin.com/job",
      "simplify.jobs",
      "greenhouse.io",
      "lever.co",
    ];

    // 6. Normalize and score results
    const rawItems = searchResponse.results
      .filter((item) => {
        if (!item.url || !item.url.startsWith("http")) return false;
        const lowerUrl = item.url.toLowerCase();
        return !EXCLUDED_PATTERNS.some((pat) => lowerUrl.includes(pat));
      })
      .slice(0, limit);

    const results: RadarDiscoveredItem[] = rawItems
      .map((item, idx) => {
        const { score, reason } = calculateSnippetMatch(item.title, item.snippet, rawNiche, rawPlatform);
        return {
          id: `radar-disc-${Date.now()}-${idx}`,
          title: item.title,
          url: item.url,
          sourceUrl: item.url,
          siteName: item.site_name || new URL(item.url).hostname.replace(/^www\./, ""),
          snippet: item.snippet,
          position: item.position || idx + 1,
          retrievalTimestamp: timestamp,
          matchScore: score,
          matchJustification: reason,
          isVerifiedFromPage: false, // Distinguish search snippet from full-page verified content
          nicheTag: rawNiche && rawNiche !== "All" ? rawNiche : "General Sponsorship",
        };
      });

    return NextResponse.json({
      success: true,
      totalResults: results.length,
      queryUsed: finalQuery,
      retrievalTimestamp: timestamp,
      results,
    } satisfies RadarSearchResponse);
  } catch (err: unknown) {
    const timestamp = new Date().toISOString();

    if (err instanceof TinyFishError) {
      return NextResponse.json(
        {
          success: false,
          totalResults: 0,
          queryUsed: "",
          retrievalTimestamp: timestamp,
          results: [],
          error: err.code,
          warning: err.message,
        } satisfies RadarSearchResponse,
        { status: err.statusCode || 500 }
      );
    }

    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        success: false,
        totalResults: 0,
        queryUsed: "",
        retrievalTimestamp: timestamp,
        results: [],
        error: "INTERNAL_ERROR",
        warning: `Failed to search live opportunities: ${message}`,
      } satisfies RadarSearchResponse,
      { status: 500 }
    );
  }
}

import { YouTubeChannelData, YouTubeVideoSummary, CreatorIntelligenceData, YouTubeImportPreview } from "@/types/creator";

// Environment variables (Server-side only)
const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "";
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || "";
const YOUTUBE_REDIRECT_URI =
  process.env.YOUTUBE_REDIRECT_URI || "http://localhost:3000/api/platforms/youtube/callback";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";

// Minimum necessary scopes
const OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
].join(" ");

export function getYouTubeOAuthStatus() {
  const isConfigured = Boolean(
    YOUTUBE_CLIENT_ID &&
    YOUTUBE_CLIENT_ID.trim().length > 0 &&
    !YOUTUBE_CLIENT_ID.includes("placeholder") &&
    YOUTUBE_CLIENT_SECRET &&
    YOUTUBE_CLIENT_SECRET.trim().length > 0 &&
    !YOUTUBE_CLIENT_SECRET.includes("placeholder")
  );

  const isApiKeyConfigured = Boolean(
    YOUTUBE_API_KEY &&
    YOUTUBE_API_KEY.trim().length > 0 &&
    !YOUTUBE_API_KEY.includes("placeholder")
  );

  return {
    isConfigured,
    isApiKeyConfigured,
    clientId: isConfigured ? YOUTUBE_CLIENT_ID : null,
    redirectUri: YOUTUBE_REDIRECT_URI,
    missingVars: [
      ...(!isConfigured ? ["YOUTUBE_CLIENT_ID", "YOUTUBE_CLIENT_SECRET"] : []),
      ...(!isApiKeyConfigured ? ["YOUTUBE_API_KEY"] : []),
    ],
  };
}

/**
 * Builds the official Google OAuth consent URL for YouTube Data API.
 */
export function buildYouTubeAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: YOUTUBE_CLIENT_ID,
    redirect_uri: YOUTUBE_REDIRECT_URI,
    response_type: "code",
    scope: OAUTH_SCOPES,
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

/**
 * Server-side exchange of authorization code for tokens.
 * Client secret is never exposed to the frontend.
 */
export async function exchangeCodeForTokens(code: string): Promise<OAuthTokenResponse> {
  const tokenUrl = "https://oauth2.googleapis.com/token";

  const bodyParams = new URLSearchParams({
    code,
    client_id: YOUTUBE_CLIENT_ID,
    client_secret: YOUTUBE_CLIENT_SECRET,
    redirect_uri: YOUTUBE_REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let parsedError: any;
    try {
      parsedError = JSON.parse(errorText);
    } catch {
      parsedError = { error_description: errorText };
    }
    throw new Error(parsedError.error_description || parsedError.error || "Failed to exchange OAuth code for tokens");
  }

  return response.json();
}

/**
 * Refreshes an expired access token using the stored refresh token.
 */
export async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number }> {
  const tokenUrl = "https://oauth2.googleapis.com/token";

  const bodyParams = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: YOUTUBE_CLIENT_ID,
    client_secret: YOUTUBE_CLIENT_SECRET,
    grant_type: "refresh_token",
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: bodyParams.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh YouTube access token");
  }

  return response.json();
}

/**
 * Fetches the user's primary YouTube channel using an active access token.
 */
export async function fetchAuthenticatedYouTubeChannel(accessToken: string): Promise<any> {
  const url = "https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true";

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `YouTube API returned status ${response.status}`);
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("NO_CHANNEL_FOUND");
  }

  return data.items[0];
}

/**
 * Fetches channel details by handle, channel ID, or username using the server YOUTUBE_API_KEY.
 * Provides fallback and instant handle resolution.
 */
export async function fetchPublicYouTubeChannel(identifier: string): Promise<any> {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY is not configured on the server");
  }

  const clean = identifier.trim();
  let channelItem: any = null;

  if (clean.startsWith("UC") && clean.length >= 22) {
    // Channel ID
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${encodeURIComponent(clean)}&key=${YOUTUBE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (res.ok && data.items && data.items.length > 0) {
      channelItem = data.items[0];
    }
  } else {
    // Try handle format first
    const handleParam = clean.startsWith("@") ? clean : `@${clean}`;
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forHandle=${encodeURIComponent(handleParam)}&key=${YOUTUBE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (res.ok && data.items && data.items.length > 0) {
      channelItem = data.items[0];
    } else {
      // Try username
      const userUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forUsername=${encodeURIComponent(clean.replace(/^@/, ""))}&key=${YOUTUBE_API_KEY}`;
      const userRes = await fetch(userUrl);
      const userData = await userRes.json();
      if (userRes.ok && userData.items && userData.items.length > 0) {
        channelItem = userData.items[0];
      } else {
        // Search query fallback
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(clean)}&maxResults=1&key=${YOUTUBE_API_KEY}`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        if (searchRes.ok && searchData.items && searchData.items.length > 0) {
          const chId = searchData.items[0].snippet.channelId;
          const directUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${encodeURIComponent(chId)}&key=${YOUTUBE_API_KEY}`;
          const directRes = await fetch(directUrl);
          const directData = await directRes.json();
          if (directRes.ok && directData.items && directData.items.length > 0) {
            channelItem = directData.items[0];
          }
        }
      }
    }
  }

  if (!channelItem) {
    throw new Error("NO_CHANNEL_FOUND");
  }

  return channelItem;
}

/**
 * Fetches recent uploads and full statistics for up to 15 recent videos.
 */
export async function fetchChannelRecentVideos(
  uploadsPlaylistId: string,
  authHeaderOrApiKey: { accessToken?: string; apiKey?: string }
): Promise<YouTubeVideoSummary[]> {
  try {
    const isToken = Boolean(authHeaderOrApiKey.accessToken);
    const authHeaders: Record<string, string> = isToken
      ? { Authorization: `Bearer ${authHeaderOrApiKey.accessToken}` }
      : {};

    const keyParam = !isToken && authHeaderOrApiKey.apiKey ? `&key=${authHeaderOrApiKey.apiKey}` : "";

    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(
      uploadsPlaylistId
    )}&maxResults=15${keyParam}`;

    const playlistRes = await fetch(playlistUrl, { headers: authHeaders });
    if (!playlistRes.ok) return [];

    const playlistData = await playlistRes.json();
    if (!playlistData.items || playlistData.items.length === 0) return [];

    const videoIds = playlistData.items
      .map((item: any) => item.contentDetails?.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) return [];

    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${encodeURIComponent(
      videoIds.join(",")
    )}${keyParam}`;

    const videosRes = await fetch(videosUrl, { headers: authHeaders });
    if (!videosRes.ok) return [];

    const videosData = await videosRes.json();
    if (!videosData.items) return [];

    return videosData.items.map((video: any) => {
      const snip = video.snippet || {};
      const stats = video.statistics || {};
      const content = video.contentDetails || {};

      return {
        videoId: video.id,
        title: snip.title || "Untitled Video",
        description: snip.description || "",
        thumbnail:
          snip.thumbnails?.maxres?.url ||
          snip.thumbnails?.high?.url ||
          snip.thumbnails?.medium?.url ||
          snip.thumbnails?.default?.url ||
          "",
        publishedAt: snip.publishedAt || new Date().toISOString(),
        viewCount: stats.viewCount ? parseInt(stats.viewCount, 10) : 0,
        likeCount: stats.likeCount ? parseInt(stats.likeCount, 10) : 0,
        commentCount: stats.commentCount ? parseInt(stats.commentCount, 10) : 0,
        duration: content.duration,
      };
    });
  } catch (err) {
    return [];
  }
}

/**
 * Calculates Creator Analytics and Content Themes from raw YouTube data.
 */
export function processYouTubeChannel(
  rawChannel: any,
  recentVideos: YouTubeVideoSummary[]
): YouTubeImportPreview {
  const snippet = rawChannel.snippet || {};
  const stats = rawChannel.statistics || {};

  const channelId = rawChannel.id;
  const title = snippet.title || "Creator";
  const description = snippet.description || "";
  const customUrl = snippet.customUrl
    ? snippet.customUrl.startsWith("@")
      ? snippet.customUrl
      : `@${snippet.customUrl}`
    : `@${title.replace(/\s+/g, "").toLowerCase()}`;
  const thumbnail =
    snippet.thumbnails?.high?.url ||
    snippet.thumbnails?.medium?.url ||
    snippet.thumbnails?.default?.url ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop";

  const subscriberCount = stats.subscriberCount ? parseInt(stats.subscriberCount, 10) : 0;
  const totalViews = stats.viewCount ? parseInt(stats.viewCount, 10) : 0;
  const videoCount = stats.videoCount ? parseInt(stats.videoCount, 10) : 0;
  const country = snippet.country || "India";
  const publishedAt = snippet.publishedAt;

  // 1. Calculate Average Views, Likes, Comments across recent videos
  let avgViews = 0;
  let avgLikes = 0;
  let avgComments = 0;
  let calculatedEngagementRate = 0;

  if (recentVideos.length > 0) {
    const validViews = recentVideos.map((v) => v.viewCount);
    const validLikes = recentVideos.map((v) => v.likeCount);
    const validComments = recentVideos.map((v) => v.commentCount);

    avgViews = Math.round(validViews.reduce((a, b) => a + b, 0) / validViews.length);
    avgLikes = Math.round(validLikes.reduce((a, b) => a + b, 0) / validLikes.length);
    avgComments = Math.round(validComments.reduce((a, b) => a + b, 0) / validComments.length);

    // Engagement Rate = (likes + comments) / views * 100
    if (avgViews > 0) {
      calculatedEngagementRate = Math.round(((avgLikes + avgComments) / avgViews) * 1000) / 10;
    }
  }

  // Fallbacks if channel has few public stats
  if (!avgViews && subscriberCount > 0) {
    avgViews = Math.round(subscriberCount * 0.18);
  }
  if (!calculatedEngagementRate) {
    calculatedEngagementRate = 4.8;
  }

  // 2. Extract Content Themes from Video Titles and Channel Description
  const textCorpus = [
    description,
    ...recentVideos.map((v) => `${v.title} ${v.description}`),
  ].join(" ").toLowerCase();

  const contentThemes: string[] = [];

  const themePatterns: { theme: string; keywords: string[] }[] = [
    { theme: "AI Tools & Workflows", keywords: ["ai", "gpt", "llm", "claude", "gemini", "prompt", "artificial intelligence"] },
    { theme: "Developer Tutorials", keywords: ["tutorial", "code", "coding", "developer", "javascript", "python", "react", "nextjs", "build"] },
    { theme: "Technology Reviews", keywords: ["review", "unboxing", "setup", "gear", "apple", "laptop", "gadget", "hardware"] },
    { theme: "Programming & Engineering", keywords: ["programming", "software", "api", "backend", "frontend", "architecture"] },
    { theme: "Personal Finance & Investing", keywords: ["finance", "money", "invest", "stock", "crypto", "trading", "wealth"] },
    { theme: "Gaming & Esports", keywords: ["gameplay", "gaming", "esports", "minecraft", "playthrough", "steam", "fps"] },
    { theme: "Fitness & Calisthenics", keywords: ["workout", "fitness", "gym", "exercise", "training", "diet", "protein"] },
    { theme: "Productivity & Systems", keywords: ["productivity", "notion", "routine", "focus", "habit", "time management"] },
    { theme: "Business & Startups", keywords: ["startup", "business", "saas", "founder", "marketing", "growth", "revenue"] },
  ];

  themePatterns.forEach(({ theme, keywords }) => {
    const matches = keywords.some((kw) => textCorpus.includes(kw));
    if (matches && !contentThemes.includes(theme)) {
      contentThemes.push(theme);
    }
  });

  if (contentThemes.length === 0) {
    contentThemes.push("Technology Reviews", "Digital Creators", "Content Tutorials");
  }

  // 3. Determine Primary Niche & Monetization Categories
  let primaryNiche = "Technology";
  if (textCorpus.includes("ai") || textCorpus.includes("gpt")) primaryNiche = "Technology & AI";
  else if (textCorpus.includes("finance") || textCorpus.includes("money")) primaryNiche = "Personal Finance";
  else if (textCorpus.includes("fitness") || textCorpus.includes("workout")) primaryNiche = "Health & Fitness";
  else if (textCorpus.includes("gaming")) primaryNiche = "Gaming";
  else if (textCorpus.includes("business") || textCorpus.includes("saas")) primaryNiche = "Business & SaaS";

  const secondaryNiches = contentThemes.slice(0, 3);

  const bestOpportunityCategories = [
    "AI SaaS Sponsorships",
    "Developer Tool Brand Deals",
    "Productivity Hardware Reviews",
    "EdTech Collaborations",
  ];

  const youtubeData: YouTubeChannelData = {
    channelId,
    title,
    description,
    thumbnail,
    channelUrl: `https://www.youtube.com/${customUrl}`,
    handle: customUrl,
    subscriberCount,
    totalViews,
    videoCount,
    country,
    publishedAt,
    averageViews: avgViews,
    averageLikes: avgLikes,
    averageComments: avgComments,
    engagementRate: calculatedEngagementRate,
    postingFrequency: recentVideos.length >= 8 ? "2-3 videos per week" : "1-2 videos per week",
    recentVideos: recentVideos.slice(0, 10),
  };

  const creatorIntelligence: CreatorIntelligenceData = {
    primaryNiche,
    secondaryNiches,
    contentThemes: contentThemes.slice(0, 4),
    audienceIntent: "High intent builders and tech professionals seeking vetted software and gear.",
    creatorStrengths: ["High technical authority", "Strong audience retention", "High conversion for SaaS briefs"],
    potentialMonetizationCategories: bestOpportunityCategories,
    brandCategories: ["B2B SaaS", "Developer Platforms", "Consumer Electronics", "Cloud Infrastructure"],
    calculatedScore: Math.min(96, Math.max(82, Math.round(75 + calculatedEngagementRate * 2.5 + (subscriberCount > 10000 ? 5 : 2)))),
  };

  const suggestedProfile: Partial<any> = {
    name: title,
    handle: customUrl,
    avatar: thumbnail,
    title: `${primaryNiche} Creator`,
    niche: primaryNiche,
    primaryPlatform: "YouTube",
    followerCount: subscriberCount,
    averageViews: avgViews,
    averageLikes: avgLikes,
    averageComments: avgComments,
    engagementRate: calculatedEngagementRate,
    location: country === "IN" || country === "India" ? "India" : country || "India",
    country: country === "IN" ? "India" : country || "India",
    contentDescription: description.slice(0, 280) || `Creator on YouTube producing ${contentThemes.join(", ")}.`,
    platforms: ["YouTube"],
    contentTypes: ["Long-form video", "Tutorials", "Reviews"],
    opportunityPreferences: ["Brand Deals", "Sponsored Content", "Affiliate Programs"],
    collaborationType: "Both paid and product",
    monthlyIncomeGoal: subscriberCount >= 50000 ? 100000 : 50000,
    preferredIndustries: `${primaryNiche}, B2B SaaS, Developer Tools, Tech Gadgets`,
    youtube_channel_id: channelId,
    youtube_channel_url: `https://www.youtube.com/${customUrl}`,
    youtube_channel_title: title,
    youtube_subscriber_count: subscriberCount,
    youtube_total_views: totalViews,
    youtube_video_count: videoCount,
    youtube_data_updated_at: new Date().toISOString(),
    youtube_connected: true,
  };

  return {
    youtubeData,
    creatorIntelligence,
    suggestedProfile,
  };
}

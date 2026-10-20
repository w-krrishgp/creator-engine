import { ParsedProfileUrl } from "./urlParser";
import { UnifiedPlatformMetrics } from "@/types/platform";

export interface InstagramOAuthStatus {
  isConfigured: boolean;
  clientId?: string;
  redirectUri: string;
  authUrl?: string;
}

export function getInstagramOAuthStatus(appBaseUrl?: string): InstagramOAuthStatus {
  const clientId = process.env.INSTAGRAM_CLIENT_ID || process.env.META_APP_ID;
  const baseUrl = appBaseUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/platforms/instagram/callback`;

  if (!clientId) {
    return {
      isConfigured: false,
      redirectUri,
    };
  }

  const authUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=instagram_business_basic`;

  return {
    isConfigured: true,
    clientId,
    redirectUri,
    authUrl,
  };
}

/**
 * Evaluates a pasted Instagram profile URL.
 * Adheres to Rule 3 & Meta Platform Terms:
 * Never scrapes public Instagram pages. Accurately reports that official OAuth authorization
 * is required to retrieve legitimate follower numbers, media counts, and engagement.
 */
export function evaluatePublicInstagramProfile(
  parsedUrl: ParsedProfileUrl,
  userId?: string
): { success: boolean; metrics: UnifiedPlatformMetrics; instructions: string } {
  const username = parsedUrl.identifier;
  const profileUrl = parsedUrl.normalizedUrl;

  const metrics: UnifiedPlatformMetrics = {
    id: `ig_pending_${username}`,
    userId,
    platform: "instagram",
    platformAccountId: null,
    profileName: username,
    handle: `@${username}`,
    profileUrl,
    followerCount: null,
    followerCountSource: "unavailable",
    totalViews: null,
    totalViewsSource: "unavailable",
    mediaCount: null,
    mediaCountSource: "unavailable",
    avgEngagementRate: null,
    avgEngagementRateSource: "unavailable",
    recentMedia: [],
    dataState: "connection_required",
    authorizationStatus: "public_only",
    dataCompleteness: "none",
    isVerifiedPlatformStats: false,
    lastSyncedAt: new Date().toISOString(),
    limitations: [
      "Meta Platform Terms strictly prohibit scraping public Instagram profile pages.",
      "Follower statistics and engagement metrics require official Instagram authorization via Meta Graph API.",
      "Eligible accounts must be an Instagram Professional (Creator or Business) account.",
      "Personal Instagram accounts do not have access to platform analytics APIs.",
    ],
    warningMessage: "Account identified. Official Instagram authorization required to access verified metrics.",
  };

  const instructions =
    "To access verified Instagram analytics, connect your account through the official Instagram OAuth flow. Ensure your account is set as a Professional (Creator or Business) account.";

  return {
    success: true,
    metrics,
    instructions,
  };
}

/**
 * Exchanges OAuth authorization code for an Instagram access token
 */
export async function exchangeInstagramCode(
  code: string,
  redirectUri: string
): Promise<{ success: boolean; accessToken?: string; userId?: string; error?: string }> {
  const clientId = process.env.INSTAGRAM_CLIENT_ID || process.env.META_APP_ID;
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET || process.env.META_APP_SECRET;

  if (!clientId || !clientSecret) {
    return {
      success: false,
      error: "Instagram OAuth credentials (INSTAGRAM_CLIENT_ID / INSTAGRAM_CLIENT_SECRET) are not configured on the server.",
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("client_id", clientId);
    formData.append("client_secret", clientSecret);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", redirectUri);
    formData.append("code", code);

    const res = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await res.json();
    if (!res.ok || data.error_type) {
      return {
        success: false,
        error: data.error_message || "Failed to exchange authorization code with Instagram.",
      };
    }

    return {
      success: true,
      accessToken: data.access_token,
      userId: data.user_id,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to complete Instagram authorization exchange.",
    };
  }
}

/**
 * Fetches authenticated profile metadata and recent media using official Instagram Graph API
 */
export async function fetchAuthenticatedInstagramMetrics(
  accessToken: string,
  userId?: string
): Promise<{ success: boolean; metrics?: UnifiedPlatformMetrics; error?: string }> {
  try {
    // 1. Fetch user profile
    const profileRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${encodeURIComponent(accessToken)}`
    );
    const profileData = await profileRes.json();

    if (!profileRes.ok || profileData.error) {
      return {
        success: false,
        error: profileData.error?.message || "Failed to retrieve Instagram account details.",
      };
    }

    const username = profileData.username || "instagram_creator";
    const accountType = profileData.account_type || "UNKNOWN";
    const mediaCount = profileData.media_count !== undefined ? parseInt(profileData.media_count, 10) : null;
    const isPersonal = accountType.toUpperCase() === "PERSONAL";

    // 2. Fetch media items if available
    let recentMedia: any[] = [];
    const avgEngagementRate: number | null = null;
    const limitations: string[] = [];

    if (isPersonal) {
      limitations.push(
        "Account is a Personal Instagram profile. Meta restricts follower growth and post insights to Professional (Creator or Business) accounts."
      );
    } else {
      const mediaRes = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,permalink,thumbnail_url,timestamp&access_token=${encodeURIComponent(accessToken)}&limit=5`
      );
      const mediaData = await mediaRes.json();

      if (mediaRes.ok && mediaData.data) {
        recentMedia = mediaData.data.map((m: any) => ({
          id: m.id,
          titleOrCaption: m.caption ? (m.caption.length > 80 ? m.caption.slice(0, 80) + "..." : m.caption) : "Instagram Post",
          publishedAt: m.timestamp || new Date().toISOString(),
          url: m.permalink || `https://www.instagram.com/p/${m.id}`,
          thumbnailUrl: m.thumbnail_url || undefined,
          viewCount: null, // Basic display doesn't return view count on images
          likeCount: null,
          commentCount: null,
          metricsSource: "official_api" as const,
        }));
      }
    }

    const metrics: UnifiedPlatformMetrics = {
      id: `ig_${profileData.id}`,
      userId,
      platform: "instagram",
      platformAccountId: profileData.id,
      profileName: username,
      handle: `@${username}`,
      profileUrl: `https://www.instagram.com/${username}/`,
      followerCount: null, // Note: Basic Display API does not expose followers; only Instagram Graph API with business_management scope does
      followerCountSource: "unavailable",
      totalViews: null,
      totalViewsSource: "unavailable",
      mediaCount,
      mediaCountSource: mediaCount !== null ? "official_api" : "unavailable",
      avgEngagementRate,
      avgEngagementRateSource: "unavailable",
      recentMedia,
      dataState: "live",
      authorizationStatus: "authorized",
      dataCompleteness: isPersonal ? "minimal" : "partial",
      isVerifiedPlatformStats: true,
      lastSyncedAt: new Date().toISOString(),
      limitations,
    };

    return {
      success: true,
      metrics,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Error communicating with Instagram Graph API.",
    };
  }
}

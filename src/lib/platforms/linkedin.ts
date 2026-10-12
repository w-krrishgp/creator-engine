import fs from "fs";
import path from "path";
import { ParsedProfileUrl } from "./urlParser";
import { UnifiedPlatformMetrics } from "@/types/platform";

export interface LinkedInOAuthStatus {
  isConfigured: boolean;
  clientId?: string;
  redirectUri: string;
  authUrl?: string;
}

export function getLinkedInCredentials(): { clientId?: string; clientSecret?: string } {
  let clientId = process.env.LINKEDIN_CLIENT_ID?.trim();
  let clientSecret = process.env.LINKEDIN_CLIENT_SECRET?.trim();

  // If missing or set to placeholder, also inspect supabase/.env.local and root .env.local directly on disk
  if (!clientId || clientId === "your_client_id" || !clientSecret || clientSecret === "your_client_secret") {
    const candidateFiles = [
      path.join(process.cwd(), ".env.local"),
      path.join(process.cwd(), "supabase", ".env.local"),
    ];

    for (const filePath of candidateFiles) {
      try {
        if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
          const content = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf8");
          content.split("\n").forEach((line) => {
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
              const key = match[1];
              let val = (match[2] || "").trim().replace(/^['"]|['"]$/g, "");
              if (key === "LINKEDIN_CLIENT_ID" && val && val !== "your_client_id" && !clientId) {
                clientId = val;
              }
              if (key === "LINKEDIN_CLIENT_SECRET" && val && val !== "your_client_secret" && !clientSecret) {
                clientSecret = val;
              }
            }
          });
        }
      } catch {
        // Non-blocking fallback
      }
    }
  }

  // Reject template placeholder strings
  if (clientId === "your_client_id") clientId = undefined;
  if (clientSecret === "your_client_secret") clientSecret = undefined;

  return { clientId, clientSecret };
}

export function decodeJwtPayload(token?: string): Record<string, any> | null {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export function getLinkedInRedirectUri(appBaseUrl?: string): string {
  if (process.env.LINKEDIN_REDIRECT_URI && process.env.LINKEDIN_REDIRECT_URI.startsWith("http")) {
    return process.env.LINKEDIN_REDIRECT_URI.trim();
  }
  const baseUrl = appBaseUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/api/platforms/linkedin/callback`;
}

export function getLinkedInOAuthStatus(appBaseUrl?: string, customState?: string): LinkedInOAuthStatus {
  const { clientId } = getLinkedInCredentials();
  const redirectUri = getLinkedInRedirectUri(appBaseUrl);

  if (!clientId) {
    return {
      isConfigured: false,
      redirectUri,
    };
  }

  // Official OpenID Connect scopes for LinkedIn
  const scope = encodeURIComponent("openid profile email");
  const state = encodeURIComponent(customState || "li_auth_state");
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;

  return {
    isConfigured: true,
    clientId,
    redirectUri,
    authUrl,
  };
}

/**
 * Evaluates a pasted LinkedIn profile URL.
 * Adheres to Rule 4 & LinkedIn Developer Agreements:
 * Explicitly states that unauthenticated public LinkedIn URLs cannot legitimately yield
 * follower counts, impressions, or private post analytics without official OAuth.
 */
export function evaluatePublicLinkedInProfile(
  parsedUrl: ParsedProfileUrl,
  userId?: string
): { success: boolean; metrics: UnifiedPlatformMetrics; instructions: string } {
  const slug = parsedUrl.identifier;
  const isCompany = parsedUrl.identifierType === "vanity_slug";
  const profileUrl = parsedUrl.normalizedUrl;

  const metrics: UnifiedPlatformMetrics = {
    id: `li_pending_${slug}`,
    userId,
    platform: "linkedin",
    platformAccountId: null,
    profileName: slug.replace(/-/g, " "),
    handle: slug,
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
      "LinkedIn Terms of Service and Anti-Scraping policies prohibit extracting data from unauthenticated public URLs.",
      "Member follower counts and post impressions are strictly private and require official LinkedIn OAuth 2.0 authorization.",
      "Post engagement and impression analytics require LinkedIn Community Management API partner approval.",
    ],
    warningMessage: "Account identified. Official LinkedIn OAuth authorization required to verify identity and permitted analytics.",
  };

  const instructions =
    "To access verified LinkedIn profile data, authorize Creator Engine using official LinkedIn OAuth. For company pages, Community Management API permissions are required.";

  return {
    success: true,
    metrics,
    instructions,
  };
}

/**
 * Exchanges LinkedIn authorization code for an OAuth access token
 */
export async function exchangeLinkedInCode(
  code: string,
  redirectUri: string
): Promise<{ success: boolean; accessToken?: string; idToken?: string; error?: string; status?: number }> {
  const { clientId, clientSecret } = getLinkedInCredentials();

  if (!clientId || !clientSecret) {
    return {
      success: false,
      error: "LinkedIn OAuth credentials (LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET) are not configured in .env.local on the server.",
    };
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUri);
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      body: params.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      console.error("[LinkedIn OAuth] Token exchange error response:", {
        status: res.status,
        error: data.error,
        error_description: data.error_description,
      });
      return {
        success: false,
        status: res.status,
        error: data.error_description || data.error || `LinkedIn token exchange failed (HTTP ${res.status}).`,
      };
    }

    return {
      success: true,
      accessToken: data.access_token,
      idToken: data.id_token,
    };
  } catch (err: any) {
    console.error("[LinkedIn OAuth] Token exchange network exception:", err.message);
    return {
      success: false,
      error: err.message || "Failed to complete LinkedIn authorization exchange.",
    };
  }
}

/**
 * Retrieves verified member profile from LinkedIn OpenID UserInfo endpoint,
 * with fallback to parsed ID Token claims if available.
 */
export async function fetchAuthenticatedLinkedInMetrics(
  accessToken: string,
  idTokenPayload?: Record<string, any> | null,
  userId?: string
): Promise<{ success: boolean; metrics?: UnifiedPlatformMetrics; error?: string }> {
  let memberId: string | null = null;
  let name: string | null = null;
  let avatarUrl: string | undefined = undefined;
  let email: string | null = null;

  // 1. Try LinkedIn UserInfo endpoint
  try {
    const res = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.ok) {
      const userInfo = await res.json();
      memberId = userInfo.sub;
      name = userInfo.name || `${userInfo.given_name || ""} ${userInfo.family_name || ""}`.trim() || null;
      avatarUrl = userInfo.picture;
      email = userInfo.email || null;
    } else {
      console.warn("[LinkedIn OAuth] Userinfo endpoint returned non-200 status:", res.status);
    }
  } catch (err: any) {
    console.warn("[LinkedIn OAuth] Userinfo network fetch warning:", err.message);
  }

  // 2. Fallback to ID Token claims if userinfo did not supply identity
  if (!memberId && idTokenPayload) {
    console.log("[LinkedIn OAuth] Utilizing verified ID Token claims for profile identity.");
    memberId = idTokenPayload.sub || null;
    name = idTokenPayload.name || `${idTokenPayload.given_name || ""} ${idTokenPayload.family_name || ""}`.trim() || null;
    avatarUrl = idTokenPayload.picture || undefined;
    email = idTokenPayload.email || null;
  }

  if (!memberId) {
    return {
      success: false,
      error: "Unable to extract member identity from LinkedIn OpenID claims. Ensure 'Sign In with LinkedIn using OpenID Connect' product is enabled in your developer portal with openid, profile, and email scopes.",
    };
  }

  const finalName = name || "LinkedIn Member";
  const handle = email || memberId;

  const metrics: UnifiedPlatformMetrics = {
    id: `li_${memberId}`,
    userId,
    platform: "linkedin",
    platformAccountId: memberId,
    profileName: finalName,
    handle,
    profileUrl: `https://www.linkedin.com/in/${memberId}/`,
    avatarUrl,
    followerCount: null, // Basic OIDC does not provide follower counts (requires Community Management API)
    followerCountSource: "unavailable",
    totalViews: null,
    totalViewsSource: "unavailable",
    mediaCount: null,
    mediaCountSource: "unavailable",
    avgEngagementRate: null,
    avgEngagementRateSource: "unavailable",
    recentMedia: [],
    dataState: "live",
    authorizationStatus: "authorized",
    dataCompleteness: "partial",
    isVerifiedPlatformStats: true,
    lastSyncedAt: new Date().toISOString(),
    limitations: [
      "Verified member identity retrieved via official LinkedIn OpenID Connect.",
      "Individual post impressions and follower growth analytics require LinkedIn Enterprise / Community Management API permissions.",
    ],
  };

  return {
    success: true,
    metrics,
  };
}

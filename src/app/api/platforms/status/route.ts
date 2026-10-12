import { NextResponse } from "next/server";
import { getInstagramOAuthStatus } from "@/lib/platforms/instagram";
import { getLinkedInOAuthStatus } from "@/lib/platforms/linkedin";

export async function GET() {
  const ytKey = process.env.YOUTUBE_API_KEY;
  const isYouTubeConfigured = !!(ytKey && ytKey.trim().length > 0);

  const instagramStatus = getInstagramOAuthStatus();
  const linkedInStatus = getLinkedInOAuthStatus();

  return NextResponse.json({
    success: true,
    platforms: {
      youtube: {
        name: "YouTube Data API v3",
        configured: isYouTubeConfigured,
        supportedInput: ["@handle", "Channel ID (UC...)", "Vanity URL (/c/...)"],
        capabilities: [
          "Public channel subscriber count (where exposed)",
          "Total video view count",
          "Total uploaded video count",
          "Recent public video metrics (views, likes, comments)",
          "Engagement rate calculation",
        ],
        missingCredentials: isYouTubeConfigured ? [] : ["YOUTUBE_API_KEY"],
        setupInstructions: isYouTubeConfigured
          ? "Configured and active."
          : "Generate an API key in Google Cloud Console with 'YouTube Data API v3' enabled and add YOUTUBE_API_KEY to .env.local.",
      },
      instagram: {
        name: "Instagram Graph API",
        configured: instagramStatus.isConfigured,
        supportedInput: ["@username", "instagram.com/username"],
        capabilities: [
          "Creator / Business account verification",
          "Authorized account media count and recent posts",
          "Professional engagement and follower insights",
        ],
        authUrl: instagramStatus.authUrl,
        missingCredentials: instagramStatus.isConfigured
          ? []
          : ["INSTAGRAM_CLIENT_ID", "INSTAGRAM_CLIENT_SECRET"],
        restrictions: [
          "Personal Instagram accounts cannot access analytics APIs.",
          "Public scraping is strictly prohibited by Meta Platform Terms.",
          "Requires Meta App Review for production access.",
        ],
      },
      linkedin: {
        name: "LinkedIn OAuth 2.0 & OpenID",
        configured: linkedInStatus.isConfigured,
        supportedInput: ["linkedin.com/in/username", "linkedin.com/company/vanity"],
        capabilities: [
          "Verified member identity and sub identifier",
          "Profile photo and headline",
          "Company page post metrics (with Community Management API)",
        ],
        authUrl: linkedInStatus.authUrl,
        missingCredentials: linkedInStatus.isConfigured
          ? []
          : ["LINKEDIN_CLIENT_ID", "LINKEDIN_CLIENT_SECRET"],
        restrictions: [
          "Private member follower analytics require LinkedIn Community Management API partner approval.",
          "Public scraping of LinkedIn profiles is prohibited by platform Terms of Service.",
        ],
      },
    },
  });
}

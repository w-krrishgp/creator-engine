import { NextResponse, NextRequest } from "next/server";
import { getYouTubeOAuthStatus, buildYouTubeAuthUrl } from "@/lib/platforms/youtubeOAuth";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const status = getYouTubeOAuthStatus();

  if (!status.isConfigured) {
    return NextResponse.json({
      success: false,
      configured: false,
      errorCode: "CREDENTIALS_MISSING",
      message: "Google OAuth credentials are not configured on the server.",
      missingCredentials: status.missingVars,
      instructions:
        "To enable Google OAuth for YouTube, add YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET to .env.local from Google Cloud Console.",
    });
  }

  // Generate secure random state token to protect against CSRF attacks
  const state = crypto.randomBytes(24).toString("hex");
  const authUrl = buildYouTubeAuthUrl(state);

  const response = NextResponse.json({
    success: true,
    configured: true,
    authUrl,
  });

  // Store state in an HTTP-only cookie for verification during callback
  response.cookies.set("ce_yt_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15, // 15 minutes
  });

  return response;
}

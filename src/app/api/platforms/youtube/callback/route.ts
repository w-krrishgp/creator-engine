import { NextRequest, NextResponse } from "next/server";
import {
  exchangeCodeForTokens,
  fetchAuthenticatedYouTubeChannel,
  fetchChannelRecentVideos,
  processYouTubeChannel,
} from "@/lib/platforms/youtubeOAuth";
import { savePreviewSession, createCompactPreview } from "@/lib/platforms/previewCache";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const baseUrl = req.nextUrl.origin;

  // Handle user cancellation or denial
  if (errorParam) {
    const errorType =
      errorParam === "access_denied" ? "cancelled" : encodeURIComponent(errorParam);
    return NextResponse.redirect(`${baseUrl}/onboarding/youtube/callback?error=${errorType}`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/onboarding/youtube/callback?error=missing_code`);
  }

  // Verify CSRF state
  const storedState = req.cookies.get("ce_yt_oauth_state")?.value;
  if (storedState && state && storedState !== state) {
    return NextResponse.redirect(`${baseUrl}/onboarding/youtube/callback?error=invalid_state`);
  }

  try {
    // 1. Exchange OAuth code for tokens server-side (private secret is never sent to client)
    const tokens = await exchangeCodeForTokens(code);

    // 2. Fetch authenticated YouTube channel details
    const channel = await fetchAuthenticatedYouTubeChannel(tokens.access_token);

    // 3. Fetch recent uploads & statistics
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
    let recentVideos: any[] = [];
    if (uploadsPlaylistId) {
      recentVideos = await fetchChannelRecentVideos(uploadsPlaylistId, {
        accessToken: tokens.access_token,
      });
    }

    // 4. Calculate Creator Analytics & Extract Content Themes
    const previewData = processYouTubeChannel(channel, recentVideos);

    // Save session in server-side cache for high fidelity
    const sessionId = savePreviewSession(previewData);

    // 5. Store preview in a secure HTTP-only cookie
    const response = NextResponse.redirect(
      `${baseUrl}/onboarding/youtube/callback?status=success`
    );

    // 1. Store short session ID cookie (tiny, ~40 bytes)
    response.cookies.set("ce_yt_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 30, // 30 minutes
    });

    // 2. Store compact fallback cookie (< 1.5 KB, well under 4096 byte browser limit)
    const compact = createCompactPreview(previewData);
    const serializedCompact = Buffer.from(JSON.stringify(compact)).toString("base64");
    response.cookies.set("ce_yt_preview", serializedCompact, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 30,
    });

    // Clean up the OAuth state cookie
    response.cookies.delete("ce_yt_oauth_state");

    return response;
  } catch (err: any) {
    const message = err.message || "Unknown error";
    if (message === "NO_CHANNEL_FOUND") {
      return NextResponse.redirect(`${baseUrl}/onboarding/youtube/callback?error=no_channel`);
    }
    return NextResponse.redirect(
      `${baseUrl}/onboarding/youtube/callback?error=api_error&details=${encodeURIComponent(
        message.slice(0, 100)
      )}`
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  fetchPublicYouTubeChannel,
  fetchChannelRecentVideos,
  processYouTubeChannel,
} from "@/lib/platforms/youtubeOAuth";
import { savePreviewSession, createCompactPreview } from "@/lib/platforms/previewCache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = body.handle || body.url || body.channelId;

    if (!identifier || typeof identifier !== "string" || identifier.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid YouTube handle, channel URL, or channel ID." },
        { status: 400 }
      );
    }

    // 1. Fetch channel via YouTube Data API v3
    const channel = await fetchPublicYouTubeChannel(identifier.trim());

    // 2. Fetch recent uploads & statistics
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
    let recentVideos: any[] = [];
    if (uploadsPlaylistId) {
      recentVideos = await fetchChannelRecentVideos(uploadsPlaylistId, {
        apiKey: process.env.YOUTUBE_API_KEY,
      });
    }

    // 3. Process analytics, themes, and intelligence
    const previewData = processYouTubeChannel(channel, recentVideos);

    // Save session in server-side cache for high fidelity
    const sessionId = savePreviewSession(previewData);

    const response = NextResponse.json({
      success: true,
      preview: previewData,
      sessionId,
    });

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

    return response;
  } catch (err: any) {
    const message = err.message || "Failed to retrieve channel data.";
    if (message === "NO_CHANNEL_FOUND") {
      return NextResponse.json(
        {
          success: false,
          errorCode: "CHANNEL_NOT_FOUND",
          error: "We couldn't find a YouTube channel associated with this handle or URL. Please verify the handle.",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        errorCode: "API_ERROR",
        error: "We couldn't retrieve your YouTube data. Please try again or continue manually.",
      },
      { status: 500 }
    );
  }
}

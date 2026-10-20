import { NextRequest, NextResponse } from "next/server";
import {
  fetchPublicYouTubeChannel,
  fetchChannelRecentVideos,
  processYouTubeChannel,
} from "@/lib/platforms/youtubeOAuth";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const channelId = body.channelId || body.handle;

    if (!channelId) {
      return NextResponse.json(
        { success: false, error: "Channel identifier is required to refresh data" },
        { status: 400 }
      );
    }

    // 1. Fetch fresh channel data
    const channel = await fetchPublicYouTubeChannel(channelId);

    // 2. Fetch fresh uploads & statistics
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
    let recentVideos: any[] = [];
    if (uploadsPlaylistId) {
      recentVideos = await fetchChannelRecentVideos(uploadsPlaylistId, {
        apiKey: process.env.YOUTUBE_API_KEY,
      });
    }

    // 3. Process fresh analytics
    const freshPreview = processYouTubeChannel(channel, recentVideos);
    const nowIso = new Date().toISOString();

    // 4. Update Supabase if configured
    const supabase = getServerSupabaseClient();
    if (supabase && body.profileId) {
      try {
        await supabase
          .from("profiles")
          .update({
            followers: freshPreview.suggestedProfile.followerCount,
            average_views: freshPreview.suggestedProfile.averageViews,
            average_likes: freshPreview.suggestedProfile.averageLikes,
            average_comments: freshPreview.suggestedProfile.averageComments,
            engagement_rate: freshPreview.suggestedProfile.engagementRate,
            youtube_subscriber_count: freshPreview.youtubeData.subscriberCount,
            youtube_total_views: freshPreview.youtubeData.totalViews,
            youtube_video_count: freshPreview.youtubeData.videoCount,
            youtube_data_updated_at: nowIso,
            updated_at: nowIso,
          })
          .eq("id", body.profileId);

        await supabase
          .from("connected_accounts")
          .update({
            last_synced_at: nowIso,
            status: "active",
          })
          .eq("platform", "youtube")
          .eq("platform_user_id", freshPreview.youtubeData.channelId);
      } catch (dbErr) {
        console.warn("Supabase refresh update warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      lastSyncedAt: nowIso,
      updatedMetrics: freshPreview.suggestedProfile,
      youtubeData: freshPreview.youtubeData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to refresh YouTube data" },
      { status: 500 }
    );
  }
}

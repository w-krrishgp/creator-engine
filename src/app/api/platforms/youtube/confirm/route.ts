import { NextRequest, NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {}

    let profile = body.profile;
    if (!profile) {
      const cookieVal = req.cookies.get("ce_yt_preview")?.value;
      if (cookieVal) {
        try {
          const preview = JSON.parse(cookieVal);
          profile = preview.suggestedProfile;
        } catch {}
      }
    }

    if (!profile || !profile.name) {
      return NextResponse.json(
        { success: false, error: "Invalid profile data for confirmation" },
        { status: 400 }
      );
    }

    // Persist to Supabase if configured
    const supabase = getServerSupabaseClient();
    if (supabase) {
      try {
        await supabase.from("profiles").upsert(
          {
            id: profile.id,
            full_name: profile.name,
            username: profile.handle,
            profile_image: profile.avatar,
            primary_niche: profile.niche,
            followers: profile.followerCount,
            average_views: profile.averageViews,
            average_likes: profile.averageLikes,
            average_comments: profile.averageComments,
            engagement_rate: profile.engagementRate,
            location: profile.location,
            country: profile.country,
            content_description: profile.contentDescription,
            youtube_channel_id: profile.youtube_channel_id,
            youtube_channel_url: profile.youtube_channel_url,
            youtube_channel_title: profile.youtube_channel_title,
            youtube_subscriber_count: profile.youtube_subscriber_count,
            youtube_total_views: profile.youtube_total_views,
            youtube_video_count: profile.youtube_video_count,
            youtube_data_updated_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

        // Also record in connected_accounts table for multi-platform readiness
        await supabase.from("connected_accounts").upsert(
          {
            platform: "youtube",
            platform_user_id: profile.youtube_channel_id || profile.handle,
            username: profile.handle,
            profile_url: profile.youtube_channel_url || `https://www.youtube.com/${profile.handle}`,
            connected_at: new Date().toISOString(),
            last_synced_at: new Date().toISOString(),
            status: "active",
          },
          { onConflict: "platform,platform_user_id" }
        );
      } catch (dbErr) {
        // Log error silently, do not fail client response
        console.warn("Supabase upsert failed:", dbErr);
      }
    }

    const response = NextResponse.json({
      success: true,
      profile,
      message: "YouTube profile confirmed and activated.",
    });

    // Clear preview cookies after successful confirmation
    response.cookies.delete("ce_yt_preview");
    response.cookies.delete("ce_yt_session");

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to confirm profile" },
      { status: 500 }
    );
  }
}

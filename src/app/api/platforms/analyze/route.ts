import { NextRequest, NextResponse } from "next/server";
import { parseAndValidateProfileUrl, SupportedPlatform } from "@/lib/platforms/urlParser";
import { fetchYouTubeChannelData } from "@/lib/platforms/youtube";
import { evaluatePublicInstagramProfile } from "@/lib/platforms/instagram";
import { evaluatePublicLinkedInProfile } from "@/lib/platforms/linkedin";
import { PlatformAnalyzeResponse, UnifiedPlatformMetrics } from "@/types/platform";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest): Promise<NextResponse<PlatformAnalyzeResponse>> {
  try {
    const body = await req.json();
    const { url, platform, forceRefresh, userId } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        {
          success: false,
          platform: (platform as SupportedPlatform) || "youtube",
          dataState: "data_unavailable",
          errorCode: "INVALID_URL",
          error: "A valid URL or profile identifier is required.",
        },
        { status: 400 }
      );
    }

    // Step 1: Parse and validate URL
    const parsed = parseAndValidateProfileUrl(url, platform);
    if (!parsed.isValid) {
      return NextResponse.json(
        {
          success: false,
          platform: parsed.platform,
          dataState: "data_unavailable",
          errorCode: "INVALID_URL",
          error: parsed.error || "Invalid profile URL format.",
        },
        { status: 400 }
      );
    }

    // Step 2: Route to platform-specific official integration handler
    if (parsed.platform === "youtube") {
      const result = await fetchYouTubeChannelData(parsed, {
        forceRefresh: !!forceRefresh,
        userId,
      });

      if (!result.success || !result.metrics) {
        return NextResponse.json(
          {
            success: false,
            platform: "youtube",
            dataState: "data_unavailable",
            errorCode: result.errorCode || "CHANNEL_NOT_FOUND",
            error: result.errorMessage || "Failed to retrieve YouTube channel data.",
            instructions: result.instructions,
          },
          { status: result.errorCode === "CREDENTIALS_MISSING" ? 200 : 400 }
        );
      }

      // Persist to Supabase if authenticated and client available
      await persistPlatformSnapshot(result.metrics, userId);

      return NextResponse.json({
        success: true,
        platform: "youtube",
        metrics: result.metrics,
        dataState: result.metrics.dataState,
      });
    }

    if (parsed.platform === "instagram") {
      const result = evaluatePublicInstagramProfile(parsed, userId);
      return NextResponse.json({
        success: true,
        platform: "instagram",
        metrics: result.metrics,
        dataState: result.metrics.dataState,
        instructions: result.instructions,
      });
    }

    if (parsed.platform === "linkedin") {
      const result = evaluatePublicLinkedInProfile(parsed, userId);
      return NextResponse.json({
        success: true,
        platform: "linkedin",
        metrics: result.metrics,
        dataState: result.metrics.dataState,
        instructions: result.instructions,
      });
    }

    return NextResponse.json(
      {
        success: false,
        platform: parsed.platform,
        dataState: "data_unavailable",
        errorCode: "INVALID_URL",
        error: `Platform '${parsed.platform}' is not supported.`,
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        platform: "youtube",
        dataState: "data_unavailable",
        errorCode: "INTERNAL_ERROR",
        error: error.message || "An unexpected error occurred during profile analysis.",
      },
      { status: 500 }
    );
  }
}

/**
 * Safely persists a platform snapshot to Supabase if the database is configured.
 * Degrades gracefully if the connected_accounts table has not yet been migrated.
 */
async function persistPlatformSnapshot(metrics: UnifiedPlatformMetrics, userId?: string) {
  const supabase = getServerSupabaseClient();
  if (!supabase || !userId) return;

  try {
    await supabase.from("connected_accounts").upsert(
      {
        user_id: userId,
        platform: metrics.platform,
        platform_account_id: metrics.platformAccountId,
        profile_name: metrics.profileName,
        handle: metrics.handle,
        profile_url: metrics.profileUrl,
        avatar_url: metrics.avatarUrl,
        description: metrics.description,
        authorization_status: metrics.authorizationStatus,
        data_state: metrics.dataState,
        data_completeness: metrics.dataCompleteness,
        is_verified: metrics.isVerifiedPlatformStats,
        follower_count: metrics.followerCount,
        follower_count_source: metrics.followerCountSource,
        is_subscriber_count_hidden: metrics.isSubscriberCountHidden || false,
        total_views: metrics.totalViews,
        total_views_source: metrics.totalViewsSource,
        media_count: metrics.mediaCount,
        media_count_source: metrics.mediaCountSource,
        avg_engagement_rate: metrics.avgEngagementRate,
        avg_engagement_rate_source: metrics.avgEngagementRateSource,
        recent_media: metrics.recentMedia,
        limitations: metrics.limitations,
        last_synced_at: metrics.lastSyncedAt,
      },
      {
        onConflict: "user_id,platform,handle",
      }
    );
  } catch {
    // Non-blocking persistence failure
  }
}

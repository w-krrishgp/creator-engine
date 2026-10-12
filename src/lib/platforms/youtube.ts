import { ParsedProfileUrl } from "./urlParser";
import { UnifiedPlatformMetrics, UnifiedRecentMediaItem } from "@/types/platform";

interface CacheEntry {
  data: UnifiedPlatformMetrics;
  cachedAt: number;
}

// In-memory cache with 30-minute TTL to conserve YouTube Data API quota (10,000 daily quota limit)
const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000;

export interface YouTubeFetchResult {
  success: boolean;
  metrics?: UnifiedPlatformMetrics;
  fromCache?: boolean;
  errorCode?: 
    | "CREDENTIALS_MISSING" 
    | "CHANNEL_NOT_FOUND" 
    | "QUOTA_EXHAUSTED" 
    | "PRIVATE_OR_UNAVAILABLE" 
    | "API_ERROR";
  errorMessage?: string;
  instructions?: string;
}

/**
 * Fetches verified public YouTube channel data using YouTube Data API v3.
 * Server-only execution. Does not expose API key to client.
 */
export async function fetchYouTubeChannelData(
  parsedUrl: ParsedProfileUrl,
  options: { forceRefresh?: boolean; userId?: string } = {}
): Promise<YouTubeFetchResult> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return {
      success: false,
      errorCode: "CREDENTIALS_MISSING",
      errorMessage: "YouTube Data API Key is not configured on the server.",
      instructions:
        "To enable genuine YouTube Data API retrieval, obtain a Google Cloud API Key with 'YouTube Data API v3' enabled and set YOUTUBE_API_KEY in your environment variables (.env.local).",
    };
  }

  const cacheKey = `yt:${parsedUrl.identifier.toLowerCase()}`;
  if (!options.forceRefresh) {
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return {
        success: true,
        metrics: {
          ...cached.data,
          dataState: "cached_live",
          userId: options.userId || cached.data.userId,
        },
        fromCache: true,
      };
    }
  }

  try {
    // Step 1: Resolve Channel via Handle, ID, or Username
    let channelItem: any = null;

    if (parsedUrl.identifierType === "channel_id") {
      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${encodeURIComponent(parsedUrl.identifier)}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) return handleYouTubeApiError(data, res.status);
      if (data.items && data.items.length > 0) {
        channelItem = data.items[0];
      }
    } else if (parsedUrl.identifierType === "handle") {
      const handleParam = parsedUrl.identifier.startsWith("@")
        ? parsedUrl.identifier
        : `@${parsedUrl.identifier}`;
      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forHandle=${encodeURIComponent(handleParam)}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) return handleYouTubeApiError(data, res.status);
      if (data.items && data.items.length > 0) {
        channelItem = data.items[0];
      }
    } else {
      // Username or vanity slug
      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forUsername=${encodeURIComponent(parsedUrl.identifier)}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) return handleYouTubeApiError(data, res.status);
      if (data.items && data.items.length > 0) {
        channelItem = data.items[0];
      } else {
        // Fallback: search query for channel
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(parsedUrl.identifier)}&maxResults=1&key=${apiKey}`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        if (!searchRes.ok) return handleYouTubeApiError(searchData, searchRes.status);
        if (searchData.items && searchData.items.length > 0) {
          const resolvedChannelId = searchData.items[0].snippet.channelId;
          const directUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${encodeURIComponent(resolvedChannelId)}&key=${apiKey}`;
          const directRes = await fetch(directUrl);
          const directData = await directRes.json();
          if (directData.items && directData.items.length > 0) {
            channelItem = directData.items[0];
          }
        }
      }
    }

    if (!channelItem) {
      return {
        success: false,
        errorCode: "CHANNEL_NOT_FOUND",
        errorMessage: `No public YouTube channel found for '${parsedUrl.identifier}'. Verify the channel handle or URL.`,
      };
    }

    // Step 2: Extract Channel Metadata & Statistics
    const snippet = channelItem.snippet || {};
    const stats = channelItem.statistics || {};
    const contentDetails = channelItem.contentDetails || {};

    const channelId = channelItem.id;
    const channelTitle = snippet.title || parsedUrl.identifier;
    const channelDescription = snippet.description || "";
    const customUrl = snippet.customUrl ? (snippet.customUrl.startsWith("@") ? snippet.customUrl : `@${snippet.customUrl}`) : parsedUrl.identifier;
    const avatarUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url;

    // Handle hidden subscriber counts legitimately
    const isHiddenSubs = stats.hiddenSubscriberCount === true;
    const followerCount = isHiddenSubs
      ? null
      : stats.subscriberCount !== undefined
      ? parseInt(stats.subscriberCount, 10)
      : null;

    const totalViews = stats.viewCount !== undefined ? parseInt(stats.viewCount, 10) : null;
    const mediaCount = stats.videoCount !== undefined ? parseInt(stats.videoCount, 10) : null;

    // Step 3: Fetch Recent Public Videos from Uploads Playlist
    const uploadsPlaylistId = contentDetails.relatedPlaylists?.uploads;
    let recentMedia: UnifiedRecentMediaItem[] = [];
    let avgEngagementRate: number | null = null;
    const limitations: string[] = [];

    if (uploadsPlaylistId) {
      try {
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(uploadsPlaylistId)}&maxResults=5&key=${apiKey}`;
        const playlistRes = await fetch(playlistUrl);
        const playlistData = await playlistRes.json();

        if (playlistRes.ok && playlistData.items && playlistData.items.length > 0) {
          const videoIds = playlistData.items
            .map((item: any) => item.contentDetails?.videoId)
            .filter(Boolean);

          if (videoIds.length > 0) {
            const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${encodeURIComponent(videoIds.join(","))}&key=${apiKey}`;
            const videosRes = await fetch(videosUrl);
            const videosData = await videosRes.json();

            if (videosRes.ok && videosData.items) {
              let totalEngRateSum = 0;
              let engCount = 0;

              recentMedia = videosData.items.map((video: any) => {
                const vSnippet = video.snippet || {};
                const vStats = video.statistics || {};
                const vViews = vStats.viewCount ? parseInt(vStats.viewCount, 10) : null;
                const vLikes = vStats.likeCount ? parseInt(vStats.likeCount, 10) : null;
                const vComments = vStats.commentCount ? parseInt(vStats.commentCount, 10) : null;

                if (vViews && vViews > 0 && vLikes !== null) {
                  const interactions = (vLikes || 0) + (vComments || 0);
                  const rate = (interactions / vViews) * 100;
                  totalEngRateSum += rate;
                  engCount++;
                }

                return {
                  id: video.id,
                  titleOrCaption: vSnippet.title || "Untitled Video",
                  publishedAt: vSnippet.publishedAt || new Date().toISOString(),
                  url: `https://www.youtube.com/watch?v=${video.id}`,
                  thumbnailUrl: vSnippet.thumbnails?.high?.url || vSnippet.thumbnails?.medium?.url,
                  viewCount: vViews,
                  likeCount: vLikes,
                  commentCount: vComments,
                  metricsSource: "official_api" as const,
                };
              });

              if (engCount > 0) {
                avgEngagementRate = Math.round((totalEngRateSum / engCount) * 100) / 100;
              }
            }
          }
        }
      } catch (videoErr) {
        limitations.push("Recent videos list was temporarily unavailable.");
      }
    } else {
      limitations.push("Channel has no public uploads playlist.");
    }

    if (isHiddenSubs) {
      limitations.push("Channel owner has hidden public subscriber count.");
    }

    const unifiedMetrics: UnifiedPlatformMetrics = {
      id: `yt_${channelId}`,
      userId: options.userId,
      platform: "youtube",
      platformAccountId: channelId,
      profileName: channelTitle,
      handle: customUrl,
      profileUrl: `https://www.youtube.com/${customUrl.startsWith("@") ? customUrl : "@" + customUrl}`,
      avatarUrl,
      description: channelDescription,
      followerCount,
      followerCountSource: isHiddenSubs ? "unavailable" : "official_api",
      isSubscriberCountHidden: isHiddenSubs,
      totalViews,
      totalViewsSource: totalViews !== null ? "official_api" : "unavailable",
      mediaCount,
      mediaCountSource: mediaCount !== null ? "official_api" : "unavailable",
      avgEngagementRate,
      avgEngagementRateSource: avgEngagementRate !== null ? "official_api" : "unavailable",
      recentMedia,
      dataState: "live",
      authorizationStatus: "not_required",
      dataCompleteness: isHiddenSubs ? "partial" : "full",
      isVerifiedPlatformStats: true,
      lastSyncedAt: new Date().toISOString(),
      limitations,
    };

    // Cache the verified response
    memoryCache.set(cacheKey, {
      data: unifiedMetrics,
      cachedAt: Date.now(),
    });
    // Also cache by channelId
    memoryCache.set(`yt:${channelId.toLowerCase()}`, {
      data: unifiedMetrics,
      cachedAt: Date.now(),
    });

    return {
      success: true,
      metrics: unifiedMetrics,
      fromCache: false,
    };
  } catch (error: any) {
    return {
      success: false,
      errorCode: "API_ERROR",
      errorMessage: error.message || "An unexpected error occurred while communicating with YouTube Data API.",
    };
  }
}

function handleYouTubeApiError(data: any, statusCode: number): YouTubeFetchResult {
  const errorObj = data.error || {};
  const reason = errorObj.errors?.[0]?.reason || "";
  const message = errorObj.message || "YouTube API error occurred.";

  if (statusCode === 403 && (reason === "quotaExceeded" || message.includes("quota"))) {
    return {
      success: false,
      errorCode: "QUOTA_EXHAUSTED",
      errorMessage: "YouTube Data API daily quota has been exceeded for this project.",
      instructions: "The YouTube Data API allows 10,000 quota units per day. Please retry tomorrow or request a quota increase from Google Cloud Console.",
    };
  }

  if (statusCode === 400 || statusCode === 404) {
    return {
      success: false,
      errorCode: "CHANNEL_NOT_FOUND",
      errorMessage: `YouTube channel was not found or the identifier is invalid: ${message}`,
    };
  }

  return {
    success: false,
    errorCode: "API_ERROR",
    errorMessage: `YouTube API returned error (${statusCode}): ${message}`,
  };
}

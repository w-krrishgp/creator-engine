import { YouTubeImportPreview } from "@/types/creator";

// Server-side memory cache for YouTube import previews
interface CacheEntry {
  preview: YouTubeImportPreview;
  expiresAt: number;
}

// Persist across Next.js dev reloads
const globalForPreview = globalThis as unknown as {
  cePreviewCache?: Map<string, CacheEntry>;
};

const previewCache: Map<string, CacheEntry> =
  globalForPreview.cePreviewCache ?? new Map<string, CacheEntry>();

if (process.env.NODE_ENV !== "production") {
  globalForPreview.cePreviewCache = previewCache;
}

function purgeExpired() {
  const now = Date.now();
  for (const [id, entry] of previewCache.entries()) {
    if (entry.expiresAt < now) {
      previewCache.delete(id);
    }
  }
}

export function savePreviewSession(preview: YouTubeImportPreview): string {
  purgeExpired();
  const sessionId = "yt_sess_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now().toString(36);
  previewCache.set(sessionId, {
    preview,
    expiresAt: Date.now() + 1000 * 60 * 30, // 30 mins
  });
  return sessionId;
}

export function getPreviewSession(sessionId: string): YouTubeImportPreview | null {
  purgeExpired();
  const entry = previewCache.get(sessionId);
  if (!entry) return null;
  return entry.preview;
}

export function deletePreviewSession(sessionId: string) {
  previewCache.delete(sessionId);
}

// Compact preview for fallback cookie (< 2.5 KB Base64, well under the 4096-byte browser limit)
export function createCompactPreview(preview: YouTubeImportPreview): YouTubeImportPreview {
  return {
    youtubeData: {
      channelId: preview.youtubeData.channelId,
      title: preview.youtubeData.title,
      description: (preview.youtubeData.description || "").slice(0, 120),
      thumbnail: preview.youtubeData.thumbnail,
      channelUrl: preview.youtubeData.channelUrl,
      handle: preview.youtubeData.handle,
      subscriberCount: preview.youtubeData.subscriberCount,
      totalViews: preview.youtubeData.totalViews,
      videoCount: preview.youtubeData.videoCount,
      country: preview.youtubeData.country,
      publishedAt: preview.youtubeData.publishedAt,
      averageViews: preview.youtubeData.averageViews,
      averageLikes: preview.youtubeData.averageLikes,
      averageComments: preview.youtubeData.averageComments,
      engagementRate: preview.youtubeData.engagementRate,
      postingFrequency: preview.youtubeData.postingFrequency,
      recentVideos: [],
    },
    creatorIntelligence: preview.creatorIntelligence,
    suggestedProfile: {
      ...preview.suggestedProfile,
      contentDescription: (preview.suggestedProfile.contentDescription || "").slice(0, 140),
    },
  };
}

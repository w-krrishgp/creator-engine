import { SupportedPlatform } from "@/lib/platforms/urlParser";

export type MetricProvenance = 
  | "official_api"   // Retrieved directly from an official API
  | "user_entered"   // Supplied manually by the creator
  | "estimated"      // Derived or estimated by Creator Engine
  | "unavailable";   // Not legitimately accessible or hidden

export type AccountDataState =
  | "live"                 // Live verified data directly from official API
  | "cached_live"          // Authenticated or public live data served from cache
  | "user_entered"         // Self-reported by user
  | "demo"                 // Demo/sample persona (Rahul / Priya)
  | "connection_required"  // Public URL detected, but private/professional OAuth required for analytics
  | "data_unavailable";    // Account private, unresolvable, or platform rate limited

export type AuthorizationStatus =
  | "not_required"   // e.g. public YouTube channel Data API
  | "public_only"    // e.g. IG/LinkedIn handle known, but no OAuth granted
  | "authorized"     // Official OAuth token active and valid
  | "expired"        // Token expired and requires re-authorization
  | "unauthorized";  // Missing scopes or personal account restrictions

export interface UnifiedRecentMediaItem {
  id: string;
  titleOrCaption: string;
  publishedAt: string; // ISO date
  url: string;
  thumbnailUrl?: string;
  viewCount: number | null;
  likeCount: number | null;
  commentCount: number | null;
  metricsSource: MetricProvenance;
}

export interface MetricWithProvenance<T> {
  value: T | null;
  source: MetricProvenance;
  lastUpdated: string; // ISO timestamp
  notes?: string;
}

export interface UnifiedPlatformMetrics {
  id: string; // Internal UUID or connection ID
  userId?: string; // Authenticated Supabase user ID
  platform: SupportedPlatform;
  platformAccountId: string | null; // e.g. YouTube Channel ID (UC...), IG Business ID, LinkedIn sub
  profileName: string;
  handle: string; // e.g. @mkbhd, rahul.fit
  profileUrl: string;
  avatarUrl?: string;
  description?: string;

  // Primary platform metrics (null if unavailable, never fake zero)
  followerCount: number | null; // Subscribers for YT, Followers for IG/LI
  followerCountSource: MetricProvenance;
  isSubscriberCountHidden?: boolean;

  totalViews: number | null; // Channel total views, video views
  totalViewsSource: MetricProvenance;

  mediaCount: number | null; // Total videos or posts
  mediaCountSource: MetricProvenance;

  avgEngagementRate: number | null; // Percentage e.g. 4.2
  avgEngagementRateSource: MetricProvenance;

  // Recent content
  recentMedia: UnifiedRecentMediaItem[];

  // Data governance & provenance
  dataState: AccountDataState;
  authorizationStatus: AuthorizationStatus;
  dataCompleteness: "full" | "partial" | "minimal" | "none";
  isVerifiedPlatformStats: boolean;
  lastSyncedAt: string; // ISO timestamp

  // Diagnostic feedback & restrictions
  limitations: string[];
  warningMessage?: string;
  errorMessage?: string;
}

export interface PlatformAnalyzeRequest {
  url: string;
  platform?: SupportedPlatform;
  creatorId?: string;
}

export interface PlatformAnalyzeResponse {
  success: boolean;
  platform: SupportedPlatform;
  metrics?: UnifiedPlatformMetrics;
  dataState: AccountDataState;
  error?: string;
  errorCode?: 
    | "INVALID_URL"
    | "CHANNEL_NOT_FOUND"
    | "ACCOUNT_NOT_FOUND"
    | "PRIVATE_ACCOUNT"
    | "PRIVATE_OR_UNAVAILABLE"
    | "QUOTA_EXHAUSTED"
    | "CREDENTIALS_MISSING"
    | "AUTH_REQUIRED"
    | "UNSUPPORTED_ACCOUNT_TYPE"
    | "API_ERROR"
    | "INTERNAL_ERROR";
  instructions?: string;
}

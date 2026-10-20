import { CreatorProfile } from "./creator";

/**
 * Raw TinyFish Search API Schemas
 */
export interface TinyFishSearchParams {
  query: string;
  purpose?: string;
  location?: string;
  language?: string;
  include_domains?: string;
  exclude_domains?: string;
  recency_minutes?: number;
}

export interface TinyFishSearchResultItem {
  position: number;
  site_name: string;
  title: string;
  snippet: string;
  url: string;
}

export interface TinyFishSearchResponse {
  query: string;
  results: TinyFishSearchResultItem[];
  total_results: number;
  page?: number;
  error?: {
    code: string;
    message: string;
  };
  request_id?: string;
}

/**
 * Raw TinyFish Fetch API Schemas
 */
export interface TinyFishFetchOptions {
  format?: "markdown" | "html" | "json";
  ttl?: number;
  purpose?: string;
  links?: boolean;
  image_links?: boolean;
  iframe_links?: boolean;
  per_url_timeout_ms?: number;
}

export interface TinyFishFetchResultItem {
  url: string;
  final_url?: string;
  title?: string;
  description?: string;
  language?: string;
  format?: string;
  text: string;
  links?: string[];
  image_links?: string[];
  iframe_links?: string[];
}

export interface TinyFishFetchErrorItem {
  url: string;
  error: string;
}

export interface TinyFishFetchResponse {
  results: TinyFishFetchResultItem[];
  errors: TinyFishFetchErrorItem[];
  error?: {
    code: string;
    message: string;
  };
  request_id?: string;
}

/**
 * Creator Opportunity Radar Domain Schemas
 */

export interface RadarSearchRequest {
  query?: string;
  niche?: string;
  location?: string;
  platform?: string;
  limit?: number;
}

export interface RadarDiscoveredItem {
  id: string;
  title: string;
  url: string;
  siteName: string;
  snippet: string;
  position: number;
  retrievalTimestamp: string;
  sourceUrl: string;
  matchScore: number;
  matchJustification: string;
  isVerifiedFromPage: boolean;
  nicheTag: string;
}

export interface RadarSearchResponse {
  success: boolean;
  totalResults: number;
  queryUsed: string;
  retrievalTimestamp: string;
  results: RadarDiscoveredItem[];
  rateLimited?: boolean;
  warning?: string;
  error?: string;
}

export interface VerificationFlags {
  brandVerified: boolean;
  requirementsVerified: boolean;
  compensationVerified: boolean;
  deadlineVerified: boolean;
  applicationLinkVerified: boolean;
}

export interface RadarExtractedCampaign {
  brandName: string;
  campaignTitle: string;
  campaignDescription: string;
  eligibilityRequirements: string[];
  compensation: string | null;
  compensationNotes?: string;
  publishedDeadline: string | null;
  applicationUrl: string | null;
  targetAudience: string | null;
  targetLocation: string | null;
  sourceUrl: string;
  finalUrl: string;
  retrievalTimestamp: string;
  verification: VerificationFlags;
  missingInformation: string[];
  sourcePageTitle?: string;
  sourcePageDescription?: string;
  isAuthenticCampaignPage: boolean;
  rawExcerpt?: string;
}

export interface RadarGeneratedPitch {
  subject: string;
  elevatorPitch: string;
  fullOutreachMessage: string;
  suggestedDeliverables: string[];
  suggestedFeeRange?: string;
  modelUsed: string;
  isFallback: boolean;
  creatorMatchedId: string;
}

export interface RadarExtractRequest {
  url: string;
  creatorProfile?: CreatorProfile;
}

export interface RadarExtractResponse {
  success: boolean;
  retrievalTimestamp: string;
  campaign?: RadarExtractedCampaign;
  pitch?: RadarGeneratedPitch;
  error?: string;
  details?: string;
}

import { NextRequest, NextResponse } from "next/server";
import {
  exchangeLinkedInCode,
  fetchAuthenticatedLinkedInMetrics,
  getLinkedInRedirectUri,
  decodeJwtPayload,
} from "@/lib/platforms/linkedin";
import { getServerSupabaseClient } from "@/lib/supabase/server";

function getRequestOrigin(req: NextRequest): string {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    const proto = forwardedProto || "https";
    return `${proto}://${forwardedHost}`;
  }
  return req.nextUrl.origin;
}

export async function GET(req: NextRequest) {
  const origin = getRequestOrigin(req);
  const searchParams = req.nextUrl.searchParams;

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  console.log("[LinkedIn Callback] Received OAuth return:", {
    hasCode: !!code,
    hasState: !!state,
    providerError: error || null,
  });

  // Step 1: Handle User Cancellation or LinkedIn Provider Errors
  if (error) {
    console.warn("[LinkedIn Callback] LinkedIn provider returned error:", {
      error,
      errorDescription,
    });
    const res = NextResponse.redirect(
      new URL(
        `/profile?linkedin_error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(
          errorDescription || "LinkedIn authorization was cancelled or denied."
        )}`,
        origin
      )
    );
    res.cookies.delete("li_oauth_state");
    return res;
  }

  if (!code) {
    console.warn("[LinkedIn Callback] Missing authorization code.");
    const res = NextResponse.redirect(
      new URL("/profile?linkedin_error=missing_code&error_description=No+authorization+code+received+from+LinkedIn.", origin)
    );
    res.cookies.delete("li_oauth_state");
    return res;
  }

  // Step 2: Validate CSRF State Token against secure HTTP-only cookie
  const savedState = req.cookies.get("li_oauth_state")?.value;
  const isStateValid = !!savedState && !!state && (savedState === state || decodeURIComponent(savedState) === decodeURIComponent(state));

  console.log("[LinkedIn Callback] State validation:", {
    cookieFound: !!savedState,
    stateMatch: isStateValid,
  });

  if (!isStateValid) {
    console.error("[LinkedIn Callback] CSRF State mismatch or missing state cookie.");
    const res = NextResponse.redirect(
      new URL(
        "/profile?linkedin_error=invalid_state&error_description=Security+state+validation+failed.+Please+ensure+cookies+are+enabled+and+retry+connecting.",
        origin
      )
    );
    res.cookies.delete("li_oauth_state");
    return res;
  }

  // Extract creatorId embedded in state payload if present
  let creatorId = "default";
  if (state.includes("__")) {
    const parts = state.split("__");
    if (parts[1]) {
      creatorId = decodeURIComponent(parts[1]);
    }
  }

  // Step 3: Server-side code exchange using Client Secret (Never exposed to browser)
  const redirectUri = getLinkedInRedirectUri(origin);
  console.log("[LinkedIn Callback] Exchanging code with redirect URI:", redirectUri);

  const tokenResult = await exchangeLinkedInCode(code, redirectUri);

  if (!tokenResult.success || !tokenResult.accessToken) {
    console.error("[LinkedIn Callback] Token exchange failed:", tokenResult.error);
    const res = NextResponse.redirect(
      new URL(
        `/profile?linkedin_error=token_exchange_failed&error_description=${encodeURIComponent(
          tokenResult.error || "Failed to exchange authorization code with LinkedIn."
        )}`,
        origin
      )
    );
    res.cookies.delete("li_oauth_state");
    return res;
  }

  // Step 4: Fetch verified OpenID Connect profile (UserInfo or ID Token claims)
  const idTokenPayload = tokenResult.idToken ? decodeJwtPayload(tokenResult.idToken) : null;
  const metricsResult = await fetchAuthenticatedLinkedInMetrics(
    tokenResult.accessToken,
    idTokenPayload,
    creatorId !== "default" ? creatorId : undefined
  );

  if (!metricsResult.success || !metricsResult.metrics) {
    console.error("[LinkedIn Callback] Profile retrieval failed:", metricsResult.error);
    const res = NextResponse.redirect(
      new URL(
        `/profile?linkedin_error=userinfo_failed&error_description=${encodeURIComponent(
          metricsResult.error || "Failed to retrieve verified LinkedIn profile information."
        )}`,
        origin
      )
    );
    res.cookies.delete("li_oauth_state");
    return res;
  }

  const metrics = metricsResult.metrics;

  // Step 5: Associate with Supabase without breaking existing authentication
  const supabase = getServerSupabaseClient();
  let dbPersisted = false;

  if (supabase) {
    try {
      // 1. Persist to connected_accounts table if present
      const { error: connError } = await supabase.from("connected_accounts").upsert(
        {
          platform: "linkedin",
          platform_account_id: metrics.platformAccountId,
          profile_name: metrics.profileName,
          handle: metrics.handle,
          profile_url: metrics.profileUrl,
          avatar_url: metrics.avatarUrl,
          description: metrics.description,
          authorization_status: "authorized",
          data_state: "live",
          data_completeness: "partial",
          is_verified: true,
          follower_count: null, // Basic OIDC does not expose follower count
          follower_count_source: "unavailable",
          total_views: null,
          total_views_source: "unavailable",
          media_count: null,
          media_count_source: "unavailable",
          avg_engagement_rate: null,
          avg_engagement_rate_source: "unavailable",
          recent_media: [],
          limitations: metrics.limitations,
          last_synced_at: new Date().toISOString(),
        },
        {
          onConflict: "platform,handle",
        }
      );

      if (!connError) {
        dbPersisted = true;
      } else {
        console.warn("[LinkedIn Callback] connected_accounts table notice (non-fatal):", connError.message);
      }

      // 2. Also ensure creator_profiles has a verified record for this profile in active database
      const profileId = `li_${metrics.platformAccountId || metrics.handle.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
      const { error: profError } = await supabase.from("creator_profiles").upsert(
        {
          id: profileId,
          name: metrics.profileName,
          handle: metrics.handle.startsWith("@") ? metrics.handle : `@${metrics.handle}`,
          avatar: metrics.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop",
          title: "LinkedIn Content Creator",
          niche: "Professional & Industry Insights",
          primary_platform: "LinkedIn",
          follower_count: 0,
          engagement_rate: 3.5,
          audience_demographic: `Audience following ${metrics.profileName} on LinkedIn`,
          content_format: "Posts & Articles",
          content_frequency: "3-4 pieces per week",
          creator_stage: "Nano (1k-10k)",
          experience_level: "Growing (1-3 yrs)",
          primary_goal: "Audience growth & industry authority",
          monetisation_goals: ["Brand Collaborations", "Consulting", "Workshops"],
          monthly_income_target: 50000,
          bio: metrics.description || `Verified LinkedIn creator (${metrics.profileName}).`,
          location: "Global",
          topics: ["Professional Growth", "Industry Insights"],
          active_deals_count: 0,
          estimated_pipeline_value: 0,
          monthly_growth_rate: 5.0,
          avg_impressions_per_post: 0,
          media_kit_link: `https://creator-engine.demo/mediakit/${profileId}`,
          is_manually_reported: false,
          is_onboarded: true,
        },
        {
          onConflict: "id",
        }
      );

      if (!profError) {
        dbPersisted = true;
      } else {
        console.warn("[LinkedIn Callback] creator_profiles table notice (non-fatal):", profError.message);
      }
    } catch (dbErr: any) {
      console.warn("[LinkedIn Callback] Database persistence degraded gracefully (non-fatal):", dbErr.message);
    }
  }

  // Step 6: Successful Redirection with confirmation parameters
  const targetUrl = new URL("/profile", origin);
  targetUrl.searchParams.set("linkedin_connected", "success");
  targetUrl.searchParams.set("member_id", metrics.platformAccountId || "");
  targetUrl.searchParams.set("name", metrics.profileName);
  targetUrl.searchParams.set("handle", metrics.handle);
  if (metrics.avatarUrl) {
    targetUrl.searchParams.set("avatar", metrics.avatarUrl);
  }
  if (!dbPersisted) {
    targetUrl.searchParams.set("db_status", "local_only");
  }

  const res = NextResponse.redirect(targetUrl);
  // Clear the state cookie upon successful consumption
  res.cookies.delete("li_oauth_state");

  return res;
}

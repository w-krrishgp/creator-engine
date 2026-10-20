"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCreator, calculateProfileCompletion } from "@/context/CreatorContext";
import {
  CreatorProfile,
  PlatformType,
  CreatorStageType,
  ExperienceLevelType,
} from "@/types/creator";
import { UnifiedPlatformMetrics } from "@/types/platform";
import {
  User,
  ShieldCheck,
  Save,
  RotateCcw,
  Sparkles,
  Target,
  ExternalLink,
  CheckCircle2,
  Share2,
  Info,
  ArrowRight,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  Video,
  Users,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";
import { PlatformDataStateBadge } from "@/components/platforms/PlatformDataStateBadge";
import { ConnectAccountModal } from "@/components/platforms/ConnectAccountModal";
import { ConnectProfilePrompt } from "@/components/common/ConnectProfilePrompt";
import { YouTubeIcon, InstagramIcon, LinkedInIcon } from "@/components/common/PlatformIcons";
import { YouTubeConnectModal } from "@/components/onboarding/YouTubeConnectModal";

function formatLastSynced(dateString?: string | null): string {
  if (!dateString) return "Today, 6:42 PM";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Today, 6:42 PM";
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const timeStr = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    if (isToday) {
      return `Today, ${timeStr}`;
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return `Yesterday, ${timeStr}`;
    }
    return `${d.toLocaleDateString([], { month: "short", day: "numeric" })}, ${timeStr}`;
  } catch {
    return "Today, 6:42 PM";
  }
}

export default function ProfilePage() {
  const {
    activeCreator,
    updateCreatorProfile,
    resetCreatorProfile,
    switchCreator,
    activePlatformMetrics,
    activeDataState,
    importPlatformCreator,
    disconnectPlatformCreator,
    showToast,
  } = useCreator();

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [isRefreshingYouTube, setIsRefreshingYouTube] = useState(false);
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isDeleteProfileDialogOpen, setIsDeleteProfileDialogOpen] = useState(false);

  // Detect LinkedIn OAuth callback redirections
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const linkedinConnected = params.get("linkedin_connected");
    const linkedinError = params.get("linkedin_error");
    const errorDescription = params.get("error_description");

    if (linkedinConnected === "success") {
      const memberId = params.get("member_id") || "verified_member";
      const name = params.get("name") || "LinkedIn Member";
      const handle = params.get("handle") || `in/${memberId.slice(0, 8)}`;
      const avatar = params.get("avatar") || undefined;

      const metrics: UnifiedPlatformMetrics = {
        id: `li_${memberId}`,
        platform: "linkedin",
        platformAccountId: memberId,
        profileName: name,
        handle: handle.startsWith("@") ? handle : `@${handle}`,
        profileUrl: `https://www.linkedin.com/in/${encodeURIComponent(handle.replace(/^@/, ""))}`,
        avatarUrl: avatar,
        description: `Verified LinkedIn Member (${name})`,
        followerCount: null,
        followerCountSource: "unavailable",
        totalViews: null,
        totalViewsSource: "unavailable",
        mediaCount: null,
        mediaCountSource: "unavailable",
        avgEngagementRate: null,
        avgEngagementRateSource: "unavailable",
        recentMedia: [],
        authorizationStatus: "authorized",
        dataState: "live",
        dataCompleteness: "partial",
        isVerifiedPlatformStats: true,
        lastSyncedAt: new Date().toISOString(),
        limitations: [
          "OpenID Connect verification confirmed identity (openid, profile, email).",
          "Follower counts, impressions, and post reach are not provided by basic sign-in.",
          "Creator analytics require LinkedIn Community Management Partner API access.",
        ],
      };

      importPlatformCreator(metrics);
      showToast(`Linked LinkedIn account: ${name}`, "success");

      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    } else if (linkedinError) {
      let friendlyMessage = errorDescription || linkedinError;
      if (linkedinError === "credentials_missing") {
        friendlyMessage = "LinkedIn credentials not found. Please set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in .env.local.";
      } else if (linkedinError === "invalid_state") {
        friendlyMessage = "Security state validation failed. Please ensure browser cookies are enabled and retry connecting.";
      } else if (linkedinError === "token_exchange_failed") {
        friendlyMessage = `Token exchange failed: ${errorDescription || "Please verify Client Secret and Authorized Redirect URL in LinkedIn Developer Portal."}`;
      } else if (linkedinError === "userinfo_failed") {
        friendlyMessage = `Profile access error: ${errorDescription || "Verify 'Sign In with LinkedIn using OpenID Connect' is added in your LinkedIn app Products."}`;
      }

      showToast(`LinkedIn: ${friendlyMessage}`, "warning");
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    }
  }, [importPlatformCreator, showToast]);

  // Local form state synced with activeCreator without cascading effect renders
  const [prevId, setPrevId] = useState(activeCreator?.id || "");
  const [formData, setFormData] = useState<CreatorProfile | null>(activeCreator);
  const [copiedLink, setCopiedLink] = useState(false);

  if (activeCreator && prevId !== activeCreator.id) {
    setPrevId(activeCreator.id);
    setFormData(activeCreator);
  }

  // If no active creator is connected, render the connect profile empty state
  if (!activeCreator || !formData) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-2">
        <ConnectProfilePrompt
          feature="profile"
          title="Connect Your Live Profile to Access Your Media Kit"
          subtitle="No active creator profile found. Connect your YouTube, Instagram, or LinkedIn account to generate a verified media kit, real-time engagement stats, and customizable rate cards."
        />
      </div>
    );
  }

  const handleChange = (
    field: keyof CreatorProfile,
    value: string | number | string[]
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCreatorProfile({
      ...formData,
      isManuallyReported: true,
      isOnboarded: true,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(`https://creator-engine.demo/mediakit/${formData.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const isYouTubeConnected = Boolean(
    (formData?.youtube_connected ?? activeCreator?.youtube_connected) === true &&
    (formData?.youtube_channel_id || activeCreator?.youtube_channel_id || formData?.handle)
  );

  const rawYtHandle =
    formData?.youtube_channel_title ||
    formData?.handle ||
    activePlatformMetrics?.handle ||
    "AlexTech";
  const ytChannelHandle = rawYtHandle.startsWith("@") ? rawYtHandle : `@${rawYtHandle}`;
  const ytLastSynced = formatLastSynced(
    formData?.youtube_data_updated_at ||
    activePlatformMetrics?.lastSyncedAt
  );

  const handleRefreshYouTube = async () => {
    if (!formData) return;
    setIsRefreshingYouTube(true);
    try {
      const channelIdentifier =
        formData.youtube_channel_id ||
        formData.handle?.replace(/^@/, "") ||
        activePlatformMetrics?.platformAccountId ||
        "AlexTech";

      const res = await fetch("/api/platforms/youtube/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: channelIdentifier,
          profileId: formData.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to refresh YouTube data");
      }

      const nowIso = data.lastSyncedAt || new Date().toISOString();
      const updated: CreatorProfile = {
        ...formData,
        ...(data.updatedMetrics || {}),
        youtube_subscriber_count: data.youtubeData?.subscriberCount ?? formData.youtube_subscriber_count,
        youtube_total_views: data.youtubeData?.totalViews ?? formData.youtube_total_views,
        youtube_video_count: data.youtubeData?.videoCount ?? formData.youtube_video_count,
        youtube_data_updated_at: nowIso,
        youtube_connected: true,
      };

      setFormData(updated);
      updateCreatorProfile(updated);
      showToast("YouTube data refreshed successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Could not refresh YouTube data. Check connection.", "warning");
    } finally {
      setIsRefreshingYouTube(false);
    }
  };

  const handleConfirmDisconnect = async () => {
    if (!formData) return;
    setIsDisconnecting(true);
    try {
      await fetch("/api/platforms/youtube/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: formData.id,
          channelId: formData.youtube_channel_id,
        }),
      });

      const updated: CreatorProfile = {
        ...formData,
        youtube_connected: false,
        youtube_channel_id: undefined,
        youtube_channel_url: undefined,
        connectedAccounts: (formData.connectedAccounts || []).map((acc) =>
          acc.platform === "youtube" ? { ...acc, status: "disconnected" as const } : acc
        ),
      };

      setFormData(updated);
      updateCreatorProfile(updated);
      setIsDisconnectDialogOpen(false);
      showToast("YouTube disconnected. Your manual profile data has been preserved.", "info");
    } catch (err: any) {
      showToast("Failed to disconnect YouTube. Please try again.", "warning");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const platforms: PlatformType[] = [
    "Instagram",
    "LinkedIn",
    "YouTube",
    "TikTok",
    "X",
  ];

  const stages: CreatorStageType[] = [
    "Nano (1k-10k)",
    "Micro (10k-50k)",
    "Mid-Tier (50k-200k)",
    "Macro (200k+)",
  ];

  const experienceLevels: ExperienceLevelType[] = [
    "Emerging (< 1 yr)",
    "Growing (1-3 yrs)",
    "Established (3+ yrs)",
  ];

  const monetisationOptions = [
    "Brand Collaborations",
    "Digital Guides & E-books",
    "1:1 Consulting & Calls",
    "Affiliate Supplements / Tools",
    "Corporate Workshops",
    "Paid Newsletter / Community",
  ];

  const toggleMonetisation = (option: string) => {
    const current = formData.monetisationGoals || [];
    const exists = current.includes(option);
    const updated = exists ? current.filter((g) => g !== option) : [...current, option];
    handleChange("monetisationGoals", updated);
  };

  // Real-time calculation based on local formData edits
  const currentCompletionScore = calculateProfileCompletion(formData);

  const completionChecklist = [
    { label: "Creator Name & Handle", met: !!formData.name && !!formData.handle },
    { label: "Niche & Specialization", met: !!formData.niche },
    { label: "Experience Level", met: !!formData.experienceLevel },
    { label: "Primary Platform Selected", met: !!formData.primaryPlatform },
    { label: "Follower Metric Set", met: formData.followerCount > 0 },
    { label: "Audience Demographics Described", met: !!formData.audienceDemographic },
    { label: "Content Format Defined", met: !!formData.contentFormat },
    { label: "Publishing Frequency", met: !!formData.contentFrequency },
    { label: "Growth Stage Categorized", met: !!formData.creatorStage },
    { label: "Primary Business Goal Set", met: !!formData.primaryGoal },
    { label: "Monetisation Channels Selected", met: (formData.monetisationGoals?.length || 0) > 0 },
    { label: "Monthly Income Target Defined", met: formData.monthlyIncomeTarget > 0 },
    { label: "Creator Bio & Pitch", met: !!formData.bio },
    { label: "Geographic Location", met: !!formData.location },
  ];

  return (
    <div className="space-y-6">
      {/* Top Disclaimer */}
      <DemoDisclaimer text="Profiles are saved in local application state. Profile edits immediately recalibrate your deterministic compatibility matches on the brand marketplace and growth roadmap." />

      {/* Profile Hero Header Card */}
      <div className="bg-white rounded-[22px] border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Cover Accent Gradient */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-5 -mt-12 sm:-mt-14">
          {/* Avatar and Basic Details */}
          <div className="flex items-end gap-4 sm:gap-5 min-w-0">
            <div className="story-ring-gradient p-[3px] rounded-full shrink-0 shadow-md bg-white">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white bg-slate-100"
              />
            </div>
            <div className="pb-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {formData.name}
                </h1>
                <span title="Verified Creator Profile">
                  <ShieldCheck className="w-5 h-5 text-[#0870e8] shrink-0" />
                </span>
                <Badge variant="blue" size="sm">
                  {formData.primaryPlatform}
                </Badge>
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-600 mt-0.5">
                {formData.handle?.startsWith("@") ? formData.handle : `@${formData.handle}`} • {formData.niche} • {formData.location}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-end">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-[#0870e8] text-xs sm:text-sm font-bold transition-all shadow-2xs btn-tactile"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0870e8]" />
              <span>Re-run Wizard</span>
            </Link>

            <button
              type="button"
              onClick={resetCreatorProfile}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs btn-tactile"
              title="Reset profile data to default persona"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-[#0870e8] hover:bg-[#0760cb] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all btn-tactile"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteProfileDialogOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200/80 text-rose-700 text-xs sm:text-sm font-bold transition-all shadow-2xs btn-tactile cursor-pointer"
              title={`Disconnect and remove ${formData.name} from workspace`}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Disconnect Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Connected Accounts Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0870e8]/10 text-[#0870e8]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Connected Accounts
                </h3>
                <PlatformDataStateBadge
                  state={isYouTubeConnected ? "live" : activeDataState}
                  provenance={isYouTubeConnected ? "official_api" : activePlatformMetrics?.followerCountSource || (activeCreator.isManuallyReported ? "user_entered" : "user_entered")}
                  lastSyncedAt={formData.youtube_data_updated_at || activePlatformMetrics?.lastSyncedAt}
                  size="xs"
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Official platform integrations, verified metrics, and automated synchronization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isYouTubeConnected && (
              <button
                type="button"
                onClick={() => setIsYouTubeModalOpen(true)}
                className="btn-tactile inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
              >
                <YouTubeIcon className="w-4 h-4 text-white" />
                <span>Connect YouTube</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsConnectModalOpen(true)}
              className="btn-tactile inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Other Accounts</span>
            </button>
          </div>
        </div>

        {/* Primary Platform: YouTube */}
        <div className="pt-5 space-y-5">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <YouTubeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-slate-900 text-base sm:text-lg">
                      YouTube
                    </span>
                    {isYouTubeConnected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Connected ✓
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200/70 border border-slate-300 text-slate-600 text-xs font-semibold">
                        Not Connected
                      </span>
                    )}
                  </div>
                  {isYouTubeConnected ? (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 mt-0.5 flex-wrap">
                      <span className="font-semibold text-slate-900">
                        Channel: <code className="font-mono text-[#0870e8] bg-blue-50 px-1.5 py-0.5 rounded-md">{ytChannelHandle}</code>
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">
                        Last synced: <span className="font-medium text-slate-700">{ytLastSynced}</span>
                      </span>
                      {formData.youtube_channel_url && (
                        <a
                          href={formData.youtube_channel_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-slate-700 inline-flex items-center gap-0.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-0.5">
                      Connect your YouTube channel and let Creator Engine automatically sync your live metrics, recent uploads, and channel themes.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {isYouTubeConnected ? (
                  <>
                    <button
                      type="button"
                      onClick={handleRefreshYouTube}
                      disabled={isRefreshingYouTube}
                      className="btn-tactile px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-2xs transition-colors"
                      title="Sync latest statistics and uploads from YouTube Data API"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingYouTube ? "animate-spin text-[#0870e8]" : ""}`} />
                      <span>{isRefreshingYouTube ? "Refreshing..." : "Refresh YouTube Data"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDisconnectDialogOpen(true)}
                      className="btn-tactile px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                      title="Disconnect YouTube integration"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsYouTubeModalOpen(true)}
                    className="btn-tactile px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <YouTubeIcon className="w-4 h-4 text-white" />
                    <span>Connect YouTube →</span>
                  </button>
                )}
              </div>
            </div>

            {/* Verified Statistics Breakdown (when connected) */}
            {isYouTubeConnected && (
              <div className="pt-2 space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                      Subscribers
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                      {(formData.youtube_subscriber_count || formData.followerCount || 0).toLocaleString()}
                    </span>
                    <span className="text-3xs text-slate-400 block mt-1">
                      Official YouTube API
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                      Total Views
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                      {(formData.youtube_total_views || 0) > 0
                        ? (formData.youtube_total_views || 0).toLocaleString()
                        : "Not enough data"}
                    </span>
                    <span className="text-3xs text-slate-400 block mt-1">
                      Official YouTube API
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                      Videos
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                      {(formData.youtube_video_count || 0) > 0
                        ? (formData.youtube_video_count || 0).toLocaleString()
                        : "Not enough data"}
                    </span>
                    <span className="text-3xs text-slate-400 block mt-1">
                      Channel Uploads
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                      Average Views
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                      {(formData.averageViews || formData.avgImpressionsPerPost || 0) > 0
                        ? (formData.averageViews || formData.avgImpressionsPerPost || 0).toLocaleString()
                        : "Not enough data"}
                    </span>
                    <span className="text-3xs text-[#0870e8] font-semibold block mt-1">
                      Calculated by Creator Engine
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                      Engagement Rate
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-emerald-600">
                      {(formData.engagementRate || 0) > 0
                        ? `${formData.engagementRate}%`
                        : "Not enough data"}
                    </span>
                    <span className="text-3xs text-[#0870e8] font-semibold block mt-1">
                      Calculated by Creator Engine
                    </span>
                  </div>
                </div>

                {/* Top Content Themes */}
                {formData.content_themes && formData.content_themes.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Top Content Themes:</span>
                    {formData.content_themes.map((theme, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Multi-Platform Architecture: Upcoming Platforms */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Multi-Platform Architecture (Upcoming Platforms)
              </span>
              <span className="text-2xs text-slate-400">
                Connected account schema prepared for Instagram, TikTok, LinkedIn, X, Twitch
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Instagram", color: "text-pink-600", bg: "bg-pink-50" },
                { name: "TikTok", color: "text-slate-800", bg: "bg-slate-100" },
                { name: "LinkedIn", color: "text-blue-700", bg: "bg-blue-50" },
                { name: "X / Twitter", color: "text-slate-900", bg: "bg-slate-100" },
              ].map((plat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-slate-200/70 flex items-center justify-between gap-2 opacity-80"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-7 h-7 rounded-lg ${plat.bg} ${plat.color} flex items-center justify-center font-bold text-xs shrink-0`}>
                      {plat.name[0]}
                    </div>
                    <span className="text-xs font-bold text-slate-800 truncate">{plat.name}</span>
                  </div>
                  <span className="text-3xs uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">
                    Coming Soon
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Disconnect Confirmation Dialog */}
      {isDisconnectDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Disconnect YouTube Channel Sync?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Are you sure you want to disconnect live YouTube sync for <strong className="text-slate-900">{ytChannelHandle}</strong>?
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-700">What happens:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Automatic YouTube metric synchronization will stop.</li>
                  <li>Your creator profile will switch to manual mode with all data <strong>preserved</strong>.</li>
                  <li>To remove this creator profile completely from your workspace, use the <strong>Disconnect Profile</strong> button above.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDisconnectDialogOpen(false)}
                disabled={isDisconnecting}
                className="btn-tactile px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDisconnect}
                disabled={isDisconnecting}
                className="btn-tactile px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {isDisconnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Disconnecting...</span>
                  </>
                ) : (
                  <span>Disconnect YouTube</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disconnect Entire Creator Profile Confirmation Dialog */}
      {isDeleteProfileDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-up text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Disconnect & Remove Creator Profile?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Are you sure you want to disconnect <strong className="text-slate-900">{formData.name}</strong> ({formData.handle}) from Creator Engine?
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-700">What happens:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>This creator profile will be removed from your connected profiles list.</li>
                  <li>All associated data and roadmap milestones for this profile will be cleared.</li>
                  <li>You can reconnect or import this channel again anytime.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteProfileDialogOpen(false)}
                className="btn-tactile px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setIsDeleteProfileDialogOpen(false);
                  await disconnectPlatformCreator(formData.id);
                }}
                className="btn-tactile px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer"
              >
                Disconnect & Remove Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Connect Modal */}
      <YouTubeConnectModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        onManualClick={() => setIsYouTubeModalOpen(false)}
      />

      {/* Other Accounts Modal */}
      <ConnectAccountModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onAccountImported={(metrics) => {
          importPlatformCreator(metrics);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Basic Identity Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-[#0870e8]" />
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                    Core Creator Identity
                  </h3>
                </div>
                <Badge variant="blue" size="sm">
                  Public Snapshot
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>

                  {/* Public Handle */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Handle / Channel *</label>
                    <input
                      type="text"
                      value={formData.handle}
                      onChange={(e) => handleChange("handle", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="e.g. alex@creator.dev"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>

                  {/* Website / Portfolio */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Website / Portfolio URL</label>
                    <input
                      type="url"
                      value={formData.website || ""}
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Niche */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Primary Niche *</label>
                    <input
                      type="text"
                      value={formData.niche}
                      onChange={(e) => handleChange("niche", e.target.value)}
                      placeholder="e.g. Fitness & Nutrition, Personal Finance"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Experience Level *</label>
                    <select
                      value={formData.experienceLevel || "Growing (1-3 yrs)"}
                      onChange={(e) => handleChange("experienceLevel", e.target.value as ExperienceLevelType)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all cursor-pointer"
                    >
                      {experienceLevels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Location */}
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Base Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Country</label>
                    <input
                      type="text"
                      value={formData.country || "India"}
                      onChange={(e) => handleChange("country", e.target.value)}
                      placeholder="e.g. India"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>

                  {/* Creator Stage */}
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Growth Stage *</label>
                    <select
                      value={formData.creatorStage}
                      onChange={(e) => handleChange("creatorStage", e.target.value as CreatorStageType)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all cursor-pointer"
                    >
                      {stages.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Creator Pitch & Bio</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] resize-none font-sans transition-all"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Audience & Channel Metrics Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Share2 className="w-4.5 h-4.5 text-[#0870e8]" />
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                    Platform Channels & Metrics (Self-Reported)
                  </h3>
                </div>
                <Badge variant="blue" size="sm">
                  Channels
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Primary Platform */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Primary Platform *</label>
                    <select
                      value={formData.primaryPlatform}
                      onChange={(e) => handleChange("primaryPlatform", e.target.value as PlatformType)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all cursor-pointer"
                    >
                      {platforms.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Follower Count */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Declared Follower Count *</label>
                    <input
                      type="number"
                      value={formData.followerCount}
                      onChange={(e) => handleChange("followerCount", parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Secondary Platform */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Secondary Platform (Optional)</label>
                    <select
                      value={formData.secondaryPlatform || ""}
                      onChange={(e) => handleChange("secondaryPlatform", e.target.value as PlatformType | "")}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all cursor-pointer"
                    >
                      <option value="">None</option>
                      {platforms.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Secondary Followers */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Secondary Followers</label>
                    <input
                      type="number"
                      value={formData.secondaryFollowers || 0}
                      onChange={(e) => handleChange("secondaryFollowers", parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Engagement Rate */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Estimated Engagement Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.engagementRate}
                      onChange={(e) => handleChange("engagementRate", parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>

                  {/* Average Views */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Average Views</label>
                    <input
                      type="number"
                      value={formData.averageViews || formData.avgImpressionsPerPost || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        handleChange("averageViews", val);
                        handleChange("avgImpressionsPerPost", val);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>

                  {/* Content Frequency */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Publishing Frequency</label>
                    <input
                      type="text"
                      value={formData.contentFrequency || "Consistent (3-5 posts/wk)"}
                      onChange={(e) => handleChange("contentFrequency", e.target.value)}
                      placeholder="e.g. 4-5 Reels / week"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>
                </div>

                {/* Audience description */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Audience Demographic Profile</label>
                  <input
                    type="text"
                    value={formData.audienceDemographic}
                    onChange={(e) => handleChange("audienceDemographic", e.target.value)}
                    placeholder="e.g. College students & beginners (18-24) or Software engineers (24-34)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                  />
                </div>

                {/* Content Format */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Primary Content Formats</label>
                  <input
                    type="text"
                    value={formData.contentFormat}
                    onChange={(e) => handleChange("contentFormat", e.target.value)}
                    placeholder="e.g. 60s Reels, Educational Carousels, Long-form case studies"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Business Goals & Monetisation Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-4.5 h-4.5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                    Business Goals & Monetisation Engine
                  </h3>
                </div>
                <Badge variant="emerald" size="sm">
                  Monetisation Target
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Primary Goal */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Primary Creator Objective *</label>
                    <input
                      type="text"
                      value={formData.primaryGoal}
                      onChange={(e) => handleChange("primaryGoal", e.target.value)}
                      placeholder="e.g. Brand Collaborations, 1:1 Consulting Clients"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>

                  {/* Monthly Income Target */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Monthly Income Target (INR)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm sm:text-base">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={formData.monthlyIncomeTarget}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          handleChange("monthlyIncomeTarget", val);
                          handleChange("monthlyIncomeGoal", val);
                        }}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                      />
                    </div>
                  </div>

                  {/* Preferred Collaboration Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Collaboration Type</label>
                    <select
                      value={formData.collaborationType || "Both paid and product"}
                      onChange={(e) => handleChange("collaborationType", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all cursor-pointer"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Affiliate">Affiliate</option>
                      <option value="Product">Product</option>
                      <option value="Both paid and product">Both paid and product</option>
                      <option value="Any">Any</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Brands or Industries */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">Target Brands & Industries</label>
                  <input
                    type="text"
                    value={formData.preferredIndustries || ""}
                    onChange={(e) => handleChange("preferredIndustries", e.target.value)}
                    placeholder="e.g. AI SaaS, Developer Tools, Consumer Tech, Productivity Apps"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                  />
                </div>

                {/* Monetisation Channels Multi-select */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wide">
                    Active & Planned Monetisation Channels
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {monetisationOptions.map((opt) => {
                      const isSelected = (formData.monetisationGoals || []).includes(opt);
                      return (
                        <div
                          key={opt}
                          onClick={() => toggleMonetisation(opt)}
                          className={`p-3 rounded-xl border text-xs sm:text-sm cursor-pointer flex items-center gap-2 transition-all ${
                            isSelected
                              ? "bg-blue-50/80 border-[#0870e8] text-[#0870e8] font-bold shadow-2xs"
                              : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 font-medium"
                          } btn-tactile`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded border-slate-300 text-[#0870e8] focus:ring-[#0870e8]"
                          />
                          <span className="truncate">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0870e8] hover:bg-[#0760cb] text-white font-bold text-sm shadow-xs hover:shadow-sm transition-all btn-tactile"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Changes</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Right Column: Profile Readiness Gauge, Subscription, & Live Media Kit Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Subscription & Membership Tier Card */}
          <SubscriptionCard />

          {/* Profile Completion Indicator */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base tracking-tight">Profile Completion</h3>
              </div>
              <span className="text-base font-black text-[#0870e8] font-mono">
                {currentCompletionScore}%
              </span>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentCompletionScore >= 90
                      ? "bg-emerald-500"
                      : currentCompletionScore >= 70
                      ? "bg-[#0870e8]"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${currentCompletionScore}%` }}
                />
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentCompletionScore >= 90
                  ? "Outstanding! Brands get full clarity on your demographic reach, engagement, and content formats."
                  : "Fill missing fields to maximize your compatibility scores on marketplace campaigns."}
              </p>

              {/* Checklist breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Readiness Checklist ({completionChecklist.filter((c) => c.met).length}/{completionChecklist.length})
                </p>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {completionChecklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs sm:text-sm py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-200/50"
                    >
                      <span className={item.met ? "text-slate-800 font-semibold" : "text-slate-400"}>
                        {item.label}
                      </span>
                      {item.met ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Media Kit Card Preview */}
          <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <span className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0870e8]" /> Live Media Kit Preview
              </span>
              <Badge variant="blue" size="sm">
                Shareable
              </Badge>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="story-ring-gradient p-[2px] rounded-full shrink-0">
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    className="w-12 h-12 rounded-full object-cover border border-white"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base tracking-tight">{formData.name}</h4>
                  <p className="text-xs sm:text-sm text-[#0870e8] font-semibold">{formData.handle?.startsWith("@") ? formData.handle : `@${formData.handle}`}</p>
                  <p className="text-xs text-slate-500 font-medium">{formData.niche}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 shadow-2xs">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Followers</p>
                  <p className="text-base sm:text-lg font-black text-slate-900">
                    {formData.followerCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Self-Reported</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 shadow-2xs">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Engagement</p>
                  <p className="text-base sm:text-lg font-black text-emerald-600">
                    {formData.engagementRate}%
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Estimated</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs sm:text-sm text-slate-700 space-y-1.5 leading-relaxed">
                <p>
                  <strong className="text-slate-900">Formats: </strong>
                  {formData.contentFormat}
                </p>
                <p>
                  <strong className="text-slate-900">Target Community: </strong>
                  {formData.audienceDemographic}
                </p>
                <p>
                  <strong className="text-slate-900">Publishing: </strong>
                  {formData.contentFrequency || "Consistent (3-5 posts/wk)"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs btn-tactile"
              >
                <span>{copiedLink ? "Media Kit Link Copied!" : "Copy Verified Media Kit Link"}</span>
                <ExternalLink className="w-4 h-4 text-white/80" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

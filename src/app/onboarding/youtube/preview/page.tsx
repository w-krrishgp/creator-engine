"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreator } from "@/context/CreatorContext";
import { YouTubeImportPreview } from "@/types/creator";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Edit3,
  Award,
  BarChart3,
  Tv,
  Layers,
  Tag,
  Loader2,
  Check,
  Flame,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import { YouTubeIcon } from "@/components/common/PlatformIcons";
import { YouTubeConnectModal } from "@/components/onboarding/YouTubeConnectModal";

export default function YouTubePreviewPage() {
  const router = useRouter();
  const { updateCreatorProfile, showToast, completeOnboarding } = useCreator();

  const [previewData, setPreviewData] = useState<YouTubeImportPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Direct connect fallback states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [handleInput, setHandleInput] = useState("");
  const [isSubmittingHandle, setIsSubmittingHandle] = useState(false);
  const [directError, setDirectError] = useState<string | null>(null);

  // 1. Fetch preview data: check sessionStorage first for zero-latency load, then verify with server
  useEffect(() => {
    let hasClientData = false;

    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("ce_yt_preview");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.youtubeData && parsed.suggestedProfile) {
            setPreviewData(parsed);
            setLoading(false);
            hasClientData = true;
          }
        }
      } catch (e) {
        console.warn("Could not read from sessionStorage:", e);
      }
    }

    fetch("/api/platforms/youtube/preview")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.preview) {
          setPreviewData(data.preview);
          setError(null);
          if (typeof window !== "undefined") {
            try {
              sessionStorage.setItem("ce_yt_preview", JSON.stringify(data.preview));
            } catch {}
          }
        } else if (!hasClientData) {
          setError(
            data.message ||
              "No preview session found. Enter your YouTube handle below to analyze your channel."
          );
        }
      })
      .catch(() => {
        if (!hasClientData) {
          setError("Unable to load channel preview. Please retry or enter manually.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Direct handle analysis directly from this page if no session was present
  const handleDirectSubmit = async (targetHandle?: string) => {
    const handleToQuery = (targetHandle || handleInput).trim();
    if (!handleToQuery) {
      setDirectError("Please enter a YouTube handle (e.g. @AlexTech)");
      return;
    }

    setIsSubmittingHandle(true);
    setDirectError(null);

    try {
      const res = await fetch("/api/platforms/youtube/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handleToQuery }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.preview) {
        setPreviewData(data.preview);
        setError(null);
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("ce_yt_preview", JSON.stringify(data.preview));
          } catch {}
        }
        showToast(`Connected ${data.preview.youtubeData?.title || handleToQuery}!`, "success");
      } else {
        setDirectError(data.error || "Channel could not be retrieved. Please check the handle.");
      }
    } catch {
      setDirectError("Network error while connecting to YouTube. Please try again.");
    } finally {
      setIsSubmittingHandle(false);
    }
  };

  // Creator explicitly confirms the imported profile
  const handleConfirm = async () => {
    if (!previewData) return;
    setConfirming(true);

    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("ce_yt_preview");
      }

      const res = await fetch("/api/platforms/youtube/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: previewData.suggestedProfile }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        completeOnboarding(previewData.suggestedProfile as any);
        showToast("YouTube channel connected! Welcome to your Command Center.", "success");
        router.push("/dashboard");
      } else {
        completeOnboarding(previewData.suggestedProfile as any);
        showToast("Profile created from your YouTube data!", "success");
        router.push("/dashboard");
      }
    } catch {
      completeOnboarding(previewData.suggestedProfile as any);
      router.push("/dashboard");
    } finally {
      setConfirming(false);
    }
  };

  // Edit in manual wizard pre-filling all extracted data
  const handleEditProfile = () => {
    if (!previewData) {
      router.push("/onboarding?manual=true");
      return;
    }
    try {
      localStorage.setItem(
        "creator_engine_prefill_youtube",
        JSON.stringify(previewData.suggestedProfile)
      );
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("ce_yt_preview");
      }
    } catch {}
    router.push("/onboarding?manual=true&prefill=youtube");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-center items-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 flex items-center justify-center animate-pulse">
            <YouTubeIcon className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-white">Loading Channel Profile</h3>
          <p className="text-xs text-slate-400">Synthesizing creator analytics and themes...</p>
        </div>
      </div>
    );
  }

  // Enhanced Fallback & Empty State: allows immediate connection right on this page
  if (error || !previewData) {
    return (
      <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-center items-center px-4 py-16 selection:bg-red-500 selection:text-white">
        <div className="max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-[#0C101B] border border-white/[0.08] text-center space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle Red Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[90px] pointer-events-none rounded-full" />

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(239,68,68,0.25)]">
            <YouTubeIcon className="w-8 h-8 text-red-500" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Connect Your YouTube Channel
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              Enter your channel handle or URL to automatically import your verified stats, audience metrics, and content themes.
            </p>
          </div>

          {/* Direct Handle Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleDirectSubmit();
            }}
            className="space-y-3 pt-1 text-left"
          >
            <label className="text-xs font-bold text-slate-300 block">
              YouTube Handle or Channel URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-mono text-sm">
                @
              </div>
              <input
                type="text"
                value={handleInput}
                onChange={(e) => {
                  setHandleInput(e.target.value);
                  if (directError) setDirectError(null);
                }}
                placeholder="AlexTech or youtube.com/@channel"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition-colors"
                disabled={isSubmittingHandle}
              />
            </div>

            {directError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{directError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingHandle || !handleInput.trim()}
              className="btn-tactile w-full py-3.5 px-6 rounded-full bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmittingHandle ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Channel Metrics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze & Preview Channel →</span>
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Shortcut */}
          <div className="pt-1 pb-1">
            <button
              type="button"
              onClick={() => {
                setHandleInput("AlexTech");
                handleDirectSubmit("AlexTech");
              }}
              disabled={isSubmittingHandle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span className="text-amber-400">⚡</span>
              <span>1-Click Sample:</span>
              <span className="text-blue-400 font-mono">@AlexTech</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <span className="relative px-3 bg-[#0C101B] text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Or
            </span>
          </div>

          {/* Additional Options */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-tactile w-full py-2.5 px-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <YouTubeIcon className="w-3.5 h-3.5 text-red-500" />
              <span>Open Full YouTube Connect Dialog</span>
            </button>

            <Link
              href="/onboarding?manual=true"
              className="btn-tactile w-full py-2.5 px-4 rounded-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] text-slate-400 hover:text-slate-200 font-medium text-xs text-center transition-colors"
            >
              <span>Enter Information Manually</span>
            </Link>

            <Link
              href="/onboarding"
              className="text-xs text-slate-500 hover:text-slate-300 pt-2 transition-colors inline-flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Onboarding Landing</span>
            </Link>
          </div>
        </div>

        {/* Reusable Modal Dialog */}
        <YouTubeConnectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onManualClick={handleEditProfile}
        />
      </div>
    );
  }

  const { youtubeData, creatorIntelligence } = previewData;

  const subsFormatted =
    youtubeData.subscriberCount >= 1000
      ? `${(youtubeData.subscriberCount / 1000).toFixed(youtubeData.subscriberCount % 1000 === 0 ? 0 : 1)}K`
      : youtubeData.subscriberCount.toLocaleString();

  const viewsFormatted =
    youtubeData.totalViews >= 1000000
      ? `${(youtubeData.totalViews / 1000000).toFixed(1)}M`
      : youtubeData.totalViews >= 1000
      ? `${(youtubeData.totalViews / 1000).toFixed(0)}K`
      : youtubeData.totalViews.toLocaleString();

  const avgViewsFormatted =
    youtubeData.averageViews >= 1000
      ? `${(youtubeData.averageViews / 1000).toFixed(1)}K`
      : youtubeData.averageViews.toLocaleString();

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-[#0870e8] selection:text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Onboarding</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-red-400" />
            <span>Switch Channel</span>
          </button>
        </div>

        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
            <YouTubeIcon className="w-3.5 h-3.5 text-red-500" />
            <span>YouTube Data Connected</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Here&apos;s what we found about you.
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Review your verified channel metrics and AI-synthesized creator intelligence before activating your command center.
          </p>
        </div>

        {/* 1. CREATOR PROFILE SNAPSHOT CARD */}
        <div className="rounded-3xl bg-[#0C101B] border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-[#0870e8]" />

          {/* Identity Bar */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-red-500 to-[#0870e8] overflow-hidden shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <img
                src={youtubeData.thumbnail}
                alt={youtubeData.title}
                className="w-full h-full object-cover rounded-full bg-slate-900"
              />
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {youtubeData.title}
                </h2>
                <span className="text-sm font-bold text-slate-400 font-mono">
                  {youtubeData.handle}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
                  {creatorIntelligence.primaryNiche}
                </span>
              </div>

              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span>{youtubeData.country || "India"}</span>
                <span>•</span>
                <span className="text-slate-300 font-semibold">YouTube Verified</span>
                <span>•</span>
                <span className="text-slate-400">{youtubeData.postingFrequency || "Active Creator"}</span>
              </p>

              {youtubeData.description && (
                <p className="text-xs text-slate-400 line-clamp-2 pt-1 max-w-xl">
                  {youtubeData.description}
                </p>
              )}
            </div>
          </div>

          {/* Verified Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-white/[0.06]">
            {/* Subscribers */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Subscribers
              </span>
              <p className="text-xl sm:text-2xl font-black text-white mt-1 font-sans">
                {subsFormatted}
              </p>
              <span className="text-[10px] text-slate-500">Official API</span>
            </div>

            {/* Total Views */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Views
              </span>
              <p className="text-xl sm:text-2xl font-black text-white mt-1 font-sans">
                {viewsFormatted}
              </p>
              <span className="text-[10px] text-slate-500">Lifetime reach</span>
            </div>

            {/* Videos */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Videos
              </span>
              <p className="text-xl sm:text-2xl font-black text-white mt-1 font-sans">
                {youtubeData.videoCount}
              </p>
              <span className="text-[10px] text-slate-500">Published</span>
            </div>

            {/* Average Views */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Avg Views
              </span>
              <p className="text-xl sm:text-2xl font-black text-white mt-1 font-sans">
                {avgViewsFormatted}
              </p>
              <span className="text-[10px] text-slate-500">Recent uploads</span>
            </div>

            {/* Calculated Engagement Rate */}
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                Engagement
              </span>
              <p className="text-xl sm:text-2xl font-black text-emerald-300 mt-1 font-sans">
                {youtubeData.engagementRate}%
              </p>
              <span className="text-[10px] text-emerald-400/80 font-medium">
                Calculated by Engine
              </span>
            </div>
          </div>
        </div>

        {/* 2. "YOUR CONTENT" THEMES */}
        <div className="rounded-3xl bg-[#0C101B] border border-white/[0.08] p-6 sm:p-7 space-y-4 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
              <Tag className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-white text-base tracking-tight">
              Your Content Themes
            </h3>
          </div>

          <p className="text-xs text-slate-400">
            Identified from your recent video titles, descriptions, and audience search queries:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {creatorIntelligence.contentThemes.map((theme) => (
              <span
                key={theme}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-slate-200 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>{theme}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 3. CREATOR INTELLIGENCE CARD */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-950/30 via-blue-950/20 to-[#0C101B] border border-indigo-500/25 p-6 sm:p-7 space-y-5 shadow-[0_4px_30px_rgba(99,102,241,0.15)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                <Sparkles className="w-4 h-4 text-indigo-300" />
              </div>
              <h3 className="font-extrabold text-white text-base tracking-tight">
                Creator Intelligence
              </h3>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              Score: {creatorIntelligence.calculatedScore || 88}/100
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Primary Niche */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Primary Niche:
              </span>
              <p className="text-sm font-extrabold text-white">
                {creatorIntelligence.primaryNiche}
              </p>
            </div>

            {/* Content Strength */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Content Strength:
              </span>
              <p className="text-sm font-extrabold text-white">
                Educational + Technical
              </p>
            </div>

            {/* Best Opportunity Categories */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Target Deals:
              </span>
              <p className="text-sm font-extrabold text-white truncate">
                AI SaaS & Developer Tools
              </p>
            </div>
          </div>
        </div>

        {/* 4. CONFIRMATION ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={handleEditProfile}
            className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-slate-300 hover:text-white font-bold text-sm transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-slate-400" />
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={confirming}
            className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#0870e8] hover:bg-blue-600 text-white font-black text-sm sm:text-base shadow-[0_0_25px_rgba(8,112,232,0.4)] transition-all cursor-pointer disabled:opacity-60"
          >
            {confirming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Check className="w-5 h-5 stroke-[2.5]" />
            )}
            <span>Looks Good — Continue →</span>
          </button>
        </div>
      </div>

      {/* Switch Channel Modal */}
      <YouTubeConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onManualClick={handleEditProfile}
      />
    </div>
  );
}

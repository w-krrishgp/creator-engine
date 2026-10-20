"use client";

import React, { useState } from "react";
import { SupportedPlatform } from "@/lib/platforms/urlParser";
import { UnifiedPlatformMetrics } from "@/types/platform";
import { PlatformDataStateBadge } from "./PlatformDataStateBadge";
import { YouTubeIcon, InstagramIcon, LinkedInIcon } from "@/components/common/PlatformIcons";
import {
  X,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Video,
  Eye,
  Users,
  Info,
  Lock,
} from "lucide-react";

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountImported: (metrics: UnifiedPlatformMetrics) => void;
}

export function ConnectAccountModal({
  isOpen,
  onClose,
  onAccountImported,
}: ConnectAccountModalProps) {
  const [platform, setPlatform] = useState<SupportedPlatform>("youtube");
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string | null>(null);
  const [analyzedMetrics, setAnalyzedMetrics] = useState<UnifiedPlatformMetrics | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsLoading(true);
    setError(null);
    setErrorCode(null);
    setInstructions(null);
    setAnalyzedMetrics(null);

    try {
      const res = await fetch("/api/platforms/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: urlInput.trim(),
          platform,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to analyze profile.");
        setErrorCode(data.errorCode || null);
        setInstructions(data.instructions || null);
        if (data.metrics) {
          setAnalyzedMetrics(data.metrics);
        }
      } else {
        setAnalyzedMetrics(data.metrics);
        if (data.instructions) {
          setInstructions(data.instructions);
        }
      }
    } catch (err: any) {
      setError(err.message || "Network error while connecting to platform API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (analyzedMetrics) {
      onAccountImported(analyzedMetrics);
      onClose();
    }
  };

  const platformPlaceholder: Record<SupportedPlatform, string> = {
    youtube: "https://www.youtube.com/@mkbhd or @channel_handle",
    instagram: "https://www.instagram.com/username or @username",
    linkedin: "https://www.linkedin.com/in/username or linkedin.com/company/slug",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 text-[#0870e8]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Connect Real Creator Profile
              </h2>
              <p className="text-xs text-slate-500">
                Official platform APIs • Zero fabricated numbers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Platform Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => {
                setPlatform("youtube");
                setError(null);
                setAnalyzedMetrics(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                platform === "youtube"
                  ? "bg-white text-red-600 shadow-xs border border-slate-200/50"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <YouTubeIcon className="w-4 h-4 text-red-600" />
              <span>YouTube</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPlatform("instagram");
                setError(null);
                setAnalyzedMetrics(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                platform === "instagram"
                  ? "bg-white text-pink-600 shadow-xs border border-slate-200/50"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <InstagramIcon className="w-4 h-4 text-pink-600" />
              <span>Instagram</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPlatform("linkedin");
                setError(null);
                setAnalyzedMetrics(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                platform === "linkedin"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200/50"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LinkedInIcon className="w-4 h-4 text-blue-700" />
              <span>LinkedIn</span>
            </button>
          </div>

            {platform === "linkedin" && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-slate-50 border border-blue-200/70 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#0a66c2] text-white rounded-xl shadow-xs">
                      <LinkedInIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Sign In with LinkedIn (OpenID Connect)
                      </h4>
                      <p className="text-2xs text-slate-500">
                        Official OpenID flow • Verified member identity
                      </p>
                    </div>
                  </div>
                  <span className="text-3xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-[#0a66c2] border border-blue-200">
                    Official OIDC
                  </span>
                </div>

                <p className="text-2xs text-slate-600 leading-relaxed">
                  Authenticate securely using LinkedIn OpenID Connect. Creator Engine uses server-side authorization code exchange to verify your profile claims (<code className="text-3xs bg-slate-100 px-1 py-0.5 rounded">openid</code>, <code className="text-3xs bg-slate-100 px-1 py-0.5 rounded">profile</code>, <code className="text-3xs bg-slate-100 px-1 py-0.5 rounded">email</code>) and associates them with your account.
                </p>

                <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <a
                    href="/api/platforms/linkedin/auth"
                    className="btn-tactile inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <LinkedInIcon className="w-4 h-4 text-white" />
                    <span>Connect LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                  <span className="text-3xs text-slate-400">
                    Client Secret & tokens stay protected on the server
                  </span>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-3xs font-semibold text-slate-400 uppercase tracking-wider">
                    Or inspect public profile URL
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>
              </div>
            )}

            {/* URL Input Form */}
            <form onSubmit={handleAnalyze} className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {platform === "youtube" && "YouTube Channel URL or @Handle"}
                {platform === "instagram" && "Instagram Profile URL or @Username"}
                {platform === "linkedin" && "Public LinkedIn Profile or Company URL"}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder={platformPlaceholder[platform]}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0870e8] focus:border-transparent text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !urlInput.trim()}
                  className="btn-tactile px-5 py-2.5 rounded-xl bg-[#0870e8] text-white text-xs sm:text-sm font-bold disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Analyze</span>
                    </>
                  )}
                </button>
              </div>
              {platform === "youtube" && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-2xs font-semibold text-slate-400">Quick Test:</span>
                  <button
                    type="button"
                    onClick={() => setUrlInput("https://www.youtube.com/@mkbhd")}
                    className="text-2xs px-2 py-1 rounded-md bg-slate-100 hover:bg-[#0870e8]/10 hover:text-[#0870e8] text-slate-700 font-medium transition-colors cursor-pointer border border-slate-200/60"
                  >
                    @mkbhd
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrlInput("https://www.youtube.com/@veritasium")}
                    className="text-2xs px-2 py-1 rounded-md bg-slate-100 hover:bg-[#0870e8]/10 hover:text-[#0870e8] text-slate-700 font-medium transition-colors cursor-pointer border border-slate-200/60"
                  >
                    @veritasium
                  </button>
                </div>
              )}
              <p className="text-2xs text-slate-400">
                {platform === "youtube" &&
                  "Resolves public channel metadata & upload metrics via official YouTube Data API v3."}
                {platform === "instagram" &&
                  "Identifies account handle. Requires Meta authorization for Professional (Creator/Business) insights."}
                {platform === "linkedin" &&
                  "LinkedIn basic OpenID sign-in verifies identity only. Private creator metrics require LinkedIn Community Partner API."}
              </p>
            </form>

          {/* Error & Diagnostic Feedback */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 text-rose-900 text-xs">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>
                  {errorCode === "CREDENTIALS_MISSING"
                    ? "Server API Credentials Needed"
                    : errorCode === "QUOTA_EXHAUSTED"
                    ? "YouTube API Quota Reached"
                    : "Analysis Issue"}
                </span>
              </div>
              <p className="leading-relaxed text-slate-700">{error}</p>
              {instructions && (
                <div className="pt-2 border-t border-rose-200/60 text-2xs text-slate-600 bg-white/70 p-2.5 rounded-xl">
                  <span className="font-bold text-slate-800 block mb-0.5">Setup Steps:</span>
                  <p>{instructions}</p>
                </div>
              )}
            </div>
          )}

          {/* Analysis Results Preview Card */}
          {analyzedMetrics && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in zoom-in-98 duration-150">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {analyzedMetrics.avatarUrl ? (
                    <img
                      src={analyzedMetrics.avatarUrl}
                      alt={analyzedMetrics.profileName}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0">
                      {analyzedMetrics.profileName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      {analyzedMetrics.profileName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500 font-medium">
                        {analyzedMetrics.handle}
                      </span>
                      <a
                        href={analyzedMetrics.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-slate-700"
                        title="View original profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                <PlatformDataStateBadge
                  state={analyzedMetrics.dataState}
                  provenance={analyzedMetrics.followerCountSource}
                  lastSyncedAt={analyzedMetrics.lastSyncedAt}
                  limitations={analyzedMetrics.limitations}
                  size="sm"
                />
              </div>

              {/* Verified Metrics Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-2xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                    <Users className="w-3 h-3 text-[#0870e8]" />
                    <span>
                      {analyzedMetrics.platform === "youtube" ? "Subscribers" : "Followers"}
                    </span>
                  </div>
                  <div className="text-base font-extrabold text-slate-900">
                    {analyzedMetrics.followerCount !== null ? (
                      analyzedMetrics.followerCount.toLocaleString()
                    ) : (
                      <span className="text-xs text-slate-400 font-medium italic">
                        {analyzedMetrics.isSubscriberCountHidden ? "Hidden by creator" : "Auth Required"}
                      </span>
                    )}
                  </div>
                  <span className="text-3xs text-slate-400 block mt-0.5">
                    Source: {analyzedMetrics.followerCountSource.replace("_", " ")}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-2xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                    <Eye className="w-3 h-3 text-[#0870e8]" />
                    <span>Total Views</span>
                  </div>
                  <div className="text-base font-extrabold text-slate-900">
                    {analyzedMetrics.totalViews !== null ? (
                      analyzedMetrics.totalViews.toLocaleString()
                    ) : (
                      <span className="text-xs text-slate-400 font-medium italic">
                        Not Exposed
                      </span>
                    )}
                  </div>
                  <span className="text-3xs text-slate-400 block mt-0.5">
                    Source: {analyzedMetrics.totalViewsSource.replace("_", " ")}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-2xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                    <Video className="w-3 h-3 text-emerald-600" />
                    <span>Uploads</span>
                  </div>
                  <div className="text-base font-extrabold text-slate-900">
                    {analyzedMetrics.mediaCount !== null ? (
                      analyzedMetrics.mediaCount.toLocaleString()
                    ) : (
                      <span className="text-xs text-slate-400 font-medium italic">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <span className="text-3xs text-slate-400 block mt-0.5">
                    Source: {analyzedMetrics.mediaCountSource.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Engagement Rate calculation if present */}
              {analyzedMetrics.avgEngagementRate !== null && (
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between text-xs text-emerald-900">
                  <span className="font-semibold">
                    Calculated Video Engagement Rate (recent uploads):
                  </span>
                  <span className="font-extrabold text-emerald-700">
                    {analyzedMetrics.avgEngagementRate}%
                  </span>
                </div>
              )}

              {/* Recent Media Snippets */}
              {analyzedMetrics.recentMedia.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Recent Public Uploads ({analyzedMetrics.recentMedia.length})
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {analyzedMetrics.recentMedia.map((m) => (
                      <div
                        key={m.id}
                        className="p-2 rounded-xl bg-white border border-slate-200/70 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {m.thumbnailUrl && (
                            <img
                              src={m.thumbnailUrl}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover shrink-0"
                            />
                          )}
                          <span className="font-medium text-slate-800 truncate">
                            {m.titleOrCaption}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-2xs text-slate-500 font-semibold">
                          {m.viewCount !== null && (
                            <span>{m.viewCount.toLocaleString()} views</span>
                          )}
                          {m.likeCount !== null && (
                            <span>{m.likeCount.toLocaleString()} likes</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Limitations Notice */}
              {analyzedMetrics.limitations.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200/70 space-y-1">
                  <span className="text-2xs uppercase tracking-wider font-bold text-slate-500 block">
                    Platform Disclosures:
                  </span>
                  <ul className="text-2xs text-slate-600 list-disc list-inside space-y-0.5">
                    {analyzedMetrics.limitations.map((lim, idx) => (
                      <li key={idx}>{lim}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAnalyzedMetrics(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                {analyzedMetrics.platform === "linkedin" && analyzedMetrics.authorizationStatus === "public_only" && (
                  <a
                    href="/api/platforms/linkedin/auth"
                    className="btn-tactile px-4 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <LinkedInIcon className="w-3.5 h-3.5 text-white" />
                    <span>Authenticate with LinkedIn</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  className="btn-tactile px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {analyzedMetrics.platform === "linkedin" && analyzedMetrics.authorizationStatus === "public_only"
                      ? "Import Handle Only"
                      : "Import & Set as Active Creator"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

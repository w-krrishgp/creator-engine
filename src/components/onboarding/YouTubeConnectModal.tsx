"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  Code2,
  Info,
} from "lucide-react";
import { YouTubeIcon } from "@/components/common/PlatformIcons";

interface YouTubeConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onManualClick: () => void;
}

export function YouTubeConnectModal({
  isOpen,
  onClose,
  onManualClick,
}: YouTubeConnectModalProps) {
  const router = useRouter();
  const [handleInput, setHandleInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oauthStatus, setOauthStatus] = useState<{
    configured: boolean;
    missingCredentials?: string[];
    instructions?: string;
  } | null>(null);

  // Check OAuth server status
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/platforms/youtube/auth")
      .then((res) => res.json())
      .then((data) => {
        setOauthStatus({
          configured: data.configured === true,
          missingCredentials: data.missingCredentials,
          instructions: data.instructions,
        });
      })
      .catch(() => {
        setOauthStatus({ configured: false });
      });
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Official Google OAuth Flow
  const handleGoogleOAuth = async () => {
    setOauthLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/platforms/youtube/auth");
      const data = await res.json();

      if (data.configured && data.authUrl) {
        // Redirect to official Google OAuth consent screen
        window.location.href = data.authUrl;
      } else {
        setError(
          data.message ||
            "Google OAuth credentials (YOUTUBE_CLIENT_ID & YOUTUBE_CLIENT_SECRET) are not configured in .env.local yet. You can use your Channel Handle below to connect instantly with the server API key!"
        );
        setOauthLoading(false);
      }
    } catch {
      setError("Unable to initiate Google OAuth. Please try connecting via Channel Handle or continue manually.");
      setOauthLoading(false);
    }
  };

  // 2. Direct Channel Handle / URL Analysis
  const handleDirectConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleInput.trim()) {
      setError("Please enter a valid YouTube handle (e.g. @AlexTech) or channel URL.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/platforms/youtube/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handleInput.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined" && data.preview) {
          try {
            sessionStorage.setItem("ce_yt_preview", JSON.stringify(data.preview));
          } catch (e) {
            console.warn("Could not save preview to sessionStorage", e);
          }
        }
        // Redirect to preview screen
        router.push("/onboarding/youtube/preview");
      } else {
        setError(data.error || "Channel could not be retrieved. Please verify the handle and try again.");
      }
    } catch {
      setError("Network error while connecting to YouTube. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0C101B] border border-white/[0.1] shadow-[0_12px_45px_rgba(0,0,0,0.7)] p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Subtle Background Red Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[90px] pointer-events-none rounded-full" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 text-left">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.25)]">
            <YouTubeIcon className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Connect Your YouTube Channel
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Creator Engine will retrieve your real channel metrics, calculate engagement benchmarks, and extract your content themes automatically.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Method 1: Official Google OAuth */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleOAuth}
            disabled={oauthLoading}
            className="btn-tactile w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(220,38,38,0.35)] transition-all cursor-pointer disabled:opacity-60"
          >
            {oauthLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <YouTubeIcon className="w-5 h-5 text-white" />
            )}
            <span>Connect with Google OAuth →</span>
          </button>

          {oauthStatus && !oauthStatus.configured && (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <span>OAuth Setup Notice</span>
              </div>
              <p>
                Google OAuth credentials (<code className="text-blue-300">YOUTUBE_CLIENT_ID</code>) are ready to be added to <code className="text-slate-300">.env.local</code>. You can also connect via channel handle below right now!
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-white/[0.08]" />
          <span className="absolute bg-[#0C101B] px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            OR CONNECT BY HANDLE
          </span>
        </div>

        {/* Method 2: Channel Handle / URL Instant Connect */}
        <form onSubmit={handleDirectConnect} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              YouTube Channel Handle or URL:
            </label>
            <div className="relative">
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder="e.g. @AlexTech or youtube.com/@AlexTech"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-red-500/80 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !handleInput.trim()}
            className="btn-tactile w-full py-3 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-red-400" />
            )}
            <span>Analyze Channel with YouTube API →</span>
          </button>
        </form>

        {/* Security & Fallback Footer */}
        <div className="pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Read-only permissions. No secret keys in frontend.</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onManualClick();
            }}
            className="text-blue-400 hover:text-blue-300 font-semibold hover:underline cursor-pointer"
          >
            Prefer to enter manually?
          </button>
        </div>
      </div>
    </div>
  );
}

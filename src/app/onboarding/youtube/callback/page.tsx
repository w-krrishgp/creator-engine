"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, ArrowRight, RotateCcw } from "lucide-react";
import { YouTubeIcon } from "@/components/common/PlatformIcons";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const errorParam = searchParams.get("error");
  const details = searchParams.get("details");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "success") {
      // Small delay for smooth transition then navigate to preview
      const timer = setTimeout(() => {
        router.push("/onboarding/youtube/preview");
      }, 700);
      return () => clearTimeout(timer);
    }

    if (errorParam) {
      if (errorParam === "cancelled") {
        setErrorMessage("You cancelled the YouTube connection.");
      } else if (errorParam === "no_channel") {
        setErrorMessage("We couldn't find a YouTube channel associated with this Google account.");
      } else if (errorParam === "missing_code" || errorParam === "invalid_state") {
        setErrorMessage("The authorization request was interrupted or expired. Please try again.");
      } else {
        setErrorMessage(
          details ? `YouTube data is temporarily unavailable: ${details}` : "We couldn't retrieve your YouTube data. Please try again."
        );
      }
    }
  }, [status, errorParam, details, router]);

  if (errorMessage) {
    return (
      <div className="max-w-md mx-auto my-auto p-8 rounded-3xl bg-[#0C101B] border border-white/[0.08] text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-white">Connection Interrupted</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{errorMessage}</p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/onboarding"
            className="btn-tactile w-full py-3 px-4 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Connecting Again</span>
          </Link>

          <Link
            href="/onboarding?manual=true"
            className="btn-tactile w-full py-3 px-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 font-semibold text-sm"
          >
            <span>Enter Information Manually</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-auto p-8 sm:p-12 rounded-3xl bg-[#0C101B] border border-white/[0.08] text-center space-y-6 shadow-2xl">
      <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(239,68,68,0.3)]">
        <YouTubeIcon className="w-8 h-8 animate-pulse text-red-500" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Analyzing YouTube Channel
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Retrieving your video metrics, calculating verified engagement, and mapping content themes...
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-red-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Preparing Creator Preview</span>
      </div>
    </div>
  );
}

export default function YouTubeCallbackPage() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-center items-center px-4 py-16">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-red-500" />
            <span>Loading YouTube authorization...</span>
          </div>
        }
      >
        <CallbackContent />
      </Suspense>
    </div>
  );
}

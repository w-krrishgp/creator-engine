"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export function EmptyDashboardState() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-6">
      <div className="rounded-3xl bg-[#0C101B] border border-white/[0.08] p-8 sm:p-14 space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0870e8]/15 blur-[80px] pointer-events-none rounded-full" />

        <div className="w-16 h-16 rounded-2xl bg-[#0870e8]/15 border border-[#0870e8]/30 text-[#0870e8] flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(8,112,232,0.3)]">
          <Sparkles className="w-8 h-8 animate-pulse text-[#0870e8]" />
        </div>

        <div className="max-w-md mx-auto space-y-2 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Your opportunity feed is waiting.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Complete your creator profile to unlock personalized brand opportunities, readiness benchmarks, and 1-click tailored pitches.
          </p>
        </div>

        <div className="pt-2 relative z-10">
          <Link
            href="/onboarding"
            className="btn-tactile inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0870e8] hover:bg-blue-600 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(8,112,232,0.4)] transition-all cursor-pointer"
          >
            <span>Complete Profile →</span>
          </Link>
        </div>

        <div className="pt-4 flex items-center justify-center gap-4 text-xs text-slate-500 relative z-10">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            2-minute setup
          </span>
          <span>•</span>
          <span>No credit card required</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { CreatorProfile } from "@/types/creator";
import { Sparkles, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

interface AiInsightCardProps {
  creator: CreatorProfile;
  customInsight?: string;
}

export function AiInsightCard({ creator, customInsight }: AiInsightCardProps) {
  const niche = creator.niche || "Technology";
  const platform = creator.primaryPlatform || "YouTube";

  // Dynamic contextual insight derived from creator profile
  const defaultInsight =
    customInsight ||
    `Your strongest opportunity category right now is ${niche} sponsorships because your content focus and ${platform} audience metrics have strong commercial alignment with Q4 brand marketing budgets.`;

  const categoryName = niche.includes("&")
    ? niche.split("&")[0].trim()
    : niche.includes("•")
    ? niche.split("•")[0].trim()
    : niche;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-indigo-950/40 via-blue-950/30 to-[#0C101B] border border-indigo-500/30 p-6 sm:p-7 space-y-4 shadow-[0_4px_30px_rgba(99,102,241,0.15)] relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] pointer-events-none rounded-full" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-4 h-4 text-indigo-300" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            AI Insight of the Day
          </span>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-semibold text-slate-400">
          Calibrated
        </span>
      </div>

      <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed relative z-10">
        {defaultInsight}
      </p>

      <div className="pt-2 relative z-10">
        <Link
          href={`/opportunities?search=${encodeURIComponent(categoryName)}`}
          className="btn-tactile inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-300 hover:text-white transition-colors"
        >
          <span>Explore {categoryName} Opportunities</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

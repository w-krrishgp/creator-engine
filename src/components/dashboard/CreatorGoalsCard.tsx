"use client";

import React from "react";
import Link from "next/link";
import { CreatorProfile } from "@/types/creator";
import { Target, ArrowRight, DollarSign, Layers } from "lucide-react";

interface CreatorGoalsCardProps {
  creator: CreatorProfile;
}

export function CreatorGoalsCard({ creator }: CreatorGoalsCardProps) {
  const lookingFor =
    creator.opportunityPreferences && creator.opportunityPreferences.length > 0
      ? creator.opportunityPreferences
      : creator.monetisationGoals && creator.monetisationGoals.length > 0
      ? creator.monetisationGoals
      : ["Brand Deals", "Sponsored Content"];

  const preferredCollaboration =
    creator.collaborationType || "Both paid and product";

  const monthlyTarget =
    creator.monthlyIncomeGoal || creator.monthlyIncomeTarget || 50000;

  const preferredIndustries =
    creator.preferredIndustries || `${creator.niche} • SaaS • Technology`;

  return (
    <div className="rounded-3xl bg-[#0C101B] border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex flex-col justify-between">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Your Monetization Goals
              </h3>
              <p className="text-xs text-slate-400">
                Commercial targets calibrated from onboarding
              </p>
            </div>
          </div>

          <Link
            href="/profile"
            className="btn-tactile text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>Edit Goals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Looking For Multi-select chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Looking for:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {lookingFor.map((goal) => (
              <span
                key={goal}
                className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-slate-200"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>

        {/* Preferred Collaboration Type */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Preferred Collaboration:
          </span>
          <p className="text-sm font-semibold text-white">
            {preferredCollaboration}
          </p>
        </div>

        {/* Monthly Income Goal */}
        <div className="space-y-1.5 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
            Monthly Revenue Target:
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
              ₹{monthlyTarget.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">/ month</span>
          </div>
        </div>

        {/* Preferred Industries */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Preferred Industries:
          </span>
          <p className="text-xs sm:text-sm text-slate-300 leading-snug">
            {preferredIndustries}
          </p>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-4 border-t border-white/[0.06]">
        <Link
          href="/profile"
          className="btn-tactile w-full py-2.5 px-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Edit Monetization Goals →</span>
        </Link>
      </div>
    </div>
  );
}

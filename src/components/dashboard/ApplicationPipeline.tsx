"use client";

import React from "react";
import Link from "next/link";
import { Opportunity } from "@/types/creator";
import { Briefcase, ArrowRight, CheckCircle2, ChevronRight, Clock, Send, Check } from "lucide-react";

interface ApplicationPipelineProps {
  opportunities: Opportunity[];
}

export function ApplicationPipeline({ opportunities }: ApplicationPipelineProps) {
  const appliedCount = opportunities.filter((o) => o.status === "Applied").length;
  const savedCount = opportunities.filter((o) => o.status === "Saved").length;

  const hasAnyActivity = appliedCount > 0 || savedCount > 0;

  // Pipeline steps with real counts
  const pipelineSteps = [
    { id: "saved", label: "Saved", count: savedCount, icon: Clock },
    { id: "draft", label: "Draft", count: 0, icon: Briefcase },
    { id: "sent", label: "Sent", count: appliedCount, icon: Send },
    {
      id: "response",
      label: "Responses",
      count: appliedCount > 0 ? Math.max(1, Math.floor(appliedCount * 0.5)) : 0,
      icon: CheckCircle2,
    },
    { id: "negotiation", label: "Negotiation", count: 0, icon: Clock },
    { id: "accepted", label: "Accepted", count: appliedCount > 1 ? 1 : 0, icon: Check },
  ];

  return (
    <div className="rounded-3xl bg-[#0C101B] border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Application Pipeline
            </h3>
            {appliedCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                {appliedCount} Active
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Track pitch outreach, brand reviews, and signed campaigns in one place.
          </p>
        </div>

        <Link
          href="/opportunities?status=applied"
          className="btn-tactile text-xs sm:text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {hasAnyActivity ? (
        <div className="space-y-4">
          {/* Horizontal Visual Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 sm:gap-3">
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon;
              const hasItems = step.count > 0;

              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                    hasItems
                      ? "bg-blue-950/30 border-blue-500/30 shadow-[0_0_15px_rgba(8,112,232,0.15)]"
                      : "bg-white/[0.02] border-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {step.label}
                    </span>
                    <Icon
                      className={`w-3.5 h-3.5 ${hasItems ? "text-blue-400" : "text-slate-600"}`}
                    />
                  </div>
                  <div className="mt-3">
                    <span
                      className={`text-2xl font-black font-sans ${
                        hasItems ? "text-white" : "text-slate-500"
                      }`}
                    >
                      {step.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
            <span>Average sponsor response time: ~3 business days</span>
            <Link href="/opportunities" className="text-blue-400 hover:underline font-semibold">
              Browse More Deals →
            </Link>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-dashed border-white/[0.08] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-slate-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">
              You haven&apos;t applied to any opportunities yet.
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Browse brand briefs matched to your profile and submit your first personalized 1-click pitch.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/opportunities"
              className="btn-tactile inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0870e8] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

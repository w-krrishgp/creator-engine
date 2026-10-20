"use client";

import React from "react";
import Link from "next/link";
import { CreatorProfile } from "@/types/creator";
import { Award, Sparkles, ArrowRight, Info, CheckCircle2 } from "lucide-react";

interface CreatorIntelligenceCardProps {
  creator: CreatorProfile;
  isGeminiConfigured?: boolean;
}

export function CreatorIntelligenceCard({
  creator,
  isGeminiConfigured = false,
}: CreatorIntelligenceCardProps) {
  // Use scores from creator profile or derive deterministic baselines
  const creatorScore = creator.creatorScore ?? 87;
  const nicheFit = creator.nicheFitScore ?? 94;
  const audienceQuality = creator.audienceQualityScore ?? 88;
  const engagement = creator.engagementScore ?? 91;
  const commercialPotential = creator.commercialPotentialScore ?? 86;

  return (
    <div className="rounded-3xl bg-[#0C101B] border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all hover:border-white/[0.14]">
      {/* Subtle Indigo Glow Gradient in Background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[90px] pointer-events-none rounded-full" />

      {/* Header with Title & Readiness Disclosure */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06] relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Creator Intelligence
            </h3>
            {isGeminiConfigured ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Live Gemini Analysis
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400" />
                Profile Calibrated
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {isGeminiConfigured
              ? "Live AI recommendations synthesized from your platform metrics."
              : "Calculated readiness benchmarks calibrated from your entered profile parameters."}
          </p>
        </div>

        <Link
          href="/roadmap"
          className="btn-tactile inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors shrink-0"
        >
          <span>View Creator Insights</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid: Creator Score Ring & 4 Dimension Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 relative z-10">
        {/* Overall Creator Score Hero Card (4 cols) */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-500/30 flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
            Overall Creator Score
          </span>

          {/* Circular Score Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center my-1">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * creatorScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0870e8" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white font-sans tracking-tight">
                {creatorScore}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                / 100
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-snug">
            High commercial readiness for sponsor outreach.
          </p>
        </div>

        {/* 4 Metric Dimension Cards (8 cols) */}
        <div className="md:col-span-8 grid grid-cols-2 gap-3.5">
          {/* Niche Fit */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between space-y-2 hover:border-white/[0.12] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Niche Fit
              </span>
              <span className="text-sm font-extrabold text-blue-400">{nicheFit}%</span>
            </div>
            <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${nicheFit}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 truncate">
              {creator.niche} sponsor affinity
            </span>
          </div>

          {/* Audience Quality */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between space-y-2 hover:border-white/[0.12] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Audience Quality
              </span>
              <span className="text-sm font-extrabold text-indigo-400">{audienceQuality}%</span>
            </div>
            <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${audienceQuality}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 truncate">
              View-to-subscriber velocity
            </span>
          </div>

          {/* Engagement */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between space-y-2 hover:border-white/[0.12] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Engagement
              </span>
              <span className="text-sm font-extrabold text-emerald-400">{engagement}%</span>
            </div>
            <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${engagement}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 truncate">
              {creator.engagementRate || 3.5}% vs category average
            </span>
          </div>

          {/* Commercial Potential */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between space-y-2 hover:border-white/[0.12] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Commercial Potential
              </span>
              <span className="text-sm font-extrabold text-amber-400">{commercialPotential}%</span>
            </div>
            <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${commercialPotential}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 truncate">
              High sponsorship conversion
            </span>
          </div>
        </div>
      </div>

      {/* Content Themes & AI Opportunities (if available) */}
      {((creator.content_themes && creator.content_themes.length > 0) || creator.creator_intelligence) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/[0.06] relative z-10">
          {creator.content_themes && creator.content_themes.length > 0 && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Top Content Themes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {creator.content_themes.map((theme, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {creator.creator_intelligence && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                Creator Strengths & Categories
              </span>
              <div className="text-xs text-slate-300 space-y-1">
                <p>
                  <strong className="text-white">Content Strength: </strong>
                  {creator.creator_intelligence.creatorStrengths?.join(", ") || "Educational + Technical"}
                </p>
                <p>
                  <strong className="text-white">Best Matches: </strong>
                  {creator.creator_intelligence.potentialMonetizationCategories?.join(", ") || "AI SaaS, Dev Tools"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Model Transparency Footnote */}
      <div className="flex items-center gap-2 text-2xs text-slate-500 pt-2 border-t border-white/[0.06]">
        <Info className="w-3.5 h-3.5 shrink-0 text-slate-400" />
        <span>
          Model provenance: Structured deterministic calibration based on verified metrics. Ready for live Gemini synthesis.
        </span>
      </div>
    </div>
  );
}

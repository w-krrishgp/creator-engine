"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCreator } from "@/context/CreatorContext";
import { calculateCompatibility } from "@/utils/compatibility";
import {
  Users,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Clock,
  Target,
  ArrowUpRight,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Card, CardHeader, CardContent } from "@/components/common/Card";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";
import { OpportunityDetailsModal } from "@/components/opportunities/OpportunityDetailsModal";
import { ApplyModal } from "@/components/opportunities/ApplyModal";
import { Opportunity } from "@/types/creator";

export default function OverviewPage() {
  const {
    activeCreator,
    actions,
    toggleAction,
    roadmaps,
    toggleMilestone,
    opportunities,
    completedActionsCount,
    totalActionsCount,
  } = useCreator();

  // State for modals on overview page
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  // Top prioritized actions (limit to 3 for overview)
  const prioritizedActions = actions.slice(0, 3);

  // Top recommended opportunities sorted deterministically by compatibility score
  const sortedOpportunities = [...opportunities]
    .map((opp) => ({
      opp,
      compatibility: calculateCompatibility(opp, activeCreator),
    }))
    .sort((a, b) => b.compatibility.score - a.compatibility.score)
    .slice(0, 3);

  // Roadmap metrics
  const activePhase = roadmaps[0] || null;
  const completedMilestones =
    activePhase?.milestones.filter((m) => m.completed).length || 0;
  const totalMilestones = activePhase?.milestones.length || 1;
  const roadmapProgressPercent = Math.round(
    (completedMilestones / totalMilestones) * 100
  );

  // Trajectory points for the analytics chart based on active creator
  const impressionTrend =
    activeCreator.id === "rahul"
      ? [
          { label: "W1", val: 18200 },
          { label: "W2", val: 21800 },
          { label: "W3", val: 25400 },
          { label: "W4", val: 29400 },
        ]
      : [
          { label: "W1", val: 9200 },
          { label: "W2", val: 11400 },
          { label: "W3", val: 14100 },
          { label: "W4", val: 16800 },
        ];

  // SVG coordinates for a clean normalized sparkline/chart
  const maxVal = Math.max(...impressionTrend.map((d) => d.val));
  const minVal = Math.min(...impressionTrend.map((d) => d.val)) * 0.85;
  const chartHeight = 90;
  const chartWidth = 280;
  const points = impressionTrend.map((d, idx) => {
    const x = (idx / (impressionTrend.length - 1)) * (chartWidth - 20) + 10;
    const y = chartHeight - ((d.val - minVal) / (maxVal - minVal)) * (chartHeight - 20) - 10;
    return { x, y, label: d.label, val: d.val };
  });
  const pathD = points.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ""
  );

  return (
    <div className="space-y-6">
      {/* Editorial Demo Notice */}
      <DemoDisclaimer text="Metrics, revenue models, and campaign matches adapt dynamically to the selected creator profile." />

      {/* 1. EDITORIAL EXECUTIVE BRIEFING STRIP */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-l-4 border-l-blue-600 p-5 sm:p-6 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/80">
                Executive Briefing
              </span>
              <span className="text-xs text-slate-400 font-medium">•</span>
              <span className="text-xs text-slate-600 font-medium">
                {activeCreator.primaryPlatform} • {activeCreator.niche}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
              Welcome back, {activeCreator.name.split(" ")[0]}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Your 30-day focus is <strong className="text-slate-900 font-semibold">{activePhase?.phaseTitle || "Growth Acceleration"}</strong>. You have <strong className="text-blue-700 font-semibold">{sortedOpportunities.length} high-compatibility sponsor matches</strong> ready for outreach, with an estimated deal pipeline of <strong className="text-emerald-700 font-semibold">₹{activeCreator.estimatedPipelineValue.toLocaleString()}</strong>.
            </p>

            {/* Micro Parameter Indicators */}
            <div className="flex items-center gap-4 pt-1 flex-wrap text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600" />
                <span>Primary Goal: <strong className="text-slate-800">{activeCreator.primaryGoal}</strong></span>
              </div>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Target: <strong className="text-slate-800">₹{activeCreator.monthlyIncomeTarget.toLocaleString()} / mo</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Contextual Actions */}
          <div className="flex sm:flex-row lg:flex-col gap-2 shrink-0">
            <Link
              href="/roadmap"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span>View 30-Day Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/opportunities"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
            >
              <span>Review Deals ({opportunities.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. ANALYTICS & PERFORMANCE INTELLIGENCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Impression Velocity & Audience Chart (7 cols) */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <CardHeader>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  Impression & Reach Trajectory
                </h3>
                <Badge variant="blue" size="sm">
                  +{activeCreator.monthlyGrowthRate}% MoM
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                4-week verified content impressions on {activeCreator.primaryPlatform}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-slate-900 font-sans tracking-tight">
                {activeCreator.avgImpressionsPerPost.toLocaleString()}
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Avg. Reach / Post</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Functional SVG Sparkline */}
            <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/60">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                <span>30-Day Velocity Curve</span>
                <span className="text-emerald-700 font-semibold">Exceeds platform baseline by +38%</span>
              </div>
              <div className="w-full flex items-center justify-center">
                <svg
                  className="w-full h-24 overflow-visible"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="none"
                >
                  {/* Subtle grid lines */}
                  <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2={chartWidth} y2="50" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2={chartWidth} y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />

                  {/* Gradient fill */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0055ff" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#0055ff" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`}
                    fill="url(#chartGradient)"
                  />

                  {/* Trend line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#0055ff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data points */}
                  {points.map((pt, i) => (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="3.5"
                        fill="#ffffff"
                        stroke="#0055ff"
                        strokeWidth="2"
                      />
                      <text
                        x={pt.x}
                        y={chartHeight + 12}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#64748b"
                        fontWeight="600"
                      >
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Audience Demographic Footprint */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500">Core Community:</span>
              <span className="font-semibold text-slate-800 text-right">
                {activeCreator.audienceDemographic}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Right: Dual Scorecards (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {/* Card A: Engagement Quality */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Audience Retention
              </span>
              <Badge variant="emerald" size="sm">
                Top 15% Tier
              </Badge>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight font-sans">
                  {activeCreator.engagementRate}%
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  vs 2.2% category avg
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                High-intent comment-to-view ratio on {activeCreator.primaryPlatform}.
              </p>
            </div>

            {/* Visual benchmark bar */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Baseline (2.2%)</span>
                <span className="font-bold text-slate-700">Your Rate ({activeCreator.engagementRate}%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, (activeCreator.engagementRate / 6) * 100)}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Card B: Monetisation Pipeline */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Deal Pipeline
              </span>
              <Badge variant="blue" size="sm">
                5 Qualified
              </Badge>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight font-sans">
                  ₹{activeCreator.estimatedPipelineValue.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  active potential
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Calculated from verified brands matching your minimum follower threshold.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
              <span className="text-slate-500">Target Progress:</span>
              <span className="font-mono font-bold text-slate-800">
                {Math.round((activeCreator.estimatedPipelineValue / activeCreator.monthlyIncomeTarget) * 100)}% of goal
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* 3. EXECUTION & STRATEGIC FOCUS (Split Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: 30-Day Roadmap Progress (6 cols) */}
        <Card className="lg:col-span-6 flex flex-col justify-between">
          <CardHeader>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Roadmap Milestones</h3>
                <Badge variant="violet" size="sm">
                  {activePhase?.days || "Phase 1"}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {activePhase?.phaseTitle}
              </p>
            </div>
            <Link
              href="/roadmap"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Full Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="space-y-3.5">
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  {completedMilestones} of {totalMilestones} Completed
                </span>
                <span className="font-bold text-slate-900 font-mono">{roadmapProgressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${roadmapProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Milestones Checklist */}
            <div className="space-y-2">
              {activePhase?.milestones.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  onClick={() => activePhase && toggleMilestone(activePhase.id, m.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer ${
                    m.completed
                      ? "bg-slate-50 border-slate-200/80 text-slate-500"
                      : "bg-white border-slate-200/90 hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                      m.completed ? "bg-emerald-600 text-white" : "border border-slate-300 bg-white"
                    }`}
                  >
                    {m.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold leading-tight ${
                        m.completed ? "line-through text-slate-400" : "text-slate-800"
                      }`}
                    >
                      {m.title}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {m.description}
                    </p>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                    {m.tag}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right: High-Impact Action Queue (6 cols) */}
        <Card className="lg:col-span-6 flex flex-col justify-between">
          <CardHeader>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Prioritised Actions</h3>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {completedActionsCount}/{totalActionsCount} Done
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Ranked by revenue and outreach leverage</p>
            </div>
            <Link
              href="/actions"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Action Centre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="space-y-2.5">
            {prioritizedActions.map((action) => (
              <div
                key={action.id}
                className={`p-3 rounded-lg border transition-all ${
                  action.completed
                    ? "bg-slate-50/70 border-slate-200 text-slate-400"
                    : "bg-white border-slate-200/90 hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    onClick={() => toggleAction(action.id)}
                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                      action.completed
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-slate-300 hover:border-blue-600 bg-white"
                    }`}
                    aria-label="Toggle action completion"
                  >
                    {action.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <Badge
                        variant={
                          action.priority === "High"
                            ? "rose"
                            : action.priority === "Medium"
                            ? "amber"
                            : "slate"
                        }
                        size="sm"
                      >
                        {action.priority}
                      </Badge>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {action.deadline}
                      </span>
                    </div>

                    <p
                      className={`text-xs font-bold leading-tight ${
                        action.completed ? "line-through text-slate-400" : "text-slate-900"
                      }`}
                    >
                      {action.title}
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 leading-snug">
                      <strong className="text-slate-700 font-semibold">Reason: </strong>
                      {action.reason}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 4. CURATED OPPORTUNITY MATCHES (Structured Row Pattern) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Recommended Brand Opportunities
            </h3>
            <p className="text-[11px] text-slate-500">
              Deterministic matches calculated for {activeCreator.niche} and {activeCreator.primaryPlatform} audience
            </p>
          </div>
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <span>Marketplace ({opportunities.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </Link>
        </div>

        {/* Structured Horizontal List Pattern for Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedOpportunities.map(({ opp, compatibility }) => {
            const isApplied = opp.status === "Applied";

            return (
              <div
                key={opp.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1.5 bg-slate-50 rounded-lg border border-slate-200/60">
                        {opp.brandLogo}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs leading-snug">
                          {opp.brand}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {opp.brandCategory}
                        </p>
                      </div>
                    </div>
                    <Badge variant="blue" size="sm">
                      {compatibility.score}% Match
                    </Badge>
                  </div>

                  <h5 className="font-bold text-slate-800 text-xs leading-tight line-clamp-1 mb-1">
                    {opp.title}
                  </h5>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {opp.description}
                  </p>

                  <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Budget</span>
                    <span className="font-bold text-emerald-700 text-xs">{opp.budgetRange}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedOpp(opp);
                      setDetailsOpen(true);
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    View Brief
                  </button>

                  {isApplied ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      Applied ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedOpp(opp);
                        setApplyOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals on Overview Page */}
      {selectedOpp && (
        <>
          <OpportunityDetailsModal
            opportunity={selectedOpp}
            compatibility={calculateCompatibility(selectedOpp, activeCreator)}
            isOpen={detailsOpen}
            onClose={() => setDetailsOpen(false)}
            onApplyClick={() => {
              setDetailsOpen(false);
              setApplyOpen(true);
            }}
          />
          <ApplyModal
            opportunity={selectedOpp}
            isOpen={applyOpen}
            onClose={() => setApplyOpen(false)}
          />
        </>
      )}
    </div>
  );
}

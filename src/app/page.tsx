"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCreator } from "@/context/CreatorContext";
import { calculateCompatibility } from "@/utils/compatibility";
import {
  DollarSign,
  ArrowRight,
  Clock,
  Target,
  ArrowUpRight,
  Check,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Card, CardHeader, CardContent } from "@/components/common/Card";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";
import { PersonaSwitcherBar } from "@/components/common/PersonaSwitcherBar";
import { HackathonDemoBar } from "@/components/common/HackathonDemoBar";
import { OpportunityDetailsModal } from "@/components/opportunities/OpportunityDetailsModal";
import { ApplyModal } from "@/components/opportunities/ApplyModal";
import { Opportunity, ActionStatus } from "@/types/creator";

export default function OverviewPage() {
  const {
    activeCreator,
    actions,
    toggleAction,
    updateActionStatus,
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

      {/* Repeatable Hackathon Demo Tour */}
      <HackathonDemoBar />

      {/* Consistent Persona Switcher Bar */}
      <PersonaSwitcherBar subtitle="Switch active creator to dynamically update executive briefing, analytics, priorities, and deal eligibility." />

      {/* 1. CREATOR PROFILE HERO CARD (24px radius with cover banner) */}
      <div className="bg-white rounded-3xl border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] overflow-hidden transition-all">
        {/* Subtle Instagram Gradient Cover Header */}
        <div className="h-24 sm:h-28 w-full story-ring-gradient relative opacity-90">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
          <div className="absolute top-3 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Executive Briefing
            </span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-12 sm:-mt-14 mb-4">
            {/* Creator Identity with Story Ring */}
            <div className="flex items-end gap-4 min-w-0">
              <div className="p-1 rounded-full bg-white shadow-md shrink-0">
                <div className="p-[2.5px] rounded-full story-ring-gradient">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-white overflow-hidden">
                    <img
                      src={activeCreator.avatar}
                      alt={activeCreator.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1 mb-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    {activeCreator.name}
                  </h2>
                  <span title="Verified Creator Profile">
                    <ShieldCheck className="w-5 h-5 text-[#0870e8] shrink-0" />
                  </span>
                  <Badge variant="blue" size="sm">
                    {activeCreator.niche}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-500">
                    @{activeCreator.handle}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium truncate">
                  {activeCreator.primaryPlatform} • {activeCreator.creatorStage} • {activeCreator.location || "India"}
                </p>
              </div>
            </div>

            {/* Quick Contextual Action Pills */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <Link
                href="/onboarding"
                className="btn-tactile inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0870e8] border border-blue-200/80 font-bold text-xs transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0870e8]" />
                <span>Onboarding Setup</span>
              </Link>
              <Link
                href="/roadmap"
                className="btn-tactile inline-flex items-center justify-center gap-1.5 px-4.5 py-2 rounded-full bg-[#0870e8] hover:bg-[#065ec4] text-white font-bold text-xs shadow-xs transition-colors"
              >
                <span>View 30-Day Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/opportunities"
                className="btn-tactile inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors border border-slate-200/80"
              >
                <span>Review Deals ({opportunities.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            </div>
          </div>

          {/* Strategic Context Strip */}
          <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <p className="text-slate-600 leading-relaxed font-normal max-w-3xl">
              Your 30-day focus is <strong className="text-slate-900 font-semibold">{activePhase?.phaseTitle || "Growth Acceleration"}</strong>. You have <strong className="text-[#0870e8] font-semibold">{sortedOpportunities.length} high-compatibility sponsor matches</strong> ready for outreach, with an estimated deal pipeline of <strong className="text-emerald-700 font-semibold">₹{activeCreator.estimatedPipelineValue.toLocaleString()}</strong>.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#0870e8]" />
                <span>Goal: <strong className="text-slate-800">{activeCreator.primaryGoal}</strong></span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Target: <strong className="text-slate-800">₹{activeCreator.monthlyIncomeTarget.toLocaleString()} / mo</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4-METRIC KEY STATISTICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Followers */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Audience Scale
            </span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              {activeCreator.followerCount.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Verified {activeCreator.primaryPlatform} audience
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold pt-2 border-t border-slate-100">
            <TrendingUp className="w-3 h-3" />
            <span>+{activeCreator.monthlyGrowthRate}% monthly growth</span>
          </div>
        </Card>

        {/* Engagement Rate */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Engagement Rate
            </span>
            <Badge variant="emerald" size="sm">
              Top Tier
            </Badge>
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              {activeCreator.engagementRate}%
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              vs. 2.2% platform baseline
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>High comment-to-view ratio</span>
          </div>
        </Card>

        {/* Growth Rate */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Average Reach
            </span>
            <Badge variant="blue" size="sm">
              Verified
            </Badge>
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              {activeCreator.avgImpressionsPerPost.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Average impressions / post
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Consistent 30-day posting</span>
          </div>
        </Card>

        {/* Deal Pipeline Value */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Deal Pipeline
            </span>
            <Badge variant="emerald" size="sm">
              5 Eligible
            </Badge>
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              ₹{activeCreator.estimatedPipelineValue.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Estimated active potential
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>{Math.round((activeCreator.estimatedPipelineValue / activeCreator.monthlyIncomeTarget) * 100)}% of monthly target</span>
          </div>
        </Card>
      </div>

      {/* 3. PERFORMANCE INTELLIGENCE & REACH TRAJECTORY */}
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
            {/* Functional SVG Sparkline with Blue Gradient Fill */}
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/60">
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
                      <stop offset="0%" stopColor="#0870e8" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#0870e8" stopOpacity="0.0" />
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
                    stroke="#0870e8"
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
                        r="4"
                        fill="#ffffff"
                        stroke="#0870e8"
                        strokeWidth="2.5"
                      />
                      <text
                        x={pt.x}
                        y={chartHeight + 14}
                        fontSize="9"
                        fill="#94a3b8"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
              {impressionTrend.map((t, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-semibold">{t.label} Impressions</span>
                  <p className="text-xs font-bold text-slate-800">{t.val.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right: Benchmarks & Income Progress (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
          {/* Card A: Category Engagement Comparison */}
          <Card className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Audience Retention
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Top 15% Tier
                </span>
              </div>

              <div className="my-2.5">
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
            </div>

            {/* Visual benchmark bar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Baseline (2.2%)</span>
                <span className="font-bold text-slate-700">Your Rate ({activeCreator.engagementRate}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, (activeCreator.engagementRate / 6) * 100)}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Card B: Monthly Income Goal Progress */}
          <Card className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Monthly Goal Progress
                </span>
                <Badge variant="blue" size="sm">
                  {Math.round((activeCreator.estimatedPipelineValue / activeCreator.monthlyIncomeTarget) * 100)}% of Target
                </Badge>
              </div>

              <div className="my-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 tracking-tight font-sans">
                    ₹{activeCreator.estimatedPipelineValue.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    of ₹{activeCreator.monthlyIncomeTarget.toLocaleString()} / mo
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Calculated from verified brands matching your minimum follower threshold.
                </p>
              </div>
            </div>

            {/* Income progress bar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Pipeline Potential</span>
                <span className="font-bold text-slate-700">Goal: ₹{activeCreator.monthlyIncomeTarget.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0870e8] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (activeCreator.estimatedPipelineValue / activeCreator.monthlyIncomeTarget) * 100)}%` }}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. EXECUTION & STRATEGIC FOCUS (Roadmap & Priority Actions) */}
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
              className="text-xs font-bold text-[#0870e8] hover:text-blue-700 flex items-center gap-1"
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
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0870e8] rounded-full transition-all duration-300"
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
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    m.completed
                      ? "bg-slate-50/70 border-slate-200/80 text-slate-500"
                      : "bg-white border-slate-200/80 hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-colors ${
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
                  <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
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
                <span className="text-xs font-mono font-bold text-[#0870e8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/70">
                  {completedActionsCount}/{totalActionsCount} Done
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Ranked by revenue and outreach leverage</p>
            </div>
            <Link
              href="/actions"
              className="text-xs font-bold text-[#0870e8] hover:text-blue-700 flex items-center gap-1"
            >
              <span>Action Centre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="space-y-2.5">
            {prioritizedActions.map((action) => {
              const status: ActionStatus = action.status || (action.completed ? "Completed" : "Not started");
              const isCompleted = status === "Completed";
              const isInProgress = status === "In progress";

              return (
                <div
                  key={action.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isCompleted
                      ? "bg-slate-50/70 border-slate-200 text-slate-400"
                      : isInProgress
                      ? "bg-white border-blue-300 shadow-xs"
                      : "bg-white border-slate-200/80 hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleAction(action.id)}
                      className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        isCompleted
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 hover:border-[#0870e8] bg-white"
                      }`}
                      title={isCompleted ? "Mark incomplete" : "Mark completed"}
                      aria-label="Toggle action completion"
                    >
                      {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
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

                          {/* Interactive Status Pill */}
                          <button
                            onClick={() => {
                              const nextStatus: ActionStatus =
                                status === "Not started"
                                  ? "In progress"
                                  : status === "In progress"
                                  ? "Completed"
                                  : "Not started";
                              updateActionStatus(action.id, nextStatus);
                            }}
                            className={`btn-tactile px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                              status === "Completed"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : status === "In progress"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                            title="Click to cycle status"
                          >
                            {status}
                          </button>

                          {action.relatedTitle && (
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium truncate max-w-[150px]">
                              {action.relatedTitle}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                          <Clock className="w-2.5 h-2.5" /> {action.deadline}
                        </span>
                      </div>

                      <p
                        className={`text-xs font-bold leading-tight ${
                          isCompleted ? "line-through text-slate-400" : "text-slate-900"
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
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* 5. CURATED OPPORTUNITY MATCHES */}
      <div className="space-y-3.5">
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
            className="btn-tactile inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-2xs transition-colors"
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
                className="bg-white rounded-2xl border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-between hover:border-slate-300/80 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 bg-slate-50 rounded-xl border border-slate-200/60 shadow-2xs group-hover:scale-105 transition-transform">
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
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {compatibility.qualifies ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                          Ineligible
                        </span>
                      )}
                      <Badge variant="blue" size="sm">
                        {compatibility.score}% Match
                      </Badge>
                    </div>
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

                <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-100">
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
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Applied ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedOpp(opp);
                        setApplyOpen(true);
                      }}
                      className="btn-tactile px-3.5 py-1.5 rounded-full bg-[#0870e8] hover:bg-[#065ec4] text-white text-xs font-semibold shadow-2xs transition-colors"
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

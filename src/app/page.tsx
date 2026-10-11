"use client";

import React from "react";
import Link from "next/link";
import { useCreator } from "@/context/CreatorContext";
import { calculateCompatibility } from "@/utils/compatibility";
import {
  Users,
  TrendingUp,
  Briefcase,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Target,
  Flame,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Card, CardHeader, CardContent } from "@/components/common/Card";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";

export default function OverviewPage() {
  const {
    activeCreator,
    actions,
    toggleAction,
    roadmaps,
    opportunities,
    completedActionsCount,
    totalActionsCount,
    profileCompletion,
  } = useCreator();

  // Top prioritized actions (limit to 3 for overview)
  const prioritizedActions = actions.slice(0, 3);

  // Top recommended opportunities sorted deterministically by compatibility score
  const sortedOpportunities = [...opportunities]
    .map((opp) => ({
      opp,
      compatibility: calculateCompatibility(opp, activeCreator),
    }))
    .sort((a, b) => b.compatibility.score - a.compatibility.score)
    .slice(0, 3)
    .map((item) => item.opp);

  // Roadmap metrics
  const activePhase = roadmaps[0] || null;
  const completedMilestones =
    activePhase?.milestones.filter((m) => m.completed).length || 0;
  const totalMilestones = activePhase?.milestones.length || 1;
  const roadmapProgressPercent = Math.round(
    (completedMilestones / totalMilestones) * 100
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Disclaimer */}
      <DemoDisclaimer text="Illustrative metrics shown for prototype demonstration. Brand budgets, CPM projections, and roadmap steps are tailored to creator profile data." />

      {/* Hero Welcome & Profile Snapshot */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-slate-900/10 border border-slate-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 backdrop-blur-md border border-white/10">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Active Persona: {activeCreator.name}</span>
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {activeCreator.primaryPlatform} • {activeCreator.niche}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {activeCreator.name.split(" ")[0]} 👋
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {activeCreator.bio}
            </p>

            <div className="flex items-center gap-4 pt-1 flex-wrap text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Primary Goal: <strong className="text-white">{activeCreator.primaryGoal}</strong></span>
              </div>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Monthly Target: <strong className="text-white">₹{activeCreator.monthlyIncomeTarget.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick CTA to Edit Profile / Media Kit */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md shadow-white/10 transition-all hover:scale-[1.02]"
            >
              <span>Edit Creator Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/opportunities"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-all"
            >
              <span>Explore Marketplace</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Followers */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Audience
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {activeCreator.followerCount.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                +{activeCreator.monthlyGrowthRate}% /mo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {activeCreator.primaryPlatform} • {activeCreator.audienceDemographic.slice(0, 24)}...
            </p>
          </div>
        </Card>

        {/* Engagement Rate */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Engagement Rate
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {activeCreator.engagementRate}%
              </span>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                Industry High
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              ~{activeCreator.avgImpressionsPerPost.toLocaleString()} avg impressions / post
            </p>
          </div>
        </Card>

        {/* Active Pipeline Deals */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Opportunity Matches
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {opportunities.length}
              </span>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                Active Campaigns
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {opportunities.filter((o) => o.status === "Applied").length} applications submitted
            </p>
          </div>
        </Card>

        {/* Deal Pipeline Value */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Estimated Pipeline
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                ₹{activeCreator.estimatedPipelineValue.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Sample Model
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Target: ₹{activeCreator.monthlyIncomeTarget.toLocaleString()} / month
            </p>
          </div>
        </Card>
      </div>

      {/* Two-Column Middle Section: Growth Roadmap Progress & Next Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 30-Day Roadmap Snapshot (7 cols) */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <CardHeader>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Growth Roadmap Progress</h3>
                <Badge variant="purple" size="sm">
                  {activePhase?.days || "Phase 1"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activePhase?.phaseTitle}
              </p>
            </div>
            <Link
              href="/roadmap"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Full Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-600">
                  {completedMilestones} of {totalMilestones} Milestones Completed
                </span>
                <span className="font-bold text-slate-900">{roadmapProgressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${roadmapProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Objective statement */}
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70 leading-relaxed">
              <strong className="text-slate-900 font-semibold">Objective: </strong>
              {activePhase?.phaseObjective}
            </p>

            {/* Milestones list preview */}
            <div className="space-y-2">
              {activePhase?.milestones.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                    m.completed
                      ? "bg-emerald-50/40 border-emerald-200/80"
                      : "bg-white border-slate-200/80"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      m.completed ? "bg-emerald-600 text-white" : "border border-slate-300 text-transparent"
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold leading-tight ${
                        m.completed ? "text-emerald-950 line-through" : "text-slate-800"
                      }`}
                    >
                      {m.title}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {m.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                    {m.tag}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right: Recommended Next Actions (5 cols) */}
        <Card className="lg:col-span-5 flex flex-col justify-between">
          <CardHeader>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Recommended Actions</h3>
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {completedActionsCount}/{totalActionsCount} done
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Prioritized by growth and conversion impact</p>
            </div>
            <Link
              href="/actions"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Action Centre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="space-y-3">
            {prioritizedActions.map((action) => (
              <div
                key={action.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  action.completed
                    ? "bg-slate-50/70 border-slate-200 opacity-60"
                    : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    onClick={() => toggleAction(action.id)}
                    className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                      action.completed
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-slate-300 hover:border-indigo-500 bg-white"
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
                        {action.priority} Priority
                      </Badge>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {action.deadline}
                      </span>
                    </div>

                    <p
                      className={`text-xs font-bold leading-tight ${
                        action.completed ? "line-through text-slate-500" : "text-slate-900"
                      }`}
                    >
                      {action.title}
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
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

      {/* Bottom Section: Top Recommended Brand Opportunities */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              Top Campaign Matches For {activeCreator.name.split(" ")[0]}
            </h3>
            <p className="text-xs text-slate-500">
              Deterministic ranking tailored to {activeCreator.niche} and {activeCreator.primaryPlatform} audience
            </p>
          </div>
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <span>View All {opportunities.length} Campaigns</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </div>
    </div>
  );
}

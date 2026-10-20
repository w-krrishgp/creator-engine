"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCreator } from "@/context/CreatorContext";
import {
  ContentGapItem,
  SkillPriorityItem,
  TopicOpportunityItem,
  ReferenceProfile,
} from "@/types/creator";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  TrendingUp,
  Sparkles,
  Target,
  Check,
  ExternalLink,
  Calendar,
  Award,
  ArrowRight,
  Zap,
  Lock,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";
import { PersonaSwitcherBar } from "@/components/common/PersonaSwitcherBar";
import { HackathonDemoBar } from "@/components/common/HackathonDemoBar";
import { UpgradePromptModal, LimitType } from "@/components/subscription/UpgradePromptModal";
import { ConnectProfilePrompt } from "@/components/common/ConnectProfilePrompt";

export default function RoadmapPage() {
  const {
    activeCreator,
    roadmaps,
    toggleMilestone,
    refreshAiRecommendations,
    isAiGenerating,
    isGeminiConfigured,
    lastAiGeneratedAt,
    currentPlan,
    currentPlanId,
    subscriptionUsage,
    isDemoMode,
  } = useCreator();

  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(0);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [modalLimitType, setModalLimitType] = useState<LimitType>("roadmap");
  const [modalMessage, setModalMessage] = useState<string | undefined>(undefined);

  // If no active creator is connected, render the connect profile empty state
  if (!activeCreator) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-2">
        <ConnectProfilePrompt
          feature="roadmap"
          title="Connect Your Live Profile to View Your Growth Roadmap"
          subtitle="No active creator profile connected. Link your YouTube channel, Instagram handle, or LinkedIn profile to synthesize a customized 30 / 60 / 90-day growth plan, detect content gaps, and prioritize skill milestones."
        />
      </div>
    );
  }

  // Fallback if no roadmaps are loaded
  if (!roadmaps || roadmaps.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0870e8] flex items-center justify-center mx-auto shadow-xs">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Generate Your Growth Roadmap</h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto">
          Synthesize a tailored 30 / 60 / 90-day phased execution blueprint, high-impact content gaps, and topic opportunities with AI.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          <button
            onClick={async () => {
              const res = await refreshAiRecommendations();
              if (res && res.quotaExceeded) {
                setModalLimitType("ai");
                setModalMessage(res.reason);
                setUpgradeModalOpen(true);
              }
            }}
            disabled={isAiGenerating}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0870e8] hover:bg-[#0760cb] text-white font-bold text-sm shadow-xs transition-all disabled:opacity-60 cursor-pointer btn-tactile"
          >
            <Sparkles className={`w-4 h-4 ${isAiGenerating ? "animate-spin" : ""}`} />
            <span>{isAiGenerating ? "Synthesizing AI Roadmap..." : "Generate Growth Roadmap (AI)"}</span>
          </button>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-sm shadow-2xs btn-tactile"
          >
            <span>Launch Onboarding Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const currentPhase = roadmaps[selectedPhaseIndex] || roadmaps[0];
  const phaseCompletedCount = currentPhase.milestones.filter((m) => m.completed).length;
  const phaseTotalCount = currentPhase.milestones.length;
  const phaseProgressPercent = phaseTotalCount > 0 ? Math.round((phaseCompletedCount / phaseTotalCount) * 100) : 0;

  // Calculate overall 90-day roadmap progress across all phases
  const totalAllMilestones = roadmaps.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedAllMilestones = roadmaps.reduce(
    (acc, p) => acc + p.milestones.filter((m) => m.completed).length,
    0
  );
  const overallProgressPercent =
    totalAllMilestones > 0 ? Math.round((completedAllMilestones / totalAllMilestones) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* 0. HACKATHON DEMO ASSISTANT (Shown only for demo personas) */}
      {isDemoMode && <HackathonDemoBar />}

      {/* 1. TRANSPARENCY NOTICE (Dynamic based on demo vs verified live mode) */}
      <DemoDisclaimer
        text={
          isDemoMode
            ? "Illustrative Demo Recommendations: These growth milestones, topic angles, and benchmarking references are synthesized for demo personas based on public category benchmarks."
            : `Verified Live Recommendations: Calibrated from your ${activeCreator.primaryPlatform} account signals, ${activeCreator.niche} category benchmarks, and ${activeCreator.creatorStage} creator stage. Synthesized with AI.`
        }
      />

      {/* 2. CONSISTENT PERSONA SWITCHER BAR */}
      <PersonaSwitcherBar subtitle="Phased milestones, high-impact content gaps, and topic opportunities calibrated to your active persona." />

      {/* 3. TOP STRATEGIC POSITIONING */}
      <div className="bg-white rounded-[22px] border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="blue" size="sm">
                Strategic Positioning
              </Badge>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs sm:text-[13px] font-semibold text-slate-500">
                {activeCreator.primaryPlatform} • {activeCreator.niche} • {activeCreator.creatorStage}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              30 / 60 / 90-Day Growth Roadmap
            </h1>

            {/* Concise Creator Positioning Statement */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
              <strong className="text-[#0870e8] font-bold uppercase tracking-wider text-xs block mb-1">
                Target Market Thesis:
              </strong>
              {activeCreator.positioningStatement || activeCreator.bio}
            </div>

            {/* AI Intelligence Action Bar */}
            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <button
                onClick={async () => {
                  const res = await refreshAiRecommendations();
                  if (res && res.quotaExceeded) {
                    setModalLimitType("ai");
                    setModalMessage(res.reason);
                    setUpgradeModalOpen(true);
                  }
                }}
                disabled={isAiGenerating}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0870e8] hover:bg-[#0760cb] text-white text-xs sm:text-sm font-bold transition-all shadow-xs disabled:opacity-60 cursor-pointer btn-tactile"
              >
                <Sparkles className={`w-4 h-4 ${isAiGenerating ? "animate-spin" : ""}`} />
                <span>{isAiGenerating ? "Synthesizing AI Roadmap..." : "Generate / Refresh Roadmap (AI)"}</span>
              </button>
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100/90 px-3 py-1 rounded-full border border-slate-200/60 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-[#0870e8]" />
                  <span>
                    AI Quota: {subscriptionUsage?.aiUsage ?? 0}/{subscriptionUsage?.aiLimit ?? currentPlan.limits.aiRecommendationsPerMonth} used
                  </span>
                </span>
                {isDemoMode ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50/90 px-3 py-1 rounded-full border border-amber-200/70">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Demo Benchmark
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/90 px-3 py-1 rounded-full border border-emerald-200/70">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {isGeminiConfigured ? "Strategic AI (Live)" : "Tailored Strategy Engine (Live)"}
                  </span>
                )}
                {lastAiGeneratedAt && (
                  <span className="text-xs text-slate-400 font-medium">
                    Generated at {lastAiGeneratedAt}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Overall 90-Day Roadmap Progress Widget */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2 min-w-[220px] shrink-0 shadow-2xs">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#0870e8]" />
                90-Day Execution
              </span>
              <span className="font-mono font-bold text-[#0870e8]">{overallProgressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0870e8] rounded-full transition-all duration-300"
                style={{ width: `${overallProgressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {completedAllMilestones} of {totalAllMilestones} total milestones achieved
            </p>
          </div>
        </div>
      </div>

      {/* 3. PHASE SELECTOR TABS WITH PLAN FEATURE GATING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-full border border-slate-200/75 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {roadmaps.map((phase, idx) => {
            const isSelected = selectedPhaseIndex === idx;
            const isLocked = idx >= currentPlan.limits.roadmapPhasesAllowed;
            const completedInPhase = phase.milestones.filter((m) => m.completed).length;

            const handlePhaseClick = () => {
              if (isLocked) {
                setModalLimitType("roadmap");
                setModalMessage(
                  `The ${currentPlan.name} tier includes a 30-day foundational growth plan. Upgrade to Pro or Pro+ to unlock comprehensive 60-day and 90-day execution milestones, content gaps, and skill blueprints.`
                );
                setUpgradeModalOpen(true);
                return;
              }
              setSelectedPhaseIndex(idx);
            };

            return (
              <button
                key={phase.id}
                type="button"
                onClick={handlePhaseClick}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  isSelected
                    ? "bg-[#0870e8] text-white shadow-xs"
                    : isLocked
                    ? "bg-amber-50/80 text-amber-900 border border-amber-200/70 hover:bg-amber-100/80"
                    : "bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                } btn-tactile`}
              >
                {isLocked && <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                <span>Phase {idx + 1} ({phase.days})</span>
                {isLocked ? (
                  <span className="px-2 py-0.5 rounded-full text-xs uppercase tracking-wider font-extrabold bg-amber-200 text-amber-900">
                    Pro
                  </span>
                ) : (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-mono font-semibold ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-700"
                    }`}
                  >
                    {completedInPhase}/{phase.milestones.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-xs sm:text-sm text-slate-600 font-medium px-3 sm:px-2">
          Current focus: <strong className="text-slate-900">{currentPhase.phaseTitle}</strong>
        </div>
      </div>

      {/* 4. CURRENT PHASE EDITORIAL BRIEFING CARD */}
      <div className="bg-white rounded-[20px] border border-slate-200/75 border-l-4 border-l-[#0870e8] shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0870e8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80">
                {currentPhase.days} Execution Focus
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs sm:text-[13px] font-semibold text-slate-500">{currentPhase.phaseTitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {currentPhase.phaseTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {currentPhase.phaseObjective}
            </p>
          </div>

          {/* Phase completion gauge */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 min-w-[220px] space-y-2 shrink-0 shadow-2xs">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-slate-700">Phase Completion</span>
              <span className="font-mono font-bold text-[#0870e8]">{phaseProgressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0870e8] rounded-full transition-all duration-300"
                style={{ width: `${phaseProgressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {phaseCompletedCount} of {phaseTotalCount} milestones completed
            </p>
          </div>
        </div>
      </div>

      {/* 5. TWO COLUMN MAIN BODY: MILESTONES & STRATEGIC AUDIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ACTIONABLE MILESTONES (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Milestones Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4.5 h-4.5 text-[#0870e8]" />
                <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                  Actionable Milestones ({currentPhase.days})
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Click to toggle status</span>
            </div>

            <div className="space-y-3">
              {currentPhase.milestones.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleMilestone(currentPhase.id, m.id)}
                  className={`p-4 rounded-[16px] border transition-all cursor-pointer select-none group ${
                    m.completed
                      ? "bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300"
                      : "bg-white border-slate-200/75 hover:border-blue-300 hover:shadow-xs shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 ${
                        m.completed
                          ? "bg-emerald-600 text-white shadow-xs shadow-emerald-600/30"
                          : "border border-slate-300 group-hover:border-[#0870e8] bg-white"
                      }`}
                    >
                      {m.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4
                          className={`text-sm sm:text-base font-bold leading-tight ${
                            m.completed ? "line-through text-slate-400" : "text-slate-900"
                          }`}
                        >
                          {m.title}
                        </h4>
                        <span className="text-xs font-semibold text-[#0870e8] bg-blue-50 px-2.5 py-0.5 rounded-full shrink-0 border border-blue-200/60">
                          {m.tag}
                        </span>
                      </div>
                      <p
                        className={`text-xs sm:text-sm leading-relaxed ${
                          m.completed ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {m.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RELEVANT TOPIC OPPORTUNITIES */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4.5 h-4.5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                  Relevant Topic Opportunities ({activeCreator.niche})
                </h3>
              </div>
              <Badge variant="emerald" size="sm">
                High-Retention Angles
              </Badge>
            </div>

            <div className="space-y-3">
              {currentPhase.topicOpportunities.map((topic, idx) => {
                const isItem = typeof topic === "object" && topic !== null;
                const title = isItem ? (topic as TopicOpportunityItem).title : topic;
                const hookAngle = isItem ? (topic as TopicOpportunityItem).hookAngle : null;
                const suggestedFormat = isItem ? (topic as TopicOpportunityItem).suggestedFormat : null;
                const targetAudience = isItem ? (topic as TopicOpportunityItem).targetAudience : null;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-[16px] bg-white border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        &ldquo;{title}&rdquo;
                      </h4>
                      {suggestedFormat && (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shrink-0">
                          {suggestedFormat}
                        </span>
                      )}
                    </div>

                    {hookAngle && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-800">Hook Angle: </strong>
                        {hookAngle}
                      </p>
                    )}

                    {targetAudience && (
                      <p className="text-xs text-slate-500 font-medium">
                        Target Audience: {targetAudience}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PUBLIC-PROFILE REFERENCES FOR LEARNING & BENCHMARKING */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                  Public-Profile References for Learning & Benchmarking
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Verified links only</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentPhase.referenceProfiles.map((ref: ReferenceProfile, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-[16px] bg-white border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">{ref.name}</h4>
                        <p className="text-xs text-[#0870e8] font-semibold">{ref.handle}</p>
                      </div>
                      <Badge variant="blue" size="sm">
                        {ref.platform}
                      </Badge>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Tactical Lesson: </strong>
                      {ref.lesson}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-emerald-700 truncate">
                      {ref.statsHighlight}
                    </span>

                    {/* Verified Link Button (Only rendered when verified) */}
                    {ref.url && ref.isVerifiedLink ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors shrink-0 btn-tactile"
                      >
                        <span>Verified Profile</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Public Reference</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              * Note: Public reference profiles are curated benchmark accounts for architectural study. Creator Engine has not analyzed private analytics of unauthenticated third-party accounts.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT GAPS & SKILL PRIORITIES (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* CONTENT GAPS AND THE REASONS THEY MATTER */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                  Content Gaps & Why They Matter
                </h3>
              </div>
              <Badge variant="amber" size="sm">
                Priority Gaps
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              {currentPhase.contentGaps.map((gapItem, idx) => {
                const isObj = typeof gapItem === "object" && gapItem !== null;
                const gap = isObj ? (gapItem as ContentGapItem).gap : gapItem;
                const reason = isObj ? (gapItem as ContentGapItem).reason : null;
                const impact = isObj ? (gapItem as ContentGapItem).impactLevel : "High";

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/70 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{gap}</h4>
                      </div>
                      {impact && (
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${
                            impact === "Critical"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-100/70 text-amber-800 border-amber-300"
                          }`}
                        >
                          {impact}
                        </span>
                      )}
                    </div>

                    {reason && (
                      <div className="pl-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-800">Why it matters: </strong>
                        {reason}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* SKILL PRIORITIES */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#0870e8]" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                  Skill Priorities
                </h3>
              </div>
              <Badge variant="blue" size="sm">
                Capability Building
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              {currentPhase.skillsToImprove.map((skillItem, idx) => {
                const isObj = typeof skillItem === "object" && skillItem !== null;
                const skill = isObj ? (skillItem as SkillPriorityItem).skill : skillItem;
                const category = isObj ? (skillItem as SkillPriorityItem).category : null;
                const priority = isObj ? (skillItem as SkillPriorityItem).priority : null;
                const action = isObj ? (skillItem as SkillPriorityItem).actionStep : null;

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-blue-50/30 border border-blue-200/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0870e8] shrink-0" />
                        <h4 className="text-sm font-bold text-slate-900 truncate">{skill}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {category && (
                          <span className="text-xs text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 font-medium">
                            {category}
                          </span>
                        )}
                        {priority && (
                          <span
                            className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                              priority === "Critical"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {priority}
                          </span>
                        )}
                      </div>
                    </div>

                    {action && (
                      <p className="text-xs sm:text-sm text-slate-600 pl-5 leading-relaxed">
                        <strong className="text-slate-800">Next Action: </strong>
                        {action}
                      </p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* QUICK LINKS TO WORKFLOW & ACTIONS */}
          <div className="p-5 rounded-[20px] bg-white border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#0870e8]" /> Execute Next Steps
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Turn these milestones into weekly daily tasks and standardized sponsor deal workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Link
                href="/workflow"
                className="flex-1 py-2.5 px-3 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0870e8] text-sm font-bold text-center border border-blue-200/70 transition-colors btn-tactile"
              >
                Open Workflow Engine
              </Link>
              <Link
                href="/actions"
                className="flex-1 py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold text-center border border-slate-200/70 transition-colors btn-tactile"
              >
                Action Centre
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Limit Upgrade Prompt Modal */}
      <UpgradePromptModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        limitType={modalLimitType}
        customMessage={modalMessage}
        currentUsageCount={modalLimitType === "ai" ? subscriptionUsage?.aiUsage : undefined}
        resetDate={subscriptionUsage?.usageResetAt}
      />
    </div>
  );
}

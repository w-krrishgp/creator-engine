"use client";

import React, { useState } from "react";
import { useCreator } from "@/context/CreatorContext";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  TrendingUp,
  Sparkles,
  Target,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";

export default function RoadmapPage() {
  const { activeCreator, roadmaps, toggleMilestone } = useCreator();
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(0);

  const currentPhase = roadmaps[selectedPhaseIndex] || roadmaps[0];
  if (!currentPhase) return null;

  const completedCount = currentPhase.milestones.filter((m) => m.completed).length;
  const totalCount = currentPhase.milestones.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Top Disclaimer */}
      <DemoDisclaimer text="Roadmap phases and milestone timelines are illustrative frameworks structured according to current follower volume, niche benchmarks, and retention dynamics." />

      {/* Header with Title and Phase Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              30 / 60 / 90-Day Growth Roadmap
            </h2>
            <Badge variant="purple" size="sm">
              {activeCreator.niche}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tailored growth architecture for {activeCreator.name} to hit {activeCreator.primaryGoal}.
          </p>
        </div>

        {/* Phase Tabs Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/90 self-start sm:self-auto">
          {roadmaps.map((phase, idx) => {
            const isSelected = selectedPhaseIndex === idx;
            const phaseCompleted = phase.milestones.filter((m) => m.completed).length;

            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhaseIndex(idx)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <span>{phase.days}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-medium ${
                    isSelected ? "bg-blue-50 text-blue-700" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {phaseCompleted}/{phase.milestones.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phase Overview Editorial Briefing Card */}
      <Card className="bg-white border border-slate-200/90 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                Phase {selectedPhaseIndex + 1} • {currentPhase.days} Focus
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentPhase.phaseTitle}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {currentPhase.phaseTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {currentPhase.phaseObjective}
            </p>
          </div>

          {/* Progress Widget */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 min-w-[220px] space-y-2.5 shrink-0">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">Phase Completion</span>
              <span className="text-slate-900 font-mono font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {completedCount} of {totalCount} milestones completed
            </p>
          </div>
        </div>
      </Card>

      {/* Two Column Layout: Milestones & Strategic Audit Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Milestones (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Key Actionable Milestones
              </h3>
            </div>
            <span className="text-xs text-slate-500">Click checkmark to toggle status</span>
          </div>

          <div className="space-y-3">
            {currentPhase.milestones.map((m) => (
              <div
                key={m.id}
                onClick={() => toggleMilestone(currentPhase.id, m.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none group ${
                  m.completed
                    ? "bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300"
                    : "bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-xs"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 ${
                      m.completed
                        ? "bg-emerald-600 text-white shadow-xs shadow-emerald-600/30"
                        : "border border-slate-300 group-hover:border-blue-500 bg-white"
                    }`}
                  >
                    {m.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4
                        className={`text-sm font-bold leading-tight ${
                          m.completed ? "line-through text-slate-400" : "text-slate-900"
                        }`}
                      >
                        {m.title}
                      </h4>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md shrink-0 border border-blue-200/60">
                        {m.tag}
                      </span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
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

          {/* Reference Case Studies Box */}
          <div className="pt-2">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" /> Relevant Public-Profile References & Lessons
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentPhase.referenceProfiles.map((ref, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{ref.name}</h4>
                      <p className="text-[11px] text-blue-600 font-medium">{ref.handle}</p>
                    </div>
                    <Badge variant="purple" size="sm">
                      {ref.platform}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    <strong className="text-slate-800">Tactic: </strong>
                    {ref.lesson}
                  </p>
                  <div className="pt-1 text-[11px] font-semibold text-emerald-700">
                    {ref.statsHighlight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Strategic Content Audit Insights (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Content Gaps Detected */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Content Gaps Identified
                </h3>
              </div>
              <Badge variant="amber" size="sm">
                Optimization Area
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {currentPhase.contentGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/40 border border-amber-200/60 text-xs text-slate-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{gap}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills to Improve */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Skills to Improve Next
                </h3>
              </div>
              <Badge variant="blue" size="sm">
                Capability Building
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {currentPhase.skillsToImprove.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/40 border border-blue-200/60 text-xs text-slate-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{skill}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Topic Opportunities */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  High-Retention Topic Hooks
                </h3>
              </div>
              <Badge variant="emerald" size="sm">
                Viral Angles
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentPhase.topicOpportunities.map((topic, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-800 flex items-center justify-between group hover:bg-white hover:border-slate-300 transition-all"
                >
                  <span>&ldquo;{topic}&rdquo;</span>
                  <Sparkles className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

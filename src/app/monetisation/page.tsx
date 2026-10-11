"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCreator } from "@/context/CreatorContext";
import { MOCK_MONETISATION_CHANNELS } from "@/data/mockMonetisation";
import { MonetisationChannel } from "@/types/creator";
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  PlusCircle,
  Target,
  DollarSign,
  TrendingUp,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  Info,
  Calendar,
  Briefcase,
  Flame,
  Award,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";

export default function MonetisationPage() {
  const {
    activeCreator,
    activeCreatorId,
    switchCreator,
    addAction,
    actions,
    showToast,
  } = useCreator();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Saved pathways state synced with localStorage
  const [savedChannelIds, setSavedChannelIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`saved_monetisation_${activeCreatorId}`);
      if (saved) {
        setSavedChannelIds(JSON.parse(saved));
      } else {
        setSavedChannelIds([]);
      }
    } catch {
      // Ignore
    }
  }, [activeCreatorId]);

  const toggleSaveChannel = (channelId: string) => {
    setSavedChannelIds((prev) => {
      const isSaved = prev.includes(channelId);
      const next = isSaved ? prev.filter((id) => id !== channelId) : [...prev, channelId];
      try {
        localStorage.setItem(`saved_monetisation_${activeCreatorId}`, JSON.stringify(next));
      } catch {
        // Ignore
      }
      showToast(
        isSaved ? "Removed pathway from saved portfolio" : "Saved monetisation pathway to active portfolio",
        isSaved ? "info" : "success"
      );
      return next;
    });
  };

  const toggleExpand = (channelId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [channelId]: !prev[channelId],
    }));
  };

  // Convert pathway into functional Action Item
  const handleCreateActionItem = (channel: MonetisationChannel) => {
    const actionTitle = `Execute Launch: ${channel.title}`;
    const alreadyExists = actions.some((a) => a.title === actionTitle);

    if (alreadyExists) {
      showToast("This pathway is already queued in your Action Centre", "info");
      return;
    }

    addAction({
      title: actionTitle,
      category: "Monetisation",
      priority: channel.suitabilityScore >= 90 ? "High" : "Medium",
      reason: `First step: ${channel.suggestedFirstStep}`,
      deadline: "In 7 days",
      estimatedTime: "45 mins",
      completed: false,
    });
  };

  const channels =
    MOCK_MONETISATION_CHANNELS[activeCreatorId] ||
    MOCK_MONETISATION_CHANNELS.rahul ||
    [];

  const categories = [
    { id: "all", label: "All 5 Pathways", count: channels.length },
    { id: "brand_collaborations", label: "Brand Collabs", count: channels.filter((c) => c.category === "brand_collaborations").length },
    { id: "affiliate_marketing", label: "Affiliate Marketing", count: channels.filter((c) => c.category === "affiliate_marketing").length },
    { id: "consulting_services", label: "Services & Consulting", count: channels.filter((c) => c.category === "consulting_services").length },
    { id: "digital_products", label: "Digital Products", count: channels.filter((c) => c.category === "digital_products").length },
    { id: "pr_speaking", label: "PR & Speaking", count: channels.filter((c) => c.category === "pr_speaking").length },
  ];

  const filteredChannels =
    selectedCategory === "all"
      ? channels
      : channels.filter((c) => c.category === selectedCategory);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP DISCLAIMER WITH EXPLICIT REVENUE CAVEAT */}
      <DemoDisclaimer text="Illustrative Revenue Models: Price ranges, CPM benchmarks, and earning potentials are illustrative models based on category averages. They do not constitute financial guarantees or verified historical payouts. Connect verified accounts for empirical revenue tracking." />

      {/* 2. STRATEGIC HEADER & HACKATHON DEMO SWITCHER */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="emerald" size="sm">
                Monetisation Engine
              </Badge>
              <span className="text-xs text-slate-400 font-medium">•</span>
              <span className="text-xs text-slate-600 font-medium">
                {activeCreator.primaryPlatform} • {activeCreator.niche} • {activeCreator.followerCount.toLocaleString()} followers
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Monetisation Pathways & Viability Evaluation
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Evaluated across 5 diversified revenue models for <strong className="text-slate-900 font-semibold">{activeCreator.name}</strong> to scale toward the target of{" "}
              <strong className="text-emerald-700 font-semibold">₹{activeCreator.monthlyIncomeTarget.toLocaleString()} / month</strong>.
            </p>
          </div>

          {/* Quick Demo Switcher & Saved Counter */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            {/* Hackathon Preset Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 px-1.5 uppercase tracking-wider">
                Switch Demo:
              </span>
              <button
                type="button"
                onClick={() => switchCreator("rahul")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  activeCreatorId === "rahul"
                    ? "bg-white text-blue-700 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ⚡ Rahul (Fitness)
              </button>
              <button
                type="button"
                onClick={() => switchCreator("priya")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  activeCreatorId === "priya"
                    ? "bg-white text-indigo-700 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ⚡ Priya (Finance)
              </button>
            </div>

            {/* Saved Pathways Counter Pill */}
            <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                Saved Pathways:
              </span>
              <span className="font-bold text-slate-900 font-mono">
                {savedChannelIds.length} of {channels.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CATEGORY FILTER TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                selectedCategory === cat.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* 4. IMPORTANT REVENUE NOTICE STRIP */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs shadow-2xs">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Illustrative Pricing Benchmarks: </strong>
          The benchmark fee ranges shown below (e.g., ₹12,000–₹18,000 per sponsored Reel or ₹4,999 per advisory session) represent realistic creator industry benchmarks for {activeCreator.followerCount.toLocaleString()} {activeCreator.primaryPlatform} creators with {activeCreator.engagementRate}% engagement. They are illustrative reference ranges, never guaranteed contract amounts.
        </div>
      </div>

      {/* 5. MONETISATION PATHWAYS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredChannels.map((channel) => {
          const isSaved = savedChannelIds.includes(channel.id);
          const isExpanded = !!expandedCards[channel.id];
          const isQueued = actions.some((a) => a.title === `Execute Launch: ${channel.title}`);

          return (
            <Card
              key={channel.id}
              className={`flex flex-col justify-between overflow-hidden border transition-all duration-200 ${
                isSaved
                  ? "border-blue-300 ring-1 ring-blue-500/20 shadow-xs"
                  : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              {/* TOP HEADER */}
              <div className="p-5 pb-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant="blue" size="sm">
                        {channel.badge}
                      </Badge>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {channel.complexity} Complexity
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {channel.readinessStatus}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {channel.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{channel.subtitle}</p>
                  </div>

                  {/* Relative Suitability Gauge & Save Bookmark Button */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        channel.suitabilityScore >= 90
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-blue-50 text-blue-800 border-blue-200"
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{channel.suitabilityScore}% Match</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSaveChannel(channel.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "bg-white text-slate-400 hover:text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                      title={isSaved ? "Saved to portfolio" : "Save pathway"}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Relative Suitability Explanation */}
                {channel.suitabilityExplanation && (
                  <div className="mt-3 p-2.5 rounded-lg bg-blue-50/60 border border-blue-200/60 text-xs text-blue-900 leading-relaxed">
                    <strong className="font-bold text-blue-800">Suitability Assessment: </strong>
                    {channel.suitabilityExplanation}
                  </div>
                )}
              </div>

              {/* BODY CONTENT */}
              <div className="p-5 space-y-4 flex-1">
                {/* 1. WHY IT SUITS THIS CREATOR */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> Why this suits {activeCreator.name.split(" ")[0]}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    {channel.whyItSuits}
                  </p>
                </div>

                {/* 2. ILLUSTRATIVE PRICING & REVENUE BENCHMARK */}
                <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                      Illustrative Earning Potential
                    </span>
                    <p className="text-xs sm:text-sm font-extrabold text-emerald-950 font-mono mt-0.5">
                      {channel.estimatedPotential}
                    </p>
                  </div>

                  {channel.illustrativePriceRange && (
                    <div className="sm:text-right">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Illustrative Benchmark Range
                      </span>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">
                        {channel.illustrativePriceRange}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. PREREQUISITES OR SKILLS NEEDED */}
                {channel.prerequisites && channel.prerequisites.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-600" /> Prerequisites & Skills Needed
                    </h4>
                    <div className="space-y-1.5">
                      {channel.prerequisites.map((prereq, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-600 leading-snug bg-slate-50/70 p-2 rounded-lg border border-slate-100"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{prereq}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. POTENTIAL RISKS OR LIMITATIONS */}
                {channel.potentialRisks && (
                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 text-xs text-amber-900 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-amber-800">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      Potential Risks & Practical Limitations
                    </span>
                    <p className="text-[11px] text-amber-800 leading-relaxed pl-5">
                      {channel.potentialRisks}
                    </p>
                  </div>
                )}

                {/* EXPANDABLE LAUNCH CHECKLIST */}
                {isExpanded && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 animate-fadeIn">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Step-by-Step Launch Checklist
                    </h4>
                    <div className="space-y-1.5">
                      {channel.launchChecklist.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-slate-600 p-2 rounded-lg bg-slate-50"
                        >
                          <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER: SUGGESTED FIRST STEP & ACTION CONTROLS */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-3">
                <div className="flex items-start justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-blue-600 block">
                      Suggested First Step:
                    </span>
                    <p className="font-semibold text-slate-800 text-xs leading-snug mt-0.5">
                      {channel.suggestedFirstStep}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(channel.id)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 shrink-0 mt-1"
                  >
                    <span>{isExpanded ? "Hide Steps" : "View Checklist"}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Functional Action Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => handleCreateActionItem(channel)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                      isQueued
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isQueued ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        <span>Queued in Action Centre</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add to Action Centre</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSaveChannel(channel.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                      isSaved
                        ? "bg-white text-blue-700 border-blue-200 font-bold"
                        : "bg-white text-slate-600 hover:text-slate-900 border-slate-200"
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{isSaved ? "Saved" : "Save"}</span>
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

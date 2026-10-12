"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCreator } from "@/context/CreatorContext";
import {
  Sparkles,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  ArrowRight,
  Play,
} from "lucide-react";

interface DemoStep {
  step: number;
  label: string;
  creatorId: "rahul" | "priya";
  path: string;
  description: string;
  highlight: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    label: "1. Select Rahul (Fitness)",
    creatorId: "rahul",
    path: "/",
    description: "Initialize Rahul Sharma (15k Instagram followers • Fitness & Nutrition).",
    highlight: "Shows student fitness executive briefing, 4.8% engagement rate, and campus growth targets.",
  },
  {
    step: 2,
    label: "2. Personalized Roadmap",
    creatorId: "rahul",
    path: "/roadmap",
    description: "Review Rahul's 30/60/90-day growth plan tailored to student fitness.",
    highlight: "Positioning statement, content gaps (dorm workouts), skill priorities, and interactive milestone checklist.",
  },
  {
    step: 3,
    label: "3. Monetisation Pathways",
    creatorId: "rahul",
    path: "/monetisation",
    description: "Explore 5 commercial pathways tailored to student fitness.",
    highlight: "Brand deals (92% suitability), supplement affiliate codes, and ₹299 dorm meal prep digital guide.",
  },
  {
    step: 4,
    label: "4. Fitness Campaign & Eligibility",
    creatorId: "rahul",
    path: "/opportunities",
    description: "Inspect brand briefs matching Rahul's niche and audience.",
    highlight: "MyProtein India (96% Match, Verified Eligible) vs Wint Wealth (Ineligible: LinkedIn required).",
  },
  {
    step: 5,
    label: "5. Apply & Track Action",
    creatorId: "rahul",
    path: "/actions",
    description: "View the prioritized Action Centre with linked opportunities and roadmap tasks.",
    highlight: "Working status transitions (Not started, In progress, Completed), live progress velocity, and follow-up tracking.",
  },
  {
    step: 6,
    label: "6. Switch to Priya (Finance)",
    creatorId: "priya",
    path: "/",
    description: "Switch active persona to Priya Nair (8k LinkedIn followers • Personal Finance).",
    highlight: "Dashboard instantly adapts: salaried audience, B2B consulting pipeline, and corporate metrics.",
  },
  {
    step: 7,
    label: "7. Compare Differing Fit & Deals",
    creatorId: "priya",
    path: "/opportunities",
    description: "Notice how recommendations completely invert for Priya.",
    highlight: "Wint Wealth (97% Match) & Zerodha Varsity (95% Match) are top eligible deals; Cult.fit is strictly Ineligible.",
  },
];

export function HackathonDemoBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeCreatorId, switchCreator, resetAllDemoData, isDemoMode } = useCreator();
  const [isOpen, setIsOpen] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Synchronize step index with current pathname and active persona
  useEffect(() => {
    if (activeCreatorId === "rahul") {
      if (pathname === "/") setActiveStepIndex(0);
      else if (pathname === "/roadmap") setActiveStepIndex(1);
      else if (pathname === "/monetisation") setActiveStepIndex(2);
      else if (pathname === "/opportunities") setActiveStepIndex(3);
      else if (pathname === "/actions") setActiveStepIndex(4);
    } else if (activeCreatorId === "priya") {
      if (pathname === "/") setActiveStepIndex(5);
      else if (pathname === "/opportunities") setActiveStepIndex(6);
    }
  }, [pathname, activeCreatorId]);

  const handleRunStep = (index: number) => {
    const s = DEMO_STEPS[index];
    setActiveStepIndex(index);
    if (activeCreatorId !== s.creatorId) {
      switchCreator(s.creatorId);
    }
    if (pathname !== s.path) {
      router.push(s.path);
    }
  };

  const handleNextStep = () => {
    const nextIdx = (activeStepIndex + 1) % DEMO_STEPS.length;
    handleRunStep(nextIdx);
  };

  const currentStep = DEMO_STEPS[activeStepIndex];

  return (
    <div className="bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800/80 overflow-hidden text-xs transition-all mb-4">
      {/* Top Banner Row */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-white text-xs tracking-tight">
              Hackathon Demo Tour
            </span>
            {isDemoMode ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-950/70 border border-amber-800/80 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Demo Mode (Offline)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live Cloud
              </span>
            )}
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Step {currentStep.step} of 7: <strong className="text-slate-200">{currentStep.label}</strong>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRunStep(activeStepIndex)}
            className="btn-tactile px-3 py-1.5 rounded-full bg-[#0870e8] hover:bg-[#065ec4] text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs"
            title="Execute current step"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Go to Step {currentStep.step}</span>
          </button>

          <button
            onClick={handleNextStep}
            className="btn-tactile px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] flex items-center gap-1 border border-slate-700"
            title="Advance to next demo step"
          >
            <span>Next</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => resetAllDemoData()}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reset all demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 px-2.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-medium"
          >
            <span>{isOpen ? "Hide Steps" : "View All 7 Steps"}</span>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded 7-Step Navigation Drawer */}
      {isOpen && (
        <div className="px-4 sm:px-5 py-3.5 bg-slate-950/90 border-t border-slate-800 space-y-2.5">
          <p className="text-[11px] text-slate-400">
            Click any step below to instantly jump to that point in the hackathon presentation:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
            {DEMO_STEPS.map((s, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <button
                  key={s.step}
                  onClick={() => handleRunStep(idx)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    isActive
                      ? "bg-blue-950/70 border-blue-500 text-white shadow-xs"
                      : "bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>{s.label}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800">
                      {s.creatorId}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {s.highlight}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useCreator } from "@/context/CreatorContext";
import { ConnectAccountModal } from "@/components/platforms/ConnectAccountModal";
import { YouTubeIcon, InstagramIcon, LinkedInIcon } from "@/components/common/PlatformIcons";
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Target,
  ArrowRight,
  Zap,
  Layers,
  Lock,
} from "lucide-react";

interface ConnectProfilePromptProps {
  title?: string;
  subtitle?: string;
  feature?: "overview" | "roadmap" | "monetisation" | "opportunities" | "actions" | "workflow" | "profile";
}

export function ConnectProfilePrompt({
  title = "Connect Your Creator Profile to Get Started",
  subtitle = "Link your public YouTube channel, Instagram handle, or LinkedIn profile. Creator Engine will automatically import your verified metrics, analyze audience signals, and generate your customized strategy.",
  feature = "overview",
}: ConnectProfilePromptProps) {
  const { importPlatformCreator } = useCreator();
  const [modalOpen, setModalOpen] = useState(false);

  const featureDetails: Record<string, { badge: string; highlight: string }> = {
    overview: {
      badge: "Real-Time Intelligence",
      highlight: "Unlock live impression velocity, reach trajectories, and high-compatibility brand sponsorship matches.",
    },
    roadmap: {
      badge: "Personalized Execution",
      highlight: "Generate a custom 30/60/90-day growth roadmap with content gap detection and skill priorities for your specific platform.",
    },
    monetisation: {
      badge: "Revenue Engine",
      highlight: "Calculate dynamic rate cards and suitability scores across 5 monetization streams based on your actual follower count.",
    },
    opportunities: {
      badge: "Brand Sponsorships",
      highlight: "Calculate verified compatibility scores for brand campaign briefs and apply with 1 click using auto-generated pitches.",
    },
    actions: {
      badge: "Execution Centre",
      highlight: "Receive prioritized next steps calibrated to grow your specific channel, resolve bottlenecks, and close brand deals.",
    },
    workflow: {
      badge: "Deal Automation",
      highlight: "Generate personalized cold pitch proposals, ASCI compliance checks, and automated invoice deliverables.",
    },
    profile: {
      badge: "Live Media Kit",
      highlight: "Publish a verified, shareable media kit with live platform statistics directly from official platform APIs.",
    },
  };

  const currentInfo = featureDetails[feature] || featureDetails.overview;

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/40 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 sm:p-10 text-center transition-all">
        {/* Background decorative glows */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto space-y-6">
          {/* Platform Icon Badge Cluster */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Multi-Platform Analysis
            </span>
            <div className="h-3 w-px bg-slate-200 mx-1" />
            <div className="flex items-center gap-2">
              <YouTubeIcon className="w-4 h-4 text-red-600" />
              <InstagramIcon className="w-4 h-4 text-pink-600" />
              <LinkedInIcon className="w-4 h-4 text-blue-600" />
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-2.5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
              {subtitle}
            </p>
          </div>

          {/* Feature Highlight Pill */}
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-slate-200/80 shadow-2xs max-w-lg mx-auto text-left flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#0870e8]/10 text-[#0870e8] shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0870e8]">
                {currentInfo.badge}
              </span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed mt-0.5">
                {currentInfo.highlight}
              </p>
            </div>
          </div>

          {/* Connect Action CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-tactile w-full sm:w-auto px-7 py-3 rounded-full bg-[#0870e8] hover:bg-[#0760cb] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Connect Live Profile</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Guarantees */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-semibold pt-1 flex-wrap">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official Public API & Scrapers
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> No Password Required
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-500" /> Instant Strategic Calibration
            </span>
          </div>
        </div>
      </div>

      <ConnectAccountModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAccountImported={async (metrics) => {
          await importPlatformCreator(metrics);
        }}
      />
    </>
  );
}

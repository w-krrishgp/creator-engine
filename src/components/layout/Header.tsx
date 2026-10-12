"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useCreator } from "@/context/CreatorContext";
import {
  Menu,
  X,
  Share2,
  SlidersHorizontal,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { PlanBadge } from "@/components/subscription/PlanBadge";

export function Header() {
  const pathname = usePathname();
  const { activeCreatorId, activeCreator, switchCreator, showToast, isDemoMode } = useCreator();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageInfo = () => {
    switch (pathname) {
      case "/":
        return {
          title: "Executive Overview",
          subtitle: "Performance intelligence & strategic next steps",
          tag: "Intelligence",
        };
      case "/profile":
        return {
          title: "My Profile & Media Kit",
          subtitle: "Positioning parameters, platform metrics & verified rates",
          tag: "Identity",
        };
      case "/roadmap":
        return {
          title: "Growth Roadmap",
          subtitle: "30 / 60 / 90-day phased execution plan & market benchmarks",
          tag: "Strategy",
        };
      case "/monetisation":
        return {
          title: "Monetisation Engine",
          subtitle: "5 diversified revenue channels & realistic viability models",
          tag: "Revenue",
        };
      case "/opportunities":
        return {
          title: "Brand Marketplace",
          subtitle: "Vetted campaign briefs with deterministic compatibility scoring",
          tag: "Marketplace",
        };
      case "/workflow":
        return {
          title: "Workflow Engine",
          subtitle: "Standardized 5-step SOP, pitch templates & ASCI compliance",
          tag: "Operations",
        };
      case "/actions":
        return {
          title: "Action Centre",
          subtitle: "Prioritized execution queue & momentum tracker",
          tag: "Execution",
        };
      case "/onboarding":
        return {
          title: "Creator Onboarding Wizard",
          subtitle: "5-stage guided setup for positioning, audience, channels & revenue targets",
          tag: "Setup",
        };
      case "/pricing":
        return {
          title: "Pricing & Memberships",
          subtitle: "Transparent creator subscription tiers, quotas, and limits",
          tag: "Pricing",
        };
      default:
        return {
          title: "Creator Engine",
          subtitle: "Creator Growth & Brand Opportunity Engine",
          tag: "Dashboard",
        };
    }
  };

  const { title, subtitle, tag } = getPageInfo();

  const handleCopyMediaKit = () => {
    navigator.clipboard.writeText(activeCreator.mediaKitLink || "https://creator-engine.demo");
    showToast(`Media kit link copied for ${activeCreator.name}!`, "success");
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#fafafa]/85 backdrop-blur-md border-b border-slate-200/75 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between transition-colors">
        {/* Left: Mobile menu button & Page Breadcrumb / Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {tag}
              </span>
              <span className="text-slate-300">•</span>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                {title}
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block leading-tight mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Contextual Actions & Persona Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Current Membership Plan */}
          <PlanBadge size="sm" linkToPricing />

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-[11px] font-medium shadow-2xs">
            {isDemoMode ? (
              <span className="flex items-center gap-1.5 text-amber-700 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Demo Mode
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Cloud
              </span>
            )}
          </div>

          {/* Primary Action Button: Share Media Kit */}
          <button
            onClick={handleCopyMediaKit}
            className="btn-tactile hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all"
            title="Share verified media kit link"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share Media Kit</span>
          </button>

          {/* Compact Persona Pill Switcher */}
          <div className="flex items-center bg-slate-200/60 p-0.5 rounded-full border border-slate-200/70 text-xs">
            <span className="text-[10px] font-semibold text-slate-400 px-2 hidden lg:inline-flex items-center gap-1">
              <SlidersHorizontal className="w-2.5 h-2.5" /> Persona:
            </span>
            <button
              onClick={() => switchCreator("rahul")}
              className={`btn-tactile px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                activeCreatorId === "rahul"
                  ? "bg-white text-slate-900 font-bold shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Rahul (IG)</span>
            </button>
            <button
              onClick={() => switchCreator("priya")}
              className={`btn-tactile px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                activeCreatorId === "priya"
                  ? "bg-white text-slate-900 font-bold shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0870e8] shrink-0" />
              <span>Priya (LI)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-200">
            <div className="p-3.5 flex justify-end border-b border-slate-100">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar onMobileClose={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

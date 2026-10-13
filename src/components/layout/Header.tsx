"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useCreator } from "@/context/CreatorContext";
import {
  Menu,
  X,
  Share2,
  SlidersHorizontal,
  Plus,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { PlanBadge } from "@/components/subscription/PlanBadge";
import { ConnectAccountModal } from "@/components/platforms/ConnectAccountModal";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const {
    activeCreatorId,
    activeCreator,
    allCreators,
    switchCreator,
    showToast,
    isDemoMode,
    importPlatformCreator,
  } = useCreator();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  const handlePersonaClick = (id: string) => {
    if (activeCreatorId === id) {
      showToast(`Already viewing ${allCreators[id]?.name || id}'s workspace`, "info");
      return;
    }
    switchCreator(id);
  };

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
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {tag}
              </span>
              <span className="text-slate-300">•</span>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {title}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 hidden sm:block leading-tight mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Contextual Actions & Persona Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Current Membership Plan */}
          <PlanBadge size="sm" linkToPricing />

          {/* Theme Light/Dark Mode Switch */}
          <ThemeToggle />

          {/* Status Indicator / Go Live Button */}
          {isDemoMode ? (
            <button
              type="button"
              onClick={() => setConnectModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-800 shadow-2xs cursor-pointer transition-all btn-tactile"
              title="Currently viewing demo persona. Click to connect your live YouTube or LinkedIn account!"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Demo Mode</span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-amber-200/90 text-amber-900 rounded font-black">
                Go Live →
              </span>
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Live Account</span>
            </div>
          )}

          {/* Connect Live Profile Button */}
          <button
            type="button"
            onClick={() => setConnectModalOpen(true)}
            className="btn-tactile inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0870e8] hover:bg-[#0760cb] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            title="Connect your real YouTube, Instagram, or LinkedIn account"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Connect Live Profile</span>
            <span className="sm:hidden">Connect</span>
          </button>

          {/* Primary Action Button: Share Media Kit */}
          <button
            onClick={handleCopyMediaKit}
            className="btn-tactile hidden lg:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all"
            title="Share verified media kit link"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share Media Kit</span>
          </button>

          {/* Compact Persona Pill Switcher */}
          <div className="flex items-center bg-slate-200/60 p-0.5 rounded-full border border-slate-200/70 text-xs">
            <span className="text-xs font-semibold text-slate-400 px-2 hidden lg:inline-flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-[#0870e8]" /> Persona:
            </span>
            {activeCreatorId !== "rahul" && activeCreatorId !== "priya" && (
              <button
                className="btn-tactile px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all flex items-center gap-1.5 bg-emerald-600 text-white font-bold shadow-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                <span className="truncate max-w-[100px]">{activeCreator.name}</span>
              </button>
            )}
            <button
              onClick={() => handlePersonaClick("rahul")}
              className={`btn-tactile px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                activeCreatorId === "rahul"
                  ? "bg-white text-slate-900 font-bold shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Rahul (IG)</span>
            </button>
            <button
              onClick={() => handlePersonaClick("priya")}
              className={`btn-tactile px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
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

      {/* Connect Real Creator Profile Modal */}
      <ConnectAccountModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        onAccountImported={(metrics) => {
          importPlatformCreator(metrics);
        }}
      />
    </>
  );
}

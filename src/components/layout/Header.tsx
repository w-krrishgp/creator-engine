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
  Trash2,
  AlertTriangle,
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
    disconnectPlatformCreator,
    showToast,
    isDemoMode,
    importPlatformCreator,
  } = useCreator();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<{ id: string; name: string } | null>(null);

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
      case "/dashboard":
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
    if (!activeCreator) return;
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

          {/* Status Indicator (Only shown if active creator is connected) */}
          {activeCreator && (
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
          {activeCreator && (
            <button
              onClick={handleCopyMediaKit}
              className="btn-tactile hidden lg:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all"
              title="Share verified media kit link"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Share Media Kit</span>
            </button>
          )}

          {/* Account Indicator / Switcher */}
          {(() => {
            if (!activeCreator) return null;
            const availableIds = Object.keys(allCreators).filter(
              (id) => id !== "rahul" && id !== "priya"
            );
            if (availableIds.length <= 1) {
              return (
                <div className="hidden sm:flex items-center bg-slate-100 p-1 px-3 rounded-full border border-slate-200/70 text-xs font-semibold text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shrink-0" />
                  <span className="truncate max-w-[120px] font-bold text-slate-900">{activeCreator?.name || "Creator"}</span>
                </div>
              );
            }
            return (
              <div className="hidden sm:flex items-center bg-slate-200/60 p-0.5 rounded-full border border-slate-200/70 text-xs">
                {availableIds.map((id) => (
                  <div
                    key={id}
                    className={`inline-flex items-center rounded-full text-xs transition-all ${
                      activeCreatorId === id
                        ? "bg-white text-slate-900 font-bold shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900 font-medium"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handlePersonaClick(id)}
                      className="px-2.5 py-1.5 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate max-w-[95px]">{allCreators[id]?.name || id}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileToDelete({ id, name: allCreators[id]?.name || id });
                      }}
                      className="pr-2 pl-0.5 py-1.5 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                      title={`Disconnect ${allCreators[id]?.name || "creator"}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            );
          })()}
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

      {/* Disconnect Profile Confirmation Dialog */}
      {profileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl space-y-5 text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Disconnect Creator Profile?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to disconnect <strong className="text-slate-900">{profileToDelete.name}</strong> from Creator Engine? All metrics and tailored opportunities for this persona will be removed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProfileToDelete(null)}
                className="btn-tactile px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  disconnectPlatformCreator(profileToDelete.id);
                  setProfileToDelete(null);
                }}
                className="btn-tactile px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                Disconnect Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

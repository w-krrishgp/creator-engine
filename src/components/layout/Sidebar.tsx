"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCreator } from "@/context/CreatorContext";
import {
  LayoutDashboard,
  UserCheck,
  TrendingUp,
  Banknote,
  Briefcase,
  CheckSquare,
  Workflow,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  CreditCard,
  Plus,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { PlanBadge } from "@/components/subscription/PlanBadge";
import { ConnectAccountModal } from "@/components/platforms/ConnectAccountModal";

interface SidebarProps {
  onMobileClose?: () => void;
}

export function Sidebar({ onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const {
    activeCreatorId,
    activeCreator,
    allCreators,
    switchCreator,
    disconnectPlatformCreator,
    showToast,
    profileCompletion,
    completedActionsCount,
    totalActionsCount,
    appliedOpportunitiesCount,
    currentPlanId,
    currentPlan,
    isDemoMode,
    importPlatformCreator,
  } = useCreator();
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<{ id: string; name: string } | null>(null);

  const handlePersonaClick = (id: string) => {
    if (activeCreatorId === id) {
      showToast(`Already viewing ${allCreators[id]?.name || id}'s workspace`, "info");
      return;
    }
    switchCreator(id);
  };

  // Navigation ordered as requested: Overview, Opportunities, My Applications, Creator Profile, Analytics, Settings
  const navItems = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Opportunities",
      href: "/opportunities",
      icon: Briefcase,
      badge: activeCreator ? (appliedOpportunitiesCount > 0 ? `${appliedOpportunitiesCount} Applied` : "8 Deals") : null,
      badgeColor: appliedOpportunitiesCount > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold" : "bg-blue-50 text-[#0870e8] border-blue-200/80 font-bold",
    },
    {
      name: "My Applications",
      href: "/opportunities?status=applied",
      icon: Briefcase,
      badge: appliedOpportunitiesCount > 0 ? String(appliedOpportunitiesCount) : null,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold",
    },
    {
      name: "Creator Profile",
      href: "/profile",
      icon: UserCheck,
      badge: activeCreator ? `${profileCompletion}%` : null,
      badgeColor: profileCompletion >= 90 ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold" : "bg-blue-50 text-[#0870e8] border-blue-200/80 font-bold",
    },
    {
      name: "Analytics",
      href: "/roadmap",
      icon: TrendingUp,
      badge: "30-60-90",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200/80",
    },
    {
      name: "Settings",
      href: "/subscription",
      icon: SlidersHorizontal,
      badge: "Manage",
      badgeColor: "bg-slate-100 text-slate-600 border-slate-200/80",
    },
    {
      name: "Monetisation",
      href: "/monetisation",
      icon: Banknote,
      badge: "5 Channels",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200/80",
    },
    {
      name: "Workflow",
      href: "/workflow",
      icon: Workflow,
      badge: "SOP",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    },
    {
      name: "Actions",
      href: "/actions",
      icon: CheckSquare,
      badge: activeCreator ? `${completedActionsCount}/${totalActionsCount}` : null,
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200/80 font-mono",
    },
  ];

  const isDashboard = pathname === "/dashboard";

  return (
    <aside
      className={`w-64 flex flex-col h-full select-none transition-colors ${
        isDashboard
          ? "bg-[#0B0F19] border-r border-white/[0.08] text-slate-200"
          : "bg-white border-r border-slate-200/75 text-slate-900"
      }`}
    >
      {/* Brand Logo & Wordmark Header */}
      <div
        className={`p-4 px-5 border-b flex items-center justify-between ${
          isDashboard ? "border-white/[0.08]" : "border-slate-100"
        }`}
      >
        <Link
          href={activeCreator ? "/dashboard" : "/"}
          className="flex items-center gap-2.5 group"
          onClick={onMobileClose}
        >
          {/* Instagram Gradient Logo Mark */}
          <div className="w-8 h-8 rounded-xl story-ring-gradient flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span
                className={`font-extrabold tracking-tight text-sm ${
                  isDashboard ? "text-white" : "text-slate-900"
                }`}
              >
                CREATOR<span className="text-[#0870e8]">ENGINE</span>
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
              Creator Suite
            </span>
          </div>
        </Link>
        <span
          className={`text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
            isDashboard
              ? "bg-white/[0.06] text-slate-300 border-white/[0.1]"
              : "bg-slate-100 text-slate-700 border-slate-200/80"
          }`}
        >
          PRO
        </span>
      </div>

      {/* Account Persona Switcher */}
      <div
        className={`px-3.5 py-3 border-b ${
          isDashboard ? "border-white/[0.08] bg-white/[0.02]" : "border-slate-100 bg-slate-50/40"
        }`}
      >
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-[#0870e8]" /> Active Creator
          </span>
          {activeCreator ? (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
          ) : (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                isDashboard
                  ? "text-slate-400 bg-white/[0.04] border-white/[0.08]"
                  : "text-slate-500 bg-slate-100 border-slate-200"
              }`}
            >
              Not Connected
            </span>
          )}
        </div>

        {/* Active Account Summary Card */}
        {activeCreator ? (
          <div
            className={`mb-2 p-2.5 rounded-xl border flex items-center justify-between gap-2 shadow-2xs ${
              isDashboard ? "bg-white/[0.04] border-white/[0.08]" : "bg-white border-slate-200/80"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-full overflow-hidden shrink-0 border ${
                  isDashboard ? "border-white/[0.1]" : "border-slate-200"
                }`}
              >
                <img
                  src={
                    activeCreator.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop"
                  }
                  alt={activeCreator.name || "Creator"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p
                  className={`text-xs font-extrabold truncate ${
                    isDashboard ? "text-white" : "text-slate-900"
                  }`}
                >
                  {activeCreator.name}
                </p>
                <p className="text-[11px] text-slate-400 font-semibold truncate font-mono">
                  {activeCreator.handle}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              Active
            </span>
          </div>
        ) : (
          <div
            className={`mb-2 p-3 rounded-xl border border-dashed text-center space-y-1 ${
              isDashboard
                ? "bg-white/[0.02] border-white/[0.08]"
                : "bg-white/70 border-slate-200"
            }`}
          >
            <p className={`text-xs font-bold ${isDashboard ? "text-white" : "text-slate-800"}`}>
              No Profile Connected
            </p>
            <p className="text-[11px] text-slate-400 leading-tight">
              Connect a live profile to view tailored data.
            </p>
          </div>
        )}

        {/* Multi-Account Switcher (if more than 1 account connected) */}
        {(() => {
          const availableIds = Object.keys(allCreators).filter(
            (id) => id !== "rahul" && id !== "priya"
          );
          if (availableIds.length <= 1) return null;
          return (
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Connected Profiles
              </span>
              <div className="flex flex-col gap-1">
                {availableIds.map((cId) => (
                  <div
                    key={cId}
                    className={`group flex items-center justify-between rounded-lg border text-xs font-semibold transition-all ${
                      activeCreatorId === cId
                        ? "bg-[#0870e8] text-white border-blue-600"
                        : isDashboard
                        ? "bg-white/[0.04] text-slate-300 border-white/[0.08] hover:bg-white/[0.08]"
                        : "bg-white text-slate-700 border border-slate-200/60 hover:bg-slate-50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handlePersonaClick(cId)}
                      className="flex-1 px-2.5 py-1.5 text-left flex items-center justify-between min-w-0 cursor-pointer"
                    >
                      <span className="truncate">{allCreators[cId]?.name || cId}</span>
                      <span className="text-[10px] opacity-75 shrink-0 ml-1.5">
                        {allCreators[cId]?.primaryPlatform}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileToDelete({ id: cId, name: allCreators[cId]?.name || cId });
                      }}
                      className={`p-1.5 rounded-md mr-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer ${
                        activeCreatorId === cId
                          ? "hover:bg-blue-700 text-white"
                          : "hover:bg-rose-500/10 text-slate-400 hover:text-rose-400"
                      }`}
                      title={`Disconnect ${allCreators[cId]?.name || "creator"}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Connect Live Profile Button */}
        <button
          type="button"
          onClick={() => setConnectModalOpen(true)}
          className={`mt-2 w-full py-1.5 px-2.5 rounded-xl border border-dashed text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs btn-tactile ${
            isDashboard
              ? "border-[#0870e8]/40 bg-[#0870e8]/10 hover:bg-[#0870e8]/20 text-blue-400"
              : "border-[#0870e8]/50 bg-blue-50/50 hover:bg-blue-50 hover:border-[#0870e8] text-[#0870e8]"
          }`}
          title="Connect real YouTube, Instagram, or LinkedIn profile"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Connect Live Profile</span>
        </button>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group ${
                isActive
                  ? isDashboard
                    ? "bg-[#0870e8]/15 text-blue-400 font-bold border border-[#0870e8]/30 shadow-[0_0_12px_rgba(8,112,232,0.15)]"
                    : "bg-blue-50/90 text-[#0870e8] font-bold border border-blue-200/60 shadow-[0_1px_2px_rgba(8,112,232,0.06)]"
                  : isDashboard
                  ? "text-slate-400 hover:bg-white/[0.04] hover:text-white font-medium"
                  : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 font-medium"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 transition-colors shrink-0 ${
                    isActive
                      ? isDashboard
                        ? "text-blue-400"
                        : "text-[#0870e8]"
                      : isDashboard
                      ? "text-slate-500 group-hover:text-slate-300"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs border tracking-tight shrink-0 font-medium ${
                    isDashboard
                      ? "bg-white/[0.06] text-slate-300 border-white/[0.1]"
                      : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile Card & Readiness Meter at Bottom */}
      {activeCreator ? (
        <div
          className={`p-3 border-t space-y-2.5 ${
            isDashboard ? "border-white/[0.08] bg-white/[0.02]" : "border-slate-100 bg-slate-50/40"
          }`}
        >
          <div
            className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2.5 ${
              isDashboard ? "bg-white/[0.04] border-white/[0.08]" : "bg-white border-slate-200/75 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Avatar with Story Gradient Ring */}
              <div className="p-[1.5px] rounded-full story-ring-gradient shrink-0">
                <div
                  className={`w-9 h-9 rounded-full p-[1.5px] overflow-hidden ${
                    isDashboard ? "bg-[#0B0F19]" : "bg-white"
                  }`}
                >
                  <img
                    src={
                      activeCreator.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop"
                    }
                    alt={activeCreator.name || "Creator"}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p
                    className={`text-sm font-bold truncate leading-tight ${
                      isDashboard ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {activeCreator.name}
                  </p>
                  <PlanBadge size="xs" linkToPricing />
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5 font-mono">
                  {activeCreator.handle?.startsWith("@")
                    ? activeCreator.handle
                    : `@${activeCreator.handle || "creator"}`}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    AI Active
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/profile"
              onClick={onMobileClose}
              className={`p-1.5 rounded-full transition-colors shrink-0 ${
                isDashboard
                  ? "hover:bg-white/[0.08] text-slate-400 hover:text-white"
                  : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              }`}
              title="Edit Profile"
            >
              <CheckCircle2 className="w-4 h-4 text-[#0870e8]" />
            </Link>
          </div>

          {/* Profile Strength Meter */}
          <div className="px-1 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <Link
                href="/onboarding"
                onClick={onMobileClose}
                className="font-semibold text-slate-400 hover:text-[#0870e8] flex items-center gap-1 group transition-colors"
              >
                <span>Profile Strength</span>
                <Sparkles className="w-3 h-3 text-[#0870e8] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <span
                className={`font-bold font-mono text-xs ${
                  isDashboard ? "text-white" : "text-slate-800"
                }`}
              >
                {profileCompletion}%
              </span>
            </div>
            <div
              className={`w-full h-2 rounded-full overflow-hidden ${
                isDashboard ? "bg-white/[0.08]" : "bg-slate-200/80"
              }`}
            >
              <div
                className="h-full bg-[#0870e8] rounded-full transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>

          {/* Quick Launch Onboarding Button */}
          <Link
            href="/onboarding"
            onClick={onMobileClose}
            className={`btn-tactile w-full py-2 px-3 rounded-full border text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors ${
              isDashboard
                ? "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-blue-400"
                : "bg-blue-50/80 hover:bg-blue-100/80 border-blue-200/70 text-[#0870e8]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0870e8]" />
            <span>Launch Onboarding</span>
          </Link>
        </div>
      ) : (
        <div
          className={`p-3 border-t ${
            isDashboard ? "border-white/[0.08] bg-white/[0.02]" : "border-slate-100 bg-slate-50/40"
          }`}
        >
          <button
            type="button"
            onClick={() => setConnectModalOpen(true)}
            className="btn-tactile w-full py-2.5 px-3 rounded-2xl bg-[#0870e8] hover:bg-[#0760cb] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Connect Live Profile</span>
          </button>
        </div>
      )}

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
          <div className="bg-[#0C101B] rounded-3xl border border-white/[0.1] max-w-sm w-full p-6 shadow-2xl space-y-5 text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white tracking-tight">
                Disconnect Creator Profile?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to disconnect <strong className="text-white">{profileToDelete.name}</strong> from Creator Engine? All synchronized metrics and personalized deals for this creator will be removed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProfileToDelete(null)}
                className="btn-tactile px-4 py-2 rounded-xl border border-white/[0.1] hover:bg-white/[0.06] text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  disconnectPlatformCreator(profileToDelete.id);
                  setProfileToDelete(null);
                }}
                className="btn-tactile px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                Disconnect Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

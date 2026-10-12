"use client";

import React from "react";
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
} from "lucide-react";
import { PlanBadge } from "@/components/subscription/PlanBadge";

interface SidebarProps {
  onMobileClose?: () => void;
}

export function Sidebar({ onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const {
    activeCreatorId,
    activeCreator,
    switchCreator,
    profileCompletion,
    completedActionsCount,
    totalActionsCount,
    appliedOpportunitiesCount,
    currentPlanId,
    currentPlan,
  } = useCreator();

  // Navigation ordered as requested: Home, Roadmap, Monetisation, Opportunities, Workflow, Actions, Profile
  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Roadmap",
      href: "/roadmap",
      icon: TrendingUp,
      badge: "30-60-90",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200/80",
    },
    {
      name: "Monetisation",
      href: "/monetisation",
      icon: Banknote,
      badge: "5 Channels",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200/80",
    },
    {
      name: "Opportunities",
      href: "/opportunities",
      icon: Briefcase,
      badge: appliedOpportunitiesCount > 0 ? `${appliedOpportunitiesCount} Applied` : "8 Deals",
      badgeColor: appliedOpportunitiesCount > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold" : "bg-blue-50 text-[#0870e8] border-blue-200/80 font-bold",
    },
    {
      name: "Workflow",
      href: "/workflow",
      icon: Workflow,
      badge: "SOP",
      badgeColor: "bg-violet-50 text-violet-700 border-violet-200/80",
    },
    {
      name: "Actions",
      href: "/actions",
      icon: CheckSquare,
      badge: `${completedActionsCount}/${totalActionsCount}`,
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200/80 font-mono",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: UserCheck,
      badge: `${profileCompletion}%`,
      badgeColor: profileCompletion >= 90 ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold" : "bg-blue-50 text-[#0870e8] border-blue-200/80 font-bold",
    },
    {
      name: "Pricing",
      href: "/pricing",
      icon: CreditCard,
      badge: currentPlan.name,
      badgeColor:
        currentPlanId === "pro_plus"
          ? "bg-purple-50 text-purple-700 border-purple-200/80 font-bold"
          : currentPlanId === "pro"
          ? "bg-blue-50 text-[#0870e8] border-blue-200/80 font-bold"
          : "bg-slate-100 text-slate-700 border-slate-200/80",
    },
    {
      name: "Billing",
      href: "/subscription",
      icon: SlidersHorizontal,
      badge: "Manage",
      badgeColor: "bg-slate-100 text-slate-600 border-slate-200/80",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/75 flex flex-col h-full select-none">
      {/* Brand Logo & Wordmark Header */}
      <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group" onClick={onMobileClose}>
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
              <span className="font-extrabold tracking-tight text-slate-900 text-sm">
                CREATOR<span className="text-[#0870e8]">ENGINE</span>
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
              Creator Suite
            </span>
          </div>
        </Link>
        <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
          PRO
        </span>
      </div>

      {/* Account Persona Switcher */}
      <div className="px-3.5 py-3 border-b border-slate-100 bg-slate-50/40">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-[#0870e8]" /> Active Creator
          </span>
          <span className="text-xs font-medium text-slate-400">Demo</span>
        </div>

        <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-200/60 rounded-full">
          <button
            onClick={() => switchCreator("rahul")}
            className={`btn-tactile flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs sm:text-sm transition-all ${
              activeCreatorId === "rahul"
                ? "bg-white text-slate-900 font-bold shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">Rahul (IG)</span>
          </button>

          <button
            onClick={() => switchCreator("priya")}
            className={`btn-tactile flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs sm:text-sm transition-all ${
              activeCreatorId === "priya"
                ? "bg-white text-slate-900 font-bold shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#0870e8] shrink-0" />
            <span className="truncate">Priya (LI)</span>
          </button>
        </div>
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
                  ? "bg-blue-50/90 text-[#0870e8] font-bold border border-blue-200/60 shadow-[0_1px_2px_rgba(8,112,232,0.06)]"
                  : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 font-medium"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 transition-colors shrink-0 ${
                    isActive ? "text-[#0870e8]" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs border tracking-tight shrink-0 font-medium ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile Card & Readiness Meter at Bottom */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/40 space-y-2.5">
        <div className="p-2.5 rounded-2xl bg-white border border-slate-200/75 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar with Story Gradient Ring */}
            <div className="p-[1.5px] rounded-full story-ring-gradient shrink-0">
              <div className="w-9 h-9 rounded-full p-[1.5px] bg-white overflow-hidden">
                <img
                  src={activeCreator.avatar}
                  alt={activeCreator.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-sm font-bold text-slate-900 truncate leading-tight">
                  {activeCreator.name}
                </p>
                <PlanBadge size="xs" linkToPricing />
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {activeCreator.followerCount.toLocaleString()} • {activeCreator.primaryPlatform}
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            onClick={onMobileClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
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
              className="font-semibold text-slate-500 hover:text-[#0870e8] flex items-center gap-1 group transition-colors"
            >
              <span>Profile Strength</span>
              <Sparkles className="w-3 h-3 text-[#0870e8] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <span className="font-bold text-slate-800 font-mono text-xs">{profileCompletion}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
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
          className="btn-tactile w-full py-2 px-3 rounded-full bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/70 text-[#0870e8] text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0870e8]" />
          <span>Launch Onboarding</span>
        </Link>
      </div>
    </aside>
  );
}

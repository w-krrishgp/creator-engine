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
  ArrowRightLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Compass,
} from "lucide-react";

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
  } = useCreator();

  const navItems = [
    {
      name: "Overview",
      href: "/",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Creator Profile",
      href: "/profile",
      icon: UserCheck,
      badge: `${profileCompletion}%`,
      badgeColor: profileCompletion >= 90 ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700",
    },
    {
      name: "Growth Roadmap",
      href: "/roadmap",
      icon: TrendingUp,
      badge: "30-60-90",
      badgeColor: "bg-purple-50 text-purple-700",
    },
    {
      name: "Monetisation Engine",
      href: "/monetisation",
      icon: Banknote,
      badge: "5 Channels",
      badgeColor: "bg-amber-50 text-amber-700",
    },
    {
      name: "Opportunities Marketplace",
      href: "/opportunities",
      icon: Briefcase,
      badge: appliedOpportunitiesCount > 0 ? `${appliedOpportunitiesCount} Applied` : "8 Deals",
      badgeColor: appliedOpportunitiesCount > 0 ? "bg-emerald-50 text-emerald-700 font-semibold" : "bg-sky-50 text-sky-700",
    },
    {
      name: "Action Centre",
      href: "/actions",
      icon: CheckSquare,
      badge: `${completedActionsCount}/${totalActionsCount}`,
      badgeColor: "bg-slate-100 text-slate-700 font-mono",
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200/90 flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5 group" onClick={onMobileClose}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-base">Creator Engine</span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">Growth & Brand Monetisation</p>
          </div>
        </Link>
      </div>

      {/* Demo Profile Switcher Widget */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <ArrowRightLeft className="w-3 h-3 text-indigo-500" /> Demo Creator Switcher
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-800">
            Interactive
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/60 rounded-xl">
          <button
            onClick={() => switchCreator("rahul")}
            className={`flex flex-col items-start px-2.5 py-1.5 rounded-lg text-left transition-all ${
              activeCreatorId === "rahul"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/40 font-medium"
            }`}
          >
            <div className="flex items-center gap-1 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Rahul S.</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">Fitness • 15k Insta</span>
          </button>

          <button
            onClick={() => switchCreator("priya")}
            className={`flex flex-col items-start px-2.5 py-1.5 rounded-lg text-left transition-all ${
              activeCreatorId === "priya"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/40 font-medium"
            }`}
          >
            <div className="flex items-center gap-1 text-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>Priya N.</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">Finance • 8k In</span>
          </button>
        </div>

        {/* Current Active Creator Quick Card */}
        <div className="mt-2.5 flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
          <img
            src={activeCreator.avatar}
            alt={activeCreator.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate">{activeCreator.name}</p>
            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
              <span>{activeCreator.primaryPlatform}</span>
              <span>•</span>
              <span className="font-semibold text-slate-700">{activeCreator.followerCount.toLocaleString()} fans</span>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Core Engine
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-indigo-50/80 text-indigo-900 font-semibold shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile Readiness & Pipeline Footer Widget */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/40 space-y-3">
        {/* Profile completion bar */}
        <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Profile Readiness
            </span>
            <span className="font-mono font-bold text-slate-900">{profileCompletion}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                profileCompletion >= 90
                  ? "bg-emerald-500"
                  : profileCompletion >= 70
                  ? "bg-indigo-600"
                  : "bg-amber-500"
              }`}
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            {profileCompletion >= 90
              ? "Your media kit is optimized for inbound sponsor pitches"
              : "Complete your profile to unlock higher tier brand matches"}
          </p>
        </div>

        {/* Demo Tag */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" /> Hackathon Demo v1.0
          </span>
          <span className="text-slate-300">•</span>
          <span>Next.js App Router</span>
        </div>
      </div>
    </aside>
  );
}

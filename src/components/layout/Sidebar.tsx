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
      name: "My Profile",
      href: "/profile",
      icon: UserCheck,
      badge: `${profileCompletion}%`,
      badgeColor: profileCompletion >= 90 ? "bg-emerald-50 text-emerald-700 border-emerald-200/80" : "bg-blue-50 text-blue-700 border-blue-200/80",
    },
    {
      name: "Growth Roadmap",
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
      badgeColor: appliedOpportunitiesCount > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold" : "bg-blue-50 text-blue-700 border-blue-200/80",
    },
    {
      name: "Workflow Engine",
      href: "/workflow",
      icon: Workflow,
      badge: "SOP",
      badgeColor: "bg-violet-50 text-violet-700 border-violet-200/80",
    },
    {
      name: "Action Centre",
      href: "/actions",
      icon: CheckSquare,
      badge: `${completedActionsCount}/${totalActionsCount}`,
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200/80 font-mono",
    },
  ];

  return (
    <aside className="w-68 bg-white border-r border-slate-200/80 flex flex-col h-full select-none">
      {/* Custom Creator Engine Wordmark Header */}
      <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group" onClick={onMobileClose}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            {/* Custom geometric Engine Mark */}
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
                CREATOR<span className="text-blue-600">ENGINE</span>
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
              Business Suite
            </span>
          </div>
        </Link>
        <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          PRO
        </span>
      </div>

      {/* Compact Persona Switcher Section */}
      <div className="px-3.5 py-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <SlidersHorizontal className="w-2.5 h-2.5 text-blue-600" /> Active Persona
          </span>
          <span className="text-[10px] font-medium text-slate-400">Demo</span>
        </div>

        <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-200/60 rounded-lg">
          <button
            onClick={() => switchCreator("rahul")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-all ${
              activeCreatorId === "rahul"
                ? "bg-white text-slate-900 font-bold shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">Rahul (IG)</span>
          </button>

          <button
            onClick={() => switchCreator("priya")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-all ${
              activeCreatorId === "priya"
                ? "bg-white text-slate-900 font-bold shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
            <span className="truncate">Priya (LI)</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Workspace
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? "bg-blue-50/80 text-blue-900 font-semibold border-l-2 border-blue-600 pl-2"
                  : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 transition-colors shrink-0 ${
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] border tracking-tight shrink-0 ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Refined User Profile Area at Bottom */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/30 space-y-2.5">
        {/* Profile Card */}
        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative shrink-0">
              <img
                src={activeCreator.avatar}
                alt={activeCreator.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                  {activeCreator.name}
                </p>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {activeCreator.followerCount.toLocaleString()} • {activeCreator.primaryPlatform}
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
            title="Edit Profile"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          </Link>
        </div>

        {/* Profile Readiness Meter */}
        <div className="px-1 space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-semibold text-slate-500">Profile Readiness</span>
            <span className="font-bold text-slate-800 font-mono">{profileCompletion}%</span>
          </div>
          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

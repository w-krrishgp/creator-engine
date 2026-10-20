"use client";

import React from "react";
import Link from "next/link";
import { Search, UserCheck, Sparkles, Send, ArrowRight } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Find Opportunities",
      description: "Search vetted brand briefs with compatibility matches.",
      href: "/opportunities",
      icon: Search,
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Update Profile",
      description: "Refine your audience metrics and rate card.",
      href: "/profile",
      icon: UserCheck,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Generate AI Pitch",
      description: "Draft a personalized sponsor pitch in 1 click.",
      href: "/opportunities",
      icon: Sparkles,
      iconColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "View Applications",
      description: "Track your active campaign applications.",
      href: "/opportunities?status=applied",
      icon: Send,
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className="p-5 rounded-3xl bg-[#0C101B] border border-white/[0.08] hover:border-[#0870e8]/50 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-3 group shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-2xl border ${act.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>

              <div>
                <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-blue-300 transition-colors">
                  {act.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  {act.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

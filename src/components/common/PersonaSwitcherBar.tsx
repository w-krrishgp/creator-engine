"use client";

import React from "react";
import { useCreator } from "@/context/CreatorContext";
import { Badge } from "@/components/common/Badge";
import { Zap } from "lucide-react";

interface PersonaSwitcherBarProps {
  subtitle?: string;
}

export function PersonaSwitcherBar({ subtitle }: PersonaSwitcherBarProps) {
  const { activeCreator, switchCreator, isDemoMode } = useCreator();

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Creator Info with Instagram Story Avatar Ring */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="p-[2.5px] rounded-full story-ring-gradient shrink-0 shadow-xs">
          <div className="w-11 h-11 rounded-full p-[2px] bg-white overflow-hidden">
            <img
              src={activeCreator.avatar}
              alt={activeCreator.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Persona:
            </span>
            <span className="text-sm font-extrabold text-slate-900 tracking-tight">
              {activeCreator.name}
            </span>
            <Badge variant="blue" size="sm">
              {activeCreator.niche}
            </Badge>
            {isDemoMode ? (
              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Demo Mode
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Cloud
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate">
            {subtitle || (
              `${activeCreator.primaryPlatform} • ${activeCreator.followerCount.toLocaleString()} followers • ${activeCreator.engagementRate}% engagement rate`
            )}
          </p>
        </div>
      </div>

      {/* Switch Persona Pill Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">
          Switch:
        </span>
        <button
          onClick={() => switchCreator("rahul")}
          className={`btn-tactile px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
            activeCreator.id === "rahul"
              ? "bg-[#0870e8] text-white border-[#0870e8] shadow-xs"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Zap className="w-3 h-3 fill-current" />
          <span>Rahul (Fitness • 15k IG)</span>
        </button>

        <button
          onClick={() => switchCreator("priya")}
          className={`btn-tactile px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
            activeCreator.id === "priya"
              ? "bg-[#0870e8] text-white border-[#0870e8] shadow-xs"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Zap className="w-3 h-3 fill-current" />
          <span>Priya (Finance • 8k LI)</span>
        </button>
      </div>
    </div>
  );
}

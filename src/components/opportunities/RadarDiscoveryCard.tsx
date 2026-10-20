"use client";

import React from "react";
import { RadarDiscoveredItem } from "@/types/radar";
import {
  ExternalLink,
  Sparkles,
  Clock,
  Compass,
  ArrowRight,
  Globe,
} from "lucide-react";

interface RadarDiscoveryCardProps {
  item: RadarDiscoveredItem;
  onInspect: (item: RadarDiscoveredItem) => void;
  isInspecting?: boolean;
}

export function RadarDiscoveryCard({
  item,
  onInspect,
  isInspecting = false,
}: RadarDiscoveryCardProps) {
  const formattedTime = new Date(item.retrievalTimestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[18px] border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Header */}
      <div className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3 bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-800/20">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#0870e8] dark:text-blue-400 font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Globe className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight truncate max-w-[200px] sm:max-w-[240px]">
                {item.siteName}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Web
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              Rank #{item.position} • {item.nicheTag}
            </p>
          </div>
        </div>

        {/* Relevance Pill */}
        <div className="flex flex-col items-end shrink-0">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-800/60 text-[#0870e8] dark:text-blue-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0870e8] dark:text-blue-400" />
            <span>{item.matchScore}% Relevance</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {formattedTime}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#0870e8] dark:group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>

          <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            &ldquo;{item.snippet}&rdquo;
          </p>
        </div>

        {/* Match Justification & Source Link */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 p-2.5 rounded-lg">
            <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Match Rationale: </span>
              <span className="text-slate-600 dark:text-slate-400">{item.matchJustification}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#0870e8] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors truncate max-w-[220px]"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{item.siteName}</span>
            </a>
            <span className="text-[10px] text-slate-400 italic">Unextracted Summary</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
        >
          <span>Visit Page</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <button
          onClick={() => onInspect(item)}
          disabled={isInspecting}
          className="flex-1 bg-[#0870e8] hover:bg-[#065ec4] active:bg-[#054fa8] text-white font-semibold text-xs py-2 px-3.5 rounded-xl transition-all shadow-xs hover:shadow flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
        >
          {isInspecting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Extracting Page...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspect & Pitch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

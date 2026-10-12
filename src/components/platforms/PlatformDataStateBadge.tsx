"use client";

import React, { useState } from "react";
import { AccountDataState, MetricProvenance } from "@/types/platform";
import { ShieldCheck, Info, Database, AlertTriangle, Lock, RefreshCw } from "lucide-react";

interface PlatformDataStateBadgeProps {
  state: AccountDataState;
  provenance?: MetricProvenance;
  lastSyncedAt?: string;
  limitations?: string[];
  size?: "xs" | "sm" | "md";
  showDetailsButton?: boolean;
}

export function PlatformDataStateBadge({
  state,
  provenance,
  lastSyncedAt,
  limitations = [],
  size = "sm",
  showDetailsButton = true,
}: PlatformDataStateBadgeProps) {
  const [showPopover, setShowPopover] = useState(false);

  const configMap: Record<
    AccountDataState,
    { label: string; bg: string; text: string; border: string; dot: string; icon: React.ReactNode }
  > = {
    live: {
      label: "Live Data",
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      icon: <ShieldCheck className="w-3 h-3 text-emerald-600" />,
    },
    cached_live: {
      label: "Cached Live Data",
      bg: "bg-sky-50",
      text: "text-sky-800",
      border: "border-sky-200",
      dot: "bg-sky-500",
      icon: <RefreshCw className="w-3 h-3 text-sky-600" />,
    },
    user_entered: {
      label: "User-Entered Data",
      bg: "bg-indigo-50",
      text: "text-indigo-800",
      border: "border-indigo-200",
      dot: "bg-indigo-500",
      icon: <Database className="w-3 h-3 text-indigo-600" />,
    },
    demo: {
      label: "Demo Profile",
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      dot: "bg-amber-500 animate-pulse",
      icon: <Info className="w-3 h-3 text-amber-600" />,
    },
    connection_required: {
      label: "Connection Required",
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-200",
      dot: "bg-purple-500",
      icon: <Lock className="w-3 h-3 text-purple-600" />,
    },
    data_unavailable: {
      label: "Data Unavailable",
      bg: "bg-rose-50",
      text: "text-rose-800",
      border: "border-rose-200",
      dot: "bg-rose-500",
      icon: <AlertTriangle className="w-3 h-3 text-rose-600" />,
    },
  };

  const current = configMap[state] || configMap.demo;

  const sizeClasses = {
    xs: "px-2 py-0.5 text-2xs gap-1",
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-sm gap-2",
  }[size];

  const formattedTime = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="relative inline-flex items-center">
      <div
        className={`inline-flex items-center font-bold rounded-full border shadow-2xs transition-colors ${current.bg} ${current.text} ${current.border} ${sizeClasses}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />
        <span>{current.label}</span>
        {showDetailsButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPopover((prev) => !prev);
            }}
            className="hover:opacity-80 transition-opacity ml-0.5"
            aria-label="View data provenance"
          >
            {current.icon}
          </button>
        )}
      </div>

      {showPopover && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPopover(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-72 p-3 bg-white rounded-xl shadow-xl border border-slate-200 text-slate-800 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-900">
              <span className="flex items-center gap-1.5">
                {current.icon}
                Data Provenance
              </span>
              <span className="text-2xs text-slate-400 uppercase font-semibold">
                {state.replace("_", " ")}
              </span>
            </div>

            <div className="py-2 space-y-1.5 text-slate-600">
              {provenance && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Metric Source:</span>
                  <span className="font-semibold text-slate-700 capitalize">
                    {provenance.replace("_", " ")}
                  </span>
                </div>
              )}
              {formattedTime && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Synced:</span>
                  <span className="font-medium text-slate-700">{formattedTime}</span>
                </div>
              )}
            </div>

            {limitations.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-2xs uppercase tracking-wider text-slate-400">
                  Platform Limitations:
                </span>
                <ul className="mt-1 space-y-1 text-2xs text-slate-600 list-disc list-inside">
                  {limitations.map((lim, idx) => (
                    <li key={idx} className="leading-tight">
                      {lim}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

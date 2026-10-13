"use client";

import React from "react";
import { Info, ShieldCheck } from "lucide-react";
import { useCreator } from "@/context/CreatorContext";

interface DemoDisclaimerProps {
  compact?: boolean;
  text?: string;
  className?: string;
}

export function DemoDisclaimer({
  compact = false,
  text,
  className = "",
}: DemoDisclaimerProps) {
  const { isDemoMode } = useCreator();

  const displayText =
    text && (!text.includes("Illustrative") || isDemoMode)
      ? text
      : isDemoMode
      ? (text || "Illustrative sample data for demonstration. Earning ranges and deal metrics are models, not financial guarantees.")
      : "Calibrated from your live account metrics and category benchmarks. Earning ranges and deal metrics are projection models, not financial guarantees.";

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          isDemoMode
            ? "bg-slate-100 text-slate-700 border-slate-200/80"
            : "bg-emerald-50 text-emerald-800 border-emerald-200/80"
        } border ${className}`}
        title={displayText}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isDemoMode ? "bg-[#0870e8]" : "bg-emerald-500"
          } shrink-0`}
        />
        <span>{isDemoMode ? "Demo Data" : "Live Account"}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start sm:items-center gap-3 px-4 py-3 rounded-2xl bg-white border ${
        isDemoMode ? "border-slate-200/80" : "border-emerald-200/80"
      } text-xs sm:text-[13px] text-slate-600 shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${className}`}
    >
      <div
        className={`w-4 h-4 rounded-full ${
          isDemoMode ? "text-[#0870e8] bg-blue-50" : "text-emerald-600 bg-emerald-50"
        } shrink-0 flex items-center justify-center mt-0.5 sm:mt-0`}
      >
        {isDemoMode ? <Info className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
      </div>
      <div className="flex-1 text-xs sm:text-[13px] leading-relaxed">
        <span
          className={`font-bold mr-1.5 ${
            isDemoMode ? "text-slate-900" : "text-emerald-900"
          }`}
        >
          {isDemoMode ? "Demo Persona Benchmark:" : "Live Account Calibration:"}
        </span>
        {displayText}
      </div>
    </div>
  );
}

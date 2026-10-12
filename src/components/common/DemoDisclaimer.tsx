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
  text = "Illustrative sample data for demonstration. Earning ranges and deal metrics are models, not financial guarantees.",
  className = "",
}: DemoDisclaimerProps) {
  const { isDemoMode } = useCreator();

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
          isDemoMode
            ? "bg-slate-100 text-slate-700 border-slate-200/80"
            : "bg-emerald-50 text-emerald-800 border-emerald-200/80"
        } border ${className}`}
        title={text}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isDemoMode ? "bg-[#0870e8]" : "bg-emerald-500"
          } shrink-0`}
        />
        <span>{isDemoMode ? "Demo Data" : "Live Cloud"}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start sm:items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border ${
        isDemoMode ? "border-slate-200/80" : "border-emerald-200/80"
      } text-xs text-slate-600 shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${className}`}
    >
      <div
        className={`w-4 h-4 rounded-full ${
          isDemoMode ? "text-[#0870e8] bg-blue-50" : "text-emerald-600 bg-emerald-50"
        } shrink-0 flex items-center justify-center mt-0.5 sm:mt-0`}
      >
        {isDemoMode ? <Info className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
      </div>
      <div className="flex-1 text-[11px] leading-snug">
        <span
          className={`font-semibold mr-1.5 ${
            isDemoMode ? "text-slate-900" : "text-emerald-900"
          }`}
        >
          {isDemoMode ? "Demo Environment:" : "Live Cloud Environment:"}
        </span>
        {text}
      </div>
    </div>
  );
}

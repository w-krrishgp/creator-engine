import React from "react";
import { Info } from "lucide-react";

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
  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80 ${className}`}
        title={text}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#0870e8] shrink-0" />
        <span>Demo Data</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start sm:items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-600 shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${className}`}
    >
      <div className="w-4 h-4 rounded-full text-[#0870e8] bg-blue-50 shrink-0 flex items-center justify-center mt-0.5 sm:mt-0">
        <Info className="w-3 h-3" />
      </div>
      <div className="flex-1 text-[11px] leading-snug">
        <span className="font-semibold text-slate-900 mr-1.5">Demo Environment:</span>
        {text}
      </div>
    </div>
  );
}

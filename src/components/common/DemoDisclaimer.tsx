import React from "react";
import { Sparkles, Info } from "lucide-react";

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
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80 ${className}`}
        title={text}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Demo Data</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start sm:items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs text-slate-600 shadow-xs ${className}`}
    >
      <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600 shrink-0 mt-0.5 sm:mt-0">
        <Info className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1">
        <span className="font-semibold text-slate-800 mr-1.5">Illustrative Demo Environment:</span>
        {text}
      </div>
    </div>
  );
}

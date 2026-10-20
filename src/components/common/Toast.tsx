"use client";

import React from "react";
import { useCreator } from "@/context/CreatorContext";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useCreator();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isInfo = toast.type === "info";
        const isWarning = toast.type === "warning";

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 px-4 rounded-full bg-slate-900/95 backdrop-blur-md text-white shadow-xl shadow-slate-900/20 border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isInfo && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              <p className="text-xs font-semibold text-slate-100 truncate">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
}

export function ThemeToggle({ className = "", showLabels = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {showLabels && (
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 select-none hidden sm:inline">
          {isDark ? "Dark" : "Light"}
        </span>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        onClick={toggleTheme}
        className={`relative inline-flex h-8 w-15 shrink-0 cursor-pointer items-center rounded-full border transition-all duration-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0870e8] select-none btn-tactile ${
          isDark
            ? "bg-slate-900 border-slate-700 shadow-inner"
            : "bg-slate-200/85 border-slate-300/80 shadow-xs"
        }`}
        title={`Current theme: ${isDark ? "Dark" : "Light"}. Click to switch to ${
          isDark ? "Light" : "Dark"
        } mode.`}
      >
        {/* Background track icons */}
        <div className="absolute inset-x-1.5 flex items-center justify-between pointer-events-none text-xs">
          <Sun
            className={`w-3.5 h-3.5 transition-opacity duration-200 ${
              isDark ? "opacity-30 text-amber-300" : "opacity-0 text-amber-500"
            }`}
          />
          <Moon
            className={`w-3.5 h-3.5 transition-opacity duration-200 ${
              isDark ? "opacity-0 text-blue-300" : "opacity-40 text-slate-600"
            }`}
          />
        </div>

        {/* Sliding thumb */}
        <span
          className={`pointer-events-none inline-flex h-6.5 w-6.5 transform items-center justify-center rounded-full shadow-md transition-all duration-300 ease-in-out ${
            isDark
              ? "translate-x-7.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
              : "translate-x-0.5 bg-white text-amber-500 border border-slate-200/80"
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-white animate-in spin-in-180 duration-200" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500 animate-in spin-in-180 duration-200" />
          )}
        </span>
      </button>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useCreator } from "@/context/CreatorContext";
import {
  Menu,
  X,
  Sparkles,
  ArrowRightLeft,
  Bell,
  Search,
  CheckCircle,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Badge } from "../common/Badge";

export function Header() {
  const pathname = usePathname();
  const { activeCreatorId, activeCreator, switchCreator } = useCreator();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageInfo = () => {
    switch (pathname) {
      case "/":
        return {
          title: "Overview Dashboard",
          subtitle: "Performance intelligence & recommended growth moves",
        };
      case "/profile":
        return {
          title: "Creator Profile & Media Kit",
          subtitle: "Fine-tune your niche, metrics, audience, and revenue targets",
        };
      case "/roadmap":
        return {
          title: "30 / 60 / 90-Day Growth Roadmap",
          subtitle: "Structured milestone roadmap, content gaps & market benchmarks",
        };
      case "/monetisation":
        return {
          title: "Monetisation Engine",
          subtitle: "Tailored revenue channels, pitch checklists & reality checks",
        };
      case "/opportunities":
        return {
          title: "Opportunities Marketplace",
          subtitle: "Vetted brand campaigns with explainable deterministic matching",
        };
      case "/actions":
        return {
          title: "Action Centre",
          subtitle: "High-impact prioritised steps to hit your next milestone",
        };
      default:
        return {
          title: "Creator Engine",
          subtitle: "Creator Growth & Brand Opportunity Engine",
        };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                {title}
              </h1>
              <Badge variant="slate" size="sm" className="hidden sm:inline-flex">
                Live Prototype
              </Badge>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
          </div>
        </div>

        {/* Right: Quick Demo Persona Switcher & Badges */}
        <div className="flex items-center gap-3">
          {/* Quick Persona Pills */}
          <div className="hidden lg:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 px-2.5 flex items-center gap-1.5">
              <ArrowRightLeft className="w-3 h-3 text-indigo-600" /> Switch Creator:
            </span>
            <button
              onClick={() => switchCreator("rahul")}
              className={`px-3 py-1 text-xs rounded-lg transition-all flex items-center gap-1.5 ${
                activeCreatorId === "rahul"
                  ? "bg-white text-indigo-950 font-bold shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Rahul (Fitness)</span>
            </button>
            <button
              onClick={() => switchCreator("priya")}
              className={`px-3 py-1 text-xs rounded-lg transition-all flex items-center gap-1.5 ${
                activeCreatorId === "priya"
                  ? "bg-white text-indigo-950 font-bold shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>Priya (Finance)</span>
            </button>
          </div>

          {/* Active Creator Pill for smaller screens */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 sm:border-0 sm:pl-0">
            <img
              src={activeCreator.avatar}
              alt={activeCreator.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-800 leading-tight">{activeCreator.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">{activeCreator.primaryPlatform}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col">
            <div className="p-3 flex justify-end border-b border-slate-100">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar onMobileClose={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CreatorProfile } from "@/types/creator";
import { Bell, Sparkles, Check, ExternalLink, Menu } from "lucide-react";

interface DashboardTopHeaderProps {
  creator: CreatorProfile;
  isAiGenerating?: boolean;
  onMobileMenuOpen?: () => void;
}

export function DashboardTopHeader({
  creator,
  isAiGenerating = false,
  onMobileMenuOpen,
}: DashboardTopHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Derive actual first name or full name cleanly
  const firstName = creator.name.trim().split(" ")[0] || "Creator";

  const handleOpenMobile = () => {
    if (onMobileMenuOpen) {
      onMobileMenuOpen();
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-mobile-sidebar"));
    }
  };

  const sampleNotifications = [
    {
      id: "n1",
      title: "New 96% Match Campaign",
      description: `AI SaaS Creator Campaign matches your ${creator.niche} audience.`,
      time: "10m ago",
      unread: true,
    },
    {
      id: "n2",
      title: "Creator Score Calibrated",
      description: `Your profile readiness score was calibrated from your entered metrics.`,
      time: "1h ago",
      unread: false,
    },
  ];

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
      {/* Left: Mobile Drawer Trigger, Greeting & Subtitle */}
      <div className="flex items-start gap-3 min-w-0">
        <button
          type="button"
          onClick={handleOpenMobile}
          className="md:hidden p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 mt-0.5"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
              Good morning, {firstName} 👋
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Here&apos;s what&apos;s happening with your creator career.
          </p>
        </div>
      </div>

      {/* Right: AI-powered indicator, Notifications, Creator Avatar */}
      <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
        {/* Subtle AI-Powered Indicator */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-[#0870e8]" />
          <span>AI-Powered Engine</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0870e8] ring-2 ring-[#07090E]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0C101B] border border-white/[0.1] shadow-[0_12px_40px_rgba(0,0,0,0.6)] p-3 space-y-2 z-50 animate-fadeIn">
              <div className="flex items-center justify-between px-2 py-1 border-b border-white/[0.06]">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Notifications
                </span>
                <span className="text-[10px] text-blue-400 font-semibold cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="space-y-1.5">
                {sampleNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-xs space-y-0.5 cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-white font-bold">
                      <span className="truncate">{notif.title}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {notif.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Creator Avatar with link to Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors group cursor-pointer"
          title="View & Edit Creator Profile"
        >
          <div className="w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-tr from-[#0870e8] to-emerald-400 overflow-hidden shrink-0">
            <img
              src={creator.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop"}
              alt={creator.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-xs font-bold text-white max-w-[100px] truncate hidden sm:inline">
            {creator.handle?.startsWith("@") ? creator.handle : `@${creator.handle}`}
          </span>
        </Link>
      </div>
    </header>
  );
}

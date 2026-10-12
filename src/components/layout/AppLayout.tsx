"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ToastContainer } from "../common/Toast";
import {
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  CheckSquare,
  UserCheck,
} from "lucide-react";
import { useCreator } from "@/context/CreatorContext";

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { appliedOpportunitiesCount, totalActionsCount, completedActionsCount } = useCreator();

  const mobileNavItems = [
    {
      name: "Home",
      href: "/",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Roadmap",
      href: "/roadmap",
      icon: TrendingUp,
      badge: null,
    },
    {
      name: "Deals",
      href: "/opportunities",
      icon: Briefcase,
      badge: appliedOpportunitiesCount > 0 ? String(appliedOpportunitiesCount) : null,
    },
    {
      name: "Actions",
      href: "/actions",
      icon: CheckSquare,
      badge: totalActionsCount > completedActionsCount ? String(totalActionsCount - completedActionsCount) : null,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: UserCheck,
      badge: null,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa] text-slate-900 font-sans antialiased">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />
        
        {/* Main Content Area with safe-area padding for mobile bottom bar */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 space-y-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
      >
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl transition-all relative ${
                isActive
                  ? "text-[#0870e8] font-bold"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "scale-110 text-[#0870e8]" : "text-slate-500"
                  }`}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-[#0870e8] text-white text-[9px] font-black rounded-full border border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {item.name}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#0870e8] mt-1" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
}

"use client";

import React, { ReactNode, useState, useEffect } from "react";
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
  X,
} from "lucide-react";
import { useCreator } from "@/context/CreatorContext";

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { appliedOpportunitiesCount, totalActionsCount, completedActionsCount } = useCreator();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setMobileMenuOpen(true);
    window.addEventListener("open-mobile-sidebar", handleOpen);
    return () => window.removeEventListener("open-mobile-sidebar", handleOpen);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // On public landing page and onboarding wizard, render standalone without dashboard sidebar
  const isPublicFlow = pathname === "/" || pathname.startsWith("/onboarding");

  if (isPublicFlow) {
    return (
      <div className="min-h-screen bg-[#080B11] text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-[#0870e8] selection:text-white">
        {children}
        <ToastContainer />
      </div>
    );
  }

  const isDashboard = pathname === "/dashboard";

  const mobileNavItems = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Deals",
      href: "/opportunities",
      icon: Briefcase,
      badge: appliedOpportunitiesCount > 0 ? String(appliedOpportunitiesCount) : null,
    },
    {
      name: "Roadmap",
      href: "/roadmap",
      icon: TrendingUp,
      badge: null,
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
    <div
      className={`flex h-screen overflow-hidden font-sans antialiased ${
        isDashboard ? "bg-[#07090E] text-slate-100" : "bg-[#fafafa] text-slate-900"
      }`}
    >
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* On /dashboard, the page has its dedicated command-center DashboardTopHeader */}
        {!isDashboard && <Header />}

        {/* Main Content Area with safe-area padding for mobile bottom bar */}
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 space-y-6 ${
            isDashboard ? "bg-[#07090E] text-slate-100" : "bg-[#fafafa] text-slate-900"
          }`}
        >
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className={`fixed inset-y-0 left-0 max-w-xs w-full shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-200 ${
              isDashboard ? "bg-[#0B0F19]" : "bg-white"
            }`}
          >
            <div
              className={`p-3.5 flex justify-end border-b ${
                isDashboard ? "border-white/[0.08]" : "border-slate-100"
              }`}
            >
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className={`p-1.5 rounded-full transition-colors ${
                  isDashboard
                    ? "text-slate-400 hover:text-white hover:bg-white/[0.08]"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
                aria-label="Close menu"
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

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className={`md:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-md px-2 py-1.5 flex items-center justify-around ${
          isDashboard
            ? "bg-[#0B0F19]/95 border-t border-white/[0.08] shadow-[0_-4px_24px_rgba(0,0,0,0.5)]"
            : "bg-white/95 border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
        }`}
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
                  : isDashboard
                  ? "text-slate-400 hover:text-slate-200 font-medium"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "scale-110 text-[#0870e8]" : isDashboard ? "text-slate-400" : "text-slate-500"
                  }`}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 bg-[#0870e8] text-white text-xs font-bold rounded-full border border-white leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs tracking-tight mt-0.5 leading-none font-medium">
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

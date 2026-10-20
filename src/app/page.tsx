"use client";

import React from "react";
import Link from "next/link";
import { useCreator } from "@/context/CreatorContext";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  Target,
  BarChart3,
  Users,
  Briefcase,
  Layers,
  ChevronRight,
  Check,
  Flame,
  ArrowUpRight,
} from "lucide-react";

export default function LandingPage() {
  const { activeCreator, isOnboarded } = useCreator();

  // Determine whether user is a returning creator who completed onboarding
  const isReturningCreator = Boolean(isOnboarded && activeCreator && activeCreator.name);

  const primaryCtaText = "Build My Creator Profile →";
  const primaryCtaHref = "/onboarding";

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-[#0870e8] selection:text-white">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07090E]/80 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand Wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0870e8] via-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_20px_rgba(8,112,232,0.4)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tight text-white text-base sm:text-lg">
                CREATOR<span className="text-[#0870e8]">ENGINE</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-0.5">
                Intelligence Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#intelligence"
              className="hover:text-white transition-colors"
            >
              Creator Intelligence
            </a>
            <Link
              href="/pricing"
              className="hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Top Right Action Button */}
          <div className="flex items-center gap-3">
            {isReturningCreator ? (
              <Link
                href="/dashboard"
                className="btn-tactile inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0870e8] to-blue-600 hover:from-blue-600 hover:to-[#0870e8] text-white text-xs sm:text-sm font-bold shadow-[0_0_24px_rgba(8,112,232,0.35)] transition-all"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-white/40">
                  <img
                    src={activeCreator?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop"}
                    alt={activeCreator?.name || "Creator"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>Dashboard →</span>
              </Link>
            ) : (
              <Link
                href="/onboarding"
                className="btn-tactile inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-white text-slate-950 hover:bg-slate-100 text-xs sm:text-sm font-extrabold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
              >
                <span>Build Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 lg:pt-32 pb-20 overflow-hidden">
        {/* Ambient Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[500px] bg-gradient-to-tr from-[#0870e8]/25 via-indigo-600/20 to-emerald-500/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-12 left-10 w-72 h-72 bg-blue-600/10 blur-[90px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Subtle Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.12] backdrop-blur-md text-xs sm:text-sm font-medium text-slate-300 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-[#0870e8] animate-pulse" />
            <span>AI-Driven Monetization for Creators</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80 font-bold">100% Direct Sponsorships</span>
          </div>

          {/* Hero Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Turn Your Influence
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                Into Opportunity.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed pt-2">
              Build your creator profile once. Creator Engine finds the opportunities that fit you.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href={primaryCtaHref}
              className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#0870e8] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-[#0870e8] text-white text-base sm:text-lg font-black shadow-[0_0_35px_rgba(8,112,232,0.45)] hover:shadow-[0_0_50px_rgba(8,112,232,0.6)] transition-all cursor-pointer"
            >
              <span>{primaryCtaText}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#how-it-works"
              className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.15] text-white text-base font-bold backdrop-blur-md transition-all cursor-pointer"
            >
              <span>See How It Works</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Social Proof & Metrics Strip */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No agency commissions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Deterministic brand matchmaker</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1-click tailored AI pitches</span>
            </div>
          </div>

          {/* 3. HERO INTERACTIVE PRODUCT PREVIEW CARD */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-white/[0.18] via-white/[0.05] to-transparent shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
              <div className="rounded-[22px] bg-[#0C101B] border border-white/[0.1] p-5 sm:p-8 text-left space-y-6 overflow-hidden">
                {/* Mock Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#0870e8] to-emerald-400 overflow-hidden shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop"
                        alt="Creator Example"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-white text-lg">
                          Alex Sharma
                        </h3>
                        <span className="text-xs font-mono text-slate-400">@alextech</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold">
                          Technology • AI
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        India • YouTube & Instagram • Long-form & Shorts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-white/[0.04] border border-white/[0.08] px-3.5 py-2 rounded-2xl text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Followers
                      </span>
                      <span className="text-base font-black text-white">25K</span>
                    </div>
                    <div className="bg-white/[0.04] border border-white/[0.08] px-3.5 py-2 rounded-2xl text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Avg Views
                      </span>
                      <span className="text-base font-black text-white">42K</span>
                    </div>
                    <div className="bg-white/[0.04] border border-white/[0.08] px-3.5 py-2 rounded-2xl text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Engagement
                      </span>
                      <span className="text-base font-black text-emerald-400">6.8%</span>
                    </div>
                  </div>
                </div>

                {/* Algorithmic Readiness & Score Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-gradient-to-br from-[#0870e8]/20 to-indigo-600/20 border border-[#0870e8]/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      Creator Score
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-white font-sans">87</span>
                      <span className="text-xs text-slate-400">/100</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Niche Fit</span>
                      <span className="font-bold text-white">94%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.08] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "94%" }} />
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Audience Quality</span>
                      <span className="font-bold text-white">88%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.08] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Engagement</span>
                      <span className="font-bold text-white">91%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.08] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "91%" }} />
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Commercial</span>
                      <span className="font-bold text-white">86%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.08] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "86%" }} />
                    </div>
                  </div>
                </div>

                {/* Example Matched Opportunity Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                        96% Match
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        Technology • AI
                      </span>
                    </div>
                    <h4 className="font-extrabold text-white text-base">
                      AI SaaS Creator Campaign — DevTools
                    </h4>
                    <p className="text-xs text-slate-300">
                      Why this matches: &quot;Your AI and technology audience strongly aligns with this campaign.&quot;
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">Compensation</span>
                      <span className="text-base font-black text-emerald-400 font-mono">
                        ₹30K – ₹50K
                      </span>
                    </div>
                    <Link
                      href={primaryCtaHref}
                      className="btn-tactile px-4 py-2 rounded-xl bg-[#0870e8] hover:bg-blue-600 text-white font-bold text-xs"
                    >
                      View Campaign →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 border-t border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-[#0870e8]/10 text-blue-400 border border-[#0870e8]/20 text-xs font-bold uppercase tracking-wider">
              Step-by-Step Experience
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              From Profile Setup to High-Paying Deals
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              No generic forms. No cold DMs. Creator Engine learns your content superpowers and matches you with verified campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/[0.08] hover:border-[#0870e8]/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-[#0870e8] flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-xl font-bold text-white">
                Build Your Creator Profile
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Enter your niche, primary platforms, audience scale, and target income. Done in less than 2 minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/[0.08] hover:border-indigo-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-xl font-bold text-white">
                AI Profile Intelligence
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our engine analyzes your engagement quality, calculates your commercial readiness score, and builds your 30-day roadmap.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/[0.08] hover:border-emerald-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-xl font-bold text-white">
                Match & Monetize
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Review high-compatibility brand briefs, apply with personalized 1-click pitches, and track your deal pipeline.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href={primaryCtaHref}
              className="btn-tactile inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-950 font-black text-sm hover:bg-slate-100 shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all"
            >
              <span>{primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CORE FEATURES SECTION */}
      <section id="features" className="py-24 border-t border-white/[0.08] bg-[#0A0D15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              Engine Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Designed For High-Growth Creators
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every tool and metric is calibrated to help you negotiate higher brand fees and scale diversified revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-[#0E1322] border border-white/[0.08] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-[#0870e8] flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Deterministic Brand Compatibility
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Zero arbitrary AI black boxes. Every sponsor match displays exact eligibility scoring, follower thresholds, and audience demographic fit.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-[#0E1322] border border-white/[0.08] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                30 / 60 / 90-Day Execution Roadmaps
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Phased growth milestones, content gap analyses, and priority skills to improve so you know exactly what to produce each week.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-[#0E1322] border border-white/[0.08] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                AI Application & Pitch Generator
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generate professional campaign pitches highlighting your past reach, audience demographics, and unique creative angle in seconds.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-[#0E1322] border border-white/[0.08] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Verified Media Kit & Dynamic Rate Cards
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Benchmark your rates against industry CPMs. Share a shareable live media kit with prospective sponsors that validates your real engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-24 border-t border-white/[0.08] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0870e8]/10 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to Turn Your Influence
              <br />
              Into Real Opportunities?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
              Set up your creator profile once. Creator Engine will find the brand deals, sponsorships, and partnerships built for your audience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={primaryCtaHref}
              className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#0870e8] hover:bg-blue-600 text-white font-black text-base shadow-[0_0_35px_rgba(8,112,232,0.4)] transition-all cursor-pointer"
            >
              <span>{primaryCtaText}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="mt-auto border-t border-white/[0.08] py-12 bg-[#05070B] text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-white text-sm">
              CREATOR<span className="text-[#0870e8]">ENGINE</span>
            </span>
            <span>•</span>
            <span>Creator Monetisation & Brand Matching Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href={primaryCtaHref} className="hover:text-slate-300 transition-colors">
              {isReturningCreator ? "Dashboard" : "Onboarding"}
            </Link>
            <Link href="/opportunities" className="hover:text-slate-300 transition-colors">
              Opportunities
            </Link>
            <Link href="/pricing" className="hover:text-slate-300 transition-colors">
              Pricing
            </Link>
            <Link href="/profile" className="hover:text-slate-300 transition-colors">
              Profile
            </Link>
          </div>

          <div>
            <p>© 2026 Creator Engine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

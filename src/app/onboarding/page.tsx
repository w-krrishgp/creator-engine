"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreator } from "@/context/CreatorContext";
import {
  OnboardingFormData,
  PlatformType,
  CreatorStageType,
  ExperienceLevelType,
} from "@/types/creator";
import {
  User,
  Share2,
  Users,
  Target,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Check,
  RotateCcw,
  Camera,
  ExternalLink,
  Flame,
  Award,
  Globe,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { YouTubeConnectModal } from "@/components/onboarding/YouTubeConnectModal";
import { YouTubeIcon } from "@/components/common/PlatformIcons";

// Preset avatar options for convenient selection
const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&fit=crop",
];

// Niche Options
const NICHE_OPTIONS = [
  "Technology",
  "AI",
  "Gaming",
  "Fashion",
  "Beauty",
  "Fitness",
  "Education",
  "Finance",
  "Travel",
  "Food",
  "Lifestyle",
  "Entertainment",
  "Business",
  "Other",
];

// Content Platforms
const PLATFORM_OPTIONS = [
  "YouTube",
  "Instagram",
  "TikTok",
  "X",
  "LinkedIn",
  "Twitch",
  "Blog",
  "Other",
];

// Content Types
const CONTENT_TYPE_OPTIONS = [
  "Short-form video",
  "Long-form video",
  "Photos",
  "Educational content",
  "Reviews",
  "Tutorials",
  "Podcasts",
  "Livestreams",
  "Other",
];

// Goal Opportunities Multi-select
const OPPORTUNITY_OPTIONS = [
  "Brand Deals",
  "Sponsored Content",
  "UGC Campaigns",
  "Affiliate Programs",
  "Creator Programs",
  "PR Opportunities",
  "Creator Collaborations",
  "Events",
  "Freelance Opportunities",
  "Other",
];

// Collaboration Types
const COLLABORATION_TYPES = [
  "Paid",
  "Affiliate",
  "Product",
  "Both paid and product",
  "Any",
];

// Age Ranges
const AGE_RANGE_OPTIONS = [
  "13 - 17",
  "18 - 24",
  "25 - 34",
  "35 - 44",
  "45+",
  "Diverse / All ages",
];

// Initial blank form data
const INITIAL_FORM: OnboardingFormData = {
  name: "",
  handle: "",
  email: "",
  avatar: AVATAR_PRESETS[0],
  location: "",
  country: "India",
  website: "",
  niche: "Technology",
  platforms: ["YouTube", "Instagram"],
  contentTypes: ["Short-form video", "Tutorials", "Reviews"],
  contentDescription: "",
  primaryPlatform: "YouTube",
  followerCount: 25000,
  averageViews: 42000,
  averageLikes: 3400,
  averageComments: 420,
  engagementRate: 6.8,
  audienceAge: "18 - 24",
  audienceLocation: "India",
  audienceDescription: "",
  opportunityPreferences: ["Brand Deals", "Sponsored Content", "Affiliate Programs", "UGC Campaigns"],
  collaborationType: "Both paid and product",
  monthlyIncomeGoal: 50000,
  preferredIndustries: "AI SaaS, Consumer Tech, Developer Tools",
};

export default function OnboardingPage() {
  const router = useRouter();
  const { activeCreator, completeOnboarding, showToast } = useCreator();

  // Step 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [ytModalOpen, setYtModalOpen] = useState<boolean>(false);

  // Check URL parameters for manual mode or prefill from YouTube
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("manual") === "true") {
      setIsManualMode(true);
    }
    if (params.get("prefill") === "youtube") {
      try {
        const stored = localStorage.getItem("creator_engine_prefill_youtube");
        if (stored) {
          const prefill = JSON.parse(stored);
          setFormData((prev) => ({
            ...prev,
            name: prefill.name || prev.name,
            handle: prefill.handle || prev.handle,
            avatar: prefill.avatar || prev.avatar,
            niche: prefill.niche || prev.niche,
            followerCount: prefill.followerCount || prev.followerCount,
            averageViews: prefill.averageViews || prev.averageViews,
            averageLikes: prefill.averageLikes || prev.averageLikes,
            averageComments: prefill.averageComments || prev.averageComments,
            engagementRate: prefill.engagementRate || prev.engagementRate,
            contentDescription: prefill.contentDescription || prev.contentDescription,
            location: prefill.location || prev.location,
            country: prefill.country || prev.country,
            preferredIndustries: prefill.preferredIndustries || prev.preferredIndustries,
          }));
          setIsManualMode(true);
        }
      } catch {}
    }
  }, []);

  const [formData, setFormData] = useState<OnboardingFormData>(() => {
    if (activeCreator) {
      return {
        name: activeCreator.name || "",
        handle: activeCreator.handle || "",
        email: activeCreator.email || "",
        avatar: activeCreator.avatar || AVATAR_PRESETS[0],
        location: activeCreator.location || "",
        country: activeCreator.country || "India",
        website: activeCreator.website || "",
        niche: activeCreator.niche || "Technology",
        platforms: activeCreator.platforms || [activeCreator.primaryPlatform || "YouTube"],
        contentTypes: activeCreator.contentTypes || ["Short-form video", "Tutorials"],
        contentDescription: activeCreator.contentDescription || activeCreator.bio || "",
        primaryPlatform: (activeCreator.primaryPlatform as PlatformType) || "YouTube",
        followerCount: activeCreator.followerCount || 25000,
        averageViews: activeCreator.averageViews || activeCreator.avgImpressionsPerPost || 42000,
        averageLikes: activeCreator.averageLikes || 3400,
        averageComments: activeCreator.averageComments || 420,
        engagementRate: activeCreator.engagementRate || 6.8,
        audienceAge: activeCreator.audienceAge || "18 - 24",
        audienceLocation: activeCreator.audienceLocation || activeCreator.location || "India",
        audienceDescription: activeCreator.audienceDescription || activeCreator.audienceDemographic || "",
        opportunityPreferences: activeCreator.opportunityPreferences || ["Brand Deals", "Sponsored Content"],
        collaborationType: activeCreator.collaborationType || "Both paid and product",
        monthlyIncomeGoal: activeCreator.monthlyIncomeGoal || activeCreator.monthlyIncomeTarget || 50000,
        preferredIndustries: activeCreator.preferredIndustries || "",
      };
    }
    return INITIAL_FORM;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Processing Screen State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const processingMilestones = [
    "Understanding your niche",
    "Analyzing your audience",
    "Identifying your strengths",
    "Mapping monetization opportunities",
    "Preparing personalized recommendations",
  ];

  // Animated progress timer when launching
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push("/dashboard");
          }, 400);
          return 100;
        }

        // Trigger completed checks sequentially
        const stepIndex = Math.min(4, Math.floor(next / 20));
        setCompletedSteps((cur) => {
          if (!cur.includes(stepIndex)) {
            return [...cur, stepIndex];
          }
          return cur;
        });

        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [isProcessing, router]);

  // Handle single field change
  const handleChange = <K extends keyof OnboardingFormData>(
    field: K,
    value: OnboardingFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Toggle array item (platforms, content types, opportunities)
  const toggleArrayItem = (field: "platforms" | "contentTypes" | "opportunityPreferences", item: string) => {
    setFormData((prev) => {
      const list = prev[field] || [];
      const exists = list.includes(item);
      const nextList = exists ? list.filter((i) => i !== item) : [...list, item];
      return { ...prev, [field]: nextList };
    });
  };

  // Load sample profile (Alex Sharma)
  const loadSampleAlex = () => {
    setFormData({
      name: "Alex Sharma",
      handle: "@alextech",
      email: "alex@creator.dev",
      avatar: AVATAR_PRESETS[0],
      location: "Bengaluru",
      country: "India",
      website: "https://alexcreates.dev",
      niche: "Technology",
      platforms: ["YouTube", "Instagram"],
      contentTypes: ["Short-form video", "Tutorials", "Reviews"],
      contentDescription: "AI tools, technology tutorials and developer content for ambitious builders.",
      primaryPlatform: "YouTube",
      followerCount: 25000,
      averageViews: 42000,
      averageLikes: 3400,
      averageComments: 420,
      engagementRate: 6.8,
      audienceAge: "18 - 24",
      audienceLocation: "India & Global",
      audienceDescription: "Young software engineers, tech enthusiasts, and students building with AI.",
      opportunityPreferences: ["Brand Deals", "Sponsored Content", "Affiliate Programs", "UGC Campaigns"],
      collaborationType: "Both paid and product",
      monthlyIncomeGoal: 50000,
      preferredIndustries: "AI SaaS, Developer Tools, Consumer Tech, Productivity Apps",
    });
    setErrors({});
    showToast("Filled sample profile: Alex Sharma", "info");
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Full name is required";
      if (!formData.handle.trim()) newErrors.handle = "Creator handle is required";
      if (!formData.email.trim() || !formData.email.includes("@"))
        newErrors.email = "Valid email address is required";
      if (!formData.location.trim()) newErrors.location = "City / region is required";
      if (!formData.country.trim()) newErrors.country = "Country is required";
    } else if (step === 2) {
      if (!formData.niche) newErrors.niche = "Please select your primary niche";
      if (!formData.platforms || formData.platforms.length === 0)
        newErrors.platforms = "Select at least one content platform";
      if (!formData.contentTypes || formData.contentTypes.length === 0)
        newErrors.contentTypes = "Select at least one content format";
      if (!formData.contentDescription.trim())
        newErrors.contentDescription = "Please enter a brief description of what you create";
    } else if (step === 3) {
      if (!formData.followerCount || formData.followerCount <= 0)
        newErrors.followerCount = "Follower count must be greater than 0";
      if (!formData.averageViews || formData.averageViews <= 0)
        newErrors.averageViews = "Average views is required";
      if (!formData.engagementRate || formData.engagementRate <= 0)
        newErrors.engagementRate = "Engagement rate is required";
    } else if (step === 4) {
      if (!formData.opportunityPreferences || formData.opportunityPreferences.length === 0)
        newErrors.opportunityPreferences = "Select at least one opportunity type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      showToast("Please fill in the required fields marked in red", "warning");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Launch Creator Engine from Step 5 Review
  const handleLaunch = () => {
    // Save profile into CreatorContext, localStorage, and Supabase
    completeOnboarding(formData);

    // Trigger AI processing animation screen
    setIsProcessing(true);
    setCompletedSteps([0]);
  };

  const stepsList = [
    { number: 1, name: "About You" },
    { number: 2, name: "Your Content" },
    { number: 3, name: "Your Audience" },
    { number: 4, name: "Your Goals" },
    { number: 5, name: "Finish" },
  ];

  // 3. PROFILE PROCESSING SCREEN VIEW
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0C101B] border border-white/[0.1] rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-fadeIn">
          {/* Animated Spinner Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#0870e8]/15 border border-[#0870e8]/30 flex items-center justify-center mx-auto text-[#0870e8] shadow-[0_0_30px_rgba(8,112,232,0.3)]">
            <Sparkles className="w-8 h-8 animate-pulse text-[#0870e8]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Building your Creator Intelligence...
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Synthesizing your niche, calculating compatibility scores, and preparing your personalized dashboard.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0870e8] to-emerald-400 rounded-full transition-all duration-150"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Calibrating Engine</span>
              <span>{processingProgress}%</span>
            </div>
          </div>

          {/* Animated Check Steps */}
          <div className="space-y-2.5 text-left pt-2">
            {processingMilestones.map((m, idx) => {
              const isDone = completedSteps.includes(idx);
              const isCurrent = completedSteps.includes(idx - 1) && !isDone;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs sm:text-sm transition-all ${
                    isDone
                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300 font-semibold"
                      : isCurrent
                      ? "bg-blue-500/10 border-blue-500/25 text-blue-200"
                      : "bg-white/[0.02] border-white/[0.05] text-slate-500"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors ${
                      isDone
                        ? "bg-emerald-500 text-slate-950 font-bold"
                        : isCurrent
                        ? "border border-blue-400 text-blue-400"
                        : "border border-slate-700 text-slate-600"
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span className="truncate">{m}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-[#0870e8] selection:text-white pb-16">
      {/* Onboarding Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#07090E]/85 border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0870e8] flex items-center justify-center text-white font-black text-xs shadow-xs">
              CE
            </div>
            <span className="font-bold text-white text-sm tracking-tight">
              Creator Engine
            </span>
          </Link>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            {!isManualMode ? (
              <button
                type="button"
                onClick={() => setIsManualMode(true)}
                className="btn-tactile px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>Enter Manually</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setYtModalOpen(true)}
                  className="btn-tactile px-3 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Connect YouTube channel automatically"
                >
                  <YouTubeIcon className="w-3.5 h-3.5 text-red-500" />
                  <span className="hidden sm:inline">Connect YouTube</span>
                </button>

                <button
                  type="button"
                  onClick={loadSampleAlex}
                  className="btn-tactile px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Pre-fill realistic data for Alex Sharma"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Fill Sample Profile</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Progress Indicator (only shown in manual wizard mode) */}
        {isManualMode && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5">
            <div className="flex items-center justify-between gap-2 overflow-x-auto">
              {stepsList.map((step) => {
                const isPast = currentStep > step.number;
                const isCurrent = currentStep === step.number;

                return (
                  <div
                    key={step.number}
                    className="flex items-center gap-2 shrink-0 cursor-pointer"
                    onClick={() => {
                      if (step.number < currentStep) {
                        setCurrentStep(step.number);
                      }
                    }}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isPast
                          ? "bg-emerald-500 text-slate-950"
                          : isCurrent
                          ? "bg-[#0870e8] text-white shadow-[0_0_12px_rgba(8,112,232,0.6)]"
                          : "bg-white/[0.08] text-slate-500 border border-white/[0.1]"
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.number}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden sm:inline ${
                        isCurrent
                          ? "text-white font-bold"
                          : isPast
                          ? "text-slate-300"
                          : "text-slate-500"
                      }`}
                    >
                      Step {step.number} — {step.name}
                    </span>
                    {step.number < 5 && (
                      <div
                        className={`h-[1px] w-6 sm:w-10 ${
                          isPast ? "bg-emerald-500" : "bg-white/[0.1]"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Form Body */}
      {!isManualMode ? (
        <main className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-4 sm:px-6 py-12">
          <div className="rounded-3xl bg-[#0C101B] border border-white/[0.08] p-8 sm:p-12 space-y-8 shadow-[0_12px_45px_rgba(0,0,0,0.6)] text-center relative overflow-hidden animate-fadeIn">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 blur-[100px] pointer-events-none rounded-full" />

            <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <YouTubeIcon className="w-8 h-8 text-red-500" />
            </div>

            <div className="max-w-lg mx-auto space-y-3 relative z-10">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Build your Creator Profile
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Connect your YouTube channel and let Creator Engine automatically build your creator profile from your real channel data.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2 relative z-10">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Auto-Sync Stats
                </span>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Subscribers, total views & recent uploads retrieved.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  Calculated Reach
                </span>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Real engagement rates and per-video benchmarks.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  Content Themes
                </span>
                <p className="text-[11px] text-slate-400 leading-snug">
                  AI-mapped topics for personalized brand deals.
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2 space-y-4 relative z-10">
              <button
                type="button"
                onClick={() => setYtModalOpen(true)}
                className="btn-tactile w-full py-4 px-8 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(220,38,38,0.4)] transition-all cursor-pointer"
              >
                <YouTubeIcon className="w-5 h-5 text-white" />
                <span>Connect YouTube →</span>
              </button>

              <div className="pt-2 text-center space-y-1">
                <p className="text-xs text-slate-400">
                  Prefer to enter your information manually?
                </p>
                <button
                  type="button"
                  onClick={() => setIsManualMode(true)}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                >
                  Enter Manually →
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-center gap-4 text-2xs text-slate-500 relative z-10">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Read-only official API
              </span>
              <span>•</span>
              <span>No password required</span>
              <span>•</span>
              <span>Instant AI analysis</span>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
          {/* ========================================================================= */}
          {/* STEP 1 — ABOUT YOU */}
          {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Step 1 of 5
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Let&apos;s get to know you.
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tell us who you are so we can personalize your media kit and brand pitches.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex justify-between">
                  <span>Full Name *</span>
                  {errors.name && <span className="text-rose-400 normal-case">{errors.name}</span>}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Sharma"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl bg-[#0C101B] border text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-white/[0.1] focus:border-[#0870e8] focus:ring-[#0870e8]/20"
                  }`}
                />
              </div>

              {/* Username / Handle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex justify-between">
                  <span>Username / Creator Handle *</span>
                  {errors.handle && <span className="text-rose-400 normal-case">{errors.handle}</span>}
                </label>
                <input
                  type="text"
                  placeholder="e.g. @alextech"
                  value={formData.handle}
                  onChange={(e) => handleChange("handle", e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl bg-[#0C101B] border text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                    errors.handle
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-white/[0.1] focus:border-[#0870e8] focus:ring-[#0870e8]/20"
                  }`}
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex justify-between">
                  <span>Email *</span>
                  {errors.email && <span className="text-rose-400 normal-case">{errors.email}</span>}
                </label>
                <input
                  type="email"
                  placeholder="e.g. alex@creator.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl bg-[#0C101B] border text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-white/[0.1] focus:border-[#0870e8] focus:ring-[#0870e8]/20"
                  }`}
                />
              </div>

              {/* Profile Photo URL & Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#0870e8] to-emerald-400 overflow-hidden shrink-0">
                    <img
                      src={formData.avatar || AVATAR_PRESETS[0]}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Photo URL or choose preset below"
                    value={formData.avatar}
                    onChange={(e) => handleChange("avatar", e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#0C101B] border border-white/[0.1] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0870e8]"
                  />
                </div>

                {/* Preset Avatars Selector */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-400">Presets:</span>
                  <div className="flex gap-2">
                    {AVATAR_PRESETS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleChange("avatar", p)}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 cursor-pointer transition-transform ${
                          formData.avatar === p ? "border-[#0870e8] scale-110" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={p} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex justify-between">
                    <span>Location (City / State) *</span>
                    {errors.location && <span className="text-rose-400 normal-case">{errors.location}</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, Karnataka"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl bg-[#0C101B] border text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                      errors.location
                        ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-white/[0.1] focus:border-[#0870e8] focus:ring-[#0870e8]/20"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex justify-between">
                    <span>Country *</span>
                    {errors.country && <span className="text-rose-400 normal-case">{errors.country}</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. India"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl bg-[#0C101B] border text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                      errors.country
                        ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-white/[0.1] focus:border-[#0870e8] focus:ring-[#0870e8]/20"
                    }`}
                  />
                </div>
              </div>

              {/* Optional: Website / Portfolio URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>Website / Portfolio URL</span>
                  <span className="text-[11px] text-slate-500 font-normal">Optional</span>
                </label>
                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0C101B] border border-white/[0.1] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0870e8]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2 — YOUR CONTENT */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Step 2 of 5
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                What do you create?
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tell us what you create so we can find opportunities that actually fit your audience.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {/* Primary Niche */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex justify-between">
                  <span>Primary Niche *</span>
                  {errors.niche && <span className="text-rose-400 normal-case">{errors.niche}</span>}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {NICHE_OPTIONS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleChange("niche", n)}
                      className={`p-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center ${
                        formData.niche === n
                          ? "bg-[#0870e8] text-white border-[#0870e8] shadow-[0_0_15px_rgba(8,112,232,0.4)]"
                          : "bg-[#0C101B] text-slate-300 border-white/[0.08] hover:border-white/[0.2]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Platforms */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex justify-between">
                  <span>Content Platforms (Select all that apply) *</span>
                  {errors.platforms && <span className="text-rose-400 normal-case">{errors.platforms}</span>}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PLATFORM_OPTIONS.map((plat) => {
                    const isSelected = formData.platforms.includes(plat);
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => toggleArrayItem("platforms", plat)}
                        className={`p-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-950/70 border-blue-500 text-white"
                            : "bg-[#0C101B] text-slate-300 border-white/[0.08] hover:border-white/[0.2]"
                        }`}
                      >
                        <span>{plat}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Type */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex justify-between">
                  <span>Content Type (Select formats you produce) *</span>
                  {errors.contentTypes && <span className="text-rose-400 normal-case">{errors.contentTypes}</span>}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CONTENT_TYPE_OPTIONS.map((ct) => {
                    const isSelected = formData.contentTypes.includes(ct);
                    return (
                      <button
                        key={ct}
                        type="button"
                        onClick={() => toggleArrayItem("contentTypes", ct)}
                        className={`p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between text-left ${
                          isSelected
                            ? "bg-indigo-950/70 border-indigo-500 text-white"
                            : "bg-[#0C101B] text-slate-300 border-white/[0.08] hover:border-white/[0.2]"
                        }`}
                      >
                        <span className="truncate">{ct}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content description (Large textarea) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex justify-between">
                  <span>What type of content do you create? *</span>
                  {errors.contentDescription && (
                    <span className="text-rose-400 normal-case">{errors.contentDescription}</span>
                  )}
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. AI tools, technology tutorials, developer walkthroughs, and software breakdowns that help professionals work faster."
                  value={formData.contentDescription}
                  onChange={(e) => handleChange("contentDescription", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0C101B] border border-white/[0.1] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0870e8] resize-none text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3 — YOUR AUDIENCE */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Step 3 of 5
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Tell us about your audience.
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your audience information helps us identify brands that are most likely to work with you. Approximate numbers are completely welcome.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Primary Platform & Followers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Primary Platform *
                  </label>
                  <select
                    value={formData.primaryPlatform}
                    onChange={(e) => handleChange("primaryPlatform", e.target.value as PlatformType)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0C101B] border border-white/[0.1] text-white focus:outline-none focus:border-[#0870e8]"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X">X (Twitter)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex justify-between">
                    <span>Followers / Subscribers *</span>
                    {errors.followerCount && (
                      <span className="text-rose-400 normal-case">{errors.followerCount}</span>
                    )}
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 25000"
                    value={formData.followerCount || ""}
                    onChange={(e) => handleChange("followerCount", Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0C101B] border border-white/[0.1] text-white focus:outline-none focus:border-[#0870e8]"
                  />
                </div>
              </div>

              {/* Average Views & Engagement Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex justify-between">
                    <span>Average Views *</span>
                    {errors.averageViews && (
                      <span className="text-rose-400 normal-case">{errors.averageViews}</span>
                    )}
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 42000"
                    value={formData.averageViews || ""}
                    onChange={(e) => handleChange("averageViews", Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0C101B] border border-white/[0.1] text-white focus:outline-none focus:border-[#0870e8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex justify-between">
                    <span>Engagement Rate (%) *</span>
                    {errors.engagementRate && (
                      <span className="text-rose-400 normal-case">{errors.engagementRate}</span>
                    )}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 6.8"
                    value={formData.engagementRate || ""}
                    onChange={(e) => handleChange("engagementRate", Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0C101B] border border-white/[0.1] text-white focus:outline-none focus:border-[#0870e8]"
                  />
                </div>
              </div>

              {/* Likes & Comments (Approximate) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Average Likes (Approximate)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 3400"
                    value={formData.averageLikes || ""}
                    onChange={(e) => handleChange("averageLikes", Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0C101B] border border-white/[0.1] text-white focus:outline-none focus:border-[#0870e8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Average Comments (Approximate)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 420"
                    value={formData.averageComments || ""}
                    onChange={(e) => handleChange("averageComments", Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0C101B] border border-white/[0.1] text-white focus:outline-none focus:border-[#0870e8]"
                  />
                </div>
              </div>

              {/* Audience Age Range & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Audience Age Range
                  </label>
                  <select
                    value={formData.audienceAge}
                    onChange={(e) => handleChange("audienceAge", e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0C101B] border border-white/[0.1] text-white focus:outline-none focus:border-[#0870e8]"
                  >
                    {AGE_RANGE_OPTIONS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Audience Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. India (75%), US (15%), Global"
                    value={formData.audienceLocation}
                    onChange={(e) => handleChange("audienceLocation", e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0C101B] border border-white/[0.1] text-white focus:outline-none focus:border-[#0870e8]"
                  />
                </div>
              </div>

              {/* Audience Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Audience Description
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Software engineers, computer science students, and startup founders interested in practical coding and developer productivity."
                  value={formData.audienceDescription}
                  onChange={(e) => handleChange("audienceDescription", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0C101B] border border-white/[0.1] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0870e8] resize-none text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4 — YOUR GOALS */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Step 4 of 5
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                What opportunities are you looking for?
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Specify your monetization goals so we prioritize high-yield sponsorships and deals.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {/* Multi-select Opportunities */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex justify-between">
                  <span>Opportunities You Seek *</span>
                  {errors.opportunityPreferences && (
                    <span className="text-rose-400 normal-case">{errors.opportunityPreferences}</span>
                  )}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {OPPORTUNITY_OPTIONS.map((opp) => {
                    const isSelected = formData.opportunityPreferences.includes(opp);
                    return (
                      <button
                        key={opp}
                        type="button"
                        onClick={() => toggleArrayItem("opportunityPreferences", opp)}
                        className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between text-left ${
                          isSelected
                            ? "bg-blue-950/70 border-blue-500 text-white"
                            : "bg-[#0C101B] text-slate-300 border-white/[0.08] hover:border-white/[0.2]"
                        }`}
                      >
                        <span>{opp}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred collaboration type */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Preferred Collaboration Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COLLABORATION_TYPES.map((ct) => (
                    <button
                      key={ct}
                      type="button"
                      onClick={() => handleChange("collaborationType", ct)}
                      className={`p-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center ${
                        formData.collaborationType === ct
                          ? "bg-[#0870e8] text-white border-[#0870e8]"
                          : "bg-[#0C101B] text-slate-300 border-white/[0.08] hover:border-white/[0.2]"
                      }`}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly income goal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>Monthly Income Goal (INR ₹)</span>
                  <span className="text-[11px] text-slate-500 font-normal">Optional</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={formData.monthlyIncomeGoal || ""}
                  onChange={(e) => handleChange("monthlyIncomeGoal", Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0C101B] border border-white/[0.1] text-white focus:outline-none focus:border-[#0870e8]"
                />
              </div>

              {/* Preferred brands or industries */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>What brands or industries would you like to work with?</span>
                  <span className="text-[11px] text-slate-500 font-normal">Optional</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI SaaS, Developer Tools, Productivity, Consumer Electronics"
                  value={formData.preferredIndustries}
                  onChange={(e) => handleChange("preferredIndustries", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0C101B] border border-white/[0.1] text-white focus:outline-none focus:border-[#0870e8]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5 — PROFILE REVIEW */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Step 5 of 5 — Review
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Your Creator Profile is Ready
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Review your creator summary below. Launching will calibrate your recommendations and unlock personalized brand opportunities.
              </p>
            </div>

            {/* Polished Summary Card */}
            <div className="rounded-3xl bg-[#0C101B] border border-white/[0.1] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0870e8] via-indigo-500 to-emerald-400" />

              {/* Creator Identity */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#0870e8] to-emerald-400 overflow-hidden shrink-0">
                  <img
                    src={formData.avatar || AVATAR_PRESETS[0]}
                    alt={formData.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xl font-black text-white">{formData.name}</h3>
                  <p className="text-xs font-mono text-slate-400">{formData.handle}</p>
                  <p className="text-xs text-blue-400 font-semibold pt-0.5">
                    {formData.niche} • {formData.country}
                  </p>
                </div>
              </div>

              {/* Platforms & Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Followers
                  </span>
                  <span className="text-lg font-black text-white">
                    {formData.followerCount >= 1000
                      ? `${(formData.followerCount / 1000).toFixed(formData.followerCount % 1000 === 0 ? 0 : 1)}K`
                      : formData.followerCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Avg Views
                  </span>
                  <span className="text-lg font-black text-white">
                    {formData.averageViews >= 1000
                      ? `${(formData.averageViews / 1000).toFixed(formData.averageViews % 1000 === 0 ? 0 : 1)}K`
                      : formData.averageViews}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Engagement
                  </span>
                  <span className="text-lg font-black text-emerald-400">
                    {formData.engagementRate}%
                  </span>
                </div>
              </div>

              {/* Platforms */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Broadcast Platforms:
                </span>
                <p className="text-sm font-semibold text-slate-200">
                  {formData.platforms.join(" • ")}
                </p>
              </div>

              {/* Content Description */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Content Focus:
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {formData.contentDescription}
                </p>
              </div>

              {/* Looking For */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Looking For:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.opportunityPreferences.map((opp) => (
                    <span
                      key={opp}
                      className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300 text-xs font-medium"
                    >
                      {opp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Monthly Goal */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-sm">
                <span className="text-slate-400">Monthly Target:</span>
                <span className="font-extrabold text-emerald-400 font-mono text-base">
                  ₹{Number(formData.monthlyIncomeGoal || 50000).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM FORM CONTROLS (Sticky touch-friendly buttons for mobile-first experience) */}
        <div className="pt-8 border-t border-white/[0.08] flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="btn-tactile px-5 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentStep === 5 ? "← Edit Profile" : "Back"}</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleContinue}
              className="btn-tactile px-8 py-3.5 rounded-full bg-[#0870e8] hover:bg-blue-600 text-white font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(8,112,232,0.4)] cursor-pointer transition-all ml-auto"
            >
              <span>Continue →</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLaunch}
              className="btn-tactile px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0870e8] via-blue-600 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-black text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(8,112,232,0.5)] cursor-pointer transition-all ml-auto"
            >
              <span>Launch Creator Engine →</span>
            </button>
          )}
        </div>
      </main>
      )}

      {/* YouTube Connection Modal */}
      <YouTubeConnectModal
        isOpen={ytModalOpen}
        onClose={() => setYtModalOpen(false)}
        onManualClick={() => setIsManualMode(true)}
      />
    </div>
  );
}

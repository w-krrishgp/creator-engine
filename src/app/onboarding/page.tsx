"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCreator, calculateProfileCompletion } from "@/context/CreatorContext";
import {
  OnboardingFormData,
  PlatformType,
  CreatorStageType,
  ExperienceLevelType,
} from "@/types/creator";
import { MOCK_CREATORS } from "@/data/mockCreators";
import {
  User,
  Share2,
  Users,
  Target,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  RotateCcw,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";

// Initial blank form data template
const BLANK_FORM: OnboardingFormData = {
  name: "",
  handle: "",
  niche: "",
  creatorStage: "Micro (10k-50k)",
  experienceLevel: "Growing (1-3 yrs)",
  bio: "",
  primaryPlatform: "Instagram",
  followerCount: 0,
  secondaryPlatform: "",
  secondaryFollowers: 0,
  engagementRate: 4.5,
  audienceDemographic: "",
  location: "",
  contentFormat: "",
  contentFrequency: "Consistent (3-5 posts/wk)",
  primaryGoal: "Brand Partnerships & Sponsored Deals",
  monetisationGoals: ["Brand Collaborations"],
  monthlyIncomeTarget: 50000,
};

// Popular preset niches
const POPULAR_NICHES = [
  "Fitness & Nutrition",
  "Personal Finance & Investing",
  "Tech & Developer Tools",
  "Creator Economy",
  "Health & Wellness",
  "Productivity & AI",
  "Fashion & Lifestyle",
  "Education & Career",
];

// Popular audiences
const POPULAR_AUDIENCES = [
  "College students & young fitness beginners (18-24)",
  "Tech professionals & young corporate investors (24-34)",
  "Startup founders, engineers & tech operators",
  "Early-career corporate workers & aspiring entrepreneurs",
  "Gen-Z students & first-time investors",
];

// Popular content formats
const POPULAR_FORMATS = [
  "Short-form video, Reels & TikToks",
  "Educational carousels & infographics",
  "Long-form tutorials & YouTube breakdowns",
  "Written frameworks, threads & newsletters",
  "Case studies & tear-down carousels",
];

// Available monetization goals
const MONETISATION_OPTIONS = [
  { id: "Brand Collaborations", label: "Brand Collaborations & Sponsorships", desc: "Sponsored posts, dedicated reviews & brand ambassadorships" },
  { id: "Digital Guides & E-books", label: "Digital Guides & E-books", desc: "Notion templates, workout PDFs, cheat sheets & blueprints" },
  { id: "1:1 Consulting & Calls", label: "1:1 Consulting & Advisory", desc: "Paid strategy sessions, audit calls & custom coaching" },
  { id: "Affiliate Supplements / Tools", label: "Affiliate & Partner Commissions", desc: "Supplements, SaaS software tools & curated storefronts" },
  { id: "Corporate Workshops", label: "Corporate Workshops & Talks", desc: "Paid B2B sessions on finance, wellness & engineering skills" },
  { id: "Paid Newsletter / Community", label: "Paid Community & Newsletter", desc: "Recurring subscription revenue via private circles" },
];

export default function OnboardingPage() {
  const { activeCreator, completeOnboarding, switchCreator, showToast } = useCreator();

  // Step 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [confirmedDeclaration, setConfirmedDeclaration] = useState<boolean>(true);

  // Form State initialized from active creator or blank
  const [formData, setFormData] = useState<OnboardingFormData>(() => {
    return {
      name: activeCreator?.name || "",
      handle: activeCreator?.handle || "",
      niche: activeCreator?.niche || "",
      creatorStage: activeCreator?.creatorStage || "Micro (10k-50k)",
      experienceLevel: activeCreator?.experienceLevel || "Growing (1-3 yrs)",
      bio: activeCreator?.bio || "",
      primaryPlatform: activeCreator?.primaryPlatform || "Instagram",
      followerCount: activeCreator?.followerCount || 15000,
      secondaryPlatform: activeCreator?.secondaryPlatform || "",
      secondaryFollowers: activeCreator?.secondaryFollowers || 0,
      engagementRate: activeCreator?.engagementRate || 4.5,
      audienceDemographic: activeCreator?.audienceDemographic || "",
      location: activeCreator?.location || "",
      contentFormat: activeCreator?.contentFormat || "",
      contentFrequency: activeCreator?.contentFrequency || "Consistent (3-5 posts/wk)",
      primaryGoal: activeCreator?.primaryGoal || "Brand Partnerships & Sponsored Deals",
      monetisationGoals: activeCreator?.monetisationGoals || ["Brand Collaborations"],
      monthlyIncomeTarget: activeCreator?.monthlyIncomeTarget || 50000,
    };
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic profile completion score
  const completionScore = calculateProfileCompletion({
    ...formData,
    id: "temp",
    avatar: "",
    title: "",
    topics: [],
    activeDealsCount: 0,
    estimatedPipelineValue: 0,
    monthlyGrowthRate: 0,
    avgImpressionsPerPost: 0,
  });

  // Handle single field change and clear its error
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

  // Toggle monetization goal checkbox
  const toggleMonetisationGoal = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.monetisationGoals.includes(goal);
      const nextGoals = exists
        ? prev.monetisationGoals.filter((g) => g !== goal)
        : [...prev.monetisationGoals, goal];
      return { ...prev, monetisationGoals: nextGoals };
    });
  };

  // Hackathon demo profile loaders
  const loadDemoProfile = (creatorKey: "rahul" | "priya" | "blank") => {
    if (creatorKey === "blank") {
      setFormData(BLANK_FORM);
      setErrors({});
      showToast("Reset form to blank template for manual entry", "info");
      return;
    }

    const demo = MOCK_CREATORS[creatorKey];
    if (!demo) return;

    setFormData({
      name: demo.name,
      handle: demo.handle,
      niche: demo.niche,
      creatorStage: demo.creatorStage,
      experienceLevel: demo.experienceLevel || "Growing (1-3 yrs)",
      bio: demo.bio,
      primaryPlatform: demo.primaryPlatform,
      followerCount: demo.followerCount,
      secondaryPlatform: demo.secondaryPlatform || "",
      secondaryFollowers: demo.secondaryFollowers || 0,
      engagementRate: demo.engagementRate,
      audienceDemographic: demo.audienceDemographic,
      location: demo.location,
      contentFormat: demo.contentFormat,
      contentFrequency: demo.contentFrequency || "Consistent (3-5 posts/wk)",
      primaryGoal: demo.primaryGoal,
      monetisationGoals: demo.monetisationGoals || ["Brand Collaborations"],
      monthlyIncomeTarget: demo.monthlyIncomeTarget,
    });
    setErrors({});
    switchCreator(creatorKey);
    showToast(`Loaded ${demo.name}'s verified profile preset`, "success");
  };

  // Validate step before advancing
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Full name is required for your creator media kit";
      }
      if (!formData.handle.trim()) {
        newErrors.handle = "Creator handle or channel identifier is required";
      }
      if (!formData.niche.trim()) {
        newErrors.niche = "Please select or type your primary creator niche";
      }
      if (!formData.experienceLevel) {
        newErrors.experienceLevel = "Please specify your experience level";
      }
      if (!formData.creatorStage) {
        newErrors.creatorStage = "Please choose your current growth stage";
      }
    } else if (step === 2) {
      if (!formData.primaryPlatform) {
        newErrors.primaryPlatform = "Select your primary content platform";
      }
      if (!formData.followerCount || formData.followerCount <= 0) {
        newErrors.followerCount = "Enter a valid follower count greater than 0";
      }
      if (
        formData.secondaryPlatform &&
        (!formData.secondaryFollowers || formData.secondaryFollowers <= 0)
      ) {
        newErrors.secondaryFollowers = "Please enter follower count for secondary platform";
      }
    } else if (step === 3) {
      if (!formData.audienceDemographic.trim()) {
        newErrors.audienceDemographic = "Describe your audience demographic or choose a suggestion";
      }
      if (!formData.location.trim()) {
        newErrors.location = "Geographic location or primary audience market is required";
      }
      if (!formData.contentFormat.trim()) {
        newErrors.contentFormat = "Select or enter your primary content format";
      }
      if (!formData.contentFrequency) {
        newErrors.contentFrequency = "Please specify your publishing frequency";
      }
    } else if (step === 4) {
      if (!formData.primaryGoal.trim()) {
        newErrors.primaryGoal = "Please choose your main business objective";
      }
      if (formData.monetisationGoals.length === 0) {
        newErrors.monetisationGoals = "Select at least one monetisation focus channel";
      }
    } else if (step === 5) {
      if (!confirmedDeclaration) {
        newErrors.declaration = "Please confirm the accuracy of your self-reported parameters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Advance to next step
  const handleContinue = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        handleSubmit();
      }
    } else {
      showToast("Please complete the required fields marked in red", "warning");
    }
  };

  // Go to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Jump to specific step (if prior steps completed or navigating backwards)
  const jumpToStep = (targetStep: number) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (targetStep === currentStep) {
      return;
    } else {
      // Validate current step before allowing forward jump
      if (validateStep(currentStep)) {
        setCurrentStep(targetStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        showToast("Please complete the current step before jumping ahead", "warning");
      }
    }
  };

  // Final submission
  const handleSubmit = () => {
    if (!validateStep(5)) return;

    completeOnboarding(formData);
    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const steps = [
    { number: 1, title: "About You", desc: "Identity & Niche" },
    { number: 2, title: "Platforms", desc: "Channels & Reach" },
    { number: 3, title: "Audience", desc: "Demographics & Format" },
    { number: 4, title: "Goals", desc: "Revenue & Targets" },
    { number: 5, title: "Review", desc: "Inspect & Launch" },
  ];

  // SUCCESS STATE VIEW
  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8 animate-fadeIn">
        {/* Success Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/75 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 sm:p-10 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0870e8] via-indigo-600 to-emerald-500" />

          {/* Celebration Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0870e8] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#0870e8]" />
              Onboarding Complete & Engine Calibrated
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome to Creator Engine, {formData.name.split(" ")[0]}!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
              Your profile parameters have been recorded in local application state. Your personalized 30-60-90 day growth roadmap, brand compatibility scoring, and monetisation benchmarks are now live.
            </p>
          </div>

          {/* Snapshot Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-left">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Niche</p>
              <p className="text-sm sm:text-base font-bold text-slate-900 truncate mt-1">{formData.niche}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Channel</p>
              <p className="text-sm sm:text-base font-bold text-slate-900 truncate mt-1">
                {formData.primaryPlatform} ({formData.followerCount.toLocaleString()})
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stage & Level</p>
              <p className="text-sm sm:text-base font-bold text-slate-900 truncate mt-1">{formData.creatorStage}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Income</p>
              <p className="text-sm sm:text-base font-bold text-emerald-700 truncate mt-1 font-mono">
                ₹{formData.monthlyIncomeTarget.toLocaleString()} / mo
              </p>
            </div>
          </div>

          {/* Self-Reported Metrics Transparency Badge */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 bg-blue-50/50 p-3 sm:p-3.5 rounded-full border border-blue-100 max-w-lg mx-auto">
            <ShieldCheck className="w-4 h-4 text-[#0870e8] shrink-0" />
            <span>Data stored as self-reported metrics. You can edit any parameter anytime from your Profile tab.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0870e8] hover:bg-[#0761c9] text-white font-bold text-sm shadow-[0_4px_14px_rgba(8,112,232,0.25)] transition-all btn-tactile cursor-pointer"
            >
              <span>Go to Executive Overview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/profile"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold text-sm shadow-2xs transition-all btn-tactile cursor-pointer"
            >
              <span>View Media Kit Profile</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                setCurrentStep(1);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-slate-600 hover:text-slate-900 text-sm font-bold btn-tactile cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Edit Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Editorial Demo Notice */}
      <DemoDisclaimer text="Creator Engine multi-stage onboarding calibrates your strategic recommendations based on self-reported data. All entered parameters are saved in local application state." />

      {/* TOP BAR: Hackathon Quick Load & Live Readiness Score */}
      <div className="bg-white rounded-2xl border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left: Heading & Hackathon presets */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="blue" size="sm">
              Creator Onboarding
            </Badge>
            <span className="text-xs text-slate-400 font-medium">•</span>
            <span className="text-xs sm:text-sm text-slate-600 font-semibold">Step {currentStep} of 5</span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {currentStep === 1 && "Stage 1: About Your Creator Identity"}
              {currentStep === 2 && "Stage 2: Your Platforms & Audience Reach"}
              {currentStep === 3 && "Stage 3: Audience Persona & Content Rhythm"}
              {currentStep === 4 && "Stage 4: Strategic Goals & Revenue Focus"}
              {currentStep === 5 && "Stage 5: Review & Confirm Profile"}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
              Self-reported data is used to personalize brand match scoring, viability forecasts, and SOP playbooks.
            </p>
          </div>

          {/* Hackathon Preset Buttons */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Demo Presets:</span>
            <button
              type="button"
              onClick={() => loadDemoProfile("rahul")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50/80 hover:bg-blue-100/80 text-[#0870e8] text-xs sm:text-sm font-bold border border-blue-200/80 transition-all btn-tactile cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0870e8]" />
              <span>⚡ Rahul (IG Fitness)</span>
            </button>
            <button
              type="button"
              onClick={() => loadDemoProfile("priya")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50/80 hover:bg-indigo-100/80 text-indigo-700 text-xs sm:text-sm font-bold border border-indigo-200/80 transition-all btn-tactile cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>⚡ Priya (LinkedIn Wealth)</span>
            </button>
            <button
              type="button"
              onClick={() => loadDemoProfile("blank")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200 transition-all btn-tactile cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Start Blank</span>
            </button>
          </div>
        </div>

        {/* Right: Live Profile Readiness Meter */}
        <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 min-w-[220px] space-y-2.5 shrink-0 shadow-2xs">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0870e8]" />
              Profile Completion
            </span>
            <span className={`font-mono font-bold text-sm sm:text-base ${completionScore >= 80 ? "text-emerald-700" : "text-[#0870e8]"}`}>
              {completionScore}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                completionScore >= 85 ? "bg-emerald-500" : "bg-[#0870e8]"
              }`}
              style={{ width: `${completionScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 leading-normal">
            Updates in real-time as you fill required parameters.
          </p>
        </div>
      </div>

      {/* VISIBLE 5-STAGE STEPPER INDICATOR */}
      <div className="bg-white rounded-2xl border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-3 sm:p-4 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[640px]">
          {steps.map((s, index) => {
            const isCompleted = currentStep > s.number;
            const isCurrent = currentStep === s.number;

            return (
              <React.Fragment key={s.number}>
                <button
                  type="button"
                  onClick={() => jumpToStep(s.number)}
                  className={`flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl text-left transition-all btn-tactile cursor-pointer ${
                    isCurrent
                      ? "bg-blue-50/80 text-blue-900 font-bold"
                      : isCompleted
                      ? "text-slate-700 hover:bg-slate-50"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 transition-colors ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                        ? "bg-[#0870e8] text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.number}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs sm:text-sm leading-tight ${isCurrent ? "font-bold text-blue-900" : "font-semibold"}`}>
                      {s.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{s.desc}</p>
                  </div>
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-colors ${
                      currentStep > s.number ? "bg-emerald-400" : "bg-slate-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STAGE FORM CONTAINER */}
      <Card className="rounded-2xl border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)]">
        <CardContent className="p-5 sm:p-8 space-y-6">
          {/* ========================================================================= */}
          {/* STAGE 1: ABOUT YOU */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 sm:space-y-7 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg sm:text-xl">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <span>Who are you and what do you create?</span>
                </div>
                <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                  Tell us your creator identity, your niche specialization, and where you are in your journey.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                    <span>Full Name *</span>
                    {errors.name && <span className="text-xs text-rose-600 font-medium">{errors.name}</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.name
                        ? "border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
                    }`}
                  />
                  <p className="text-xs text-slate-500">Used for media kits and sponsor communication.</p>
                </div>

                {/* Handle / Channel ID */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                    <span>Creator Handle / Identifier *</span>
                    {errors.handle && <span className="text-xs text-rose-600 font-medium">{errors.handle}</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. @rahulfit.india or priya-finance"
                    value={formData.handle}
                    onChange={(e) => handleChange("handle", e.target.value)}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.handle
                        ? "border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
                    }`}
                  />
                  <p className="text-xs text-slate-500">Public profile slug or social handle.</p>
                </div>
              </div>

              {/* Creator Niche */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                  <span>Primary Creator Niche *</span>
                  {errors.niche && <span className="text-xs text-rose-600 font-medium">{errors.niche}</span>}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fitness & Nutrition, Personal Finance, Tech Tools"
                  value={formData.niche}
                  onChange={(e) => handleChange("niche", e.target.value)}
                  className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.niche
                      ? "border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
                  }`}
                />

                {/* Popular Niche Suggestion Chips */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-semibold text-slate-500">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_NICHES.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => handleChange("niche", n)}
                        className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${
                          formData.niche === n
                            ? "bg-blue-50 text-blue-700 border-blue-300 font-semibold"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                  <span>Creator Experience Level *</span>
                  {errors.experienceLevel && (
                    <span className="text-xs text-rose-600 font-medium">{errors.experienceLevel}</span>
                  )}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: "Emerging (< 1 yr)" as ExperienceLevelType,
                      title: "Emerging",
                      subtitle: "Under 1 year",
                      desc: "Setting up foundations, initial audience building & first brand pitches",
                    },
                    {
                      id: "Growing (1-3 yrs)" as ExperienceLevelType,
                      title: "Growing",
                      subtitle: "1 - 3 years",
                      desc: "Established routine, expanding into multiple formats & regular brand deals",
                    },
                    {
                      id: "Established (3+ yrs)" as ExperienceLevelType,
                      title: "Established",
                      subtitle: "3+ years",
                      desc: "Recognized industry voice, high commercial viability & diversified revenue",
                    },
                  ].map((exp) => (
                    <div
                      key={exp.id}
                      onClick={() => handleChange("experienceLevel", exp.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.experienceLevel === exp.id
                          ? "bg-blue-50/70 border-blue-500 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">{exp.title}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                          {exp.subtitle}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Stage */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                  <span>Audience Tier / Growth Stage *</span>
                  {errors.creatorStage && (
                    <span className="text-xs text-rose-600 font-medium">{errors.creatorStage}</span>
                  )}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(["Nano (1k-10k)", "Micro (10k-50k)", "Mid-Tier (50k-200k)", "Macro (200k+)"] as CreatorStageType[]).map(
                    (stage) => (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => handleChange("creatorStage", stage)}
                        className={`p-3.5 rounded-xl border text-center transition-all ${
                          formData.creatorStage === stage
                            ? "bg-blue-600 text-white font-bold border-blue-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-semibold"
                        }`}
                      >
                        <p className="text-xs sm:text-sm font-bold">{stage.split(" ")[0]}</p>
                        <p className={`text-xs mt-0.5 ${formData.creatorStage === stage ? "text-blue-100" : "text-slate-400"}`}>
                          {stage.split(" ")[1]}
                        </p>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Bio & Pitch */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">
                  <span>Elevator Pitch / Bio (Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Helping college students stay fit on a budget. Daily hostel meal prep & calisthenics tutorials."
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
                />
                <p className="text-xs text-slate-500">
                  Used by our AI Pitch Generator and brand compatibility matchmaker.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 2: YOUR PLATFORMS */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6 sm:space-y-7 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg sm:text-xl">
                  <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <span>Your Content Platforms & Followers</span>
                </div>
                <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                  Specify your primary broadcast channel and audience size.
                </p>
              </div>

              {/* CRITICAL TRANSPARENCY NOTICE */}
              <div className="p-4 sm:p-5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Transparency Notice: Self-Reported Channel Data</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                  Metrics entered here are manually declared by the creator and saved in local state. Creator Engine does <strong>not</strong> claim live OAuth access or verified account connection at this stage. These metrics will be calibrated against public industry benchmarks.
                </p>
              </div>

              {/* Primary Platform Selection */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                  <span>Primary Content Platform *</span>
                  {errors.primaryPlatform && (
                    <span className="text-xs text-rose-600 font-medium">{errors.primaryPlatform}</span>
                  )}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(["Instagram", "LinkedIn", "YouTube", "TikTok", "X"] as PlatformType[]).map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => handleChange("primaryPlatform", plat)}
                      className={`p-3.5 sm:p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        formData.primaryPlatform === plat
                          ? "bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-xs"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold">{plat}</span>
                      <span className="text-xs text-slate-400">
                        {plat === "Instagram" ? "Visual / Reels" : plat === "LinkedIn" ? "B2B / Carousels" : plat === "YouTube" ? "Video / Shorts" : plat === "TikTok" ? "Viral Short-form" : "Text / Commentary"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Follower Count */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                  <span>Primary Channel Follower / Subscriber Count *</span>
                  {errors.followerCount && (
                    <span className="text-xs text-rose-600 font-medium">{errors.followerCount}</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 15000"
                    value={formData.followerCount || ""}
                    onChange={(e) => handleChange("followerCount", Number(e.target.value) || 0)}
                    className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.followerCount
                        ? "border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
                    }`}
                  />
                  {formData.followerCount > 0 && (
                    <div className="absolute right-3.5 top-2.5 sm:top-3 text-xs sm:text-sm font-semibold text-slate-500 pointer-events-none">
                      {formData.followerCount.toLocaleString()} followers
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-1 flex-wrap">
                  <span className="text-xs text-slate-500 font-medium">Quick presets:</span>
                  {[5000, 15000, 45000, 120000].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => handleChange("followerCount", count)}
                      className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                    >
                      {count.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Secondary Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800">
                    Secondary Platform (Optional)
                  </label>
                  <select
                    value={formData.secondaryPlatform || ""}
                    onChange={(e) => handleChange("secondaryPlatform", e.target.value as PlatformType | "")}
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                  >
                    <option value="">None (Single Platform Focus)</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                    <option value="X">X (Twitter)</option>
                  </select>
                </div>

                {Boolean(formData.secondaryPlatform) && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                      <span>Secondary Platform Followers *</span>
                      {errors.secondaryFollowers && (
                        <span className="text-xs text-rose-600 font-medium">{errors.secondaryFollowers}</span>
                      )}
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 3200"
                      value={formData.secondaryFollowers || ""}
                      onChange={(e) => handleChange("secondaryFollowers", Number(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                )}
              </div>

              {/* Self-reported engagement rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                  <span>Average Post Engagement Rate (Self-Estimated)</span>
                  <span className="text-blue-600 font-mono text-sm sm:text-base font-bold">{formData.engagementRate || 4.5}%</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="12.0"
                  step="0.1"
                  value={formData.engagementRate || 4.5}
                  onChange={(e) => handleChange("engagementRate", parseFloat(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>1.0% (Average Macro)</span>
                  <span>4.5% (Healthy Micro)</span>
                  <span>8.0%+ (High Engagement Nano)</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 3: YOUR AUDIENCE */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 sm:space-y-7 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg sm:text-xl">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <span>Who is listening and how do you reach them?</span>
                </div>
                <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                  Brand sponsors value demographic clarity and content consistency above raw follower totals.
                </p>
              </div>

              {/* Audience Demographic */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                  <span>Target Audience Demographic & Profile *</span>
                  {errors.audienceDemographic && (
                    <span className="text-xs text-rose-600 font-medium">{errors.audienceDemographic}</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="e.g. College students & young gym beginners (aged 18-24)"
                  value={formData.audienceDemographic}
                  onChange={(e) => handleChange("audienceDemographic", e.target.value)}
                  className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.audienceDemographic
                      ? "border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
                  }`}
                />
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-semibold text-slate-500">Suggested personas:</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_AUDIENCES.map((aud) => (
                      <button
                        key={aud}
                        type="button"
                        onClick={() => handleChange("audienceDemographic", aud)}
                        className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${
                          formData.audienceDemographic === aud
                            ? "bg-blue-50 text-blue-700 border-blue-300 font-semibold"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {aud}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Geographic Location */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                  <span>Primary Location / Geographic Market *</span>
                  {errors.location && <span className="text-xs text-rose-600 font-medium">{errors.location}</span>}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, India or Global / North America"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.location
                      ? "border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
                  }`}
                />
                <div className="flex gap-2 pt-1 flex-wrap">
                  <span className="text-xs text-slate-500 font-medium">Quick options:</span>
                  {["Bengaluru, India", "Mumbai, India", "Delhi NCR, India", "Pan-India", "Global / Remote"].map(
                    (loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleChange("location", loc)}
                        className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                      >
                        {loc}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Content Formats */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                  <span>Core Content Formats *</span>
                  {errors.contentFormat && (
                    <span className="text-xs text-rose-600 font-medium">{errors.contentFormat}</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="e.g. High-energy Reels, workout carousels, nutrition guides"
                  value={formData.contentFormat}
                  onChange={(e) => handleChange("contentFormat", e.target.value)}
                  className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.contentFormat
                      ? "border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
                  }`}
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {POPULAR_FORMATS.map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => handleChange("contentFormat", fmt)}
                      className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${
                        formData.contentFormat === fmt
                          ? "bg-blue-50 text-blue-700 border-blue-300 font-semibold"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Frequency */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                  <span>Publishing Frequency *</span>
                  {errors.contentFrequency && (
                    <span className="text-xs text-rose-600 font-medium">{errors.contentFrequency}</span>
                  )}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "Daily (6-7 posts/wk)", label: "Daily", sub: "6-7 posts / week" },
                    { id: "Consistent (3-5 posts/wk)", label: "Consistent", sub: "3-5 posts / week" },
                    { id: "Steady (1-2 posts/wk)", label: "Steady", sub: "1-2 posts / week" },
                    { id: "Periodic (Bi-weekly)", label: "Periodic", sub: "Bi-weekly deep dives" },
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => handleChange("contentFrequency", freq.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        formData.contentFrequency === freq.id
                          ? "bg-blue-50 border-blue-500 shadow-xs"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <p className={`text-xs sm:text-sm font-bold ${formData.contentFrequency === freq.id ? "text-blue-700" : "text-slate-800"}`}>
                        {freq.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{freq.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 4: YOUR GOALS */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-6 sm:space-y-7 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg sm:text-xl">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <span>Strategic Goals & Monetisation Engine</span>
                </div>
                <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                  Creator Engine adapts your workflow tasks, outreach briefs, and revenue models to these objectives.
                </p>
              </div>

              {/* Primary Strategic Goal */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                  <span>Primary Business Goal *</span>
                  {errors.primaryGoal && (
                    <span className="text-xs text-rose-600 font-medium">{errors.primaryGoal}</span>
                  )}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "Brand Partnerships & Sponsored Deals",
                      title: "Brand Partnerships & Sponsorships",
                      desc: "Monetize content via sponsored integrations, brand ambassadors & rate card scaling.",
                    },
                    {
                      id: "High-Ticket Consulting & Advisory Clients",
                      title: "High-Ticket Consulting & Advisory",
                      desc: "Attract corporate clients, founders & private coaching advisory mandates.",
                    },
                    {
                      id: "Audience Growth & Distribution Scale",
                      title: "Audience Growth & Distribution",
                      desc: "Prioritize top-of-funnel reach, viral format experimentation & audience expansion.",
                    },
                    {
                      id: "Digital Products & Paid Community",
                      title: "Digital Products & Creator IP",
                      desc: "Launch e-books, Notion templates, workshops & private member communities.",
                    },
                  ].map((goal) => (
                    <div
                      key={goal.id}
                      onClick={() => handleChange("primaryGoal", goal.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.primaryGoal === goal.id
                          ? "bg-blue-50/70 border-blue-500 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            formData.primaryGoal === goal.id
                              ? "border-blue-600 bg-blue-600"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {formData.primaryGoal === goal.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm sm:text-base font-bold text-slate-900">{goal.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mt-2 pl-6 leading-relaxed">{goal.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monetisation Channels Multi-select */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                  <span>Active & Planned Monetisation Channels (Select all that apply) *</span>
                  {errors.monetisationGoals && (
                    <span className="text-xs text-rose-600 font-medium">{errors.monetisationGoals}</span>
                  )}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MONETISATION_OPTIONS.map((opt) => {
                    const isSelected = formData.monetisationGoals.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleMonetisationGoal(opt.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                          isSelected
                            ? "bg-blue-50/70 border-blue-400"
                            : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Controlled via parent div click
                          className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-900">{opt.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monthly Income Target */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800">
                    Monthly Revenue Target (INR equivalent)
                  </label>
                  <span className="text-sm sm:text-base font-bold text-emerald-700 font-mono">
                    ₹{formData.monthlyIncomeTarget.toLocaleString()} / month
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 sm:top-3 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    placeholder="e.g. 50000"
                    value={formData.monthlyIncomeTarget || ""}
                    onChange={(e) => handleChange("monthlyIncomeTarget", Number(e.target.value) || 0)}
                    className="w-full pl-8 pr-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div className="flex gap-2 pt-1 flex-wrap">
                  <span className="text-xs text-slate-500 font-medium">Quick targets:</span>
                  {[25000, 50000, 100000, 200000, 500000].map((tgt) => (
                    <button
                      key={tgt}
                      type="button"
                      onClick={() => handleChange("monthlyIncomeTarget", tgt)}
                      className="text-xs px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                    >
                      ₹{(tgt / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 5: REVIEW */}
          {/* ========================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-6 sm:space-y-7 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg sm:text-xl">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  <span>Review & Verify Completed Profile</span>
                </div>
                <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                  Inspect your calibrated creator profile before launching Creator Engine. You can jump directly to any step to make edits.
                </p>
              </div>

              {/* Review Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Identity Review Card */}
                <div className="p-4 sm:p-5 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">1. Identity & Niche</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Name:</span>
                      <span className="font-bold text-slate-900">{formData.name || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Handle:</span>
                      <span className="font-semibold text-slate-700">{formData.handle || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Niche:</span>
                      <span className="font-bold text-blue-700">{formData.niche || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Experience:</span>
                      <span className="font-semibold text-slate-700">{formData.experienceLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Growth Stage:</span>
                      <span className="font-semibold text-slate-700">{formData.creatorStage}</span>
                    </div>
                    {formData.bio && (
                      <p className="text-xs text-slate-500 pt-1.5 italic border-t border-slate-100 leading-relaxed">
                        &quot;{formData.bio}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Platforms Review Card */}
                <div className="p-4 sm:p-5 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">2. Platform Channels</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Primary Channel:</span>
                      <Badge variant="blue" size="sm">
                        {formData.primaryPlatform}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Declared Followers:</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {formData.followerCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Est. Engagement:</span>
                      <span className="font-semibold text-slate-700 font-mono">{formData.engagementRate}%</span>
                    </div>
                    {formData.secondaryPlatform && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Secondary Channel:</span>
                        <span className="font-semibold text-slate-700">
                          {formData.secondaryPlatform} ({(formData.secondaryFollowers || 0).toLocaleString()})
                        </span>
                      </div>
                    )}
                    <div className="pt-1.5 border-t border-slate-100">
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                        <Info className="w-3.5 h-3.5 shrink-0" />
                        <span>Self-reported data (no live OAuth)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Audience Review Card */}
                <div className="p-4 sm:p-5 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">3. Audience & Strategy</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div>
                      <p className="text-slate-500 text-xs">Audience Persona:</p>
                      <p className="font-semibold text-slate-800 leading-snug mt-0.5">{formData.audienceDemographic}</p>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500">Primary Location:</span>
                      <span className="font-semibold text-slate-800">{formData.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Publishing Rhythm:</span>
                      <span className="font-semibold text-slate-800">{formData.contentFrequency}</span>
                    </div>
                    <div className="pt-1">
                      <p className="text-slate-500 text-xs">Content Format:</p>
                      <p className="font-medium text-slate-700 mt-0.5">{formData.contentFormat}</p>
                    </div>
                  </div>
                </div>

                {/* 4. Goals Review Card */}
                <div className="p-4 sm:p-5 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">4. Revenue & Monetisation</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div>
                      <p className="text-slate-500 text-xs">Primary Business Goal:</p>
                      <p className="font-bold text-slate-900 mt-0.5">{formData.primaryGoal}</p>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500">Monthly Target:</span>
                      <span className="font-bold text-emerald-700 font-mono">
                        ₹{formData.monthlyIncomeTarget.toLocaleString()} / mo
                      </span>
                    </div>
                    <div className="pt-1">
                      <p className="text-slate-500 text-xs mb-1.5">Active Revenue Focus:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.monetisationGoals.map((g) => (
                          <span
                            key={g}
                            className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded border border-slate-200"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmedDeclaration}
                    onChange={(e) => {
                      setConfirmedDeclaration(e.target.checked);
                      if (errors.declaration) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.declaration;
                          return next;
                        });
                      }
                    }}
                    className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900">Accuracy & Transparency Confirmation: </span>
                    I verify that these parameters reflect my current creator positioning and self-reported metrics. I understand that Creator Engine uses this data locally to generate compatibility matches and revenue projections without live account OAuth connections.
                  </div>
                </label>
                {errors.declaration && (
                  <p className="text-xs sm:text-sm text-rose-600 font-semibold pl-7">{errors.declaration}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>

        {/* BOTTOM CONTROLS: BACK / CONTINUE */}
        <CardFooter className="flex items-center justify-between gap-4 p-4 sm:p-6 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold shadow-2xs transition-all btn-tactile cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div /> // Spacer
          )}

          <div className="flex items-center gap-3">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-[#0870e8] hover:bg-[#0761c9] text-white text-sm font-bold shadow-[0_4px_14px_rgba(8,112,232,0.25)] transition-all btn-tactile cursor-pointer"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition-all btn-tactile cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-100" />
                <span>Confirm & Launch Creator Engine</span>
              </button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

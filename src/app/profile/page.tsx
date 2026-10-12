"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCreator, calculateProfileCompletion } from "@/context/CreatorContext";
import {
  CreatorProfile,
  PlatformType,
  CreatorStageType,
  ExperienceLevelType,
} from "@/types/creator";
import {
  User,
  ShieldCheck,
  Save,
  RotateCcw,
  Sparkles,
  Target,
  ExternalLink,
  CheckCircle2,
  Share2,
  Info,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";

export default function ProfilePage() {
  const {
    activeCreator,
    updateCreatorProfile,
    resetCreatorProfile,
    switchCreator,
  } = useCreator();

  // Local form state synced with activeCreator without cascading effect renders
  const [prevId, setPrevId] = useState(activeCreator.id);
  const [formData, setFormData] = useState<CreatorProfile>(activeCreator);
  const [copiedLink, setCopiedLink] = useState(false);

  if (prevId !== activeCreator.id) {
    setPrevId(activeCreator.id);
    setFormData(activeCreator);
  }

  const handleChange = (
    field: keyof CreatorProfile,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCreatorProfile({
      ...formData,
      isManuallyReported: true,
      isOnboarded: true,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(`https://creator-engine.demo/mediakit/${formData.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const platforms: PlatformType[] = [
    "Instagram",
    "LinkedIn",
    "YouTube",
    "TikTok",
    "X",
  ];

  const stages: CreatorStageType[] = [
    "Nano (1k-10k)",
    "Micro (10k-50k)",
    "Mid-Tier (50k-200k)",
    "Macro (200k+)",
  ];

  const experienceLevels: ExperienceLevelType[] = [
    "Emerging (< 1 yr)",
    "Growing (1-3 yrs)",
    "Established (3+ yrs)",
  ];

  const monetisationOptions = [
    "Brand Collaborations",
    "Digital Guides & E-books",
    "1:1 Consulting & Calls",
    "Affiliate Supplements / Tools",
    "Corporate Workshops",
    "Paid Newsletter / Community",
  ];

  const toggleMonetisation = (option: string) => {
    const current = formData.monetisationGoals || [];
    const exists = current.includes(option);
    const updated = exists ? current.filter((g) => g !== option) : [...current, option];
    handleChange("monetisationGoals", updated);
  };

  // Real-time calculation based on local formData edits
  const currentCompletionScore = calculateProfileCompletion(formData);

  const completionChecklist = [
    { label: "Creator Name & Handle", met: !!formData.name && !!formData.handle },
    { label: "Niche & Specialization", met: !!formData.niche },
    { label: "Experience Level", met: !!formData.experienceLevel },
    { label: "Primary Platform Selected", met: !!formData.primaryPlatform },
    { label: "Follower Metric Set", met: formData.followerCount > 0 },
    { label: "Audience Demographics Described", met: !!formData.audienceDemographic },
    { label: "Content Format Defined", met: !!formData.contentFormat },
    { label: "Publishing Frequency", met: !!formData.contentFrequency },
    { label: "Growth Stage Categorized", met: !!formData.creatorStage },
    { label: "Primary Business Goal Set", met: !!formData.primaryGoal },
    { label: "Monetisation Channels Selected", met: (formData.monetisationGoals?.length || 0) > 0 },
    { label: "Monthly Income Target Defined", met: formData.monthlyIncomeTarget > 0 },
    { label: "Creator Bio & Pitch", met: !!formData.bio },
    { label: "Geographic Location", met: !!formData.location },
  ];

  return (
    <div className="space-y-6">
      {/* Top Disclaimer */}
      <DemoDisclaimer text="Profiles are saved in local application state. Profile edits immediately recalibrate your deterministic compatibility matches on the brand marketplace and growth roadmap." />

      {/* Profile Hero Header Card */}
      <div className="bg-white rounded-[22px] border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Cover Accent Gradient */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-5 -mt-12 sm:-mt-14">
          {/* Avatar and Basic Details */}
          <div className="flex items-end gap-4 sm:gap-5 min-w-0">
            <div className="story-ring-gradient p-[3px] rounded-full shrink-0 shadow-md bg-white">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white bg-slate-100"
              />
            </div>
            <div className="pb-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {formData.name}
                </h1>
                <span title="Verified Creator Profile">
                  <ShieldCheck className="w-5 h-5 text-[#0870e8] shrink-0" />
                </span>
                <Badge variant="blue" size="sm">
                  {formData.primaryPlatform}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                @{formData.handle} • {formData.niche} • {formData.location}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-end">
            {/* Persona Switchers */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100/90 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 pl-2 pr-1 uppercase tracking-wider">Presets:</span>
              <button
                type="button"
                onClick={() => switchCreator("rahul")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeCreator.id === "rahul"
                    ? "bg-white text-blue-700 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Rahul (IG)
              </button>
              <button
                type="button"
                onClick={() => switchCreator("priya")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeCreator.id === "priya"
                    ? "bg-white text-indigo-700 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Priya (LI)
              </button>
            </div>

            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-[#0870e8] text-xs font-bold transition-all shadow-2xs btn-tactile"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0870e8]" />
              <span>Re-run Wizard</span>
            </Link>

            <button
              type="button"
              onClick={resetCreatorProfile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs btn-tactile"
              title="Reset profile data to default persona"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0870e8] hover:bg-[#0760cb] text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all btn-tactile"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transparency Banner */}
      <div className="p-3.5 rounded-[16px] bg-slate-50/90 border border-slate-200/80 text-slate-700 flex items-center justify-between gap-4 flex-wrap text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#0870e8] shrink-0" />
          <span>
            <strong>Transparency Notice:</strong> All follower counts and metrics are manually entered and self-reported by the creator. Creator Engine does not claim active OAuth API integration.
          </span>
        </div>
        <Link
          href="/onboarding"
          className="text-[#0870e8] hover:underline font-bold flex items-center gap-1 shrink-0"
        >
          <span>5-Step Guided Onboarding</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Basic Identity Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#0870e8]" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                    Core Creator Identity
                  </h3>
                </div>
                <Badge variant="blue" size="sm">
                  Public Snapshot
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>

                  {/* Public Handle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Handle / Channel *</label>
                    <input
                      type="text"
                      value={formData.handle}
                      onChange={(e) => handleChange("handle", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Niche */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Primary Niche *</label>
                    <input
                      type="text"
                      value={formData.niche}
                      onChange={(e) => handleChange("niche", e.target.value)}
                      placeholder="e.g. Fitness & Nutrition, Personal Finance"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Experience Level *</label>
                    <select
                      value={formData.experienceLevel || "Growing (1-3 yrs)"}
                      onChange={(e) => handleChange("experienceLevel", e.target.value as ExperienceLevelType)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all cursor-pointer"
                    >
                      {experienceLevels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Base Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="e.g. Bengaluru, India"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>

                  {/* Creator Stage */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Growth Stage *</label>
                    <select
                      value={formData.creatorStage}
                      onChange={(e) => handleChange("creatorStage", e.target.value as CreatorStageType)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all cursor-pointer"
                    >
                      {stages.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Creator Pitch & Bio</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] resize-none font-sans transition-all"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Audience & Channel Metrics Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#0870e8]" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                    Platform Channels & Metrics (Self-Reported)
                  </h3>
                </div>
                <Badge variant="blue" size="sm">
                  Channels
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Primary Platform */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Primary Platform *</label>
                    <select
                      value={formData.primaryPlatform}
                      onChange={(e) => handleChange("primaryPlatform", e.target.value as PlatformType)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all cursor-pointer"
                    >
                      {platforms.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Follower Count */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Declared Follower Count *</label>
                    <input
                      type="number"
                      value={formData.followerCount}
                      onChange={(e) => handleChange("followerCount", parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Secondary Platform */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Secondary Platform (Optional)</label>
                    <select
                      value={formData.secondaryPlatform || ""}
                      onChange={(e) => handleChange("secondaryPlatform", e.target.value as PlatformType | "")}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all cursor-pointer"
                    >
                      <option value="">None</option>
                      {platforms.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Secondary Followers */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Secondary Followers</label>
                    <input
                      type="number"
                      value={formData.secondaryFollowers || 0}
                      onChange={(e) => handleChange("secondaryFollowers", parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Engagement Rate */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Estimated Engagement Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.engagementRate}
                      onChange={(e) => handleChange("engagementRate", parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>

                  {/* Content Frequency */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Publishing Frequency</label>
                    <input
                      type="text"
                      value={formData.contentFrequency || "Consistent (3-5 posts/wk)"}
                      onChange={(e) => handleChange("contentFrequency", e.target.value)}
                      placeholder="e.g. 4-5 Reels / week"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>
                </div>

                {/* Audience description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Audience Demographic Profile</label>
                  <input
                    type="text"
                    value={formData.audienceDemographic}
                    onChange={(e) => handleChange("audienceDemographic", e.target.value)}
                    placeholder="e.g. College students & beginners (18-24) or Software engineers (24-34)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                  />
                </div>

                {/* Content Format */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Primary Content Formats</label>
                  <input
                    type="text"
                    value={formData.contentFormat}
                    onChange={(e) => handleChange("contentFormat", e.target.value)}
                    placeholder="e.g. 60s Reels, Educational Carousels, Long-form case studies"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Business Goals & Monetisation Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                    Business Goals & Monetisation Engine
                  </h3>
                </div>
                <Badge variant="emerald" size="sm">
                  Monetisation Target
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Primary Goal */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Primary Creator Objective *</label>
                    <input
                      type="text"
                      value={formData.primaryGoal}
                      onChange={(e) => handleChange("primaryGoal", e.target.value)}
                      placeholder="e.g. Brand Collaborations, 1:1 Consulting Clients"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                    />
                  </div>

                  {/* Monthly Income Target */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Monthly Income Target (INR)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={formData.monthlyIncomeTarget}
                        onChange={(e) => handleChange("monthlyIncomeTarget", parseInt(e.target.value) || 0)}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/15 focus:border-[#0870e8] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Monetisation Channels Multi-select */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Active & Planned Monetisation Channels
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {monetisationOptions.map((opt) => {
                      const isSelected = (formData.monetisationGoals || []).includes(opt);
                      return (
                        <div
                          key={opt}
                          onClick={() => toggleMonetisation(opt)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                            isSelected
                              ? "bg-blue-50/80 border-[#0870e8] text-[#0870e8] font-bold shadow-2xs"
                              : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50"
                          } btn-tactile`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded border-slate-300 text-[#0870e8] focus:ring-[#0870e8]"
                          />
                          <span className="truncate">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0870e8] hover:bg-[#0760cb] text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all btn-tactile"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Changes</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Right Column: Profile Readiness Gauge, Subscription, & Live Media Kit Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Subscription & Membership Tier Card */}
          <SubscriptionCard />

          {/* Profile Completion Indicator */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">Profile Completion</h3>
              </div>
              <span className="text-sm font-black text-[#0870e8] font-mono">
                {currentCompletionScore}%
              </span>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentCompletionScore >= 90
                      ? "bg-emerald-500"
                      : currentCompletionScore >= 70
                      ? "bg-[#0870e8]"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${currentCompletionScore}%` }}
                />
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {currentCompletionScore >= 90
                  ? "Outstanding! Brands get full clarity on your demographic reach, engagement, and content formats."
                  : "Fill missing fields to maximize your compatibility scores on marketplace campaigns."}
              </p>

              {/* Checklist breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Readiness Checklist ({completionChecklist.filter((c) => c.met).length}/{completionChecklist.length})
                </p>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {completionChecklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50/80 border border-slate-200/50"
                    >
                      <span className={item.met ? "text-slate-700 font-medium" : "text-slate-400"}>
                        {item.label}
                      </span>
                      {item.met ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Media Kit Card Preview */}
          <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0870e8]" /> Live Media Kit Preview
              </span>
              <Badge variant="blue" size="sm">
                Shareable
              </Badge>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="story-ring-gradient p-[2px] rounded-full shrink-0">
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    className="w-12 h-12 rounded-full object-cover border border-white"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm tracking-tight">{formData.name}</h4>
                  <p className="text-xs text-[#0870e8] font-semibold">@{formData.handle}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{formData.niche}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 shadow-2xs">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Followers</p>
                  <p className="text-sm font-extrabold text-slate-900">
                    {formData.followerCount.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-slate-400 font-medium">Self-Reported</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 shadow-2xs">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Engagement</p>
                  <p className="text-sm font-extrabold text-emerald-600">
                    {formData.engagementRate}%
                  </p>
                  <p className="text-[9px] text-slate-400 font-medium">Estimated</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs text-slate-600 space-y-1.5">
                <p>
                  <strong className="text-slate-800">Formats: </strong>
                  {formData.contentFormat}
                </p>
                <p>
                  <strong className="text-slate-800">Target Community: </strong>
                  {formData.audienceDemographic}
                </p>
                <p>
                  <strong className="text-slate-800">Publishing: </strong>
                  {formData.contentFrequency || "Consistent (3-5 posts/wk)"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs btn-tactile"
              >
                <span>{copiedLink ? "Media Kit Link Copied!" : "Copy Verified Media Kit Link"}</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/80" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

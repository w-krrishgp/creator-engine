"use client";

import React, { useState } from "react";
import { useCreator } from "@/context/CreatorContext";
import { CreatorProfile, PlatformType, CreatorStageType } from "@/types/creator";
import {
  User,
  ShieldCheck,
  Save,
  RotateCcw,
  Sparkles,
  Users,
  Target,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";

export default function ProfilePage() {
  const {
    activeCreator,
    updateCreatorProfile,
    resetCreatorProfile,
    profileCompletion,
  } = useCreator();

  // Local form state synced with activeCreator without cascading effect renders
  const [prevId, setPrevId] = useState(activeCreator.id);
  const [formData, setFormData] = useState<CreatorProfile>(activeCreator);

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
    updateCreatorProfile(formData);
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

  const completionChecklist = [
    { label: "Creator Name & Handle", met: !!formData.name && !!formData.handle },
    { label: "Niche & Specialization", met: !!formData.niche },
    { label: "Primary Platform Selected", met: !!formData.primaryPlatform },
    { label: "Follower Metric Set", met: formData.followerCount > 0 },
    { label: "Audience Demographics Described", met: !!formData.audienceDemographic },
    { label: "Content Format Defined", met: !!formData.contentFormat },
    { label: "Growth Stage Categorized", met: !!formData.creatorStage },
    { label: "Primary Business Goal Set", met: !!formData.primaryGoal },
    { label: "Monthly Income Target Defined", met: formData.monthlyIncomeTarget > 0 },
    { label: "Creator Bio & Pitch", met: !!formData.bio },
    { label: "Geographic Location", met: !!formData.location },
  ];

  return (
    <div className="space-y-6">
      {/* Top Disclaimer */}
      <DemoDisclaimer text="Profiles are saved in application state. Updates immediately recalibrate your deterministic compatibility matches on the marketplace and growth roadmap." />

      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Creator Profile & Media Kit
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fine-tune your positioning, follower counts, and income targets to personalize recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={resetCreatorProfile}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.01]"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Basic Identity Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
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
                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  {/* Public Handle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Handle / Channel</label>
                    <input
                      type="text"
                      value={formData.handle}
                      onChange={(e) => handleChange("handle", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Niche */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Primary Niche</label>
                    <input
                      type="text"
                      value={formData.niche}
                      onChange={(e) => handleChange("niche", e.target.value)}
                      placeholder="e.g. Fitness & Nutrition, Personal Finance"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Base Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="e.g. Bengaluru, India"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Creator Pitch & Bio</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none font-sans"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Audience & Channel Metrics Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Platform & Community Audience
                  </h3>
                </div>
                <Badge variant="purple" size="sm">
                  Metrics Engine
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Primary Platform */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Primary Platform</label>
                    <select
                      value={formData.primaryPlatform}
                      onChange={(e) => handleChange("primaryPlatform", e.target.value as PlatformType)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
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
                    <label className="text-xs font-bold text-slate-700">Follower Count</label>
                    <input
                      type="number"
                      value={formData.followerCount}
                      onChange={(e) => handleChange("followerCount", parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Creator Stage */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Creator Growth Stage</label>
                    <select
                      value={formData.creatorStage}
                      onChange={(e) => handleChange("creatorStage", e.target.value as CreatorStageType)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    >
                      {stages.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Engagement Rate */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Engagement Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.engagementRate}
                      onChange={(e) => handleChange("engagementRate", parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                {/* Audience description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Audience Demographic Profile</label>
                  <input
                    type="text"
                    value={formData.audienceDemographic}
                    onChange={(e) => handleChange("audienceDemographic", e.target.value)}
                    placeholder="e.g. College students & beginners (18-24) or Software engineers (24-34)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                {/* Content Format */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Primary Content Formats</label>
                  <input
                    type="text"
                    value={formData.contentFormat}
                    onChange={(e) => handleChange("contentFormat", e.target.value)}
                    placeholder="e.g. 60s Reels, Educational Carousels, Long-form case studies"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Business Goals & Monetisation Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Business Goals & Income Targets
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
                    <label className="text-xs font-bold text-slate-700">Primary Creator Objective</label>
                    <input
                      type="text"
                      value={formData.primaryGoal}
                      onChange={(e) => handleChange("primaryGoal", e.target.value)}
                      placeholder="e.g. Brand Collaborations, 1:1 Consulting Clients"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  {/* Monthly Income Target */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Monthly Income Target (INR)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={formData.monthlyIncomeTarget}
                        onChange={(e) => handleChange("monthlyIncomeTarget", parseInt(e.target.value) || 0)}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all hover:scale-[1.01]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Changes</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Right Column: Profile Readiness Gauge & Live Media Kit Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Completion Indicator */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Profile Completion</h3>
              </div>
              <span className="text-sm font-black text-blue-600 font-mono">
                {profileCompletion}%
              </span>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    profileCompletion >= 90
                      ? "bg-emerald-500"
                      : profileCompletion >= 70
                      ? "bg-blue-600"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>

              <p className="text-xs text-slate-500">
                {profileCompletion >= 90
                  ? "Outstanding! Brands get full clarity on your demographic reach, engagement, and content formats."
                  : "Fill missing fields to maximize your compatibility scores on marketplace campaigns."}
              </p>

              {/* Checklist breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Readiness Checklist
                </p>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {completionChecklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50"
                    >
                      <span className={item.met ? "text-slate-700" : "text-slate-400"}>
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
          <Card className="overflow-hidden border-slate-200/90 bg-white shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Live Media Kit Preview
              </span>
              <Badge variant="blue" size="sm">
                Shareable
              </Badge>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-2xs"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{formData.name}</h4>
                  <p className="text-xs text-blue-600 font-medium">{formData.handle}</p>
                  <p className="text-[11px] text-slate-400">{formData.niche}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <p className="text-[10px] text-slate-400 font-medium">Audience</p>
                  <p className="text-sm font-extrabold text-slate-900">
                    {formData.followerCount.toLocaleString()}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <p className="text-[10px] text-slate-400 font-medium">Engagement</p>
                  <p className="text-sm font-extrabold text-emerald-600">
                    {formData.engagementRate}%
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
                <p>
                  <strong className="text-slate-800">Formats: </strong>
                  {formData.contentFormat}
                </p>
                <p>
                  <strong className="text-slate-800">Target Community: </strong>
                  {formData.audienceDemographic}
                </p>
              </div>

              <button
                type="button"
                onClick={() => alert(`Public media kit link copied: https://creator-engine.demo/mediakit/${formData.id}`)}
                className="w-full py-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Copy Verified Media Kit Link</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

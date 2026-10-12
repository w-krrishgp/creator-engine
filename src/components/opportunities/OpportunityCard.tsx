"use client";

import React, { useState } from "react";
import { Opportunity } from "@/types/creator";
import { useCreator } from "@/context/CreatorContext";
import { calculateCompatibility } from "@/utils/compatibility";
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Users,
  Sparkles,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Layers,
} from "lucide-react";
import { Badge } from "../common/Badge";
import { OpportunityDetailsModal } from "./OpportunityDetailsModal";
import { ApplyModal } from "./ApplyModal";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const { activeCreator, saveOpportunity, withdrawApplication } = useCreator();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [showScoreFactors, setShowScoreFactors] = useState(false);

  const compatibility = calculateCompatibility(opportunity, activeCreator);
  const isApplied = opportunity.status === "Applied";
  const isSaved = opportunity.status === "Saved";

  return (
    <>
      <div className="bg-white rounded-[18px] border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
        {/* Top Header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-200">
              {opportunity.brandLogo}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-slate-900 text-sm tracking-tight truncate">
                  {opportunity.brand}
                </span>
                {opportunity.sponsoredTag && (
                  <span title="Verified Campaign Brief Sponsor" className="inline-flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0870e8] shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                {opportunity.brandCategory}
              </p>
            </div>
          </div>

          {/* Badges Column: Hard Eligibility + Match Score */}
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            {/* Hard Eligibility Indicator */}
            {compatibility.qualifies ? (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                title="All mandatory brand prerequisites passed"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Eligible</span>
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80"
                title={compatibility.failedHardRequirements.join(", ")}
              >
                <AlertTriangle className="w-3 h-3 text-rose-500" />
                <span>Ineligible ({compatibility.failedHardRequirements.length})</span>
              </span>
            )}

            {/* Deterministic Match Score Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowScoreFactors(!showScoreFactors)}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                  compatibility.score >= 85
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                    : compatibility.score >= 70
                    ? "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                    : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                }`}
                title="Click to view explainable score breakdown"
              >
                <Sparkles className="w-3 h-3" />
                <span>{compatibility.score}% Match</span>
              </button>
            </div>
          </div>
        </div>

        {/* Score Factor Quick Drawer (toggleable) */}
        {showScoreFactors && (
          <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 text-xs text-slate-700 space-y-2 animate-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between font-bold text-[10px] text-slate-400 uppercase tracking-wider">
              <span>Explainable Factors</span>
              <button
                onClick={() => setShowScoreFactors(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="p-2 bg-white rounded-xl border border-slate-200/75 flex justify-between shadow-2xs">
                <span className="text-slate-500">Niche Fit</span>
                <span className="font-bold text-slate-900">+{compatibility.nicheScore}%</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200/75 flex justify-between shadow-2xs">
                <span className="text-slate-500">Platform</span>
                <span className="font-bold text-slate-900">+{compatibility.platformScore}%</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200/75 flex justify-between shadow-2xs">
                <span className="text-slate-500">Follower Tier</span>
                <span className="font-bold text-slate-900">+{compatibility.followerScore}%</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200/75 flex justify-between shadow-2xs">
                <span className="text-slate-500">Audience Fit</span>
                <span className="font-bold text-slate-900">+{compatibility.audienceScore}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 mb-1 tracking-tight">
              {opportunity.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {opportunity.description}
            </p>
          </div>

          {/* Tags Row: Platform, Niches, Location */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="purple" size="sm">
              {opportunity.platform}
            </Badge>
            {opportunity.niche.slice(0, 2).map((n, idx) => (
              <Badge key={idx} variant="slate" size="sm">
                {n}
              </Badge>
            ))}
            {opportunity.targetLocation && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100/90 text-slate-600 border border-slate-200/50">
                <MapPin className="w-2.5 h-2.5 text-slate-400" />
                <span className="truncate max-w-[140px]">{opportunity.targetLocation}</span>
              </span>
            )}
          </div>

          {/* Deliverables snippet */}
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-500 flex items-center gap-1 text-[10px] uppercase tracking-wider">
              <Layers className="w-3 h-3 text-slate-400" /> Deliverables Preview
            </span>
            <p className="line-clamp-1 text-slate-800 font-medium">
              {opportunity.deliverables.join(" • ")}
            </p>
          </div>

          {/* Key Deal Stats Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-600" /> Budget Range
              </span>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">
                {opportunity.budgetRange}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-[#0870e8]" /> Min. Followers
              </span>
              <p
                className={`font-semibold text-xs ${
                  activeCreator.followerCount >= opportunity.minFollowers
                    ? "text-slate-800"
                    : "text-rose-600 font-bold"
                }`}
              >
                {opportunity.minFollowers.toLocaleString()} fans required
              </p>
            </div>
          </div>

          {/* Ineligibility Warning Callout (if fails hard requirement) */}
          {!compatibility.qualifies && (
            <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200/80 text-[11px] text-rose-800 space-y-0.5">
              <div className="flex items-center gap-1 font-bold text-rose-900">
                <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                <span>Eligibility Shortfall</span>
              </div>
              <p className="line-clamp-2 text-rose-700 leading-snug">
                {compatibility.failedHardRequirements[0]}
              </p>
            </div>
          )}

          {/* Applied Status Banner */}
          {isApplied && (
            <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200/90 text-[11px] text-emerald-900 space-y-0.5">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Application Active
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                  {opportunity.applicationId || "CE-APP-LOGGED"}
                </span>
              </div>
              <p className="text-emerald-700 text-[10px]">
                Applied {opportunity.appliedDate || "Recently"} • Status: Under Review by Brand
              </p>
            </div>
          )}

          {/* Deadline bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-500" /> Apply by {opportunity.deadline}
            </span>
            <span className="text-slate-400 text-[10px] font-medium">Demo Campaign</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => setDetailsOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors flex items-center gap-1 btn-tactile"
          >
            <span>Brief & Fit</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => saveOpportunity(opportunity.id)}
              className={`p-2 rounded-full transition-all border ${
                isSaved
                  ? "bg-amber-50 border-amber-200 text-amber-700 shadow-2xs"
                  : "bg-white border-slate-200/80 text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              } btn-tactile`}
              title={isSaved ? "Saved to shortlisted deals (click to unsave)" : "Bookmark opportunity"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
            </button>

            {isApplied ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setDetailsOpen(true)}
                  className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold hover:bg-emerald-200 transition-colors btn-tactile"
                >
                  Tracked
                </button>
                <button
                  onClick={() => withdrawApplication(opportunity.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Withdraw test application"
                >
                  ✕
                </button>
              </div>
            ) : compatibility.qualifies ? (
              <button
                onClick={() => setApplyOpen(true)}
                className="px-4 py-1.5 rounded-full bg-[#0870e8] hover:bg-[#0760cb] text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all btn-tactile"
              >
                Apply Now
              </button>
            ) : (
              <button
                onClick={() => setDetailsOpen(true)}
                className="px-3 py-1.5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 btn-tactile"
                title="Review failed requirements"
              >
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Check Criteria</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <OpportunityDetailsModal
        opportunity={opportunity}
        compatibility={compatibility}
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onApplyClick={() => setApplyOpen(true)}
      />

      <ApplyModal
        opportunity={opportunity}
        isOpen={applyOpen}
        onClose={() => setApplyOpen(false)}
      />
    </>
  );
}

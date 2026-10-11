"use client";

import React, { useState } from "react";
import { Opportunity } from "@/types/creator";
import { useCreator } from "@/context/CreatorContext";
import { calculateCompatibility } from "@/utils/compatibility";
import {
  Calendar,
  CheckCircle2,
  DollarSign,
  Users,
  Sparkles,
  Bookmark,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "../common/Badge";
import { OpportunityDetailsModal } from "./OpportunityDetailsModal";
import { ApplyModal } from "./ApplyModal";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const { activeCreator, saveOpportunity } = useCreator();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const compatibility = calculateCompatibility(opportunity, activeCreator);
  const isApplied = opportunity.status === "Applied";
  const isSaved = opportunity.status === "Saved";

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
        {/* Top Header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center text-2xl shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
              {opportunity.brandLogo}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-slate-900 text-sm truncate">
                  {opportunity.brand}
                </span>
                {opportunity.sponsoredTag && (
                  <span title="Verified Campaign Sponsor">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                {opportunity.brandCategory}
              </p>
            </div>
          </div>

          {/* Compatibility Pill with tooltip breakdown */}
          <div className="shrink-0 text-right">
            <div
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                compatibility.score >= 85
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : compatibility.score >= 70
                  ? "bg-blue-50 text-blue-800 border-blue-200"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
              title={compatibility.explanation}
            >
              <Sparkles className="w-3 h-3" />
              <span>{compatibility.score}% Match</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Deterministic</p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 mb-1.5">
              {opportunity.title}
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {opportunity.description}
            </p>
          </div>

          {/* Key tags: Niche, Platform */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="purple" size="sm">
              {opportunity.platform}
            </Badge>
            {opportunity.niche.slice(0, 2).map((n, idx) => (
              <Badge key={idx} variant="slate" size="sm">
                {n}
              </Badge>
            ))}
          </div>

          {/* Key Deal Stats Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-600" /> Budget
              </span>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">
                {opportunity.budgetRange}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-600" /> Min. Audience
              </span>
              <p className="font-semibold text-slate-800 text-xs">
                {opportunity.minFollowers.toLocaleString()} fans
              </p>
            </div>
          </div>

          {/* Deadline bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-500" /> Apply by {opportunity.deadline}
            </span>
            <span className="text-slate-400 text-[10px]">Sample Campaign</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => setDetailsOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 transition-colors flex items-center gap-1"
          >
            <span>View Brief</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => saveOpportunity(opportunity.id)}
              className={`p-2 rounded-lg transition-colors border ${
                isSaved
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-white border-slate-200 text-slate-400 hover:text-slate-700"
              }`}
              title={isSaved ? "Saved to shortlisted deals" : "Bookmark opportunity"}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>

            {isApplied ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Applied
              </span>
            ) : (
              <button
                onClick={() => setApplyOpen(true)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.01]"
              >
                Apply
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

"use client";

import React from "react";
import { Opportunity, CompatibilityBreakdown } from "@/types/creator";
import {
  X,
  Calendar,
  CheckCircle2,
  DollarSign,
  Users,
  Layers,
  Award,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Badge } from "../common/Badge";

interface OpportunityDetailsModalProps {
  opportunity: Opportunity | null;
  compatibility: CompatibilityBreakdown | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyClick: (opp: Opportunity) => void;
}

export function OpportunityDetailsModal({
  opportunity,
  compatibility,
  isOpen,
  onClose,
  onApplyClick,
}: OpportunityDetailsModalProps) {
  if (!isOpen || !opportunity) return null;

  const isApplied = opportunity.status === "Applied";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl shadow-xs shrink-0">
              {opportunity.brandLogo}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-lg">{opportunity.brand}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">{opportunity.brandCategory}</span>
                {opportunity.sponsoredTag && (
                  <Badge variant="indigo" size="sm">
                    Verified Sponsor
                  </Badge>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                {opportunity.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Compatibility Breakdown Card */}
          {compatibility && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-slate-50 border border-indigo-100/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    Deterministic Match Score
                  </span>
                </div>
                <span className="text-sm font-extrabold text-indigo-700 bg-white px-3 py-1 rounded-full shadow-2xs border border-indigo-200">
                  {compatibility.score}% Match
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                <div className="p-2 bg-white/80 rounded-xl border border-indigo-100">
                  <p className="text-[10px] text-slate-500 font-medium">Niche Fit</p>
                  <p className="text-xs font-bold text-indigo-900">+{compatibility.nicheScore}%</p>
                </div>
                <div className="p-2 bg-white/80 rounded-xl border border-indigo-100">
                  <p className="text-[10px] text-slate-500 font-medium">Platform</p>
                  <p className="text-xs font-bold text-indigo-900">+{compatibility.platformScore}%</p>
                </div>
                <div className="p-2 bg-white/80 rounded-xl border border-indigo-100">
                  <p className="text-[10px] text-slate-500 font-medium">Follower Tier</p>
                  <p className="text-xs font-bold text-indigo-900">+{compatibility.followerScore}%</p>
                </div>
                <div className="p-2 bg-white/80 rounded-xl border border-indigo-100">
                  <p className="text-[10px] text-slate-500 font-medium">Goal Alignment</p>
                  <p className="text-xs font-bold text-indigo-900">+{compatibility.goalScore}%</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {compatibility.explanation}
              </p>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Budget Range
              </span>
              <p className="text-sm font-bold text-slate-900">{opportunity.budgetRange}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Application Deadline
              </span>
              <p className="text-sm font-bold text-slate-900">{opportunity.deadline}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" /> Min. Followers
              </span>
              <p className="text-sm font-bold text-slate-900">
                {opportunity.minFollowers.toLocaleString()} required
              </p>
            </div>
          </div>

          {/* Campaign Brief */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Campaign Brief & Context
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-200/70">
              {opportunity.description}
            </p>
          </div>

          {/* Deliverables */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" /> Deliverables Breakdown
            </h3>
            <div className="grid gap-2">
              {opportunity.deliverables.map((deliv, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{deliv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Creator Perks */}
          {opportunity.perks && opportunity.perks.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Creator Incentives & Perks
              </h3>
              <div className="grid gap-2">
                {opportunity.perks.map((perk, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 text-xs font-medium text-amber-900"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demographic Fit Notice */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-100 text-xs text-slate-600">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Target Community: </span>
              {opportunity.targetAudience}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>

          {isApplied ? (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Application Submitted & Logged
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                onApplyClick(opportunity);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:translate-y-[-1px]"
            >
              <span>Apply for Campaign</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

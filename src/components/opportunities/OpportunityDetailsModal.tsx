"use client";

import React from "react";
import { Opportunity, CompatibilityBreakdown } from "@/types/creator";
import { useCreator } from "@/context/CreatorContext";
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
  AlertTriangle,
  MapPin,
  ShieldCheck,
  FileText,
  Clock,
  RotateCcw,
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
  const { activeCreator, withdrawApplication } = useCreator();

  if (!isOpen || !opportunity) return null;

  const isApplied = opportunity.status === "Applied";
  const qualifies = compatibility?.qualifies ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-3xl shadow-xs shrink-0">
              {opportunity.brandLogo}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-lg">{opportunity.brand}</span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs font-semibold text-slate-500">{opportunity.brandCategory}</span>
                {opportunity.sponsoredTag && (
                  <Badge variant="blue" size="sm">
                    Verified Campaign Brief
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
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* HARD ELIGIBILITY ASSESSMENT BANNER */}
          <div
            className={`p-4 rounded-xl border space-y-3 ${
              qualifies
                ? "bg-emerald-50/60 border-emerald-200"
                : "bg-rose-50/70 border-rose-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {qualifies ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div>
                  <h3
                    className={`text-xs font-bold uppercase tracking-wider ${
                      qualifies ? "text-emerald-900" : "text-rose-900"
                    }`}
                  >
                    Hard Eligibility Verification
                  </h3>
                  <p
                    className={`text-xs ${
                      qualifies ? "text-emerald-700" : "text-rose-700 font-medium"
                    }`}
                  >
                    {qualifies
                      ? `${activeCreator.name} satisfies all mandatory brand prerequisites.`
                      : `${activeCreator.name} does NOT meet ${compatibility?.failedHardRequirements.length} mandatory requirement${
                          (compatibility?.failedHardRequirements.length || 0) > 1 ? "s" : ""
                        }.` }
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                  qualifies
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-rose-100 text-rose-800 border-rose-300"
                }`}
              >
                {qualifies ? "Qualified to Apply" : "Ineligible"}
              </span>
            </div>

            {/* Detailed Checks Grid */}
            {compatibility && compatibility.eligibilityChecks && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {compatibility.eligibilityChecks.map((check) => (
                  <div
                    key={check.id}
                    className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                      check.passed
                        ? "bg-white/90 border-emerald-200 text-slate-800"
                        : "bg-white border-rose-200 text-rose-900"
                    }`}
                  >
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-[11px] text-slate-900">{check.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Required: <span className="font-medium text-slate-700">{check.requirement}</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Actual: <span className="font-semibold text-slate-800">{check.actual}</span>
                      </p>
                      {check.failReason && (
                        <p className="text-[10px] font-semibold text-rose-600 mt-0.5">
                          {check.failReason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DETERMINISTIC COMPATIBILITY BREAKDOWN */}
          {compatibility && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Deterministic Algorithmic Fit
                  </span>
                </div>
                <span className="text-sm font-extrabold text-blue-700 bg-white px-3 py-1 rounded-full shadow-2xs border border-blue-200">
                  {compatibility.score}% Match
                </span>
              </div>

              {/* Factor Breakdown cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-medium">Niche Fit</p>
                  <p className="text-sm font-bold text-slate-900">+{compatibility.nicheScore}%</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-medium">Platform Fit</p>
                  <p className="text-sm font-bold text-slate-900">+{compatibility.platformScore}%</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-medium">Follower Scale</p>
                  <p className="text-sm font-bold text-slate-900">+{compatibility.followerScore}%</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-medium">Demographic Fit</p>
                  <p className="text-sm font-bold text-slate-900">+{compatibility.audienceScore}%</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Algorithmic Explanation:
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {compatibility.explanation}
                </p>
              </div>
            </div>
          )}

          {/* APPLICATION TRACKING DETAILS (if Applied) */}
          {isApplied && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Application Record & Pipeline Status
                </span>
                <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded text-emerald-800 border border-emerald-300">
                  {opportunity.applicationId || "CE-APP-LOGGED"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                  <span className="text-[10px] text-slate-500 font-medium">Application Date</span>
                  <p className="font-bold text-slate-900">{opportunity.appliedDate || "Recently"}</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                  <span className="text-[10px] text-slate-500 font-medium">Proposed Compensation</span>
                  <p className="font-bold text-slate-900">{opportunity.appliedFee || opportunity.budgetRange}</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-emerald-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 font-medium">Review Status</span>
                  <p className="font-bold text-emerald-700 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" /> Under Review
                  </p>
                </div>
              </div>

              {opportunity.appliedNotes && (
                <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Logged Pitch Concept:
                  </span>
                  <p className="text-xs text-slate-700 font-mono italic">
                    &quot;{opportunity.appliedNotes}&quot;
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-emerald-800">
                  Automated follow-up action scheduled in your Creator Engine Action Centre.
                </span>
                <button
                  onClick={() => withdrawApplication(opportunity.id)}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Withdraw Application</span>
                </button>
              </div>
            </div>
          )}

          {/* Key Deal Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Budget Range
              </span>
              <p className="text-sm font-bold text-slate-900">{opportunity.budgetRange}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Deadline
              </span>
              <p className="text-sm font-bold text-slate-900">{opportunity.deadline}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" /> Min. Followers
              </span>
              <p className="text-sm font-bold text-slate-900">
                {opportunity.minFollowers.toLocaleString()} fans
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-purple-600" /> Target Location
              </span>
              <p className="text-xs font-bold text-slate-900 line-clamp-1">
                {opportunity.targetLocation || "Pan-India"}
              </p>
            </div>
          </div>

          {/* Campaign Brief */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Campaign Objective & Background
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-200/70">
              {opportunity.description}
            </p>
          </div>

          {/* Deliverables Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" /> Required Deliverables
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

          {/* Eligibility Requirements List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Campaign Eligibility Criteria
            </h3>
            <div className="grid gap-2">
              {opportunity.eligibilityRequirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{req}</span>
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

          {/* Target Audience Community Note */}
          <div className="p-3.5 rounded-xl bg-slate-100 text-xs text-slate-600 flex items-start gap-2">
            <Users className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Target Community Profile: </span>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Application Submitted & Active in Pipeline
            </div>
          ) : qualifies ? (
            <button
              onClick={() => {
                onClose();
                onApplyClick(opportunity);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all hover:scale-[1.01]"
            >
              <span>Apply for Campaign</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onApplyClick(opportunity);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors"
                title="Submit custom pitch with eligibility exception notes"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Pitch Exception Angle</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

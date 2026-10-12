"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Opportunity } from "@/types/creator";
import { useCreator } from "@/context/CreatorContext";
import { calculateCompatibility } from "@/utils/compatibility";
import {
  X,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Badge } from "../common/Badge";

import { UpgradePromptModal } from "@/components/subscription/UpgradePromptModal";

interface ApplyModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyModal({ opportunity, isOpen, onClose }: ApplyModalProps) {
  const { activeCreator, applyOpportunity, subscriptionUsage } = useCreator();
  const [pitchNotes, setPitchNotes] = useState("");
  const [requestedFee, setRequestedFee] = useState("");
  const [agreedToDeliverables, setAgreedToDeliverables] = useState(true);
  const [agreedToCompliance, setAgreedToCompliance] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedAppId, setConfirmedAppId] = useState<string | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [quotaMessage, setQuotaMessage] = useState<string | undefined>(undefined);

  if (!isOpen || !opportunity) return null;

  const compatibility = calculateCompatibility(opportunity, activeCreator);
  const qualifies = compatibility.qualifies;

  const defaultPitch =
    activeCreator.id === "rahul"
      ? `Hey ${opportunity.brand} team! I'm Rahul (@rahulfit.india), creating high-retention fitness reels for 15k+ college students and gym beginners (4.8% engagement). For "${opportunity.title}", I'll create an authentic dorm workout & daily nutrition integration showcasing your brand in realistic daily use.`
      : `Dear ${opportunity.brand} Partnership Team, I'm Priya Nair, financial wellness creator on LinkedIn reaching 8,000 corporate professionals & engineers (ex-Deloitte). For "${opportunity.title}", I will structure an educational visual slide framework simplifying your value proposition with transparent disclaimers.`;

  const currentPitch = pitchNotes || defaultPitch;
  const suggestedBudget = requestedFee || `₹${((opportunity.budgetMin + opportunity.budgetMax) / 2).toLocaleString()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await applyOpportunity(opportunity.id, currentPitch, suggestedBudget);
    setSubmitting(false);

    if (result && result.quotaExceeded) {
      setQuotaMessage(result.reason || "Monthly campaign application limit reached.");
      setUpgradeModalOpen(true);
      return;
    }

    if (result && result.success) {
      setConfirmedAppId(result.applicationReference || "CE-APP-CONFIRMED");
    }
  };

  const handleCloseAndReset = () => {
    setConfirmedAppId(null);
    setPitchNotes("");
    setRequestedFee("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-[22px] max-w-xl w-full max-h-[90vh] flex flex-col shadow-[0_24px_60px_rgba(0,0,0,0.18)] border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{opportunity.brandLogo}</span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {confirmedAppId ? "Application Confirmed" : `Apply to ${opportunity.brand}`}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              Campaign: {opportunity.title}
            </p>
          </div>
          <button
            onClick={handleCloseAndReset}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONFIRMATION STATE VIEW */}
        {confirmedAppId ? (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Application Successfully Logged!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your pitch and verified creator profile have been logged to the Creator Engine deal pipeline for {opportunity.brand}.
              </p>
            </div>

            {/* Application Receipt Card */}
            <div className="p-4 rounded-[16px] bg-slate-50/80 border border-slate-200/80 text-left space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tracking Reference
                </span>
                <span className="font-mono text-xs font-bold text-[#0870e8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  #{confirmedAppId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Brand Partner</span>
                  <p className="font-bold text-slate-800">{opportunity.brand}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Proposed Fee</span>
                  <p className="font-bold text-emerald-700">{suggestedBudget}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Primary Channel</span>
                  <p className="font-semibold text-slate-700">{activeCreator.primaryPlatform}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Target Deadline</span>
                  <p className="font-semibold text-slate-700">{opportunity.deadline}</p>
                </div>
              </div>

              {/* Pipeline stage tracker */}
              <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" /> Pipeline Status: Under Review
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Brand campaign team typically reviews inbound creator pitches in 3-5 business days. A follow-up reminder has been automatically added to your <span className="font-bold text-slate-800">Action Centre</span>.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/actions"
                onClick={handleCloseAndReset}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#0870e8] hover:bg-[#0760cb] text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 btn-tactile"
              >
                <span>Track in Action Centre</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleCloseAndReset}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors btn-tactile"
              >
                Return to Marketplace
              </button>
            </div>
          </div>
        ) : (
          /* APPLICATION FORM VIEW */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            {/* LIVE ELIGIBILITY VALIDATION CALLOUT */}
            {qualifies ? (
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900">Eligibility Validation: Passed</p>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    {activeCreator.name} satisfies all mandatory brand prerequisites ({opportunity.minFollowers.toLocaleString()} min followers, {opportunity.platform} channel, {activeCreator.niche} alignment).
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900">Eligibility Notice: Requirements Unmet</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Standard criteria shortfall: {compatibility.failedHardRequirements.join("; ")}. You may still submit an exception pitch explaining your bespoke audience angle.
                  </p>
                </div>
              </div>
            )}

            {/* Creator Profile Auto-Attached Banner */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeCreator.avatar}
                  alt={activeCreator.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">{activeCreator.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {activeCreator.primaryPlatform} • {activeCreator.followerCount.toLocaleString()} followers • {activeCreator.engagementRate}% engagement
                  </p>
                </div>
              </div>
              <Badge variant="blue" size="sm">
                Media Kit Attached
              </Badge>
            </div>

            {/* Agreed Deliverables Checklist */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Deliverables Commitment
              </label>
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1.5">
                {opportunity.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requested Compensation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Proposed Compensation (INR)
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  Brief Range: {opportunity.budgetRange}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="text"
                  placeholder={suggestedBudget.replace("₹", "")}
                  value={requestedFee}
                  onChange={(e) => setRequestedFee(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/20 focus:border-[#0870e8] transition-all"
                />
              </div>
            </div>

            {/* Creator Pitch & Angle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0870e8]" /> Pitch & Content Concept
                </label>
                <span className="text-[11px] text-[#0870e8] font-semibold">
                  Personalized to {activeCreator.name}
                </span>
              </div>
              <textarea
                rows={4}
                value={currentPitch}
                onChange={(e) => setPitchNotes(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0870e8]/20 focus:border-[#0870e8] resize-none font-sans transition-all"
              />
            </div>

            {/* ASCI & Terms Checkbox */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToDeliverables}
                  onChange={(e) => setAgreedToDeliverables(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#0870e8] focus:ring-[#0870e8]"
                />
                <span className="text-xs text-slate-600">
                  I agree to deliver the required formats before the application deadline ({opportunity.deadline}).
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToCompliance}
                  onChange={(e) => setAgreedToCompliance(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#0870e8] focus:ring-[#0870e8]"
                />
                <span className="text-xs text-slate-500">
                  I commit to adhering to ASCI influencer disclosure regulations and brand guidelines.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCloseAndReset}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors btn-tactile"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !agreedToDeliverables || !agreedToCompliance}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0870e8] hover:bg-[#0760cb] disabled:opacity-50 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all btn-tactile"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Submitting...' : 'Submit Pitch Application'}
              </button>
            </div>
          </form>
        )}
      </div>

      <UpgradePromptModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        limitType="applications"
        customMessage={quotaMessage}
        currentUsageCount={subscriptionUsage?.applicationsUsage}
        resetDate={subscriptionUsage?.usageResetAt}
      />
    </div>
  );
}

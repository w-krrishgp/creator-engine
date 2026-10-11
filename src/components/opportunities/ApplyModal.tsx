"use client";

import React, { useState } from "react";
import { Opportunity } from "@/types/creator";
import { useCreator } from "@/context/CreatorContext";
import {
  X,
  Send,
  Sparkles,
  DollarSign,
  CheckCircle2,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Badge } from "../common/Badge";

interface ApplyModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyModal({ opportunity, isOpen, onClose }: ApplyModalProps) {
  const { activeCreator, applyOpportunity } = useCreator();
  const [pitchNotes, setPitchNotes] = useState("");
  const [requestedFee, setRequestedFee] = useState("");
  const [agreedToDeliverables, setAgreedToDeliverables] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !opportunity) return null;

  const defaultPitch =
    activeCreator.id === "rahul"
      ? `Hey ${opportunity.brand} team! I'm Rahul (@rahulfit.india), creating high-retention fitness reels for 15k+ college students with a 4.8% engagement rate. For this campaign, I'd love to produce an authentic hostel workout integration showcasing your product directly in action.`
      : `Dear ${opportunity.brand} Partnership Team, I'm Priya Nair, financial wellness advisor on LinkedIn with 8,000 corporate professionals (ex-Deloitte). My audience of engineers actively seeks trusted tools. I can structure an educational visual framework breaking down your solution.`;

  const currentPitch = pitchNotes || defaultPitch;
  const suggestedBudget = `₹${((opportunity.budgetMin + opportunity.budgetMax) / 2).toLocaleString()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      applyOpportunity(opportunity.id, currentPitch);
      setSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{opportunity.brandLogo}</span>
              <h2 className="text-lg font-bold text-slate-900">
                Apply to {opportunity.brand}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Campaign: {opportunity.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Creator Profile Auto-Attached */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeCreator.avatar}
                alt={activeCreator.name}
                className="w-10 h-10 rounded-full object-cover border border-indigo-200"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">{activeCreator.name}</p>
                <p className="text-[11px] text-slate-500">
                  {activeCreator.primaryPlatform} • {activeCreator.followerCount.toLocaleString()} followers • {activeCreator.engagementRate}% engagement
                </p>
              </div>
            </div>
            <Badge variant="indigo" size="sm">
              Media Kit Attached
            </Badge>
          </div>

          {/* Deliverables checklist reminder */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Agreed Deliverables
            </label>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              {opportunity.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Requested Budget */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Proposed Compensation (INR)
              </label>
              <span className="text-[11px] text-slate-500">
                Range: {opportunity.budgetRange}
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
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Creator Pitch & Concept */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Creator Pitch & Angle
              </label>
              <span className="text-[11px] text-indigo-600 font-medium">
                Auto-personalized
              </span>
            </div>
            <textarea
              rows={4}
              value={currentPitch}
              onChange={(e) => setPitchNotes(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none font-sans"
            />
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToDeliverables}
              onChange={(e) => setAgreedToDeliverables(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-slate-500">
              I commit to adhering to brand quality guidelines, deadline ({opportunity.deadline}), and disclosing sponsorship per ASCI influencer rules.
            </span>
          </label>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !agreedToDeliverables}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:translate-y-[-1px]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Submitting..." : "Submit Application"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

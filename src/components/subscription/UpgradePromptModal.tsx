"use client";

import React from "react";
import Link from "next/link";
import { useCreator } from "@/context/CreatorContext";
import { PlanBadge } from "./PlanBadge";
import {
  X,
  Sparkles,
  ArrowRight,
  Lock,
  Calendar,
  AlertCircle,
  Briefcase,
  CheckSquare,
  TrendingUp,
} from "lucide-react";

export type LimitType = "ai" | "applications" | "actions" | "roadmap";

interface UpgradePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  limitType: LimitType;
  customTitle?: string;
  customMessage?: string;
  currentUsageCount?: number;
  resetDate?: string;
}

export function UpgradePromptModal({
  isOpen,
  onClose,
  limitType,
  customTitle,
  customMessage,
  currentUsageCount,
  resetDate,
}: UpgradePromptModalProps) {
  const { currentPlanId, currentPlan, currentSubscription } = useCreator();

  if (!isOpen) return null;

  const nextTierName = currentPlanId === "normal" ? "Pro" : "Pro+";
  const nextTierPrice = currentPlanId === "normal" ? "₹500/mo" : "₹999/mo";

  const getLimitDetails = () => {
    switch (limitType) {
      case "ai":
        return {
          icon: <Sparkles className="w-5 h-5 text-[#0870e8]" />,
          title: customTitle || "Monthly AI Synthesis Limit Reached",
          usedCount: currentUsageCount !== undefined ? currentUsageCount : currentPlan.limits.aiRecommendationsPerMonth,
          totalLimit: currentPlan.limits.aiRecommendationsPerMonth,
          unit: "AI runs",
          message:
            customMessage ||
            `You have utilized your ${currentPlan.limits.aiRecommendationsPerMonth} monthly strategic AI recommendations on the ${currentPlan.name} plan. Upgrade to ${nextTierName} for up to ${
              currentPlanId === "normal" ? 50 : 200
            } runs/month.`,
        };
      case "applications":
        return {
          icon: <Briefcase className="w-5 h-5 text-emerald-600" />,
          title: customTitle || "Monthly Campaign Application Limit Reached",
          usedCount: currentUsageCount !== undefined ? currentUsageCount : currentPlan.limits.maxApplicationsPerMonth,
          totalLimit: currentPlan.limits.maxApplicationsPerMonth,
          unit: "deals applied",
          message:
            customMessage ||
            `You have reached your limit of ${currentPlan.limits.maxApplicationsPerMonth} brand applications for this billing cycle. Upgrade to ${nextTierName} to apply to ${
              currentPlanId === "normal" ? 25 : 100
            } brand campaigns.`,
        };
      case "actions":
        return {
          icon: <CheckSquare className="w-5 h-5 text-indigo-600" />,
          title: customTitle || "Action Centre Capacity Reached",
          usedCount: currentPlan.limits.maxActiveActions,
          totalLimit: currentPlan.limits.maxActiveActions,
          unit: "active tasks",
          message:
            customMessage ||
            `Your ${currentPlan.name} plan supports up to ${currentPlan.limits.maxActiveActions} concurrent priority queue items. Complete active tasks or upgrade to ${nextTierName} for ${
              currentPlanId === "normal" ? 25 : 100
            } task capacity.`,
        };
      case "roadmap":
        return {
          icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
          title: customTitle || "60 & 90-Day Scaling Roadmaps Locked",
          usedCount: 1,
          totalLimit: 1,
          unit: "phase (30-day foundation)",
          message:
            customMessage ||
            "The Normal tier provides a foundational 30-day growth plan. Upgrade to Pro to unlock comprehensive 60-day acceleration and 90-day scaling milestones, content gaps, and skill roadmaps.",
        };
    }
  };

  const details = getLimitDetails();

  const resetDateStr = resetDate
    ? new Date(resetDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : currentSubscription?.currentPeriodEnd
    ? new Date(currentSubscription.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Next cycle";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Lock className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Plan Limit Reached
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-white tracking-tight">
            {details.title}
          </h3>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Explanation Paragraph */}
          <p className="text-slate-600 leading-relaxed text-[12px]">
            {details.message}
          </p>

          {/* Usage Counter Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Current Plan Quota
              </span>
              <PlanBadge size="xs" />
            </div>

            <div className="flex items-baseline justify-between text-slate-800">
              <span className="text-xs text-slate-600">Current Consumption:</span>
              <span className="text-sm font-extrabold font-mono text-amber-700">
                {details.usedCount} of {details.totalLimit} {details.unit}
              </span>
            </div>

            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-full rounded-full" />
            </div>

            <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>Quota resets on: <strong>{resetDateStr}</strong></span>
            </div>
          </div>

          {/* Next Tier Upgrade Value Proposition Box */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0870e8]" />
                <h4 className="font-extrabold text-xs text-[#0870e8]">
                  Unlock {nextTierName} ({nextTierPrice})
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0870e8]">
                Recommended
              </span>
            </div>
            <p className="text-[11.5px] text-slate-600 leading-snug">
              Instant access to complete 90-day execution roadmaps, expanded campaign applications,
              and enhanced Gemini AI strategic generation.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="btn-tactile px-4 py-2 rounded-full border border-slate-300 hover:bg-slate-100 font-bold text-xs text-slate-600 transition-colors"
          >
            Dismiss
          </button>

          <Link
            href="/pricing"
            onClick={onClose}
            className="btn-tactile px-5 py-2 rounded-full bg-[#0870e8] hover:bg-[#0760cb] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>View Pricing & Upgrade Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

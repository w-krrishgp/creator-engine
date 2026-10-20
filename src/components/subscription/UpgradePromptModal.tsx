"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCreator } from "@/context/CreatorContext";
import { PlanBadge } from "./PlanBadge";
import { SubscriptionPaymentModal } from "./SubscriptionPaymentModal";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";
import { PlanId } from "@/types/subscription";
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
  Zap,
  QrCode,
  CheckCircle2,
  RefreshCw,
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
  const { currentPlanId, currentPlan, currentSubscription, startFreeTrial } = useCreator();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isTrialLoading, setIsTrialLoading] = useState(false);

  if (!isOpen) return null;

  const targetPlanId: PlanId = currentPlanId === "normal" ? "pro" : "pro_plus";
  const targetPlan = SUBSCRIPTION_PLANS[targetPlanId] || SUBSCRIPTION_PLANS.pro;
  const nextTierName = targetPlan.name;
  const nextTierPrice = `${targetPlan.priceFormatted}/mo`;

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

  const handleStartTrial = async () => {
    setIsTrialLoading(true);
    try {
      const res = await fetch("/api/subscription/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: currentSubscription?.creatorId || "creator",
          planId: targetPlanId,
        }),
      });
      await res.json();
      if (startFreeTrial) {
        await startFreeTrial(targetPlanId);
      }
      onClose();
    } catch (err) {
      console.error(err);
      if (startFreeTrial) {
        await startFreeTrial(targetPlanId);
      }
      onClose();
    } finally {
      setIsTrialLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-800">
          {/* Modal Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 to-slate-900 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Lock className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Plan Limit Reached
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {details.title}
            </h3>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-4 text-sm max-h-[70vh] overflow-y-auto">
            {/* Explanation Paragraph */}
            <p className="text-slate-600 leading-relaxed text-sm">
              {details.message}
            </p>

            {/* Next Tier Upgrade Value Proposition Box with Benefits */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border-2 border-blue-200/80 text-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0870e8]" />
                  <h4 className="font-black text-sm sm:text-base text-[#0870e8]">
                    Benefits of {nextTierName} ({nextTierPrice})
                  </h4>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0870e8]">
                  Recommended
                </span>
              </div>

              {/* Key Benefits Checklist */}
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Full 90-Day Phased Growth Roadmap:</strong> Unlocks Phase 2 & 3 scaling milestones
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Strategic AI Synthesis:</strong> {targetPlan.limits.aiRecommendationsPerMonth} strategic runs/month
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Brand Deal Applications:</strong> Up to {targetPlan.limits.maxApplicationsPerMonth} monthly campaigns
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dynamic Cold Pitch Generator:</strong> Included with tailored brand hooks
                  </span>
                </div>
              </div>
            </div>

            {/* Trial Feature Callout: Test This Feature Free */}
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-2.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                <h5 className="font-black text-xs sm:text-sm text-amber-950">
                  Want to test {nextTierName} first?
                </h5>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Activate a 7-day free trial right now with no credit card required. Unlocks all {nextTierName} features immediately so you can test roadmaps and AI tools.
              </p>
              <button
                onClick={handleStartTrial}
                disabled={isTrialLoading}
                className="btn-tactile w-full py-2.5 px-4 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isTrialLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Activating Trial...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Start 7-Day Free Trial (Test {nextTierName} Now)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 bg-slate-50/90 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
            <button
              onClick={onClose}
              className="btn-tactile px-4 py-2 rounded-full border border-slate-300 hover:bg-slate-100 font-bold text-xs sm:text-sm text-slate-700 transition-colors cursor-pointer"
            >
              Dismiss
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="btn-tactile px-4 py-2 rounded-full bg-[#0870e8] hover:bg-[#075fca] text-white font-bold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Pay via UPI QR Code / Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Payment & QR Modal */}
      <SubscriptionPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        initialPlanId={targetPlanId}
        onSuccess={() => {
          setPaymentModalOpen(false);
          onClose();
        }}
      />
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCreator } from "@/context/CreatorContext";
import { PlanBadge } from "./PlanBadge";
import { SubscriptionPaymentModal } from "./SubscriptionPaymentModal";
import { Card, CardHeader, CardContent } from "@/components/common/Card";
import {
  CreditCard,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Check,
  AlertCircle,
  ExternalLink,
  QrCode,
  Zap,
} from "lucide-react";

export function SubscriptionCard() {
  const {
    activeCreator,
    currentPlanId,
    currentPlan,
    currentSubscription,
    isSubscriptionLoading,
    subscriptionError,
    refreshSubscription,
    appliedOpportunitiesCount,
    totalActionsCount,
  } = useCreator();

  const [formattedPeriodEnd, setFormattedPeriodEnd] = useState<string>("Nov 30, 2026");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (currentSubscription?.currentPeriodEnd) {
      try {
        const d = new Date(currentSubscription.currentPeriodEnd);
        setFormattedPeriodEnd(
          d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        );
      } catch {}
    }
  }, [currentSubscription?.currentPeriodEnd]);

  return (
    <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs">
      <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#0870e8]" />
          <h3 className="font-bold text-slate-900 text-base tracking-tight">
            Subscription & Membership
          </h3>
        </div>
        <PlanBadge planId={currentPlanId} size="xs" />
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Loading State */}
        {isSubscriptionLoading ? (
          <div className="py-6 text-center space-y-2">
            <RefreshCw className="w-5 h-5 text-[#0870e8] animate-spin mx-auto" />
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Checking subscription tier...</p>
          </div>
        ) : subscriptionError ? (
          /* Error State */
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-2 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{subscriptionError}</span>
            </div>
            <button
              onClick={refreshSubscription}
              className="text-xs font-bold text-red-700 underline hover:text-red-900"
            >
              Retry subscription check
            </button>
          </div>
        ) : (
          /* Normal Active State */
          <>
            {/* Plan Snapshot Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 border border-slate-200/70 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Plan
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h4 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    {currentPlan.name}
                  </h4>
                  <span className="text-xs sm:text-sm font-bold text-slate-600 font-mono">
                    {currentPlan.priceFormatted}/mo
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {currentPlan.tagline}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Renews {formattedPeriodEnd}
                </p>
              </div>
            </div>

            {/* Quotas & Capacity Breakdown */}
            <div className="space-y-2.5 pt-1 text-xs sm:text-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Tier Usage & Limits
              </span>

              {/* Applications Limit */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
                  <span>Campaign Applications:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {appliedOpportunitiesCount} / {currentPlan.limits.maxApplicationsPerMonth} used
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0870e8] rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((appliedOpportunitiesCount / currentPlan.limits.maxApplicationsPerMonth) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action Center Capacity */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
                  <span>Action Centre Queue:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {totalActionsCount} / {currentPlan.limits.maxActiveActions} items
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((totalActionsCount / currentPlan.limits.maxActiveActions) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Features summary pills */}
              <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700">
                  <span className="block text-xs text-slate-500 font-bold uppercase tracking-wider">Roadmap Horizon</span>
                  <strong className="text-slate-900 font-semibold text-xs sm:text-sm">
                    {currentPlan.limits.roadmapPhasesAllowed === 1 ? "30 Days" : "90 Days"}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700">
                  <span className="block text-xs text-slate-500 font-bold uppercase tracking-wider">AI Synthesis</span>
                  <strong className="text-slate-900 font-semibold font-mono text-xs sm:text-sm">
                    {currentPlan.limits.aiRecommendationsPerMonth} runs/mo
                  </strong>
                </div>
              </div>
            </div>

            {/* Actions: Upgrade / Manage Subscription / UPI QR */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(true)}
                  className="btn-tactile flex-1 py-2 px-3.5 rounded-full bg-[#0870e8] hover:bg-[#0760cb] text-white text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{currentPlanId === "normal" ? "Pay via UPI / Test Trial" : "Subscription Privileges"}</span>
                </button>
                <Link
                  href="/subscription"
                  className="btn-tactile py-2 px-3.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all text-center"
                >
                  Manage
                </Link>
              </div>

              {currentPlanId === "normal" && (
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(true)}
                  className="btn-tactile w-full py-1.5 px-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Test Pro with 7-Day Free Trial</span>
                </button>
              )}
            </div>
          </>
        )}
      </CardContent>

      <SubscriptionPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        initialPlanId={currentPlanId === "normal" ? "pro" : currentPlanId}
      />
    </Card>
  );
}

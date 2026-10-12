"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCreator } from "@/context/CreatorContext";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";
import { PlanId, SubscriptionPlan } from "@/types/subscription";
import { PlanBadge } from "@/components/subscription/PlanBadge";
import { RazorpayCheckoutModal } from "@/components/subscription/RazorpayCheckoutModal";
import { Card, CardHeader, CardContent } from "@/components/common/Card";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";
import {
  CreditCard,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Zap,
  Info,
} from "lucide-react";

export default function SubscriptionManagePage() {
  const {
    activeCreator,
    currentPlanId,
    currentPlan,
    currentSubscription,
    subscriptionUsage,
    isSubscriptionLoading,
    subscriptionError,
    refreshSubscription,
    refreshSubscriptionUsage,
    appliedOpportunitiesCount,
    totalActionsCount,
  } = useCreator();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [targetPlanForCheckout, setTargetPlanForCheckout] = useState<SubscriptionPlan | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  // Status indicators
  const subStatus = currentSubscription?.status || "active";
  const isCanceled = subStatus === "canceled" || currentSubscription?.cancelAtPeriodEnd;
  const isPastDue = subStatus === "past_due";
  const isIncomplete = subStatus === "incomplete";

  const periodEndFormatted = currentSubscription?.currentPeriodEnd
    ? new Date(currentSubscription.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "30 days from cycle start";

  const handleOpenUpgrade = (planId: PlanId) => {
    const plan = SUBSCRIPTION_PLANS[planId];
    if (plan) {
      setTargetPlanForCheckout(plan);
      setCheckoutModalOpen(true);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your recurring subscription? You will retain Pro features until the end of the current billing cycle.")) {
      return;
    }

    setCancelling(true);
    try {
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: activeCreator.id,
          cancelAtCycleEnd: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCancelMessage(data.message || "Subscription scheduled for cancellation at period end.");
        await refreshSubscription();
      } else {
        alert(data.error || "Failed to cancel subscription.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error cancelling subscription";
      alert(msg);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Notice */}
      <DemoDisclaimer text="Subscription governance is enforced server-side. Payment mandates and lifecycle transitions are verified using signed Razorpay webhooks." />

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0870e8] text-xs font-bold mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Subscription & Billing Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Your Membership
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Review active plan, billing cycles, monthly feature quotas, and available subscription actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/pricing"
            className="btn-tactile inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
          >
            <span>Compare All Plans</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => {
              refreshSubscription();
              refreshSubscriptionUsage();
            }}
            disabled={isSubscriptionLoading}
            className="btn-tactile p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
            title="Refresh status"
          >
            <RefreshCw className={`w-4 h-4 ${isSubscriptionLoading ? "animate-spin text-[#0870e8]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Cancellation Success Feedback */}
      {cancelMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-sm animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">{cancelMessage}</p>
            <p className="text-xs text-amber-800 mt-0.5">
              You will not be billed on the next renewal date.
            </p>
          </div>
        </div>
      )}

      {/* Payment Failure / Past Due Alert Banner */}
      {isPastDue && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 flex items-start justify-between gap-3 text-sm">
          <div className="flex items-start gap-2.5">
            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-base">Action Required: Payment Past Due</p>
              <p className="text-xs sm:text-sm text-red-800 mt-0.5 leading-relaxed">
                The recurring charge for your {currentPlan.name} plan could not be processed. Please update your payment method or retry authorization with Razorpay to restore uninterrupted access.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenUpgrade(currentPlanId === "normal" ? "pro" : currentPlanId)}
            className="btn-tactile px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shrink-0 transition-colors"
          >
            Retry Payment
          </button>
        </div>
      )}

      {/* Grid: Current Plan Status Card & Quotas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Plan Card (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden bg-white border-slate-200/80 shadow-xs">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0870e8]" />
                <h3 className="font-bold text-slate-900 text-base">Active Subscription Plan</h3>
              </div>
              <PlanBadge planId={currentPlanId} size="sm" />
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Plan Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 border border-slate-200/80">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Active Membership
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {currentPlan.name}
                    </h2>
                    <span className="text-sm sm:text-base font-bold text-slate-600 font-mono">
                      {currentPlan.priceFormatted} / month
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{currentPlan.tagline}</p>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                  {/* Status Badge */}
                  {isCanceled ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Cancels on Period End
                    </span>
                  ) : isPastDue ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Payment Past Due
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Active & Verified
                    </span>
                  )}
                  <p className="text-xs text-slate-500 font-mono">
                    {isCanceled ? `Access until ${periodEndFormatted}` : `Renews: ${periodEndFormatted}`}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Plan Transitions */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
                {currentPlanId === "normal" ? (
                  <>
                    <button
                      onClick={() => handleOpenUpgrade("pro")}
                      className="btn-tactile inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0870e8] hover:bg-[#075fca] text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Upgrade to Pro (₹500/mo)</span>
                    </button>
                    <button
                      onClick={() => handleOpenUpgrade("pro_plus")}
                      className="btn-tactile inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Upgrade to Pro+ (₹999/mo)</span>
                    </button>
                  </>
                ) : currentPlanId === "pro" ? (
                  <>
                    <button
                      onClick={() => handleOpenUpgrade("pro_plus")}
                      className="btn-tactile inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-900 hover:bg-purple-800 text-white font-bold text-sm transition-colors cursor-pointer"
                    >
                      <ArrowUpRight className="w-4 h-4 text-purple-300" />
                      <span>Upgrade to Pro+ (₹999/mo)</span>
                    </button>
                    {!isCanceled && (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={cancelling}
                        className="btn-tactile px-4 py-2.5 rounded-full border border-red-200 text-red-700 hover:bg-red-50 font-semibold text-sm transition-colors"
                      >
                        {cancelling ? "Processing..." : "Cancel Recurring Subscription"}
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleOpenUpgrade("pro")}
                      className="btn-tactile inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                    >
                      <ArrowDownLeft className="w-4 h-4" />
                      <span>Switch to Pro (₹500/mo)</span>
                    </button>
                    {!isCanceled && (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={cancelling}
                        className="btn-tactile px-4 py-2.5 rounded-full border border-red-200 text-red-700 hover:bg-red-50 font-semibold text-sm transition-colors"
                      >
                        {cancelling ? "Processing..." : "Cancel Subscription"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features in Current Tier */}
          <Card className="bg-white border-slate-200/80 shadow-xs">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Included Privileges</h3>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {currentPlan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quota Meters & Provider Diagnostics (1 col) */}
        <div className="space-y-6">
          {/* Monthly Quotas Meter */}
          <Card className="bg-white border-slate-200/80 shadow-xs">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Monthly Quotas</h3>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Usage
              </span>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-sm">
              {/* AI Strategic Synthesis */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium">AI Strategy Runs:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {subscriptionUsage?.aiUsage || 0} / {currentPlan.limits.aiRecommendationsPerMonth}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0870e8] rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((subscriptionUsage?.aiUsage || 0) / currentPlan.limits.aiRecommendationsPerMonth) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Campaign Applications */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium">Brand Applications:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {subscriptionUsage?.applicationsUsage || 0} / {currentPlan.limits.maxApplicationsPerMonth}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((subscriptionUsage?.applicationsUsage || 0) / currentPlan.limits.maxApplicationsPerMonth) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action Center Items */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium">Action Center Queue:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {totalActionsCount} / {currentPlan.limits.maxActiveActions}
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

              {/* Reset Date */}
              <div className="pt-3 border-t border-slate-100 text-xs sm:text-[13px] text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Quotas reset: {periodEndFormatted}</span>
              </div>
            </CardContent>
          </Card>

          {/* Provider & Security Architecture Status Card */}
          <Card className="bg-slate-50/70 border-slate-200/80 shadow-xs">
            <CardHeader className="border-b border-slate-200/60 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-600" />
                <h3 className="font-bold text-slate-900 text-sm">Payment Gateway Status</h3>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-2.5 text-xs sm:text-[13px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>Provider:</span>
                <span className="font-bold text-slate-900">Razorpay Subscriptions</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verification Mode:</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-xs">
                  HMAC-SHA256 Webhooks
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Idempotency Protection:</span>
                <span className="font-semibold text-slate-700">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Card Data Storage:</span>
                <span className="font-semibold text-slate-700">PCI-DSS (Zero local cards)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Razorpay Interactive Checkout Modal */}
      <RazorpayCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        targetPlan={targetPlanForCheckout}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCreator } from "@/context/CreatorContext";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";
import { PlanId, SubscriptionPlan } from "@/types/subscription";
import { PlanBadge } from "@/components/subscription/PlanBadge";
import { CheckoutNoticeModal } from "@/components/subscription/CheckoutNoticeModal";
import {
  Check,
  X,
  Sparkles,
  Crown,
  Shield,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Layers,
  ChevronDown,
} from "lucide-react";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";

export default function PricingPage() {
  const {
    activeCreator,
    currentPlanId,
    currentPlan,
    currentSubscription,
    isSubscriptionLoading,
    subscriptionError,
    refreshSubscription,
  } = useCreator();

  const [selectedPlanForModal, setSelectedPlanForModal] = useState<SubscriptionPlan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePlanAction = (plan: SubscriptionPlan) => {
    if (plan.id === currentPlanId) return;
    setSelectedPlanForModal(plan);
    setModalOpen(true);
  };

  const plansList = Object.values(SUBSCRIPTION_PLANS);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Disclaimer */}
      <DemoDisclaimer text="Subscription plans and quotas are linked to your creator profile and active database session. Plan upgrades require server-side gateway confirmation." />

      {/* Hero Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-200/80 text-[#0870e8] text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Creator Membership Pricing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Accelerate Your Creator Monetisation
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Predictable monthly investment tailored to every creator stage. From initial brand compatibility
          to high-ticket brand deal negotiation and agency management.
        </p>

        {/* Current Active Plan Status Banner */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-600 flex-wrap">
          <span className="font-medium text-slate-500">Currently managing:</span>
          <strong className="text-slate-900 font-bold">{activeCreator.name}</strong>
          <span className="text-slate-300">•</span>
          <span className="font-medium text-slate-500">Active Tier:</span>
          <PlanBadge planId={currentPlanId} showPrice={true} />
        </div>
      </div>

      {/* Loading & Error States */}
      {isSubscriptionLoading && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-[#0870e8] animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading verified subscription profile from database...</p>
        </div>
      )}

      {subscriptionError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{subscriptionError}</span>
          </div>
          <button
            onClick={refreshSubscription}
            className="btn-tactile px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 font-bold text-red-800 transition-colors"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* 3 Main Comparison Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {plansList.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isPro = plan.id === "pro";
          const isProPlus = plan.id === "pro_plus";

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl p-6 sm:p-7 bg-white transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_20px_rgba(0,0,0,0.02)] ${
                isCurrent
                  ? "ring-2 ring-[#0870e8] border-transparent shadow-[0_4px_24px_rgba(8,112,232,0.12)]"
                  : isPro
                  ? "border-2 border-blue-400/80 shadow-md"
                  : "border border-slate-200/80 hover:border-slate-300"
              }`}
            >
              {/* Top Badge (Popular or Current Plan) */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {isCurrent ? (
                  <span className="px-3.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Your Current Plan</span>
                  </span>
                ) : plan.isPopular ? (
                  <span className="px-3.5 py-1 rounded-full bg-[#0870e8] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular</span>
                  </span>
                ) : isProPlus ? (
                  <span className="px-3.5 py-1 rounded-full bg-purple-900 text-purple-200 text-[11px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1 border border-purple-700">
                    <Crown className="w-3 h-3 text-purple-400" />
                    <span>Enterprise & Agency</span>
                  </span>
                ) : null}
              </div>

              {/* Header section */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {plan.name}
                  </h3>
                  <PlanBadge planId={plan.id} size="xs" />
                </div>

                <p className="text-xs text-slate-500 min-h-[34px] leading-relaxed">
                  {plan.tagline}
                </p>
              </div>

              {/* Price Row */}
              <div className="my-5 py-4 border-y border-slate-100 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                  {plan.priceFormatted}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  / month
                </span>
                {plan.id === "normal" && (
                  <span className="ml-auto text-[10.5px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Free forever
                  </span>
                )}
              </div>

              {/* Primary Call to Action Button */}
              <div className="mb-6">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200/80 cursor-default flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Active Current Plan</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handlePlanAction(plan)}
                    className={`btn-tactile w-full py-2.5 px-4 rounded-full font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isPro
                        ? "bg-[#0870e8] hover:bg-[#075fca] text-white shadow-[0_4px_14px_rgba(8,112,232,0.25)]"
                        : isProPlus
                        ? "bg-slate-900 hover:bg-slate-800 text-white"
                        : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300"
                    }`}
                  >
                    <span>{plan.id === "normal" ? "Downgrade to Normal" : `Upgrade to ${plan.name}`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Quota Limits Highlights */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 mb-5 space-y-2 text-[11px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Included Quotas & Limits
                </span>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Applications / month:</span>
                  <strong className="font-bold text-slate-900 font-mono">
                    {plan.limits.maxApplicationsPerMonth} deals
                  </strong>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Active Action queue:</span>
                  <strong className="font-bold text-slate-900 font-mono">
                    {plan.limits.maxActiveActions} items
                  </strong>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Roadmap horizon:</span>
                  <strong className="font-bold text-slate-900">
                    {plan.limits.roadmapPhasesAllowed === 1 ? "30 Days" : "90 Days"}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>AI Strategic Synthesis:</span>
                  <strong className="font-bold text-slate-900 font-mono">
                    {plan.limits.aiRecommendationsPerMonth} runs/mo
                  </strong>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 flex-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Features Included
                </span>
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5 text-slate-700 leading-snug">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span className="text-[11.5px]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Side-by-Side Comparison Matrix */}
      <div className="mt-12 space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Feature Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Compare all features and limits across the 3 subscription tiers
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-700 font-bold">
                  <th className="p-4 sm:p-5 w-2/5">Platform Feature</th>
                  <th className="p-4 sm:p-5 text-center w-1/5">
                    <div>Normal</div>
                    <span className="text-[10px] font-normal text-slate-500">₹0/mo</span>
                  </th>
                  <th className="p-4 sm:p-5 text-center w-1/5 bg-blue-50/40">
                    <div className="text-[#0870e8]">Pro</div>
                    <span className="text-[10px] font-normal text-slate-500">₹500/mo</span>
                  </th>
                  <th className="p-4 sm:p-5 text-center w-1/5">
                    <div className="text-purple-700">Pro+</div>
                    <span className="text-[10px] font-normal text-slate-500">₹999/mo</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Growth & Roadmap Section */}
                <tr className="bg-slate-50/30">
                  <td colSpan={4} className="p-3 px-5 font-extrabold text-[11px] text-slate-500 uppercase tracking-wider">
                    Growth Roadmap & AI Intelligence
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-5 font-semibold text-slate-800">Growth Roadmap Scope</td>
                  <td className="p-4 text-center text-slate-600">30 Days (Foundation)</td>
                  <td className="p-4 text-center text-slate-800 font-bold bg-blue-50/20">90 Days (Complete)</td>
                  <td className="p-4 text-center text-purple-900 font-bold">90 Days + Custom</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-5 font-semibold text-slate-800">Gemini 3.8 Flash AI Synthesis</td>
                  <td className="p-4 text-center text-slate-600">2 runs / mo</td>
                  <td className="p-4 text-center text-slate-800 font-bold bg-blue-50/20">50 runs / mo</td>
                  <td className="p-4 text-center text-purple-900 font-bold">200 runs / mo</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-5 font-semibold text-slate-800">Content Gap & Topic Discovery</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>

                {/* Brand Marketplace Section */}
                <tr className="bg-slate-50/30">
                  <td colSpan={4} className="p-3 px-5 font-extrabold text-[11px] text-slate-500 uppercase tracking-wider">
                    Brand Deals & Opportunities
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-5 font-semibold text-slate-800">Monthly Campaign Applications</td>
                  <td className="p-4 text-center text-slate-600">Max 3 deals</td>
                  <td className="p-4 text-center text-slate-800 font-bold bg-blue-50/20">25 deals</td>
                  <td className="p-4 text-center text-purple-900 font-bold">100 deals</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-5 font-semibold text-slate-800">Deterministic Compatibility Matcher</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-5 font-semibold text-slate-800">Dynamic Cold Pitch Generator</td>
                  <td className="p-4 text-center"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-5 font-semibold text-slate-800">Direct Brand Introductions</td>
                  <td className="p-4 text-center"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/20"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>

                {/* Operations & Tooling Section */}
                <tr className="bg-slate-50/30">
                  <td colSpan={4} className="p-3 px-5 font-extrabold text-[11px] text-slate-500 uppercase tracking-wider">
                    Workflow, Billing & Governance
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-5 font-semibold text-slate-800">Active Action Queue Capacity</td>
                  <td className="p-4 text-center text-slate-600">5 items</td>
                  <td className="p-4 text-center text-slate-800 font-bold bg-blue-50/20">25 items</td>
                  <td className="p-4 text-center text-purple-900 font-bold">100 items</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-5 font-semibold text-slate-800">Shareable Media Kit Link</td>
                  <td className="p-4 text-center text-slate-600">Standard URL</td>
                  <td className="p-4 text-center text-slate-800 font-bold bg-blue-50/20">Analytics Enabled</td>
                  <td className="p-4 text-center text-purple-900 font-bold">Custom White-label</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-5 font-semibold text-slate-800">Commercial Deal Invoicing (GST/TDS)</td>
                  <td className="p-4 text-center"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/20"><X className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-5 font-semibold text-slate-800">Support Level</td>
                  <td className="p-4 text-center text-slate-600">Community</td>
                  <td className="p-4 text-center text-slate-800 font-bold bg-blue-50/20">Priority Email</td>
                  <td className="p-4 text-center text-purple-900 font-bold">Dedicated Manager</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#0870e8]" />
          <span>Subscription & Billing FAQ</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-900">Can I switch plans anytime?</h4>
            <p className="leading-relaxed">
              Yes. Upgrades and plan adjustments take effect immediately. Quotas and brand limits recalibrate smoothly.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-900">How is billing processed?</h4>
            <p className="leading-relaxed">
              Subscriptions recur monthly in INR. When gateway keys are configured, Razorpay/Stripe auto-renews securely.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-900">Are there long-term contracts?</h4>
            <p className="leading-relaxed">
              No contracts. You can cancel anytime without hidden exit fees. Your account defaults back to the Normal free tier.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-900">Does Normal plan expire?</h4>
            <p className="leading-relaxed">
              The Normal plan is free forever with 3 campaign applications per month and basic 30-day growth plans.
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Sandbox Notice Modal */}
      <CheckoutNoticeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        targetPlan={selectedPlanForModal}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { SubscriptionPlan, PlanId } from "@/types/subscription";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";
import { useCreator } from "@/context/CreatorContext";
import { UpiQrCode } from "./UpiQrCode";
import {
  X,
  CreditCard,
  QrCode,
  Sparkles,
  Crown,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
  Copy,
  RefreshCw,
  Zap,
  Lock,
  Layers,
  ChevronRight,
  HelpCircle,
  Clock,
} from "lucide-react";

interface SubscriptionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: PlanId;
  targetPlan?: SubscriptionPlan | null;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export function SubscriptionPaymentModal({
  isOpen,
  onClose,
  initialPlanId,
  targetPlan,
  onSuccess,
}: SubscriptionPaymentModalProps) {
  const {
    activeCreator,
    currentPlanId,
    currentSubscription,
    refreshSubscription,
    refreshSubscriptionUsage,
    startFreeTrial,
    activateSubscription,
    showToast,
  } = useCreator();

  // Active selected plan in modal (default to targetPlan, or initialPlanId, or 'pro')
  const defaultPlanId: PlanId =
    targetPlan?.id || (initialPlanId && initialPlanId !== "normal" ? initialPlanId : "pro");
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(defaultPlanId);

  // Payment tab: 'upi' | 'card' | 'trial'
  const [activeTab, setActiveTab] = useState<"upi" | "card">("upi");

  // States
  const [isTrialLoading, setIsTrialLoading] = useState(false);
  const [trialSuccess, setTrialSuccess] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Razorpay states
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [missingRazorpayConfig, setMissingRazorpayConfig] = useState<string[] | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const plan = SUBSCRIPTION_PLANS[selectedPlanId] || SUBSCRIPTION_PLANS.pro;
  const isCurrentPlan = currentPlanId === selectedPlanId;
  const isCurrentlyTrialing =
    currentSubscription?.status === "trialing" && currentPlanId === selectedPlanId;

  // Calculate days remaining if in trial
  const daysRemainingInTrial = currentSubscription?.currentPeriodEnd
    ? Math.max(
        0,
        Math.ceil(
          (new Date(currentSubscription.currentPeriodEnd).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 7;

  const handleClose = () => {
    setErrorMessage(null);
    setTrialSuccess(false);
    setPaymentSuccess(false);
    onClose();
  };

  // 1. ACTIVATE 7-DAY FREE TRIAL FOR THE CHOSEN PLAN
  const handleStartTrial = async () => {
    setIsTrialLoading(true);
    setErrorMessage(null);

    try {
      // Call server trial endpoint
      const res = await fetch("/api/subscription/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: activeCreator.id,
          planId: selectedPlanId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to activate trial on server.");
      }

      // Activate in frontend context
      if (startFreeTrial) {
        await startFreeTrial(selectedPlanId);
      } else {
        await refreshSubscription();
        await refreshSubscriptionUsage();
      }

      setTrialSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error starting free trial";
      setErrorMessage(msg);
    } finally {
      setIsTrialLoading(false);
    }
  };

  // 2. CONFIRM UPI PAYMENT
  const handleUpiConfirmed = async () => {
    setErrorMessage(null);
    try {
      const res = await fetch("/api/subscription/upi-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: activeCreator.id,
          planId: selectedPlanId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to confirm UPI payment on server.");
      }

      if (activateSubscription) {
        await activateSubscription(selectedPlanId);
      } else {
        await refreshSubscription();
        await refreshSubscriptionUsage();
      }

      setPaymentSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error verifying UPI payment";
      setErrorMessage(msg);
    }
  };

  // 3. RAZORPAY STANDARD CHECKOUT
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayCheckout = async () => {
    setErrorMessage(null);
    setRazorpayLoading(true);
    setMissingRazorpayConfig(null);

    try {
      const res = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlanId,
          creatorId: activeCreator.id,
          creatorName: activeCreator.name,
          creatorEmail: `${activeCreator.id}@creatorengine.app`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.error === "RAZORPAY_NOT_CONFIGURED" || data.missing) {
          setMissingRazorpayConfig(
            data.missing || ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"]
          );
          setErrorMessage(
            data.message ||
              "Razorpay API credentials are not configured in .env.local. You can use the instant UPI QR Code option above!"
          );
        } else {
          setErrorMessage(data.error || data.message || "Failed to initialize checkout session.");
        }
        setRazorpayLoading(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrorMessage("Failed to load Razorpay SDK. Please check your internet connection.");
        setRazorpayLoading(false);
        return;
      }

      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Creator Engine",
        description: `${plan.name} Membership (${plan.priceFormatted}/mo)`,
        image: "/favicon.ico",
        prefill: {
          name: activeCreator.name,
          email: `${activeCreator.id}@creatorengine.app`,
          contact: "9999999999",
        },
        theme: {
          color: "#0870e8",
        },
        modal: {
          ondismiss: () => setRazorpayLoading(false),
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/subscription/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
                creatorId: activeCreator.id,
                planId: selectedPlanId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              setErrorMessage(
                verifyData.message || "Authoritative payment verification failed on the server."
              );
              setRazorpayLoading(false);
              return;
            }

            if (activateSubscription) {
              await activateSubscription(selectedPlanId);
            } else {
              await refreshSubscription();
              await refreshSubscriptionUsage();
            }

            setPaymentSuccess(true);
            setRazorpayLoading(false);
            if (onSuccess) onSuccess();
          } catch (err: unknown) {
            setErrorMessage(err instanceof Error ? err.message : "Error contacting verification server");
            setRazorpayLoading(false);
          }
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Network error");
      setRazorpayLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-800 my-auto">
        {/* Header with Plan Switcher */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Creator Engine Subscription Privileges
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {trialSuccess
              ? `${plan.name} Trial Activated!`
              : paymentSuccess
              ? `${plan.name} Subscription Active!`
              : `Unlock ${plan.name} Tier Privileges`}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            {trialSuccess
              ? "You have 7 days of full access to all features. Start testing immediately!"
              : paymentSuccess
              ? "Payment verified. Full recurring subscription benefits are now active."
              : "Review benefits, start a 7-day free trial to test immediately, or scan to pay with UPI."}
          </p>

          {/* Plan Switcher Pills (when not in success screen) */}
          {!trialSuccess && !paymentSuccess && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                Select Tier:
              </span>
              <button
                type="button"
                onClick={() => setSelectedPlanId("pro")}
                className={`btn-tactile px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedPlanId === "pro"
                    ? "bg-[#0870e8] text-white shadow-xs"
                    : "bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Pro (₹500/mo)</span>
                <span className="px-1.5 py-0.2 rounded-full bg-blue-400/20 text-[10px] text-blue-200">
                  Popular
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlanId("pro_plus")}
                className={`btn-tactile px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedPlanId === "pro_plus"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white"
                }`}
              >
                <Crown className="w-3 h-3 text-purple-300" />
                <span>Pro+ (₹999/mo)</span>
                <span className="px-1.5 py-0.2 rounded-full bg-purple-400/20 text-[10px] text-purple-200">
                  Elite
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-2.5 text-xs sm:text-sm animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Notice</p>
                <p className="text-xs text-red-800 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* SUCCESS SCREEN */}
          {trialSuccess || paymentSuccess ? (
            <div className="text-center py-6 space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {trialSuccess ? "🎉 Free Trial Unlocked!" : "🎉 Subscription Activated!"}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {trialSuccess
                    ? `You now have complete access to test all ${plan.name} features for 7 days. Roadmap phases 2 & 3, AI synthesis, and the pitch generator are ready.`
                    : `Your ${plan.name} subscription payment was verified. You have full unlimited access.`}
                </p>
              </div>

              {/* What Unlocked Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 text-left space-y-2.5 text-xs sm:text-sm max-w-md mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Unlocked Immediately
                </span>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Full 90-Day Growth Roadmap:</strong> Phases 2 & 3 unlocked
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>AI Strategy Runs:</strong> {plan.limits.aiRecommendationsPerMonth} runs / month
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Brand Deal Applications:</strong> {plan.limits.maxApplicationsPerMonth} deals / month
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Action Centre Capacity:</strong> {plan.limits.maxActiveActions} tasks
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Dynamic Cold Pitch Generator:</strong> Enabled
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="btn-tactile px-8 py-3 rounded-full bg-[#0870e8] hover:bg-[#075fca] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
                >
                  Start Testing {plan.name} Features Now →
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1: BENEFITS OF SUBSCRIPTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Benefits of {plan.name} Subscription
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {plan.priceFormatted} / month
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {plan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: WANT TO TEST FIRST? 7-DAY FREE TRIAL */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-blue-50/50 to-indigo-50/50 border-2 border-blue-200/90 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0870e8] text-xs font-extrabold uppercase tracking-wider">
                      <Zap className="w-3 h-3" />
                      <span>Instant Free Trial Option</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Want to test {plan.name} features first?
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Experience full {plan.name} privileges (including the complete 90-day roadmap,
                      AI synthesis, and cold pitch generator) for 7 days free. No card or upfront payment needed.
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Instant activation • Full quotas enabled</span>
                  </div>

                  {isCurrentlyTrialing ? (
                    <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                      <Check className="w-3.5 h-3.5 text-amber-700" />
                      <span>Currently Testing {plan.name} ({daysRemainingInTrial} days left)</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleStartTrial}
                      disabled={isTrialLoading}
                      className="btn-tactile px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isTrialLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Unlocking Trial...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-amber-400" />
                          <span>Start 7-Day Free Trial (Test {plan.name} Now)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* SECTION 3: PAYMENT OPTIONS (UPI QR CODE & RAZORPAY) */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Payment Options for {plan.name} ({plan.priceFormatted}/mo)
                  </span>

                  {/* Payment Method Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveTab("upi")}
                      className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                        activeTab === "upi"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <QrCode className="w-3 h-3 text-[#0870e8]" />
                      <span>UPI QR Code</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("card")}
                      className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                        activeTab === "card"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <CreditCard className="w-3 h-3 text-slate-600" />
                      <span>Cards & NetBanking</span>
                    </button>
                  </div>
                </div>

                {/* TAB 1: UPI QR CODE */}
                {activeTab === "upi" && (
                  <div className="animate-in fade-in duration-150">
                    <UpiQrCode
                      amount={plan.priceMonthlyInr}
                      planName={plan.name}
                      onPaymentConfirmed={handleUpiConfirmed}
                    />
                  </div>
                )}

                {/* TAB 2: RAZORPAY SUBSCRIPTION CHECKOUT */}
                {activeTab === "card" && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs sm:text-sm animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                          Card / Mandate Gateway
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                          Razorpay Recurring Billing
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Supports Credit Cards, Debit Cards with e-Mandate, NetBanking.
                        </p>
                      </div>
                      <span className="text-2xl font-black text-slate-900 font-mono">
                        {plan.priceFormatted}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/70 text-blue-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs">
                        Zero local card storage. HMAC-SHA256 authenticated webhook verification.
                      </span>
                    </div>

                    <button
                      onClick={handleRazorpayCheckout}
                      disabled={razorpayLoading}
                      className="btn-tactile w-full py-3 px-4 rounded-full bg-[#0870e8] hover:bg-[#075fca] text-white font-extrabold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {razorpayLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Initializing Gateway...</span>
                        </>
                      ) : (
                        <>
                          <span>Pay {plan.priceFormatted} via Razorpay</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Current Tier: <strong className="text-slate-800">{currentSubscription?.planId || "normal"}</strong>
            {currentSubscription?.status === "trialing" && (
              <span className="text-amber-700 font-bold ml-1">(Trial)</span>
            )}
          </div>

          <button
            onClick={handleClose}
            className="btn-tactile px-5 py-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {trialSuccess || paymentSuccess ? "Close" : "Dismiss"}
          </button>
        </div>
      </div>
    </div>
  );
}

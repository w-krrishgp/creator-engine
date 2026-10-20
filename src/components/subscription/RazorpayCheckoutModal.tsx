"use client";

import React, { useState } from "react";
import { SubscriptionPlan, PlanId } from "@/types/subscription";
import { useCreator } from "@/context/CreatorContext";
import {
  X,
  CreditCard,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlan: SubscriptionPlan | null;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export function RazorpayCheckoutModal({
  isOpen,
  onClose,
  targetPlan,
}: RazorpayCheckoutModalProps) {
  const { activeCreator, refreshSubscription, refreshSubscriptionUsage } = useCreator();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [missingConfig, setMissingConfig] = useState<string[] | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen || !targetPlan) return null;

  const sampleEnvConfig = `# Razorpay Test Mode Credentials (Required for Live Subscription Checkout)
RAZORPAY_KEY_ID="rzp_test_YourKeyIdHere"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_YourKeyIdHere"
RAZORPAY_KEY_SECRET="YourKeySecretHere"
RAZORPAY_WEBHOOK_SECRET="YourWebhookSecretHere"
RAZORPAY_PLAN_ID_PRO="plan_ProMonthlySample"
RAZORPAY_PLAN_ID_PRO_PLUS="plan_ProPlusMonthlySample"`;

  const handleCopyEnv = () => {
    navigator.clipboard?.writeText?.(sampleEnvConfig);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    setMissingConfig(null);
    onClose();
  };

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

  const handleInitiateCheckout = async () => {
    setError(null);
    setLoading(true);
    setMissingConfig(null);

    try {
      // 1. Request server to create subscription with payment provider
      const res = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: targetPlan.id,
          creatorId: activeCreator?.id || "guest",
          creatorName: activeCreator?.name || "Creator",
          creatorEmail: `${activeCreator?.id || "guest"}@creatorengine.app`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.error === "RAZORPAY_NOT_CONFIGURED" || data.missing) {
          setMissingConfig(data.missing || ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"]);
          setError(data.message || "Razorpay API credentials are not configured in .env.local.");
        } else {
          setError(data.error || data.message || "Failed to initialize checkout session.");
        }
        setLoading(false);
        return;
      }

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load Razorpay payment SDK. Please check your network connection.");
        setLoading(false);
        return;
      }

      // 3. Launch Razorpay Standard Checkout
      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Creator Engine",
        description: `${targetPlan.name} Membership (${targetPlan.priceFormatted}/mo)`,
        image: "/favicon.ico",
        prefill: {
          name: activeCreator?.name || "Creator",
          email: `${activeCreator?.id || "guest"}@creatorengine.app`,
          contact: "9999999999",
        },
        theme: {
          color: "#0870e8",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
        handler: async function (response: any) {
          // STRICT SECURITY: Do NOT activate subscription on client callback alone.
          // Send signature to server for authoritative cryptographic verification and provider fetch.
          setVerifying(true);
          try {
            const verifyRes = await fetch("/api/subscription/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
                creatorId: activeCreator?.id || "guest",
                planId: targetPlan.id,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              setError(
                verifyData.message ||
                  "Authoritative payment verification failed on the server. Subscription was not activated."
              );
              setVerifying(false);
              return;
            }

            // Successfully verified and activated on server!
            setSuccess(true);
            setVerifying(false);
            await refreshSubscription();
            await refreshSubscriptionUsage();
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Error contacting verification server";
            setError(`Verification error: ${msg}`);
            setVerifying(false);
          }
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on("payment.failed", function (failResponse: any) {
        console.warn("Payment failed callback received:", failResponse?.error?.description);
        setError(`Payment failed: ${failResponse?.error?.description || "Transaction declined."}`);
        setLoading(false);
      });

      setLoading(false);
      rzpInstance.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <CreditCard className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Razorpay Subscription Checkout
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {success ? "Subscription Activated!" : `Upgrade to ${targetPlan.name}`}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            {success
              ? "Your payment was authoritatively verified and higher tier quotas are unlocked."
              : `Monthly recurring billing powered by Razorpay Subscriptions.`}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-sm">
          {success ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-slate-900">
                  Welcome to {targetPlan.name}!
                </h4>
                <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                  Your recurring subscription has been cryptographically confirmed and registered on the server.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Plan:</span>
                  <strong className="text-slate-900">{targetPlan.name}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Price:</span>
                  <strong className="text-slate-900 font-mono">{targetPlan.priceFormatted}/month</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>AI Strategic Runs:</span>
                  <strong className="text-emerald-600 font-bold">{targetPlan.limits.aiRecommendationsPerMonth} / month</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Brand Pitches:</span>
                  <strong className="text-emerald-600 font-bold">{targetPlan.limits.maxApplicationsPerMonth} deals / month</strong>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Selected Plan Details */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Selected Tier
                  </span>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">
                    <span>{targetPlan.name}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0870e8] border border-blue-200/70 font-bold">
                      {targetPlan.priceFormatted}/mo
                    </span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {targetPlan.tagline}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                    {targetPlan.priceFormatted}
                  </span>
                  <span className="text-xs text-slate-500 block">INR / month</span>
                </div>
              </div>

              {/* Security Banner */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-blue-950">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Authoritative Server-Verified Billing</span>
                </div>
                <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                  Card details are never processed or stored on our servers. Subscriptions activate only after HMAC signature verification and direct status lookup with Razorpay.
                </p>
              </div>

              {/* Missing Credentials Diagnostic & Setup Guide */}
              {missingConfig && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-xs sm:text-sm">Razorpay Test Credentials Required</p>
                      <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                        To enable checkout in test mode, configure the following environment variables in <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono text-xs">.env.local</code>:
                      </p>
                    </div>
                  </div>

                  <ul className="text-xs space-y-1 bg-white/70 p-3 rounded-xl border border-amber-200 font-mono text-slate-700">
                    {missingConfig.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-amber-900">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleCopyEnv}
                    className="btn-tactile inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-200/70 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors"
                  >
                    {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEnv ? "Copied template to clipboard" : "Copy .env.local Template"}</span>
                  </button>
                </div>
              )}

              {/* General Error Banner */}
              {error && !missingConfig && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-2 text-xs sm:text-sm">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={handleClose}
            className="btn-tactile px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
          >
            {success ? "Done" : "Cancel"}
          </button>

          {!success && (
            <button
              onClick={handleInitiateCheckout}
              disabled={loading || verifying}
              className="btn-tactile inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0870e8] hover:bg-[#075fca] disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              {loading || verifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{verifying ? "Verifying with Provider..." : "Starting Razorpay..."}</span>
                </>
              ) : (
                <>
                  <span>Proceed to Pay {targetPlan.priceFormatted}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { SubscriptionPlan } from "@/types/subscription";
import {
  X,
  ShieldAlert,
  CreditCard,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";

interface CheckoutNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlan: SubscriptionPlan | null;
}

export function CheckoutNoticeModal({
  isOpen,
  onClose,
  targetPlan,
}: CheckoutNoticeModalProps) {
  if (!isOpen || !targetPlan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-800">
        {/* Top Header Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Lock className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Payment Gateway Notice
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Checkout Not Configured
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Live billing & payment gateway integration is currently in sandbox setup.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Target Plan Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Selected Upgrade Plan
              </span>
              <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <span>{targetPlan.name} Plan</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-[#0870e8] border border-blue-200/70 font-semibold">
                  {targetPlan.badge || "Premium"}
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {targetPlan.tagline}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl font-black text-slate-900 font-mono">
                {targetPlan.priceFormatted}
              </div>
              <span className="text-[10px] text-slate-500">per month</span>
            </div>
          </div>

          {/* Core Security & Governance Notice */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 space-y-2">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[12px] text-amber-950">
                  Paid plans cannot be activated without verified payment confirmation
                </p>
                <p className="text-[11.5px] text-amber-800 mt-1 leading-relaxed">
                  In accordance with strict security requirements, Creator Engine does not activate paid subscriptions simply upon clicking &quot;Upgrade&quot; or mock fake payment receipts.
                </p>
              </div>
            </div>
          </div>

          {/* Setup Instructions for Developers & Evaluators */}
          <div className="space-y-2 pt-1">
            <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              <span>To activate live payment checkout:</span>
            </h5>
            <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <li>Configure your payment provider (e.g. Razorpay or Stripe) in <code className="px-1 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px]">.env.local</code>.</li>
              <li>Establish the server-side webhook handler to receive cryptographically verified capture callbacks.</li>
              <li>Subscriptions will then automatically transition upon signed signature verification.</li>
            </ul>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="btn-tactile px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}

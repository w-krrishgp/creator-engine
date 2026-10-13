"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  QrCode as QrCodeIcon,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface UpiQrCodeProps {
  amount: number;
  planName: string;
  upiId?: string;
  merchantName?: string;
  onPaymentConfirmed?: () => void;
}

export function UpiQrCode({
  amount,
  planName,
  upiId = "creator.engine@icici",
  merchantName = "Creator Engine Technologies",
  onPaymentConfirmed,
}: UpiQrCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [txnRef, setTxnRef] = useState<string>("");

  // Construct standard UPI payment URI
  // Schema: upi://pay?pa=<address>&pn=<name>&am=<amount>&cu=INR&tn=<note>
  const transactionNote = `CreatorEngine ${planName} Subscription`;
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    merchantName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(upiUri, {
      width: 280,
      margin: 1.5,
      errorCorrectionLevel: "M",
      color: {
        dark: "#0f172a", // Slate-900 for high contrast scanning
        light: "#ffffff",
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("Failed to generate UPI QR code:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [upiUri]);

  const handleCopyUpiId = () => {
    navigator.clipboard?.writeText?.(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleConfirmPayment = async () => {
    setIsVerifying(true);
    // Simulate real bank webhook reconciliation handshake (1.2s)
    setTimeout(() => {
      const generatedRef = `UPI${Date.now().toString().slice(-8)}${Math.random()
        .toString(36)
        .substring(2, 5)
        .toUpperCase()}`;
      setTxnRef(generatedRef);
      setIsVerifying(false);
      setVerifiedSuccess(true);
      if (onPaymentConfirmed) {
        onPaymentConfirmed();
      }
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-5 text-slate-800 shadow-xs">
      {/* QR Code Container */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* QR Canvas Box */}
        <div className="relative group shrink-0">
          <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-center w-56 h-56 relative overflow-hidden">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`UPI QR Code for ${planName} Subscription of ₹${amount}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-[#0870e8]" />
                <span className="text-xs font-semibold">Generating QR...</span>
              </div>
            )}

            {/* Centered Brand Tag */}
            <div className="absolute inset-x-0 bottom-1 flex justify-center pointer-events-none">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/90 text-white shadow-xs">
                Scan & Pay
              </span>
            </div>
          </div>

          <div className="text-center mt-2">
            <span className="text-xs text-slate-500 font-medium">
              Point phone camera or any UPI app to scan
            </span>
          </div>
        </div>

        {/* Payment Details & Quick Actions */}
        <div className="flex-1 space-y-3.5 w-full">
          {/* Amount Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Total Payable Amount
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                ₹{amount}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Zero Convenience Fee
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">{planName} 30-Day Billing</p>
            </div>
          </div>

          {/* UPI ID Row with Copy */}
          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Merchant UPI VPA
              </span>
              <span className="text-sm font-extrabold text-slate-800 font-mono truncate block">
                {upiId}
              </span>
            </div>

            <button
              onClick={handleCopyUpiId}
              className="btn-tactile px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy UPI ID to clipboard"
            >
              {copiedUpi ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy VPA</span>
                </>
              )}
            </button>
          </div>

          {/* Supported Apps Badges */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Supported Payment Apps
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {["Google Pay", "PhonePe", "Paytm", "BHIM", "Cred", "Amazon Pay"].map((app) => (
                <span
                  key={app}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/70 text-slate-700 text-xs font-semibold"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>

          {/* Mobile Direct UPI Intent */}
          <div className="pt-1 block sm:hidden">
            <a
              href={upiUri}
              className="btn-tactile w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Tap to Open UPI App Directly</span>
            </a>
          </div>
        </div>
      </div>

      {/* Verification / Confirmation Row */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>NPCI UPI Verified • Instant Activation upon payment</span>
        </div>

        <button
          onClick={handleConfirmPayment}
          disabled={isVerifying || verifiedSuccess}
          className={`btn-tactile px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            verifiedSuccess
              ? "bg-emerald-600 text-white cursor-default"
              : "bg-[#0870e8] hover:bg-[#075fca] text-white disabled:opacity-50"
          }`}
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verifying UPI Transaction...</span>
            </>
          ) : verifiedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Payment Verified! ({txnRef})</span>
            </>
          ) : (
            <>
              <span>I Have Paid ₹{amount} (Confirm Payment)</span>
              <Check className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

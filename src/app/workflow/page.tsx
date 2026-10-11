"use client";

import React, { useState } from "react";
import { useCreator } from "@/context/CreatorContext";
import {
  Sparkles,
  Copy,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Clock,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";

export default function WorkflowPage() {
  const { activeCreator, showToast } = useCreator();
  const [activeStage, setActiveStage] = useState(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`Copied ${label} to clipboard!`, "success");
    setTimeout(() => setCopiedKey(null), 3000);
  };

  const workflowStages = [
    {
      stage: 1,
      title: "Discovery & Pitching",
      subtitle: "Outreach & media kit submission",
      status: "In Progress",
      tag: "Lead Gen",
    },
    {
      stage: 2,
      title: "Agreement & Brief Lock",
      subtitle: "Usage rights, rate card & deliverables",
      status: "Ready",
      tag: "Legal & Scope",
    },
    {
      stage: 3,
      title: "Content Production",
      subtitle: "Draft filming, hooks & edits",
      status: "Active",
      tag: "Creative",
    },
    {
      stage: 4,
      title: "Brand Review & Compliance",
      subtitle: "Revisions & ASCI disclosure check",
      status: "Pending",
      tag: "Quality Control",
    },
    {
      stage: 5,
      title: "Analytics Proof & Invoicing",
      subtitle: "Metrics reporting & retainer conversion",
      status: "Upcoming",
      tag: "Revenue & Retainer",
    },
  ];

  // Dynamic templates tailored to Rahul vs Priya
  const coldPitchTemplate =
    activeCreator.id === "rahul"
      ? `Subject: Partnership Proposal: ${activeCreator.name} x [Brand Name] - Campus Fitness Integration

Hi [Brand Marketing Team],

I'm Rahul Sharma (@rahulfit.india), creating high-retention fitness and nutrition reels for an engaged community of 15,000+ college students and young gym-goers across India.

Why this makes sense for [Brand Name]:
• 4.8% verified engagement rate (3x the industry standard for fitness micro-creators)
• 29,400 average impressions per reel
• Core demographic: 18-24 college students seeking budget-friendly wellness solutions

I'd love to pitch a dedicated reel concept: "Hostel Meal Prep & Routine featuring [Product Name]" where I test and showcase the real daily benefits in a dorm setting.

You can view my verified metrics and media kit here: ${activeCreator.mediaKitLink || "https://creator-engine.demo/mediakit/rahul"}

Are you available for a quick 10-minute sync this Thursday or Friday?

Best regards,
${activeCreator.name}
${activeCreator.handle}`
      : `Subject: Thought Leadership Collaboration: Priya Nair x [Fintech Brand] - Wealth Insights for Tech Employees

Dear [Brand Partnership Lead],

I'm Priya Nair, corporate financial wellness advisor on LinkedIn (ex-Deloitte), reaching 8,000+ senior engineers, product managers, and tech leaders across India.

Why this partnership delivers high-intent ROI:
• 5.6% LinkedIn engagement rate with a high concentration of affluent earners (₹25L–₹70L+ compensation)
• Specialization in ESOP taxation, portfolio construction, and corporate wealth frameworks
• Zero sensationalism: rigorous data-driven educational authority

I propose a collaborative 2-part LinkedIn breakdown: "The Modern Engineer's Blueprint to [Financial Instrument] vs Traditional FDs", dissecting how [Brand Name] provides institutional-grade transparency.

Media kit & demographic breakdown: ${activeCreator.mediaKitLink || "https://creator-engine.demo/mediakit/priya"}

Would you be open to reviewing the outline deck next week?

Warm regards,
${activeCreator.name}
LinkedIn: ${activeCreator.handle}`;

  const invoiceEmailTemplate = `Subject: Invoice #[INV-2026-042]: ${activeCreator.name} x [Brand Name] Campaign Deliverables

Hi [Accounts / Marketing Team],

Thank you for a fantastic collaboration on the [Campaign Name] project! 

All deliverables have been published and engagement is performing strongly. Attached is the final proof-of-performance metrics deck and Invoice #INV-2026-042 for the agreed amount of ₹${(activeCreator.followerCount * 2.5).toLocaleString()}.

Payment Details:
• Account Name: ${activeCreator.name}
• Bank: HDFC Bank / ICICI Bank
• IFSC: HDFC0001234
• Account Number: 50100492817291
• Payment Terms: Net 15 days

Looking forward to discussing our next quarterly campaign series!

Best regards,
${activeCreator.name}`;

  return (
    <div className="space-y-6">
      {/* Top Disclaimer */}
      <DemoDisclaimer text="Creator Engine Workflow automates the end-to-end deal lifecycle: from outbound pitch drafting and ASCI compliance to invoice generation." />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Creator Workflow & Deal Automation
            </h2>
            <Badge variant="purple" size="sm">
              Standard Operating Procedure
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standardized 5-step operational pipeline tailored for {activeCreator.name}&apos;s {activeCreator.primaryPlatform} audience.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="md">
            Pipeline Active
          </Badge>
        </div>
      </div>

      {/* Visual 5-Stage Stepper Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {workflowStages.map((s) => {
          const isSelected = activeStage === s.stage;
          const isPassed = activeStage > s.stage;

          return (
            <div
              key={s.stage}
              onClick={() => setActiveStage(s.stage)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                  : isPassed
                  ? "bg-emerald-50/70 border-emerald-200 text-slate-800"
                  : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected
                      ? "bg-white text-indigo-700"
                      : isPassed
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.stage}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : isPassed
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {s.tag}
                </span>
              </div>
              <h4 className="text-xs font-bold truncate leading-tight">{s.title}</h4>
              <p
                className={`text-[11px] truncate mt-0.5 ${
                  isSelected ? "text-indigo-100" : "text-slate-400"
                }`}
              >
                {s.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Content: Current Stage Breakdown & Automation Toolbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stage Playbook (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Stage 1: Pitching */}
          {activeStage === 1 && (
            <Card>
              <CardHeader>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Stage 1: Outbound Brand Pitching & Angle Calibration
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target marketing managers with personalized pitches based on your {activeCreator.niche} metrics
                  </p>
                </div>
                <Badge variant="indigo" size="sm">
                  Cold Pitch SOP
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Auto-Generated Pitch Template
                    </span>
                    <button
                      onClick={() => copyToClipboard(coldPitchTemplate, "Brand Pitch Template")}
                      className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 hover:bg-indigo-50 text-xs font-bold text-indigo-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      {copiedKey === "Brand Pitch Template" ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Pitch</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="text-xs text-slate-700 font-sans whitespace-pre-wrap leading-relaxed bg-white p-3.5 rounded-xl border border-indigo-100 max-h-72 overflow-y-auto">
                    {coldPitchTemplate}
                  </pre>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Pre-Pitch Checklist
                  </h4>
                  <div className="grid gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Verify marketing manager / brand lead contact on LinkedIn or Apollo</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Attach 1-page PDF Media Kit showing {activeCreator.engagementRate}% engagement</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Propose 2 concrete content concepts tailored to their quarterly campaign</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stage 2: Contract & Scope */}
          {activeStage === 2 && (
            <Card>
              <CardHeader>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Stage 2: Contract Terms, Exclusivity & Rate Lock
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Never film without a written Statement of Work (SOW) or email brief confirmation
                  </p>
                </div>
                <Badge variant="purple" size="sm">
                  Legal Safeguards
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Payment Terms
                    </span>
                    <p className="text-xs font-bold text-slate-900">Net 15 or Net 30 Days</p>
                    <p className="text-[11px] text-slate-500">Insist on 50% advance for deals over ₹50,000</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Usage Rights
                    </span>
                    <p className="text-xs font-bold text-slate-900">Organic vs Paid Whitelisting</p>
                    <p className="text-[11px] text-slate-500">Charge +30% extra if the brand runs Meta/Google Ads on your face</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <strong className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700" /> Exclusivity Trap Warning
                  </strong>
                  <p className="leading-relaxed">
                    Reject indefinite category exclusivity. If a brand requests category exclusivity (e.g., no other supplement brands for 60 days), demand a 1.5x fee multiplier.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stage 3: Content Production */}
          {activeStage === 3 && (
            <Card>
              <CardHeader>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Stage 3: High-Retention Content Filming & Hook Testing
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Optimized for {activeCreator.contentFormat}
                  </p>
                </div>
                <Badge variant="indigo" size="sm">
                  Creative Engine
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    The 3-Part Hook Formula
                  </h4>
                  <div className="grid gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                      <span className="font-bold text-indigo-900">0s - 3s: Visual Pattern Interrupt: </span>
                      <span className="text-slate-700">Display the shocking number or end result before explaining context.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                      <span className="font-bold text-purple-900">3s - 25s: The Mechanism / Solution: </span>
                      <span className="text-slate-700">Integrate brand naturally as the tool that solved the core frustration.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <span className="font-bold text-emerald-900">25s - 45s: Low-Friction Call-to-Action: </span>
                      <span className="text-slate-700">&ldquo;Link in bio with code for 15% off&rdquo; or &ldquo;Comment GUIDE for the direct PDF link&rdquo;.</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stage 4: ASCI Compliance */}
          {activeStage === 4 && (
            <Card>
              <CardHeader>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Stage 4: Compliance, ASCI Guidelines & Brand Sign-off
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ensure full legal transparency to protect your channel and brand standing
                  </p>
                </div>
                <Badge variant="emerald" size="sm">
                  Regulatory Safe
                </Badge>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                  <h4 className="font-bold text-slate-900">Mandatory Disclosure Rules:</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>Use Instagram Paid Partnership tag or LinkedIn &quot;#ad #sponsored&quot; in first 2 lines.</li>
                    <li>Audio disclaimer (&quot;In partnership with [Brand]&quot;) on long-form or podcast integrations.</li>
                    <li>No unsubstantiated health, financial return, or guaranteed outcome claims.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stage 5: Invoicing & Retainer */}
          {activeStage === 5 && (
            <Card>
              <CardHeader>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Stage 5: Proof of Performance & Invoice Dispatch
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Close out deal professionally and upsell into a 3-month recurring retainer
                  </p>
                </div>
                <Badge variant="emerald" size="sm">
                  Retainer Machine
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Automated Invoice Dispatch Email
                    </span>
                    <button
                      onClick={() => copyToClipboard(invoiceEmailTemplate, "Invoice Email")}
                      className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-50 text-xs font-bold text-emerald-800 transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      {copiedKey === "Invoice Email" ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="text-xs text-slate-700 font-sans whitespace-pre-wrap leading-relaxed bg-white p-3.5 rounded-xl border border-emerald-100 max-h-60 overflow-y-auto">
                    {invoiceEmailTemplate}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Workflow Quick Utilities & Rate Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Rate Card Calculator */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Sponsorship Rate Guidance
                </h3>
              </div>
              <Badge variant="emerald" size="sm">
                Benchmark
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Audience Tier:</span>
                  <span className="font-bold text-slate-900">{activeCreator.creatorStage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Primary Platform:</span>
                  <span className="font-bold text-slate-900">{activeCreator.primaryPlatform}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-700 font-bold">Suggested Base Fee / Post:</span>
                  <span className="text-sm font-extrabold text-indigo-700 font-mono">
                    ₹{(activeCreator.followerCount * (activeCreator.primaryPlatform === "LinkedIn" ? 5 : 1.8)).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                *LinkedIn CPMs are ~2.5x higher than Instagram due to high purchasing power & corporate decision-maker concentration.
              </p>
            </CardContent>
          </Card>

          {/* Workflow Automation Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Workflow Reminders & SLAs
                </h3>
              </div>
              <Badge variant="indigo" size="sm">
                Auto-Alerts
              </Badge>
            </CardHeader>

            <CardContent className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1 shrink-0" />
                <span>Submit creative draft minimum <strong>48 hours</strong> prior to scheduled campaign go-live date.</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                <span>Export 7-day post-launch insights screenshot report to attach with invoice.</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-purple-600 mt-1 shrink-0" />
                <span>Offer 15% discount if brand converts to a 3-month quarterly retainer commitment.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

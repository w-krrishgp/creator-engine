"use client";

import React, { useState } from "react";
import { RadarDiscoveredItem, RadarExtractResponse } from "@/types/radar";
import { Opportunity } from "@/types/creator";
import { useCreator } from "@/context/CreatorContext";
import {
  X,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Globe,
  Calendar,
  DollarSign,
  BookmarkPlus,
  RefreshCw,
  Info,
} from "lucide-react";

interface RadarInspectModalProps {
  item: RadarDiscoveredItem | null;
  extractData: RadarExtractResponse | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onRetryExtract: () => void;
}

export function RadarInspectModal({
  item,
  extractData,
  loading,
  isOpen,
  onClose,
  onRetryExtract,
}: RadarInspectModalProps) {
  const { activeCreator, opportunities, addDiscoveredOpportunity, showToast } = useCreator();
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [customSubject, setCustomSubject] = useState<string | null>(null);
  const [customPitchText, setCustomPitchText] = useState<string | null>(null);
  const [showRawExcerpt, setShowRawExcerpt] = useState(false);
  const [isSavedToPipeline, setIsSavedToPipeline] = useState(false);

  if (!isOpen || !item) return null;

  const campaign = extractData?.campaign;
  const pitch = extractData?.pitch;

  const urlSlug = (item.url || campaign?.sourceUrl || item.id)
    .replace(/^https?:\/\//i, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase()
    .slice(0, 48)
    .replace(/-+$/, "");
  const deterministicId = `radar-opp-${urlSlug}`;

  const isAlreadyInPipeline = Boolean(
    campaign &&
    opportunities.some(
      (o) =>
        o.id === deterministicId ||
        (campaign.campaignTitle && o.title.toLowerCase().trim() === campaign.campaignTitle.toLowerCase().trim())
    )
  );

  const currentSubject = customSubject !== null ? customSubject : (pitch?.subject || `Partnership Proposal: ${activeCreator.name} x ${campaign?.brandName || item.siteName}`);
  const currentPitchText = customPitchText !== null ? customPitchText : (pitch?.fullOutreachMessage || pitch?.elevatorPitch || "");

  const handleCopyPitch = () => {
    const fullText = `Subject: ${currentSubject}\n\n${currentPitchText}`;
    navigator.clipboard.writeText(fullText);
    setCopiedPitch(true);
    showToast("Pitch copied to clipboard!", "success");
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const handleSaveToPipeline = () => {
    if (!campaign) return;

    // Convert extracted live web campaign into an Opportunity object
    const convertedOpp: Opportunity = {
      id: deterministicId,
      brand: campaign.brandName,
      brandLogo: "🌐",
      brandCategory: item.nicheTag || "Live Web Sponsorship",
      title: campaign.campaignTitle,
      description: campaign.campaignDescription,
      niche: [item.nicheTag || activeCreator.niche],
      platform: "Multi-Platform",
      minFollowers: 5000,
      budgetRange: campaign.compensation || "Performance / Negotiated",
      budgetMin: 20000,
      budgetMax: 50000,
      deadline: campaign.publishedDeadline || "Rolling Admissions",
      deliverables: pitch?.suggestedDeliverables || [
        "1x Dedicated Video Feature",
        "2x Story Mentions",
        "Link in Bio for 14 Days",
      ],
      status: "Available",
      targetAudience: campaign.targetAudience || activeCreator.audienceDemographic,
      targetLocation: campaign.targetLocation || activeCreator.location,
      eligibilityRequirements: campaign.eligibilityRequirements,
      sponsoredTag: false,
    };

    addDiscoveredOpportunity(convertedOpp);
    setIsSavedToPipeline(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-[24px] max-w-3xl w-full max-h-[92vh] flex flex-col shadow-[0_24px_60px_rgba(0,0,0,0.22)] border border-slate-200/90 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-13 h-13 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl shadow-xs shrink-0">
              <Globe className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 dark:text-white text-lg sm:text-xl tracking-tight truncate">
                  {campaign?.brandName || item.siteName}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100/70 dark:bg-indigo-950/70 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  Live TinyFish Radar
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                Source: <span className="text-slate-700 dark:text-slate-300 font-medium">{item.url}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 1. Loading State */}
          {loading && (
            <div className="py-14 flex flex-col items-center justify-center text-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900/60 animate-ping opacity-30" />
                <div className="w-14 h-14 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
              </div>
              <h4 className="mt-5 font-bold text-slate-900 dark:text-white text-base">
                TinyFish Fetch in Progress
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1.5 leading-relaxed">
                Rendering live page DOM with real browser automation, removing ads and navigation chrome, and extracting verified creator criteria...
              </p>
            </div>
          )}

          {/* 2. Error State */}
          {!loading && extractData && !extractData.success && (
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex flex-col items-center text-center">
              <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mb-2" />
              <h4 className="font-bold text-rose-900 dark:text-rose-200 text-sm">
                Unable to Extract Live Page Content
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 max-w-md">
                {extractData.details || extractData.error || "The destination website could not be rendered or is protected by an authentication wall."}
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={onRetryExtract}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Fetch</span>
                </button>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Open Page Directly</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* 3. Successful Extraction View */}
          {!loading && campaign && (
            <>
              {/* Verification Badges Bar */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                  Page Verification Telemetry
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                    campaign.verification.brandVerified
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300"
                      : "bg-slate-100 border-slate-200 text-slate-600"
                  }`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span className="truncate">Brand Verified</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                    campaign.verification.compensationVerified
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300"
                      : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-amber-800 dark:text-amber-300"
                  }`}>
                    {campaign.verification.compensationVerified ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    ) : (
                      <Info className="w-4 h-4 shrink-0 text-amber-600" />
                    )}
                    <span className="truncate">{campaign.verification.compensationVerified ? "Budget Stated" : "Fee Unstated"}</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                    campaign.verification.deadlineVerified
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300"
                      : "bg-slate-100 dark:bg-slate-800/80 border-slate-200 text-slate-600 dark:text-slate-400"
                  }`}>
                    {campaign.verification.deadlineVerified ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    ) : (
                      <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
                    )}
                    <span className="truncate">{campaign.verification.deadlineVerified ? "Fixed Deadline" : "Rolling Admissions"}</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                    campaign.verification.applicationLinkVerified
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300"
                      : "bg-slate-100 border-slate-200 text-slate-600"
                  }`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span className="truncate">Application Link</span>
                  </div>
                </div>
              </div>

              {/* Verified Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Compensation / Offering</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {campaign.compensation || "Not specified on public page"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    {campaign.verification.compensationVerified
                      ? "Verified directly from live page text."
                      : "Rates typically negotiated upon pitch review."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>Application Deadline</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {campaign.publishedDeadline || "Rolling / Open Program"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    {campaign.verification.deadlineVerified
                      ? "Published deadline found in source text."
                      : "No expiry specified; ongoing creator enrollment."}
                  </p>
                </div>
              </div>

              {/* Campaign Overview */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Campaign Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
                  {campaign.campaignDescription}
                </p>
              </div>

              {/* Eligibility Criteria */}
              {campaign.eligibilityRequirements && campaign.eligibilityRequirements.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Stated Eligibility & Requirements
                  </h4>
                  <ul className="space-y-2">
                    {campaign.eligibilityRequirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Information Notice */}
              {campaign.missingInformation && campaign.missingInformation.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    <span>Missing / Unspecified Brief Parameters</span>
                  </div>
                  <ul className="text-[11px] text-amber-800 dark:text-amber-300 list-disc list-inside space-y-0.5">
                    {campaign.missingInformation.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tailored Brand Outreach Pitch (AI Synthesized) */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Personalized Pitch Proposal
                    </h4>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-md">
                    {pitch?.isFallback ? "Deterministic Engine" : "AI Synthesized"}
                  </span>
                </div>

                {/* Subject Line */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Subject Line (Editable)
                  </label>
                  <input
                    type="text"
                    value={currentSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Pitch Body */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Pitch Body (Tailored for {activeCreator.name})
                  </label>
                  <textarea
                    rows={6}
                    value={currentPitchText}
                    onChange={(e) => setCustomPitchText(e.target.value)}
                    className="w-full text-xs font-normal leading-relaxed p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Proposed Deliverables */}
                {pitch?.suggestedDeliverables && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                      Recommended Deliverables:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {pitch.suggestedDeliverables.map((d, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Copy Pitch Button */}
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={handleCopyPitch}
                    className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors inline-flex items-center gap-1.5 shadow-xs"
                  >
                    {copiedPitch ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Pitch</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Raw Excerpt Accordion */}
              {campaign.rawExcerpt && (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowRawExcerpt(!showRawExcerpt)}
                    className="w-full text-left p-3 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-between"
                  >
                    <span>Inspect Raw TinyFish Fetched Markdown</span>
                    <span className="text-[11px] text-indigo-600">{showRawExcerpt ? "Hide" : "Show"}</span>
                  </button>
                  {showRawExcerpt && (
                    <div className="p-3 bg-slate-900 text-slate-200 text-[11px] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto border-t border-slate-800">
                      {campaign.rawExcerpt}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50/90 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {campaign?.applicationUrl ? (
              <a
                href={campaign.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs hover:shadow transition-all inline-flex items-center gap-1.5"
              >
                <span>Open Application Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold text-xs transition-all inline-flex items-center gap-1.5"
              >
                <span>Visit Source Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {campaign && (
              <button
                onClick={handleSaveToPipeline}
                disabled={isSavedToPipeline || isAlreadyInPipeline}
                className="px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold text-xs transition-colors inline-flex items-center gap-1.5 disabled:opacity-60"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>{isSavedToPipeline || isAlreadyInPipeline ? "In Your Pipeline" : "Save to Opportunities"}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

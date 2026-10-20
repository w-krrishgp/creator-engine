"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CreatorProfile, Opportunity } from "@/types/creator";
import { OpportunityFilterTab } from "@/types/dashboard";
import { calculateCompatibility } from "@/utils/compatibility";
import { Sparkles, ArrowRight, Clock, MapPin, CheckCircle2, Radio, Compass } from "lucide-react";

interface PersonalizedOpportunitiesProps {
  creator: CreatorProfile;
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
}

export function PersonalizedOpportunities({
  creator,
  opportunities,
  onSelectOpportunity,
}: PersonalizedOpportunitiesProps) {
  const [activeTab, setActiveTab] = useState<OpportunityFilterTab>("All");

  const filterTabs: OpportunityFilterTab[] = [
    "All",
    "Best Matches",
    "Brand Deals",
    "Sponsorships",
    "UGC",
    "Affiliate",
    "Collaborations",
  ];

  // Calculate compatibility for each opportunity with active creator
  const scoredOpportunities = opportunities.map((opp) => ({
    opp,
    compatibility: calculateCompatibility(opp, creator),
  }));

  // Apply tab filter
  const filtered = scoredOpportunities.filter(({ opp, compatibility }) => {
    if (activeTab === "All") return true;
    if (activeTab === "Best Matches") return compatibility.score >= 85;
    if (activeTab === "Brand Deals")
      return (
        opp.brandCategory.toLowerCase().includes("tech") ||
        opp.deliverables.some((d) => d.toLowerCase().includes("sponsored"))
      );
    if (activeTab === "Sponsorships")
      return opp.sponsoredTag || opp.deliverables.some((d) => d.toLowerCase().includes("video"));
    if (activeTab === "UGC")
      return (
        opp.title.toLowerCase().includes("ugc") ||
        opp.description.toLowerCase().includes("ugc") ||
        opp.deliverables.some((d) => d.toLowerCase().includes("ugc"))
      );
    if (activeTab === "Affiliate")
      return (
        opp.budgetRange.toLowerCase().includes("rev") ||
        opp.deliverables.some((d) => d.toLowerCase().includes("affiliate"))
      );
    if (activeTab === "Collaborations")
      return opp.platform === "Multi-Platform" || opp.deliverables.length >= 2;
    return true;
  });

  // Sort by compatibility score and show top 3-4
  const topList = filtered
    .sort((a, b) => b.compatibility.score - a.compatibility.score)
    .slice(0, 4);

  return (
    <section className="space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Opportunities For You
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#0870e8]/15 border border-[#0870e8]/30 text-blue-300 text-xs font-bold">
              {opportunities.length} Available
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Opportunities selected based on your niche, audience and goals.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center flex-wrap">
          <Link
            href="/opportunities?tab=radar"
            className="btn-tactile inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0870e8]/15 hover:bg-[#0870e8]/25 border border-[#0870e8]/40 text-xs sm:text-sm font-bold text-blue-300 transition-all shadow-xs"
          >
            <Radio className="w-3.5 h-3.5 text-[#0870e8] animate-pulse" />
            <span>Opportunity Radar</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-200 uppercase font-extrabold tracking-wider">
              Live Web
            </span>
          </Link>

          <Link
            href="/opportunities"
            className="btn-tactile inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs sm:text-sm font-bold text-white transition-all"
          >
            <span>View All ({opportunities.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`btn-tactile px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0870e8] text-white shadow-[0_0_15px_rgba(8,112,232,0.4)]"
                  : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      {topList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topList.map(({ opp, compatibility }) => {
            const whyItMatches = `Your ${creator.niche || "creator"} audience and ${creator.primaryPlatform || "content"} engagement strongly align with this campaign.`;

            return (
              <div
                key={opp.id}
                className="rounded-3xl bg-[#0C101B] border border-white/[0.08] p-5 sm:p-6 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:border-[#0870e8]/50 hover:-translate-y-1 transition-all group"
              >
                <div className="space-y-4">
                  {/* Top Bar: Logo & Match Percentage */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                        {opp.brandLogo}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-white text-sm truncate">
                          {opp.brand}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">
                          {opp.brandCategory}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold bg-[#0870e8]/15 border border-[#0870e8]/30 text-blue-300">
                      {compatibility.score}% Match
                    </span>
                  </div>

                  {/* Title & Category / Location */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-1 group-hover:text-blue-300 transition-colors">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                      <span>{opp.niche?.slice(0, 2).join(" • ") || creator.niche}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {opp.targetLocation || creator.country || "Global"}
                      </span>
                    </p>
                  </div>

                  {/* Why this matches you */}
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300 space-y-1">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-blue-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      Why this matches you:
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {whyItMatches}
                    </p>
                  </div>

                  {/* Compensation & Deadline */}
                  <div className="pt-2 border-t border-white/[0.06] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Compensation:</span>
                      <span className="font-extrabold text-emerald-400 text-sm font-mono">
                        {opp.budgetRange}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Deadline:</span>
                      <span className="text-slate-300 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {opp.deadline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Opportunity Action Button */}
                <div className="pt-4 mt-4 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => onSelectOpportunity(opp)}
                    className="btn-tactile w-full py-2.5 px-4 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>View Opportunity</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-[#0C101B] border border-white/[0.08] text-center space-y-3">
          <p className="text-sm font-bold text-white">No opportunities in this category yet.</p>
          <p className="text-xs text-slate-400">Try selecting &quot;All&quot; or &quot;Best Matches&quot; to see available briefs.</p>
          <button
            type="button"
            onClick={() => setActiveTab("All")}
            className="btn-tactile px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold"
          >
            Show All Opportunities
          </button>
        </div>
      )}
    </section>
  );
}

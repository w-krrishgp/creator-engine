"use client";

import React, { useState } from "react";
import { useCreator } from "@/context/CreatorContext";
import { calculateCompatibility } from "@/utils/compatibility";
import {
  Briefcase,
  Search,
  ArrowUpDown,
  CheckCircle2,
  Bookmark,
} from "lucide-react";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";
import { Badge } from "@/components/common/Badge";

export default function OpportunitiesPage() {
  const { activeCreator, opportunities } = useCreator();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState<string>("All");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"compatibility" | "budget">("compatibility");

  const niches = [
    "All",
    "Fitness & Nutrition",
    "Personal Finance & Investing",
    "Fintech",
    "Productivity",
    "Sports",
    "Lifestyle",
  ];

  const platforms = ["All", "Instagram", "LinkedIn", "Multi-Platform"];

  // Filter and sort opportunities
  const filteredOpportunities = opportunities
    .filter((opp) => {
      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesBrand = opp.brand.toLowerCase().includes(q);
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesDesc = opp.description.toLowerCase().includes(q);
        if (!matchesBrand && !matchesTitle && !matchesDesc) return false;
      }

      // Niche filter
      if (selectedNiche !== "All") {
        if (!opp.niche.some((n) => n.toLowerCase().includes(selectedNiche.toLowerCase()))) {
          return false;
        }
      }

      // Platform filter
      if (selectedPlatform !== "All") {
        if (opp.platform !== "Multi-Platform" && opp.platform !== selectedPlatform) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== "All") {
        if (opp.status !== selectedStatus) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "compatibility") {
        const scoreA = calculateCompatibility(a, activeCreator).score;
        const scoreB = calculateCompatibility(b, activeCreator).score;
        return scoreB - scoreA;
      } else {
        return b.budgetMax - a.budgetMax;
      }
    });

  const appliedCount = opportunities.filter((o) => o.status === "Applied").length;
  const savedCount = opportunities.filter((o) => o.status === "Saved").length;

  return (
    <div className="space-y-6">
      {/* Top Disclaimer */}
      <DemoDisclaimer text="Sample campaigns curated for demonstration. Brand briefs, deliverables, and budgets reflect realistic creator-brand partnership structures." />

      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Brand Opportunities Marketplace
            </h2>
            <Badge variant="emerald" size="sm">
              Live Demo Deals
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Deterministic algorithmic compatibility matched against {activeCreator.name}&apos;s profile and follower reach.
          </p>
        </div>

        {/* Quick status counters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedStatus("Applied")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              selectedStatus === "Applied"
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{appliedCount} Applied</span>
          </button>

          <button
            onClick={() => setSelectedStatus("Saved")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              selectedStatus === "Saved"
                ? "bg-amber-50 border-amber-300 text-amber-800"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            <span>{savedCount} Shortlisted</span>
          </button>
        </div>
      </div>

      {/* Search & Working Filters Toolbar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by brand name, campaign theme, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "compatibility" | "budget")}
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="compatibility">Highest Compatibility Score</option>
              <option value="budget">Highest Budget Max</option>
            </select>
          </div>
        </div>

        {/* Filter Pills row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Niche Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
              Niche:
            </span>
            {niches.map((n) => (
              <button
                key={n}
                onClick={() => setSelectedNiche(n)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 ${
                  selectedNiche === n
                    ? "bg-slate-900 text-white font-bold"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Platform Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Platform:
            </span>
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  selectedPlatform === p
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Cards Grid or Empty State */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No campaigns match your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query, niche filter, or platform criteria to discover open brand campaigns.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedNiche("All");
              setSelectedPlatform("All");
              setSelectedStatus("All");
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

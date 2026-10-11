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
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Users,
  Filter,
  RotateCcw,
  Clock,
  ArrowRight,
} from "lucide-react";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";
import { Badge } from "@/components/common/Badge";

export default function OpportunitiesPage() {
  const { activeCreator, switchCreator, opportunities } = useCreator();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState<string>("All");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [statusTab, setStatusTab] = useState<"all" | "eligible" | "applied" | "saved">("all");
  const [sortBy, setSortBy] = useState<"compatibility" | "budget" | "followers" | "deadline">("compatibility");

  const niches = [
    "All",
    "Fitness & Nutrition",
    "Personal Finance & Investing",
    "Fintech",
    "Productivity",
    "Sports",
    "Wellness",
    "Lifestyle",
  ];

  const platforms = ["All", "Instagram", "LinkedIn", "Multi-Platform"];

  // Filter opportunities
  const filteredOpportunities = opportunities
    .filter((opp) => {
      const compatibility = calculateCompatibility(opp, activeCreator);

      // Status tab filter
      if (statusTab === "eligible") {
        if (!compatibility.qualifies) return false;
      } else if (statusTab === "applied") {
        if (opp.status !== "Applied") return false;
      } else if (statusTab === "saved") {
        if (opp.status !== "Saved") return false;
      }

      // Search query filter
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesBrand = opp.brand.toLowerCase().includes(q);
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesDesc = opp.description.toLowerCase().includes(q);
        const matchesDeliverables = opp.deliverables.some((d) => d.toLowerCase().includes(q));
        const matchesLocation = opp.targetLocation?.toLowerCase().includes(q);
        if (!matchesBrand && !matchesTitle && !matchesDesc && !matchesDeliverables && !matchesLocation) {
          return false;
        }
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

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "compatibility") {
        const scoreA = calculateCompatibility(a, activeCreator).score;
        const scoreB = calculateCompatibility(b, activeCreator).score;
        return scoreB - scoreA;
      } else if (sortBy === "budget") {
        return b.budgetMax - a.budgetMax;
      } else if (sortBy === "followers") {
        return a.minFollowers - b.minFollowers;
      } else {
        return a.deadline.localeCompare(b.deadline);
      }
    });

  // Dynamic counter metrics
  const eligibleCount = opportunities.filter(
    (o) => calculateCompatibility(o, activeCreator).qualifies
  ).length;
  const appliedCount = opportunities.filter((o) => o.status === "Applied").length;
  const savedCount = opportunities.filter((o) => o.status === "Saved").length;

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedNiche !== "All" ||
    selectedPlatform !== "All" ||
    statusTab !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedNiche("All");
    setSelectedPlatform("All");
    setStatusTab("all");
    setSortBy("compatibility");
  };

  return (
    <div className="space-y-6">
      {/* Explicit Top Demo Disclaimer */}
      <DemoDisclaimer text="Sample campaigns from fictional brands for demonstration. Briefs, follower thresholds, and budgets reflect real-world commercial creator marketing standards. Compatibility scores and eligibility checks are deterministic and explainable." />

      {/* Persona Quick Switcher Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
            <img
              src={activeCreator.avatar}
              alt={activeCreator.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Creator Persona:
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {activeCreator.name}
              </span>
              <Badge variant="blue" size="sm">
                {activeCreator.niche}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              {activeCreator.primaryPlatform} • {activeCreator.followerCount.toLocaleString()} followers • {activeCreator.engagementRate}% engagement rate
            </p>
          </div>
        </div>

        {/* Switch Persona Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-slate-400 mr-1 hidden sm:inline">
            Switch Persona:
          </span>
          <button
            onClick={() => switchCreator("rahul")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              activeCreator.id === "rahul"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            ⚡ Rahul (Fitness • 15k IG)
          </button>
          <button
            onClick={() => switchCreator("priya")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              activeCreator.id === "priya"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            ⚡ Priya (Finance • 8k LinkedIn)
          </button>
        </div>
      </div>

      {/* Header and Marketplace Stats Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Brand Opportunities Marketplace
            </h2>
            <Badge variant="emerald" size="sm">
              8 Live Briefs
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Algorithmic matchmaking evaluates niche alignment, native platform fit, and follower scale.
          </p>
        </div>

        {/* Status Category Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 overflow-x-auto">
          <button
            onClick={() => setStatusTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              statusTab === "all"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Briefs ({opportunities.length})
          </button>

          <button
            onClick={() => setStatusTab("eligible")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              statusTab === "eligible"
                ? "bg-white text-emerald-800 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Eligible ({eligibleCount})</span>
          </button>

          <button
            onClick={() => setStatusTab("applied")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              statusTab === "applied"
                ? "bg-white text-blue-800 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Applied ({appliedCount})</span>
          </button>

          <button
            onClick={() => setStatusTab("saved")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              statusTab === "saved"
                ? "bg-white text-amber-800 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            <span>Shortlist ({savedCount})</span>
          </button>
        </div>
      </div>

      {/* Application Tracking View Banner (When on "Applied" Tab) */}
      {statusTab === "applied" && (
        <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 border border-blue-200/90 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Application Pipeline Tracking
              </h3>
            </div>
            <span className="text-xs font-bold text-blue-800 bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
              {appliedCount} Active Applications
            </span>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            All submitted applications are stored locally with proposal receipts, proposed fees, and automated follow-up reminders. When brand review completes, offer terms and contracts sync to your Creator Engine dashboard.
          </p>
        </div>
      )}

      {/* Search & Working Filters Toolbar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by brand name, campaign brief, deliverables, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "compatibility" | "budget" | "followers" | "deadline"
                )
              }
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="compatibility">Highest Compatibility Score</option>
              <option value="budget">Highest Budget Max</option>
              <option value="followers">Lowest Follower Minimum</option>
              <option value="deadline">Soonest Deadline</option>
            </select>
          </div>
        </div>

        {/* Filter Pills row: Niche & Platform */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Niche Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Niche:
            </span>
            {niches.map((n) => (
              <button
                key={n}
                onClick={() => setSelectedNiche(n)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 ${
                  selectedNiche === n
                    ? "bg-slate-900 text-white font-bold shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Platform Pills & Reset */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                Platform:
              </span>
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(p)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    selectedPlatform === p
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="ml-2 px-2.5 py-1 rounded-md text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors flex items-center gap-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Campaign Cards Grid or Rich Empty State */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              No brand campaigns match your criteria
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find open briefs matching your search query &quot;{searchQuery || "active filters"}&quot; with current niche and platform selections.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Marketplace Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}

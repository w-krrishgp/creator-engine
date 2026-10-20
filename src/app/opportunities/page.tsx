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
  Filter,
  RotateCcw,
  Clock,
  Radio,
  Sparkles,
  Compass,
  Globe,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";
import { Badge } from "@/components/common/Badge";
import { PersonaSwitcherBar } from "@/components/common/PersonaSwitcherBar";
import { HackathonDemoBar } from "@/components/common/HackathonDemoBar";
import { RadarDiscoveryCard } from "@/components/opportunities/RadarDiscoveryCard";
import { RadarInspectModal } from "@/components/opportunities/RadarInspectModal";
import {
  RadarDiscoveredItem,
  RadarExtractResponse,
  RadarSearchResponse,
} from "@/types/radar";

export default function OpportunitiesPage() {
  const { activeCreator, opportunities, currentPlan, currentPlanId, subscriptionUsage, showToast } = useCreator();

  // Mode switcher: Curated Deals vs Live Web Opportunity Radar (TinyFish)
  const [viewMode, setViewMode] = useState<"curated" | "radar">("curated");

  // Search & Filter state for Curated Marketplace
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState<string>("All");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [statusTab, setStatusTab] = useState<"all" | "eligible" | "applied" | "saved">("all");
  const [sortBy, setSortBy] = useState<"compatibility" | "budget" | "followers" | "deadline">("compatibility");

  // Radar State (TinyFish Live Web)
  const [radarQuery, setRadarQuery] = useState("");
  const [radarNiche, setRadarNiche] = useState<string>(activeCreator.niche || "Tech & AI");
  const [radarLocation, setRadarLocation] = useState<string>("IN");
  const [radarResults, setRadarResults] = useState<RadarDiscoveredItem[]>([]);
  const [radarLoading, setRadarLoading] = useState(false);
  const [radarError, setRadarError] = useState<string | null>(null);
  const [radarWarning, setRadarWarning] = useState<string | null>(null);
  const [lastSearchedAt, setLastSearchedAt] = useState<string | null>(null);

  // Inspect Modal State
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedRadarItem, setSelectedRadarItem] = useState<RadarDiscoveredItem | null>(null);
  const [extractData, setExtractData] = useState<RadarExtractResponse | null>(null);
  const [extractLoading, setExtractLoading] = useState(false);

  const niches = [
    "All",
    "Tech & AI",
    "Healthcare & Medicine",
    "Fitness & Nutrition",
    "Personal Finance & Investing",
    "Fintech",
    "Productivity",
    "Sports",
    "Wellness",
    "Lifestyle",
  ];

  const platforms = ["All", "YouTube", "Instagram", "LinkedIn", "Multi-Platform"];

  // Filter opportunities for Curated Deals
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

  // TinyFish Live Web Search
  const handleRadarScan = async (overrideQuery?: string, overrideNiche?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : radarQuery;
    const n = overrideNiche !== undefined ? overrideNiche : radarNiche;

    setRadarLoading(true);
    setRadarError(null);
    setRadarWarning(null);

    try {
      const res = await fetch("/api/opportunities/radar/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q.trim(),
          niche: n,
          location: radarLocation,
          platform: activeCreator.primaryPlatform,
          limit: 10,
        }),
      });

      const data: RadarSearchResponse = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setRadarError("Rate limit exceeded. Please wait 30 seconds before initiating another search.");
        } else {
          setRadarError(data.warning || data.error || `Search failed with status ${res.status}`);
        }
        return;
      }

      if (data.error === "TINYFISH_UNCONFIGURED") {
        setRadarWarning(data.warning || "TINYFISH_API_KEY is not configured in .env.local.");
        return;
      }

      setRadarResults(data.results || []);
      setLastSearchedAt(data.retrievalTimestamp);

      if (data.results.length === 0) {
        showToast("No active live web programs found for this query. Try broader keywords.", "info");
      } else {
        showToast(`TinyFish discovered ${data.results.length} live sponsorship programs!`, "success");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setRadarError(`Connection failed: ${msg}`);
    } finally {
      setRadarLoading(false);
    }
  };

  // Inspect & Fetch Webpage Content
  const handleInspect = async (item: RadarDiscoveredItem) => {
    setSelectedRadarItem(item);
    setInspectModalOpen(true);
    setExtractLoading(true);
    setExtractData(null);

    try {
      const res = await fetch("/api/opportunities/radar/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: item.sourceUrl,
          creatorProfile: activeCreator,
        }),
      });

      const data: RadarExtractResponse = await res.json();
      setExtractData(data);

      if (!res.ok || !data.success) {
        showToast(data.details || "Could not extract full page content.", "warning");
      } else {
        showToast(`Verified live campaign brief from ${item.siteName}!`, "success");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setExtractData({
        success: false,
        retrievalTimestamp: new Date().toISOString(),
        error: "NETWORK_ERROR",
        details: msg,
      });
    } finally {
      setExtractLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 0. HACKATHON DEMO ASSISTANT */}
      <HackathonDemoBar />

      {/* 1. EXPLICIT TOP DEMO DISCLAIMER */}
      <DemoDisclaimer text="Sample campaigns and live web radar results. Compatibility scores and eligibility checks are deterministic and explainable. Live web results are fetched via TinyFish and cross-verified against page text." />

      {/* 2. CONSISTENT PERSONA SWITCHER BAR */}
      <PersonaSwitcherBar subtitle="Campaign compatibility scores and live radar queries automatically calibrate based on the active persona's metrics." />

      {/* 2.1 MONTHLY APPLICATION QUOTA & RESET BANNER */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                Monthly Brand Application Quota
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                {currentPlan.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Server-enforced limit on concurrent sponsor pitches per billing cycle.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left sm:text-right">
            <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
              <span className={subscriptionUsage && subscriptionUsage.applicationsRemaining <= 0 ? "text-amber-600 font-extrabold" : "text-emerald-700 dark:text-emerald-400 font-extrabold"}>
                {subscriptionUsage?.applicationsUsage ?? 0}
              </span>
              {" / "}
              <span>{subscriptionUsage?.applicationsLimit ?? currentPlan.limits.maxApplicationsPerMonth}</span> deals used
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              Resets on: {subscriptionUsage?.usageResetAt ? new Date(subscriptionUsage.usageResetAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Next cycle"}
            </div>
          </div>
        </div>
      </div>

      {/* MODE SWITCHER: Curated Marketplace vs TinyFish Live Web Opportunity Radar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {viewMode === "curated" ? "Brand Opportunities Marketplace" : "Creator Opportunity Radar"}
            </h2>
            {viewMode === "curated" ? (
              <Badge variant="emerald" size="sm">
                {opportunities.length} Live Briefs
              </Badge>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                TinyFish Live Web
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
            {viewMode === "curated"
              ? "Algorithmic matchmaking evaluates niche alignment, native platform fit, and follower scale."
              : "Discover real sponsorship programs, creator calls, and brand ambassador briefs directly from the live web."}
          </p>
        </div>

        {/* View Switcher Segmented Control */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shrink-0">
          <button
            onClick={() => setViewMode("curated")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              viewMode === "curated"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <span>Curated Deals ({opportunities.length})</span>
          </button>

          <button
            onClick={() => {
              setViewMode("radar");
              if (radarResults.length === 0 && !radarLoading) {
                handleRadarScan("", activeCreator.niche);
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              viewMode === "radar"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Radio className="w-4 h-4 text-indigo-200" />
            <span>Opportunity Radar</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20 uppercase font-extrabold tracking-wider">
              Live
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: CURATED MARKETPLACE (UNMODIFIED EXISTING BEHAVIOR)           */}
      {/* ========================================================================= */}
      {viewMode === "curated" && (
        <div className="space-y-6">
          {/* Status Category Tabs */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/80 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60 overflow-x-auto">
              <button
                onClick={() => setStatusTab("all")}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all shrink-0 ${
                  statusTab === "all"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All Briefs ({opportunities.length})
              </button>

              <button
                onClick={() => setStatusTab("eligible")}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                  statusTab === "eligible"
                    ? "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Eligible ({eligibleCount})</span>
              </button>

              <button
                onClick={() => setStatusTab("applied")}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                  statusTab === "applied"
                    ? "bg-white dark:bg-slate-900 text-blue-800 dark:text-blue-400 shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#0870e8]" />
                <span>Applied ({appliedCount})</span>
              </button>

              <button
                onClick={() => setStatusTab("saved")}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                  statusTab === "saved"
                    ? "bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-400 shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                <span>Shortlist ({savedCount})</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3.5">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter brands, keywords, deliverables, or target regions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0870e8]/20 focus:border-[#0870e8] transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="bg-transparent font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="compatibility">Compatibility Score</option>
                    <option value="budget">Highest Budget</option>
                    <option value="followers">Follower Threshold</option>
                    <option value="deadline">Closing Deadline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Niche Chips */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Niche:</span>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {niches.map((niche) => (
                  <button
                    key={niche}
                    onClick={() => setSelectedNiche(niche)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedNiche === niche
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="ml-auto px-3 py-1 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Campaign Cards Grid */}
          {filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[22px] border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No brand campaigns match your criteria
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                We couldn&apos;t find briefs matching your query with current filters. Try switching to the <strong>Opportunity Radar</strong> to discover live sponsorships across the web.
              </p>
              <button
                onClick={() => setViewMode("radar")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
              >
                <Radio className="w-4 h-4" />
                <span>Scan Live Web with Radar</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: CREATOR OPPORTUNITY RADAR (TINYFISH LIVE-WEB DISCOVERY)       */}
      {/* ========================================================================= */}
      {viewMode === "radar" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Radar Control & Live Search Panel */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 p-5 sm:p-6 rounded-[22px] border border-indigo-100 dark:border-indigo-950/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                    <Compass className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                    Live Web Discovery Engine
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Powered by <strong>TinyFish</strong> live web search & browser automation. Finds real-time brand calls without relying on static directories.
                </p>
              </div>

              {lastSearchedAt && (
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Last Scanned: {new Date(lastSearchedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              )}
            </div>

            {/* Live Search Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Developer tools ambassador, supplement affiliate, fintech sponsor..."
                  value={radarQuery}
                  onChange={(e) => setRadarQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRadarScan()}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={radarNiche}
                  onChange={(e) => setRadarNiche(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {niches.filter((n) => n !== "All").map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3 flex items-center gap-2">
                <select
                  value={radarLocation}
                  onChange={(e) => setRadarLocation(e.target.value)}
                  className="px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shrink-0"
                >
                  <option value="IN">🇮🇳 India (IN)</option>
                  <option value="US">🇺🇸 United States (US)</option>
                  <option value="GB">🇬🇧 United Kingdom (GB)</option>
                  <option value="Global">🌐 Worldwide</option>
                </select>

                <button
                  onClick={() => handleRadarScan()}
                  disabled={radarLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {radarLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-4 h-4" />
                      <span>Scan Live Web</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Keyword Starter Prompts */}
            <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 flex items-center gap-2 flex-wrap text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>Suggested Scans:</span>
              </span>
              {[
                { label: "AsyncAPI & Tech Ambassadors", q: "developer ambassador program", niche: "Tech & AI" },
                { label: "Arm & AI Software Advocates", q: "AI developer program ambassador", niche: "Tech & AI" },
                { label: "Fitness Supplement Calls", q: "fitness brand ambassador program apply", niche: "Fitness & Nutrition" },
                { label: "Personal Finance Sponsorships", q: "fintech creator program sponsor apply", niche: "Personal Finance & Investing" },
              ].map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setRadarQuery(pill.q);
                    setRadarNiche(pill.niche);
                    handleRadarScan(pill.q, pill.niche);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-[11px] font-medium"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Unconfigured Warning Callout */}
          {radarWarning && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-200">
                <p className="font-bold">TinyFish API Key Setup Required</p>
                <p className="mt-0.5">
                  To scan the live web for newly published creator briefs, add your API key to <code>.env.local</code> as <code>TINYFISH_API_KEY=your_key_here</code> and restart your development server.
                </p>
              </div>
            </div>
          )}

          {/* Error Callout */}
          {radarError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 dark:text-rose-200">
                <p className="font-bold">Radar Search Notice</p>
                <p className="mt-0.5">{radarError}</p>
              </div>
            </div>
          )}

          {/* Loading Skeletons */}
          {radarLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="p-5 rounded-[18px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                  </div>
                  <div className="h-9 bg-slate-100 dark:bg-slate-800 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          )}

          {/* Discovered Opportunities Grid */}
          {!radarLoading && radarResults.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Live Web Results ({radarResults.length})
                </span>
                <span className="text-[11px] text-slate-400 italic">
                  Ranked by contextual relevance to {activeCreator.name}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {radarResults.map((item) => (
                  <RadarDiscoveryCard
                    key={item.id}
                    item={item}
                    onInspect={handleInspect}
                    isInspecting={extractLoading && selectedRadarItem?.id === item.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Initial / Empty State */}
          {!radarLoading && radarResults.length === 0 && !radarError && !radarWarning && (
            lastSearchedAt ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[22px] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
                  <Search className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    No Matching Sponsorships Discovered
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                    TinyFish scanned the live web for &ldquo;{radarQuery || radarNiche}&rdquo; but found no active public programs. Try broader keywords or click one of the quick scan suggestions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setRadarQuery("");
                    handleRadarScan("");
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Search</span>
                </button>
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[22px] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
                  <Compass className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Ready to Scan the Live Web
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                    Enter keywords or click <strong>Scan Live Web</strong> to query TinyFish for real company ambassadorship programs, creator deals, and brand briefs matching <strong>{activeCreator.name}&apos;s</strong> niche.
                  </p>
                </div>
                <button
                  onClick={() => handleRadarScan()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white text-xs sm:text-sm font-bold hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <Radio className="w-4 h-4" />
                  <span>Start Live Web Scan</span>
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* INSPECT & FETCH DETAILS MODAL */}
      <RadarInspectModal
        item={selectedRadarItem}
        extractData={extractData}
        loading={extractLoading}
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        onRetryExtract={() => selectedRadarItem && handleInspect(selectedRadarItem)}
      />
    </div>
  );
}

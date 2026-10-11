"use client";

import React, { useState } from "react";
import { useCreator } from "@/context/CreatorContext";
import { MOCK_MONETISATION_CHANNELS } from "@/data/mockMonetisation";
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";

export default function MonetisationPage() {
  const { activeCreator } = useCreator();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const channels =
    MOCK_MONETISATION_CHANNELS[activeCreator.id] ||
    MOCK_MONETISATION_CHANNELS.rahul;

  const categories = [
    { id: "all", label: "All 5 Channels" },
    { id: "brand_collaborations", label: "Brand Collabs" },
    { id: "consulting_services", label: "Services & Advisory" },
    { id: "digital_products", label: "Digital Products" },
    { id: "affiliate_marketing", label: "Affiliate Marketing" },
    { id: "pr_speaking", label: "PR & Speaking" },
  ];

  const filteredChannels =
    selectedCategory === "all"
      ? channels
      : channels.filter((c) => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Disclaimer with Clear Caveat */}
      <DemoDisclaimer text="Income projections are illustrative models based on average creator CPMs and industry benchmarks. They do not represent financial advice or guaranteed earnings." />

      {/* Header and Category Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Monetisation Engine & Revenue Channels
            </h2>
            <Badge variant="indigo" size="sm">
              Tailored for {activeCreator.name.split(" ")[0]}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personalised revenue streams analyzed for your {activeCreator.followerCount.toLocaleString()} {activeCreator.primaryPlatform} audience and {activeCreator.niche} focus.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Important Income Disclosure Notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs shadow-2xs">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">No Guaranteed Revenue Notice: </strong>
          Creator earnings depend on negotiation leverage, audience engagement rates, content consistency, and market seasonality. Use these channels to diversify your income safely rather than relying on a single sponsor.
        </div>
      </div>

      {/* Monetisation Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChannels.map((channel) => (
          <Card
            key={channel.id}
            className="flex flex-col justify-between overflow-hidden border-slate-200/90 hover:border-indigo-300 transition-all duration-200 group"
          >
            {/* Channel Top Header */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-50/60 to-white">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="indigo" size="sm">
                    {channel.badge}
                  </Badge>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {channel.complexity} Complexity
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {channel.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {channel.subtitle}
                </p>
              </div>

              {/* Suitability Gauge */}
              <div className="shrink-0 text-right">
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border ${
                    channel.suitabilityScore >= 90
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-indigo-50 text-indigo-800 border-indigo-200"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{channel.suitabilityScore}% Match</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{channel.readinessStatus}</p>
              </div>
            </div>

            {/* Channel Body */}
            <div className="p-6 space-y-4 flex-1">
              {/* Why It Suits You */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600" /> Why this suits you
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  {channel.whyItSuits}
                </p>
              </div>

              {/* Estimated Earning Potential */}
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Estimated Earning Potential
                  </span>
                  <p className="text-sm font-black text-emerald-950">
                    {channel.estimatedPotential}
                  </p>
                </div>
                <Badge variant="emerald" size="sm">
                  {channel.readinessStatus}
                </Badge>
              </div>

              {/* Launch Checklist */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Actionable Launch Checklist
                </h4>
                <div className="space-y-1.5">
                  {channel.launchChecklist.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-600 font-medium"
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Realistic Caveats */}
              <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-slate-500" /> Practical Caveats & Reality Check
                </span>
                <p className="text-[11px] leading-relaxed">{channel.realisticCaveats}</p>
              </div>
            </div>

            {/* Footer with First Step */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="text-xs">
                <span className="text-[10px] uppercase font-bold text-indigo-600">Suggested 1st Move: </span>
                <p className="font-semibold text-slate-800 text-xs line-clamp-1">
                  {channel.suggestedFirstStep}
                </p>
              </div>
              <button
                onClick={() => alert(`Starting setup for: ${channel.title}\nNext step: ${channel.suggestedFirstStep}`)}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-bold text-slate-800 transition-colors shadow-2xs shrink-0 flex items-center gap-1"
              >
                <span>Activate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

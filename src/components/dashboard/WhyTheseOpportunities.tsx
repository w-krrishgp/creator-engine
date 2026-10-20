"use client";

import React from "react";
import { CreatorProfile } from "@/types/creator";
import { Sparkles, Tag } from "lucide-react";

interface WhyTheseOpportunitiesProps {
  creator: CreatorProfile;
}

export function WhyTheseOpportunities({ creator }: WhyTheseOpportunitiesProps) {
  // Extract tags from profile niche, topics, preferredIndustries, and country
  const tags: string[] = [];

  if (creator.niche) {
    creator.niche.split(/[&,•/]/).forEach((part) => {
      const trimmed = part.trim();
      if (trimmed && !tags.includes(trimmed)) tags.push(trimmed);
    });
  }

  if (creator.preferredIndustries) {
    creator.preferredIndustries.split(/[&,•/]/).forEach((part) => {
      const trimmed = part.trim();
      if (trimmed && !tags.includes(trimmed) && tags.length < 6) tags.push(trimmed);
    });
  }

  if (creator.country && !tags.includes(creator.country)) {
    tags.push(creator.country);
  }

  // Fallback tags if none specified
  if (tags.length === 0) {
    tags.push("AI", "Technology", "Content", "SaaS");
  }

  const primaryNichesText = tags.slice(0, 3).join(", ");

  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-[#0C101B] border border-blue-500/20 p-5 sm:p-6 space-y-3.5">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-xl bg-[#0870e8]/20 text-[#0870e8]">
          <Sparkles className="w-4 h-4" />
        </div>
        <h3 className="font-extrabold text-white text-sm sm:text-base tracking-tight">
          Why these opportunities?
        </h3>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
        Based on your profile, Creator Engine prioritized{" "}
        <strong className="text-white font-bold">{primaryNichesText}</strong> opportunities
        because they closely match your declared niche, follower tier, and audience engagement profile.
      </p>

      {/* Small Tags */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Tag className="w-3 h-3 text-[#0870e8]" />
            <span>{tag}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

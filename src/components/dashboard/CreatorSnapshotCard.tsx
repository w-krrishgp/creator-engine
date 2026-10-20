"use client";

import React from "react";
import Link from "next/link";
import { CreatorProfile } from "@/types/creator";
import { ShieldCheck, ArrowRight, MapPin, Tv, Video } from "lucide-react";

interface CreatorSnapshotCardProps {
  creator: CreatorProfile;
}

export function CreatorSnapshotCard({ creator }: CreatorSnapshotCardProps) {
  // Extract and format stats cleanly with explicit fallback for unprovided data
  const followersFormatted =
    typeof creator.followerCount === "number" && creator.followerCount > 0
      ? creator.followerCount >= 1000
        ? `${(creator.followerCount / 1000).toFixed(creator.followerCount % 1000 === 0 ? 0 : 1)}K`
        : creator.followerCount.toLocaleString()
      : null;

  const viewsFormatted =
    typeof creator.averageViews === "number" && creator.averageViews > 0
      ? creator.averageViews >= 1000
        ? `${(creator.averageViews / 1000).toFixed(creator.averageViews % 1000 === 0 ? 0 : 1)}K`
        : creator.averageViews.toLocaleString()
      : typeof creator.avgImpressionsPerPost === "number" && creator.avgImpressionsPerPost > 0
      ? creator.avgImpressionsPerPost >= 1000
        ? `${(creator.avgImpressionsPerPost / 1000).toFixed(creator.avgImpressionsPerPost % 1000 === 0 ? 0 : 1)}K`
        : creator.avgImpressionsPerPost.toLocaleString()
      : null;

  const engagementFormatted =
    typeof creator.engagementRate === "number" && creator.engagementRate > 0
      ? `${creator.engagementRate}%`
      : null;

  const platforms =
    creator.platforms && creator.platforms.length > 0
      ? creator.platforms
      : creator.primaryPlatform
      ? [creator.primaryPlatform]
      : [];

  const contentFormatFormatted =
    (creator.contentTypes && creator.contentTypes.length > 0
      ? creator.contentTypes.join(" • ")
      : creator.contentFormat) || null;

  return (
    <div className="rounded-3xl bg-[#0C101B] border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all hover:border-white/[0.14]">
      {/* Top subtle highlight gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0870e8] via-indigo-500 to-emerald-400" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
        {/* Creator Identity */}
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-[2px] bg-gradient-to-tr from-[#0870e8] via-indigo-500 to-emerald-400 overflow-hidden shadow-[0_0_20px_rgba(8,112,232,0.3)]">
              <img
                src={creator.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop"}
                alt={creator.name || "Creator avatar"}
                className="w-full h-full object-cover rounded-full bg-slate-900"
              />
            </div>
            <span
              className="absolute bottom-0 right-0 p-1 bg-[#0C101B] rounded-full border border-white/[0.1] shadow-xs"
              title="Verified Profile"
            >
              <ShieldCheck className="w-4 h-4 text-[#0870e8]" />
            </span>
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                {creator.name || "Creator"}
              </h2>
              <span className="text-xs sm:text-sm font-bold text-slate-400 font-mono">
                {creator.handle?.startsWith("@") ? creator.handle : `@${creator.handle || "creator"}`}
              </span>
              {creator.niche && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#0870e8]/15 border border-[#0870e8]/30 text-blue-300 text-xs font-bold">
                  {creator.niche}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {creator.location || creator.country || "Not provided"}
              </span>
              <span>•</span>
              <span className="text-slate-300 font-semibold">
                {platforms.length > 0 ? platforms.join(" • ") : "No platforms linked"}
              </span>
            </div>

            {creator.contentDescription && (
              <p className="text-xs text-slate-400 line-clamp-1 max-w-xl pt-0.5">
                {creator.contentDescription}
              </p>
            )}
          </div>
        </div>

        {/* Action Button: Edit Profile */}
        <div className="shrink-0 flex items-center">
          <Link
            href="/profile"
            className="btn-tactile inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
          >
            <span>Edit Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Followers */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Followers / Subs
          </span>
          <div className="my-1.5">
            {followersFormatted ? (
              <p className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                {followersFormatted}
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic mt-1">Not provided</p>
            )}
          </div>
          <span className="text-[10px] text-slate-500 truncate">
            {creator.primaryPlatform || "Primary platform"} audience
          </span>
        </div>

        {/* Average Views */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Average Views
          </span>
          <div className="my-1.5">
            {viewsFormatted ? (
              <p className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                {viewsFormatted}
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic mt-1">Not provided</p>
            )}
          </div>
          <span className="text-[10px] text-slate-500 truncate">
            {creator.youtube_connected ? "Calculated by Creator Engine" : "Per piece reach benchmark"}
          </span>
        </div>

        {/* Engagement Rate */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Engagement Rate
          </span>
          <div className="my-1.5">
            {engagementFormatted ? (
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-sans tracking-tight">
                {engagementFormatted}
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic mt-1">Not provided</p>
            )}
          </div>
          <span className="text-[10px] text-emerald-500/80 font-medium truncate">
            {creator.youtube_connected ? "Calculated by Creator Engine" : "Active interaction ratio"}
          </span>
        </div>

        {/* Content Type */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Content Formats
          </span>
          <div className="my-1.5">
            {contentFormatFormatted ? (
              <p className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {contentFormatFormatted}
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic mt-1">Not provided</p>
            )}
          </div>
          <span className="text-[10px] text-slate-500 truncate">
            {creator.contentFrequency || "Publishing rhythm"}
          </span>
        </div>
      </div>
    </div>
  );
}

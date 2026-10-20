"use client";

import React, { useState } from "react";
import { useCreator } from "@/context/CreatorContext";
import { Badge } from "@/components/common/Badge";
import { Plus, Trash2 } from "lucide-react";
import { PlanBadge } from "@/components/subscription/PlanBadge";
import { PlatformDataStateBadge } from "@/components/platforms/PlatformDataStateBadge";
import { ConnectAccountModal } from "@/components/platforms/ConnectAccountModal";
import { YouTubeIcon, InstagramIcon, LinkedInIcon } from "@/components/common/PlatformIcons";
import { UnifiedPlatformMetrics } from "@/types/platform";

interface PersonaSwitcherBarProps {
  subtitle?: string;
}

export function PersonaSwitcherBar({ subtitle }: PersonaSwitcherBarProps) {
  const {
    activeCreator,
    activeCreatorId,
    allCreators,
    switchCreator,
    showToast,
    activeDataState,
    activePlatformMetrics,
    importPlatformCreator,
    disconnectPlatformCreator,
  } = useCreator();

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // List all available accounts (excluding legacy demo IDs)
  const creatorIds = Object.keys(allCreators).filter(
    (id) => id !== "rahul" && id !== "priya"
  );

  const handlePersonaClick = (id: string) => {
    if (activeCreatorId === id) {
      showToast(`Already viewing ${allCreators[id]?.name || id}'s workspace`, "info");
      return;
    }
    switchCreator(id);
  };

  // If no active creator is connected, hide the switcher bar
  if (!activeCreator) {
    return null;
  }

  return (
    <>
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
        {/* Creator Info with Story Avatar Ring & Data State */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="p-[2.5px] rounded-full story-ring-gradient shrink-0 shadow-xs">
            <div className="w-11 h-11 rounded-full p-[2px] bg-white overflow-hidden">
              <img
                src={activeCreator.avatar}
                alt={activeCreator.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Active Profile:
              </span>
              <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate max-w-[180px]">
                {activeCreator.name}
              </span>
              <Badge variant="blue" size="sm" className="truncate max-w-[190px]">
                {activeCreator.niche}
              </Badge>
              <PlanBadge size="xs" linkToPricing />

              {/* Explicit Data State Badge */}
              <PlatformDataStateBadge
                state={activeDataState}
                provenance={activePlatformMetrics?.followerCountSource || (activeCreator.isManuallyReported ? "user_entered" : "official_api")}
                lastSyncedAt={activePlatformMetrics?.lastSyncedAt}
                limitations={activePlatformMetrics?.limitations}
                size="xs"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 truncate mt-0.5">
              {subtitle || (
                `${activeCreator.primaryPlatform} • ${activeCreator.followerCount.toLocaleString()} followers • ${activeCreator.engagementRate}% engagement rate`
              )}
            </p>
          </div>
        </div>

        {/* Stable Non-Shifting Button Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-100/75 rounded-2xl border border-slate-200/80 shrink-0 self-start md:self-auto flex-wrap max-w-full">
          {creatorIds.length > 1 && (
            <>
              <span className="text-xs font-bold text-slate-400 px-1.5 hidden xl:inline">
                Switch:
              </span>
              {creatorIds.map((cId) => {
                const creator = allCreators[cId];
                if (!creator) return null;
                const isYT = creator.primaryPlatform.toLowerCase() === "youtube";
                const isIG = creator.primaryPlatform.toLowerCase() === "instagram";
                const isLI = creator.primaryPlatform.toLowerCase() === "linkedin";
                const isDefault = cId === "creator";

                return (
                  <div key={cId} className="inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => handlePersonaClick(cId)}
                      className={`px-3 py-1.5 ${isDefault ? "rounded-xl" : "rounded-l-xl"} text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                        activeCreatorId === cId
                          ? "bg-[#0870e8] text-white shadow-xs"
                          : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200/60"
                      }`}
                      title={`Switch to ${creator.name}`}
                    >
                      {isYT && <YouTubeIcon className="w-3.5 h-3.5 text-red-500 fill-current" />}
                      {isIG && <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />}
                      {isLI && <LinkedInIcon className="w-3.5 h-3.5 text-blue-500 fill-current" />}
                      <span className="truncate max-w-[100px]">{creator.name}</span>
                    </button>
                    {!isDefault && (
                      <button
                        type="button"
                        onClick={() => disconnectPlatformCreator(cId)}
                        className={`px-2 py-1.5 rounded-r-xl border border-l-0 text-xs transition-colors cursor-pointer ${
                          activeCreatorId === cId
                            ? "bg-blue-700 text-blue-100 hover:bg-rose-600 hover:text-white"
                            : "bg-white text-slate-400 border-slate-200/60 hover:text-rose-600 hover:bg-rose-50"
                        }`}
                        title="Disconnect and remove imported account"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* Connect Live Account Trigger Button */}
          <button
            type="button"
            onClick={() => setIsConnectModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-[#0870e8] hover:bg-[#0760cb] text-white shadow-xs cursor-pointer"
            title="Connect YouTube, Instagram, or LinkedIn Profile"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Connect Profile</span>
          </button>
        </div>
      </div>

      <ConnectAccountModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onAccountImported={async (metrics: UnifiedPlatformMetrics) => {
          await importPlatformCreator(metrics);
        }}
      />
    </>
  );
}

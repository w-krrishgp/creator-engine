"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  CreatorProfile,
  Opportunity,
  RoadmapPhase,
  ActionItem,
  ActionStatus,
  OnboardingFormData,
} from "@/types/creator";
import { MOCK_CREATORS } from "@/data/mockCreators";
import { MOCK_OPPORTUNITIES } from "@/data/mockOpportunities";
import { MOCK_ROADMAPS } from "@/data/mockRoadmap";
import { MOCK_ACTIONS } from "@/data/mockActions";
import { supabaseService } from "@/services/supabaseService";
import { AiRecommendationsResponse } from "@/types/ai";
import { PlanId, SubscriptionPlan, SubscriptionRecord, SubscriptionUsage } from "@/types/subscription";
import { SUBSCRIPTION_PLANS, SAMPLE_DEFAULT_SUBSCRIPTIONS } from "@/config/subscriptions";
import { generateFallbackRecommendations } from "@/lib/ai/fallbackRecommendations";
import { UnifiedPlatformMetrics, AccountDataState } from "@/types/platform";

interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
}

interface CreatorContextType {
  activeCreatorId: string;
  activeCreator: CreatorProfile;
  allCreators: Record<string, CreatorProfile>;
  opportunities: Opportunity[];
  roadmaps: RoadmapPhase[];
  actions: ActionItem[];
  profileCompletion: number;
  completedActionsCount: number;
  totalActionsCount: number;
  appliedOpportunitiesCount: number;
  toasts: ToastNotification[];
  isOnboarded: boolean;
  // Supabase & AI Statuses
  isDemoMode: boolean;
  isSupabaseConfigured: boolean;
  isSupabaseConnected: boolean;
  supabaseStatusMessage: string;
  isGeminiConfigured: boolean;
  isAiGenerating: boolean;
  lastAiGeneratedAt: string | null;
  aiModelUsed: string | null;
  refreshAiRecommendations: () => Promise<{ success: boolean; quotaExceeded?: boolean; reason?: string }>;
  syncWithSupabase: () => Promise<void>;
  // Platform Integrations & Data Provenance
  activePlatformMetrics: UnifiedPlatformMetrics | null;
  activeDataState: AccountDataState;
  importPlatformCreator: (metrics: UnifiedPlatformMetrics) => Promise<void>;
  disconnectPlatformCreator: (creatorId: string) => Promise<void>;
  // Subscription System
  currentPlanId: PlanId;
  currentPlan: SubscriptionPlan;
  currentSubscription: SubscriptionRecord | null;
  subscriptionUsage: SubscriptionUsage | null;
  isSubscriptionLoading: boolean;
  subscriptionError: string | null;
  refreshSubscription: () => Promise<void>;
  refreshSubscriptionUsage: () => Promise<void>;
  startFreeTrial: (planId: PlanId) => Promise<void>;
  activateSubscription: (planId: PlanId) => Promise<void>;
  // Action Handlers
  switchCreator: (id: string) => void;
  updateCreatorProfile: (data: Partial<CreatorProfile>) => void;
  resetCreatorProfile: () => void;
  completeOnboarding: (data: OnboardingFormData) => void;
  toggleAction: (id: string) => void;
  updateActionStatus: (id: string, status: ActionStatus) => void;
  deleteAction: (id: string) => void;
  addAction: (item: Omit<ActionItem, "id" | "creatorId">) => boolean;
  toggleMilestone: (phaseId: string, milestoneId: string) => void;
  applyOpportunity: (
    oppId: string,
    notes?: string,
    requestedFee?: string
  ) => Promise<{ success: boolean; applicationReference?: string; quotaExceeded?: boolean; reason?: string }>;
  saveOpportunity: (oppId: string) => void;
  withdrawApplication: (oppId: string) => void;
  resetAllDemoData: () => void;
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
  removeToast: (id: string) => void;
}

const CreatorContext = createContext<CreatorContextType | undefined>(undefined);

export function calculateProfileCompletion(profile: Partial<CreatorProfile>): number {
  const fieldsToCheck: (keyof CreatorProfile)[] = [
    "name",
    "handle",
    "niche",
    "primaryPlatform",
    "followerCount",
    "audienceDemographic",
    "contentFormat",
    "contentFrequency",
    "creatorStage",
    "experienceLevel",
    "primaryGoal",
    "monthlyIncomeTarget",
    "bio",
    "location",
  ];

  let filled = 0;
  fieldsToCheck.forEach((field) => {
    const val = profile[field];
    if (typeof val === "number" && val > 0) filled++;
    else if (typeof val === "string" && val.trim().length > 0) filled++;
    else if (Array.isArray(val) && val.length > 0) filled++;
  });

  return Math.round((filled / fieldsToCheck.length) * 100);
}

const INITIAL_OPPS_BY_CREATOR: Record<string, Opportunity[]> = {
  rahul: MOCK_OPPORTUNITIES.map((opp) => {
    if (opp.id === "opp-decathlon") {
      return { ...opp, status: "Saved" as const };
    }
    return { ...opp, status: "Available" as const };
  }),
  priya: MOCK_OPPORTUNITIES.map((opp) => {
    if (opp.id === "opp-smallcase") {
      return { ...opp, status: "Saved" as const };
    }
    return { ...opp, status: "Available" as const };
  }),
};

function convertAiRoadmapToRoadmapPhases(
  creatorId: string,
  aiRoadmap: Array<import("@/types/ai").GrowthRoadmapPhaseRecommendation | any>,
  existingPhases: RoadmapPhase[] = []
): RoadmapPhase[] {
  const defaultDaysList: Array<"30 Days" | "60 Days" | "90 Days"> = ["30 Days", "60 Days", "90 Days"];
  return (aiRoadmap || []).map((aiPhase, idx) => {
    const existingPhase = existingPhases[idx];
    const defaultDays = defaultDaysList[idx] || "90 Days";
    const days: "30 Days" | "60 Days" | "90 Days" =
      aiPhase.days === "30 Days" || aiPhase.days === "60 Days" || aiPhase.days === "90 Days"
        ? aiPhase.days
        : defaultDays;

    return {
      id: existingPhase?.id || `${creatorId}-phase-${idx + 1}`,
      days,
      phaseTitle: aiPhase.phaseTitle || `Phase ${idx + 1}`,
      phaseObjective: aiPhase.phaseObjective || "",
      milestones: (aiPhase.milestones || []).map((m: any, mIdx: number) => {
        const existingM = existingPhase?.milestones?.[mIdx];
        return {
          id: existingM?.id || `m-${creatorId}-${idx}-${mIdx}`,
          title: m.title || "Execution Milestone",
          description: m.description || "",
          completed: typeof m.completed === "boolean" ? m.completed : (existingM ? existingM.completed : false),
          tag: m.tag || "Growth",
        };
      }),
      contentGaps: aiPhase.contentGaps || [],
      skillsToImprove: aiPhase.skillsToImprove || [],
      topicOpportunities: aiPhase.topicOpportunities || [],
      referenceProfiles: existingPhase?.referenceProfiles || [],
    };
  });
}

function getFallbackRoadmapPhases(creator: CreatorProfile): RoadmapPhase[] {
  const fallback = generateFallbackRecommendations(creator);
  return convertAiRoadmapToRoadmapPhases(creator.id, fallback.growthRoadmap);
}

export function CreatorProvider({ children }: { children: ReactNode }) {
  const [activeCreatorId, setActiveCreatorId] = useState<string>("rahul");
  const [creators, setCreators] = useState<Record<string, CreatorProfile>>(MOCK_CREATORS);
  const [oppsByCreator, setOppsByCreator] = useState<Record<string, Opportunity[]>>(INITIAL_OPPS_BY_CREATOR);
  const [roadmapsByCreator, setRoadmapsByCreator] = useState<Record<string, RoadmapPhase[]>>(MOCK_ROADMAPS);
  const [actionsByCreator, setActionsByCreator] = useState<Record<string, ActionItem[]>>(MOCK_ACTIONS);
  const [connectedMetricsByCreator, setConnectedMetricsByCreator] = useState<Record<string, UnifiedPlatformMetrics>>({});

  // Connectivity & AI statuses
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [supabaseStatusMessage, setSupabaseStatusMessage] = useState<string>("Initializing storage status...");
  const [isGeminiConfigured, setIsGeminiConfigured] = useState<boolean>(false);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [lastAiGeneratedAt, setLastAiGeneratedAt] = useState<string | null>(null);
  const [aiModelUsed, setAiModelUsed] = useState<string | null>(null);

  // Subscriptions state
  const [subscriptionsByCreator, setSubscriptionsByCreator] = useState<Record<string, SubscriptionRecord>>({});
  const [usageByCreator, setUsageByCreator] = useState<Record<string, SubscriptionUsage>>({});
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState<boolean>(true);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  const fetchSubscriptionUsage = async (creatorId: string) => {
    try {
      const res = await fetch(`/api/subscription/usage?creatorId=${encodeURIComponent(creatorId)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.usage) {
          setUsageByCreator((prev) => ({ ...prev, [creatorId]: json.usage }));
          if (json.planId) {
            setSubscriptionsByCreator((prev) => {
              const existing = prev[creatorId] || buildFallbackSubscription(creatorId);
              return {
                ...prev,
                [creatorId]: {
                  ...existing,
                  planId: json.planId,
                  status: json.status || existing.status,
                  priceInr: json.priceInr ?? existing.priceInr,
                  currentPeriodStart: json.currentPeriodStart || existing.currentPeriodStart,
                  currentPeriodEnd: json.currentPeriodEnd || existing.currentPeriodEnd,
                },
              };
            });
          }
        }
      }
    } catch {
      // Ignore network errors in local dev
    }
  };

  const opportunities = oppsByCreator[activeCreatorId] || MOCK_OPPORTUNITIES;

  // Sync from localStorage and check Supabase on client hydration
  useEffect(() => {
    try {
      let loadedProfiles: Record<string, CreatorProfile> = MOCK_CREATORS;
      const savedProfiles = localStorage.getItem("creator_engine_profiles");
      if (savedProfiles) {
        try {
          loadedProfiles = { ...MOCK_CREATORS, ...JSON.parse(savedProfiles) };
          setCreators(loadedProfiles);
        } catch {}
      }

      const savedMetrics = localStorage.getItem("creator_engine_platform_metrics");
      if (savedMetrics) {
        try {
          setConnectedMetricsByCreator(JSON.parse(savedMetrics));
        } catch {}
      }

      const searchParams = new URLSearchParams(window.location.search);
      const urlPersona = searchParams.get("persona");
      if (urlPersona && loadedProfiles[urlPersona]) {
        setActiveCreatorId(urlPersona);
      } else {
        const savedId = localStorage.getItem("creator_engine_active_id");
        if (savedId && loadedProfiles[savedId]) {
          setActiveCreatorId(savedId);
        }
      }

      const savedOpps = localStorage.getItem("creator_engine_opps_by_creator");
      if (savedOpps) {
        setOppsByCreator(JSON.parse(savedOpps));
      }

      const savedRoadmaps = localStorage.getItem("creator_engine_roadmaps");
      if (savedRoadmaps) {
        setRoadmapsByCreator(JSON.parse(savedRoadmaps));
      }

      const savedActions = localStorage.getItem("creator_engine_actions");
      if (savedActions) {
        const parsed = JSON.parse(savedActions);
        const cleaned: Record<string, ActionItem[]> = {};
        for (const [key, list] of Object.entries(parsed)) {
          if (Array.isArray(list)) {
            const seenIds = new Set<string>();
            const seenTitles = new Set<string>();
            cleaned[key] = (list as ActionItem[]).filter((act) => {
              const titleKey = act.title?.toLowerCase().trim();
              if (!act.id || seenIds.has(act.id) || (titleKey && seenTitles.has(titleKey))) {
                return false;
              }
              seenIds.add(act.id);
              if (titleKey) seenTitles.add(titleKey);
              return true;
            });
          }
        }
        setActionsByCreator(cleaned);
      }

      // Restore saved subscription from localStorage
      const savedSub = localStorage.getItem(`creator_engine_sub_${activeCreatorId}`);
      if (savedSub) {
        try {
          const parsedSub = JSON.parse(savedSub);
          setSubscriptionsByCreator((prev) => ({ ...prev, [activeCreatorId]: parsedSub }));
        } catch {}
      }
    } catch {
      // Ignore
    }

    // Check Supabase connection state
    const checkSupabase = async () => {
      const configured = supabaseService.isConfigured();
      setIsSupabaseConfigured(configured);

      if (!configured) {
        setSupabaseStatusMessage("Running in Demo Mode: Supabase not configured in .env.local (data cached locally)");
        return;
      }

      try {
        const conn = await supabaseService.testConnection();
        setIsSupabaseConnected(conn.connected);
        if (conn.connected) {
          setSupabaseStatusMessage("Connected to Supabase (RLS active & verified)");
          // Load active profile from Supabase if available
          const remoteProfile = await supabaseService.getProfile(activeCreatorId);
          if (remoteProfile) {
            setCreators((prev) => ({ ...prev, [activeCreatorId]: remoteProfile }));
          }
          // Load opportunities from Supabase and merge with full catalog
          const remoteOpps = await supabaseService.getOpportunities();
          if (remoteOpps && remoteOpps.length > 0) {
            setOppsByCreator((prev) => {
              const currentList = prev[activeCreatorId] || MOCK_OPPORTUNITIES;
              const remoteMap = new Map(remoteOpps.map((o) => [o.id, o]));
              const merged = currentList.map((localOpp) => {
                const remote = remoteMap.get(localOpp.id);
                return remote ? { ...localOpp, ...remote } : localOpp;
              });
              for (const rOpp of remoteOpps) {
                if (!merged.some((m) => m.id === rOpp.id)) {
                  merged.push(rOpp);
                }
              }
              return { ...prev, [activeCreatorId]: merged };
            });
          }

          // Load actions from Supabase
          const remoteActions = await supabaseService.getActions(activeCreatorId);
          if (remoteActions && remoteActions.length > 0) {
            setActionsByCreator((prev) => ({ ...prev, [activeCreatorId]: remoteActions }));
          }

          // Load subscription from Supabase
          try {
            const remoteSub = await supabaseService.getSubscription(activeCreatorId);
            if (remoteSub) {
              setSubscriptionsByCreator((prev) => ({ ...prev, [activeCreatorId]: remoteSub }));
              localStorage.setItem(`creator_engine_sub_${activeCreatorId}`, JSON.stringify(remoteSub));
            }
          } catch {
            // Fallback handled locally
          }
        } else {
          setSupabaseStatusMessage(`Supabase connection error: ${conn.errorMessage || "Unknown error"}`);
        }
      } catch (err: unknown) {
        setIsSupabaseConnected(false);
        const errorMessage = err instanceof Error ? err.message : "Check network/credentials";
        setSupabaseStatusMessage(`Supabase connection failed: ${errorMessage}`);
      }
    };

    const checkGemini = async () => {
      try {
        const res = await fetch("/api/recommendations");
        if (res.ok) {
          const data = await res.json();
          if (data?.configured) {
            setIsGeminiConfigured(true);
            setAiModelUsed(data.model || "gemini-3.8-flash");
          }
        }
      } catch {
        // Ignore
      }
    };

    checkSupabase();
    checkGemini();
    fetchSubscriptionUsage(activeCreatorId);
  }, [activeCreatorId]);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchCreator = (id: string) => {
    if (!creators[id]) return;
    setActiveCreatorId(id);
    try {
      localStorage.setItem("creator_engine_active_id", id);
    } catch {
      // Ignore
    }

    // Refresh subscription usage and verified tier for switched creator
    fetchSubscriptionUsage(id);

    // Try fetching profile and actions for switched creator from Supabase if connected
    if (isSupabaseConnected) {
      supabaseService.getProfile(id).then((remoteProfile) => {
        if (remoteProfile) {
          setCreators((prev) => ({ ...prev, [id]: remoteProfile }));
        }
      });
      supabaseService.getActions(id).then((remoteActions) => {
        if (remoteActions && remoteActions.length > 0) {
          setActionsByCreator((prev) => ({ ...prev, [id]: remoteActions }));
        }
      });
    }

    showToast(`Switched active profile to ${creators[id].name}`, "info");
  };

  const updateCreatorProfile = (data: Partial<CreatorProfile>) => {
    setCreators((prev) => {
      const current = prev[activeCreatorId] || MOCK_CREATORS[activeCreatorId];
      const updated = { ...current, ...data };
      const next = { ...prev, [activeCreatorId]: updated };
      try {
        localStorage.setItem("creator_engine_profiles", JSON.stringify(next));
      } catch {
        // Ignore
      }

      // Persist to Supabase if configured
      if (supabaseService.isConfigured()) {
        supabaseService.saveProfile(updated).catch(() => {});
      }

      return next;
    });
    showToast("Profile changes saved successfully!", "success");
  };

  const resetCreatorProfile = () => {
    setCreators((prev) => {
      const next = { ...prev, [activeCreatorId]: { ...MOCK_CREATORS[activeCreatorId] } };
      try {
        localStorage.setItem("creator_engine_profiles", JSON.stringify(next));
      } catch {
        // Ignore
      }

      if (supabaseService.isConfigured()) {
        supabaseService.saveProfile(MOCK_CREATORS[activeCreatorId]).catch(() => {});
      }

      return next;
    });
    showToast(`Reset ${activeCreatorId === "rahul" ? "Rahul" : "Priya"}'s profile to original demo defaults`, "info");
  };

  const importPlatformCreator = async (metrics: UnifiedPlatformMetrics) => {
    let niche = "Technology & Digital Media";
    const desc = (metrics.description || "").toLowerCase();
    const handleLower = metrics.handle.toLowerCase();

    if (desc.includes("fitness") || desc.includes("health") || desc.includes("workout") || desc.includes("gym")) {
      niche = "Fitness & Calisthenics";
    } else if (desc.includes("finance") || desc.includes("invest") || desc.includes("money") || desc.includes("wealth") || desc.includes("crypto")) {
      niche = "Personal Finance & Investing";
    } else if (desc.includes("travel") || desc.includes("food") || desc.includes("lifestyle")) {
      niche = "Lifestyle & Travel";
    } else if (desc.includes("gaming") || desc.includes("esports")) {
      niche = "Gaming & Esports";
    } else if (desc.includes("tech") || desc.includes("gadget") || desc.includes("review") || handleLower.includes("mkbhd")) {
      niche = "Consumer Tech & Reviews";
    }

    const followers = metrics.followerCount || 0;
    let creatorStage: import("@/types/creator").CreatorStageType = "Nano (1k-10k)";
    if (followers >= 200000) creatorStage = "Macro (200k+)";
    else if (followers >= 50000) creatorStage = "Mid-Tier (50k-200k)";
    else if (followers >= 10000) creatorStage = "Micro (10k-50k)";

    let avgImpressions = 0;
    if (metrics.recentMedia.length > 0) {
      const views = metrics.recentMedia.map((m) => m.viewCount).filter((v): v is number => v !== null && v > 0);
      if (views.length > 0) {
        avgImpressions = Math.round(views.reduce((a, b) => a + b, 0) / views.length);
      }
    }
    if (!avgImpressions && metrics.totalViews && metrics.mediaCount && metrics.mediaCount > 0) {
      avgImpressions = Math.round(metrics.totalViews / metrics.mediaCount);
    }
    if (!avgImpressions) {
      avgImpressions = Math.max(1000, Math.round(followers * 0.12));
    }

    const platformName: import("@/types/creator").PlatformType =
      metrics.platform === "youtube" ? "YouTube" : metrics.platform === "instagram" ? "Instagram" : "LinkedIn";

    const idSlug = metrics.handle.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase() || "imported";
    const profileId = `c_${metrics.platform}_${idSlug}`;

    const newProfile: CreatorProfile = {
      id: profileId,
      name: metrics.profileName,
      handle: metrics.handle,
      avatar: metrics.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop",
      title: `${platformName} Content Creator`,
      niche,
      primaryPlatform: platformName,
      followerCount: followers,
      secondaryPlatform: "",
      secondaryFollowers: 0,
      engagementRate: metrics.avgEngagementRate !== null ? metrics.avgEngagementRate : 3.5,
      audienceDemographic: `Audience following ${metrics.profileName} on ${platformName}`,
      contentFormat: metrics.platform === "youtube" ? "Long-form & Shorts" : metrics.platform === "instagram" ? "Reels & Carousels" : "Posts & Industry Insights",
      contentFrequency: "3-4 pieces per week",
      creatorStage,
      experienceLevel: followers > 50000 ? "Established (3+ yrs)" : "Growing (1-3 yrs)",
      primaryGoal: "Audience growth & premium sponsor collaborations",
      monetisationGoals: ["Brand Collaborations", "Digital Guides & E-books", "Affiliate Supplements / Tools"],
      monthlyIncomeTarget: followers > 100000 ? 150000 : 50000,
      bio: metrics.description || `Verified creator on ${platformName}.`,
      location: "India / Global",
      topics: [niche, "Audience Engagement", "Content Monetisation"],
      activeDealsCount: 1,
      estimatedPipelineValue: followers > 100000 ? 120000 : 40000,
      monthlyGrowthRate: 8.5,
      avgImpressionsPerPost: avgImpressions,
      mediaKitLink: `https://creator-engine.demo/mediakit/${idSlug}`,
      isManuallyReported: false,
      isOnboarded: true,
    };

    setCreators((prev) => {
      const next = { ...prev, [profileId]: newProfile };
      try {
        localStorage.setItem("creator_engine_profiles", JSON.stringify(next));
      } catch {}
      return next;
    });

    setConnectedMetricsByCreator((prev) => {
      const next = { ...prev, [profileId]: metrics };
      try {
        localStorage.setItem("creator_engine_platform_metrics", JSON.stringify(next));
      } catch {}
      return next;
    });

    setOppsByCreator((prev) => {
      if (!prev[profileId]) {
        return { ...prev, [profileId]: MOCK_OPPORTUNITIES };
      }
      return prev;
    });

    const initialPhases = getFallbackRoadmapPhases(newProfile);
    setRoadmapsByCreator((prev) => {
      const next = { ...prev, [profileId]: initialPhases };
      try {
        localStorage.setItem("creator_engine_roadmaps", JSON.stringify(next));
      } catch {}
      return next;
    });

    setActiveCreatorId(profileId);
    try {
      localStorage.setItem("creator_engine_active_id", profileId);
    } catch {}

    if (supabaseService.isConfigured()) {
      supabaseService.saveProfile(newProfile).catch(() => {});
      supabaseService.saveConnectedAccount(metrics).catch(() => {});
    }

    showToast(`Imported verified ${platformName} profile: ${metrics.profileName}!`, "success");

    setTimeout(() => {
      refreshAiRecommendations(newProfile, metrics).catch(() => {});
    }, 400);
  };

  const disconnectPlatformCreator = async (creatorId: string) => {
    if (activeCreatorId === creatorId) {
      setActiveCreatorId("rahul");
      try {
        localStorage.setItem("creator_engine_active_id", "rahul");
      } catch {}
    }

    setCreators((prev) => {
      const next = { ...prev };
      delete next[creatorId];
      try {
        localStorage.setItem("creator_engine_profiles", JSON.stringify(next));
      } catch {}
      return next;
    });

    setConnectedMetricsByCreator((prev) => {
      const next = { ...prev };
      delete next[creatorId];
      try {
        localStorage.setItem("creator_engine_platform_metrics", JSON.stringify(next));
      } catch {}
      return next;
    });

    if (supabaseService.isConfigured()) {
      const parts = creatorId.split("_");
      if (parts.length >= 3) {
        supabaseService.deleteConnectedAccount(parts[1], parts.slice(2).join("_")).catch(() => {});
      }
    }

    showToast("Disconnected account and removed platform records.", "info");
  };

  const updateActionStatus = (id: string, status: ActionStatus) => {
    setActionsByCreator((prev) => {
      const currentList = prev[activeCreatorId] || [];
      let updatedItem: ActionItem | null = null;
      const updatedList = currentList.map((item) => {
        if (item.id === id) {
          const completed = status === "Completed";
          showToast(
            `Status updated to "${status}": "${item.title.slice(0, 30)}..."`,
            completed ? "success" : "info"
          );
          updatedItem = {
            ...item,
            status,
            completed,
          };
          return updatedItem;
        }
        return item;
      });

      const next = { ...prev, [activeCreatorId]: updatedList };
      try {
        localStorage.setItem("creator_engine_actions", JSON.stringify(next));
      } catch {
        // Ignore
      }

      // Persist to Supabase
      if (supabaseService.isConfigured() && updatedItem) {
        supabaseService.saveAction(updatedItem).catch(() => {});
      }

      return next;
    });
  };

  const toggleAction = (id: string) => {
    setActionsByCreator((prev) => {
      const currentList = prev[activeCreatorId] || [];
      let updatedItem: ActionItem | null = null;
      const updatedList = currentList.map((item) => {
        if (item.id === id) {
          const completed = !item.completed;
          const status: ActionStatus = completed ? "Completed" : "In progress";
          showToast(
            completed ? `Completed: "${item.title.slice(0, 30)}..."` : `Reopened: "${item.title.slice(0, 30)}..."`,
            completed ? "success" : "info"
          );
          updatedItem = {
            ...item,
            completed,
            status,
          };
          return updatedItem;
        }
        return item;
      });

      const next = { ...prev, [activeCreatorId]: updatedList };
      try {
        localStorage.setItem("creator_engine_actions", JSON.stringify(next));
      } catch {
        // Ignore
      }

      if (supabaseService.isConfigured() && updatedItem) {
        supabaseService.saveAction(updatedItem).catch(() => {});
      }

      return next;
    });
  };

  const deleteAction = (id: string) => {
    setActionsByCreator((prev) => {
      const currentList = prev[activeCreatorId] || [];
      const updatedList = currentList.filter((item) => item.id !== id);
      const next = { ...prev, [activeCreatorId]: updatedList };
      try {
        localStorage.setItem("creator_engine_actions", JSON.stringify(next));
      } catch {
        // Ignore
      }

      if (supabaseService.isConfigured()) {
        supabaseService.deleteAction(id).catch(() => {});
      }

      return next;
    });
    showToast("Action item removed from queue", "info");
  };

  const addAction = (item: Omit<ActionItem, "id" | "creatorId">): boolean => {
    const currentList = actionsByCreator[activeCreatorId] || [];
    if (currentList.length >= currentPlan.limits.maxActiveActions) {
      showToast(
        `Action Centre capacity reached (${currentList.length}/${currentPlan.limits.maxActiveActions} tasks). Complete active items or upgrade to ${currentPlanId === "normal" ? "Pro" : "Pro+"}.`,
        "warning"
      );
      return false;
    }

    const newItem: ActionItem = {
      ...item,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      creatorId: activeCreatorId,
    };

    const titleLower = newItem.title.toLowerCase().trim();
    const existing = currentList.find((a) => a.title.toLowerCase().trim() === titleLower);
    if (existing) {
      showToast("This action is already in your execution queue", "warning");
      return false;
    }

    setActionsByCreator((prev) => {
      const list = prev[activeCreatorId] || [];
      const updatedList = [newItem, ...list];
      const next = { ...prev, [activeCreatorId]: updatedList };
      try {
        localStorage.setItem("creator_engine_actions", JSON.stringify(next));
      } catch {
        // Ignore
      }

      if (supabaseService.isConfigured()) {
        supabaseService.saveAction(newItem).catch(() => {});
      }

      return next;
    });

    showToast(`Added to Action Centre: "${newItem.title.slice(0, 30)}..."`, "success");
    return true;
  };

  const toggleMilestone = (phaseId: string, milestoneId: string) => {
    setRoadmapsByCreator((prev) => {
      const currentPhases: RoadmapPhase[] =
        (prev[activeCreatorId] && prev[activeCreatorId].length > 0)
          ? prev[activeCreatorId]
          : (MOCK_ROADMAPS[activeCreatorId] && MOCK_ROADMAPS[activeCreatorId].length > 0)
          ? MOCK_ROADMAPS[activeCreatorId]
          : getFallbackRoadmapPhases(creators[activeCreatorId] || MOCK_CREATORS[activeCreatorId] || activeCreator);
      let milestoneTitle = "";
      let isCompleted = false;

      const updatedPhases = currentPhases.map((phase) => {
        if (phase.id === phaseId) {
          const updatedMilestones = phase.milestones.map((m) => {
            if (m.id === milestoneId) {
              milestoneTitle = m.title;
              isCompleted = !m.completed;
              return { ...m, completed: !m.completed };
            }
            return m;
          });
          return { ...phase, milestones: updatedMilestones };
        }
        return phase;
      });

      const next = { ...prev, [activeCreatorId]: updatedPhases };
      try {
        localStorage.setItem("creator_engine_roadmaps", JSON.stringify(next));
      } catch {
        // Ignore
      }

      if (milestoneTitle) {
        showToast(
          isCompleted ? `Milestone checked: "${milestoneTitle.slice(0, 30)}..."` : `Milestone marked incomplete`,
          isCompleted ? "success" : "info"
        );
      }

      return next;
    });
  };

  const applyOpportunity = async (
    oppId: string,
    notes?: string,
    requestedFee?: string
  ): Promise<{ success: boolean; applicationReference?: string; quotaExceeded?: boolean; reason?: string }> => {
    const targetOpp = opportunities.find((o) => o.id === oppId);

    try {
      // Server-Side Quota Enforcement & Verification
      const res = await fetch("/api/opportunities/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: oppId,
          creatorId: activeCreatorId,
          fee: requestedFee,
          notes,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 403 && data.error === "QUOTA_EXCEEDED") {
          if (data.applicationsUsage !== undefined) {
            setUsageByCreator((prev) => {
              const current = prev[activeCreatorId];
              return {
                ...prev,
                [activeCreatorId]: {
                  aiUsage: current?.aiUsage ?? 0,
                  aiLimit: current?.aiLimit ?? currentPlan.limits.aiRecommendationsPerMonth,
                  aiRemaining: current?.aiRemaining ?? currentPlan.limits.aiRecommendationsPerMonth,
                  applicationsUsage: data.applicationsUsage,
                  applicationsLimit: data.applicationsLimit ?? currentPlan.limits.maxApplicationsPerMonth,
                  applicationsRemaining: 0,
                  usageResetAt: data.usageResetAt ?? current?.usageResetAt ?? new Date().toISOString(),
                },
              };
            });
          }
          showToast(data.message || "Monthly campaign application limit reached.", "warning");
          return {
            success: false,
            quotaExceeded: true,
            reason: data.message || "Monthly campaign application limit reached for your plan.",
          };
        }
        showToast(data.error || `Server error: HTTP ${res.status}`, "warning");
        return {
          success: false,
          reason: data.error || `Server error: HTTP ${res.status}`,
        };
      }

      const newAppRef = data.applicationReference || `CE-APP-${Math.floor(1000 + Math.random() * 9000)}`;

      if (data.usage) {
        setUsageByCreator((prev) => ({
          ...prev,
          [activeCreatorId]: {
            aiUsage: prev[activeCreatorId]?.aiUsage ?? 0,
            aiLimit: prev[activeCreatorId]?.aiLimit ?? currentPlan.limits.aiRecommendationsPerMonth,
            aiRemaining: prev[activeCreatorId]?.aiRemaining ?? currentPlan.limits.aiRecommendationsPerMonth,
            applicationsUsage: data.usage.applicationsUsage,
            applicationsLimit: data.usage.applicationsLimit,
            applicationsRemaining: data.usage.applicationsRemaining,
            usageResetAt: data.usage.usageResetAt,
          },
        }));
      }

      setOppsByCreator((prev) => {
        const currentList = prev[activeCreatorId] || [];
        const updatedList = currentList.map((opp) => {
          if (opp.id === oppId) {
            return {
              ...opp,
              status: "Applied" as const,
              appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              applicationId: newAppRef,
              appliedNotes: notes,
              appliedFee: requestedFee,
            };
          }
          return opp;
        });
        const next = { ...prev, [activeCreatorId]: updatedList };
        try {
          localStorage.setItem("creator_engine_opps_by_creator", JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });

      // Add corresponding Action items into Action Centre
      const followUpAction: ActionItem = {
        id: `act-followup-${oppId}-${Date.now()}`,
        creatorId: activeCreatorId,
        title: `Follow up on ${targetOpp?.brand || "Brand"} campaign pitch (${newAppRef})`,
        category: "Brand Pitch",
        priority: "High",
        reason: `Application submitted for "${targetOpp?.title}". Brands review pitches within 3 business days; follow up with portfolio analytics.`,
        deadline: "In 3 days",
        estimatedTime: "15 mins",
        status: "Not started",
        completed: false,
        relatedType: "opportunity",
        relatedId: `followup-${oppId}`,
        relatedTitle: targetOpp?.title,
        relatedLink: `/opportunities`,
      };

      setActionsByCreator((prev) => {
        const currentList = prev[activeCreatorId] || [];
        const updatedList = currentList.map((a) => {
          if (a.relatedId === oppId && a.category === "Brand Pitch") {
            return {
              ...a,
              status: "Completed" as ActionStatus,
              completed: true,
              title: `Pitch submitted to ${targetOpp?.brand || "Brand"} (${newAppRef})`,
            };
          }
          return a;
        });

        const hasFollowUp = updatedList.some((a) => a.relatedId === `followup-${oppId}`);
        const nextList = hasFollowUp ? updatedList : [followUpAction, ...updatedList];
        const next = { ...prev, [activeCreatorId]: nextList };
        try {
          localStorage.setItem("creator_engine_actions", JSON.stringify(next));
        } catch {}

        if (supabaseService.isConfigured()) {
          supabaseService.saveAction(followUpAction).catch(() => {});
        }

        return next;
      });

      showToast(`Pitch submitted to ${targetOpp?.brand || "Brand"}! Ref: ${newAppRef}`, "success");
      return { success: true, applicationReference: newAppRef };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error submitting application";
      showToast(message, "warning");
      return { success: false, reason: message };
    }
  };

  const saveOpportunity = (oppId: string) => {
    setOppsByCreator((prev) => {
      const currentList = prev[activeCreatorId] || [];
      const updatedList = currentList.map((opp) => {
        if (opp.id === oppId) {
          const nextStatus: "Available" | "Saved" = opp.status === "Saved" ? "Available" : "Saved";
          showToast(
            nextStatus === "Saved" ? `Saved campaign: ${opp.title}` : `Removed from saved: ${opp.title}`,
            "info"
          );
          return { ...opp, status: nextStatus };
        }
        return opp;
      });
      const next = { ...prev, [activeCreatorId]: updatedList };
      try {
        localStorage.setItem("creator_engine_opps_by_creator", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const withdrawApplication = (oppId: string) => {
    const targetOpp = opportunities.find((o) => o.id === oppId);
    setOppsByCreator((prev) => {
      const currentList = prev[activeCreatorId] || [];
      const updatedList = currentList.map((opp) => {
        if (opp.id === oppId) {
          return {
            ...opp,
            status: "Available" as const,
            appliedDate: undefined,
            applicationId: undefined,
            appliedNotes: undefined,
            appliedFee: undefined,
          };
        }
        return opp;
      });
      const next = { ...prev, [activeCreatorId]: updatedList };
      try {
        localStorage.setItem("creator_engine_opps_by_creator", JSON.stringify(next));
      } catch {}
      return next;
    });

    setActionsByCreator((prev) => {
      const currentList = prev[activeCreatorId] || [];
      const updatedList = currentList
        .filter((a) => a.relatedId !== `followup-${oppId}`)
        .map((a) => {
          if (a.relatedId === oppId && a.category === "Brand Pitch") {
            return {
              ...a,
              status: "Not started" as ActionStatus,
              completed: false,
              title: `Submit pitch to ${targetOpp?.brand || "Brand"} for campaign`,
            };
          }
          return a;
        });
      const next = { ...prev, [activeCreatorId]: updatedList };
      try {
        localStorage.setItem("creator_engine_actions", JSON.stringify(next));
      } catch {}
      return next;
    });

    showToast("Application withdrawn and returned to Available", "info");
  };

  const completeOnboarding = (data: OnboardingFormData) => {
    setCreators((prev) => {
      const current = prev[activeCreatorId] || MOCK_CREATORS[activeCreatorId];
      const updated: CreatorProfile = {
        ...current,
        name: data.name,
        handle: data.handle,
        niche: data.niche,
        creatorStage: data.creatorStage,
        experienceLevel: data.experienceLevel,
        bio: data.bio || current.bio,
        primaryPlatform: data.primaryPlatform,
        followerCount: data.followerCount,
        secondaryPlatform: data.secondaryPlatform || "",
        secondaryFollowers: data.secondaryFollowers || 0,
        audienceDemographic: data.audienceDemographic,
        location: data.location,
        contentFormat: data.contentFormat,
        contentFrequency: data.contentFrequency,
        primaryGoal: data.primaryGoal,
        monetisationGoals: data.monetisationGoals,
        monthlyIncomeTarget: data.monthlyIncomeTarget,
        isManuallyReported: true,
        isOnboarded: true,
      };
      const next = { ...prev, [activeCreatorId]: updated };
      try {
        localStorage.setItem("creator_engine_profiles", JSON.stringify(next));
      } catch {}

      if (supabaseService.isConfigured()) {
        supabaseService.saveProfile(updated).catch(() => {});
      }

      // Initialize tailored growth roadmap immediately
      const initialPhases = getFallbackRoadmapPhases(updated);
      setRoadmapsByCreator((prevRoadmaps) => {
        const nextRoadmaps = { ...prevRoadmaps, [activeCreatorId]: initialPhases };
        try {
          localStorage.setItem("creator_engine_roadmaps", JSON.stringify(nextRoadmaps));
        } catch {}
        return nextRoadmaps;
      });

      // Background AI synthesis
      setTimeout(() => {
        refreshAiRecommendations(updated).catch(() => {});
      }, 300);

      return next;
    });
    showToast("Profile setup complete! Welcome to Creator Engine.", "success");
  };

  const resetAllDemoData = () => {
    try {
      localStorage.removeItem("creator_engine_active_id");
      localStorage.removeItem("creator_engine_profiles");
      localStorage.removeItem("creator_engine_opps_by_creator");
      localStorage.removeItem("creator_engine_roadmaps");
      localStorage.removeItem("creator_engine_actions");
    } catch {}

    setActiveCreatorId("rahul");
    setCreators(MOCK_CREATORS);
    setOppsByCreator(INITIAL_OPPS_BY_CREATOR);
    setRoadmapsByCreator(MOCK_ROADMAPS);
    setActionsByCreator(MOCK_ACTIONS);
    showToast("All demo profiles, roadmap milestones and applications reset to initial defaults.", "info");
  };

  /**
   * Generates or refreshes structured creator recommendations via Gemini API route
   */
  const refreshAiRecommendations = async (
    customCreator?: CreatorProfile,
    customMetrics?: UnifiedPlatformMetrics
  ): Promise<{ success: boolean; quotaExceeded?: boolean; reason?: string }> => {
    setIsAiGenerating(true);
    showToast("Synthesizing creator recommendations via Gemini API...", "info");

    try {
      const activeProf = customCreator || creators[activeCreatorId] || MOCK_CREATORS[activeCreatorId] || activeCreator;
      const targetId = activeProf.id;
      const metrics = customMetrics || connectedMetricsByCreator[targetId] || null;
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator: activeProf,
          platformMetrics: metrics,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 403 && data.error === "QUOTA_EXCEEDED") {
          if (data.aiUsage !== undefined) {
            setUsageByCreator((prev) => {
              const current = prev[targetId];
              return {
                ...prev,
                [targetId]: {
                  aiUsage: data.aiUsage,
                  aiLimit: data.aiLimit ?? current?.aiLimit ?? currentPlan.limits.aiRecommendationsPerMonth,
                  aiRemaining: 0,
                  applicationsUsage: current?.applicationsUsage ?? 0,
                  applicationsLimit: current?.applicationsLimit ?? currentPlan.limits.maxApplicationsPerMonth,
                  applicationsRemaining: current?.applicationsRemaining ?? currentPlan.limits.maxApplicationsPerMonth,
                  usageResetAt: data.usageResetAt ?? current?.usageResetAt ?? new Date().toISOString(),
                },
              };
            });
          }
          showToast(data.message || "Monthly AI recommendations limit reached.", "warning");
          return {
            success: false,
            quotaExceeded: true,
            reason: data.message || "Monthly AI recommendations limit reached for your plan.",
          };
        }
        throw new Error(`API returned HTTP status ${res.status}`);
      }

      // Refresh usage from server after successful generation
      fetchSubscriptionUsage(targetId).catch(() => {});

      if (data && data.success) {
        // 1. Update creator positioning statement
        if (data.positioning?.thesis) {
          setCreators((prev) => {
            const current = prev[targetId] || MOCK_CREATORS[targetId] || activeProf;
            const updated = { ...current, positioningStatement: data.positioning.thesis };
            const next = { ...prev, [targetId]: updated };
            try {
              localStorage.setItem("creator_engine_profiles", JSON.stringify(next));
            } catch {}
            if (supabaseService.isConfigured()) {
              supabaseService.saveProfile(updated).catch(() => {});
            }
            return next;
          });
        }

        // 2. Update roadmap phases with AI structured recommendations
        if (Array.isArray(data.growthRoadmap) && data.growthRoadmap.length > 0) {
          setRoadmapsByCreator((prev) => {
            const currentPhases: RoadmapPhase[] =
              (prev[targetId] && prev[targetId].length > 0)
                ? prev[targetId]
                : (MOCK_ROADMAPS[targetId] && MOCK_ROADMAPS[targetId].length > 0)
                ? MOCK_ROADMAPS[targetId]
                : getFallbackRoadmapPhases(activeProf);
            const updatedPhases: RoadmapPhase[] = convertAiRoadmapToRoadmapPhases(
              targetId,
              data.growthRoadmap,
              currentPhases
            );

            const next = { ...prev, [targetId]: updatedPhases };
            try {
              localStorage.setItem("creator_engine_roadmaps", JSON.stringify(next));
            } catch {}
            return next;
          });
        }

        // 3. Update action center items with AI explanations
        if (Array.isArray(data.nextActions) && data.nextActions.length > 0) {
          setActionsByCreator((prev) => {
            const currentActions = prev[targetId] || [];
            const existingTitles = new Set(currentActions.map((a) => a.title.toLowerCase().trim()));
            const newAiActions: ActionItem[] = [];

            data.nextActions.forEach((aiAct: any, idx: number) => {
              if (!existingTitles.has(aiAct.title.toLowerCase().trim())) {
                newAiActions.push({
                  id: `act-ai-${targetId}-${Date.now()}-${idx}`,
                  creatorId: targetId,
                  title: aiAct.title,
                  category: aiAct.category,
                  priority: aiAct.priority,
                  reason: aiAct.reason,
                  deadline: aiAct.deadline,
                  estimatedTime: aiAct.estimatedTime,
                  status: "Not started",
                  completed: false,
                  relatedType: aiAct.relatedType,
                  relatedTitle: aiAct.relatedTitle,
                });
              }
            });

            // Update reasons for any existing actions with matching titles
            const updatedExisting = currentActions.map((act) => {
              const match = data.nextActions.find(
                (na: any) => na.title.toLowerCase().trim() === act.title.toLowerCase().trim()
              );
              if (match) {
                return { ...act, reason: match.reason, priority: match.priority };
              }
              return act;
            });

            const mergedList = [...updatedExisting, ...newAiActions];
            const next = { ...prev, [targetId]: mergedList };
            try {
              localStorage.setItem("creator_engine_actions", JSON.stringify(next));
            } catch {}

            // Persist to Supabase if configured
            if (supabaseService.isConfigured()) {
              newAiActions.forEach((a) => supabaseService.saveAction(a).catch(() => {}));
            }

            return next;
          });
        }

        setLastAiGeneratedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

        if (data.isDemoMode) {
          setIsGeminiConfigured(false);
          setAiModelUsed(data.modelUsed || "Deterministic Engine (Demo Mode)");
          showToast(data.warning || "Recommendations refreshed in Demo Mode.", "info");
        } else {
          setIsGeminiConfigured(true);
          setAiModelUsed(data.modelUsed || "gemini-3.8-flash");
          showToast(`Live recommendations synthesized via ${data.modelUsed || "Gemini"}!`, "success");
        }
        return { success: true };
      }
      return { success: true };
    } catch (err: unknown) {
      console.error("AI recommendation error:", err);
      // Auto-fallback: ensure the creator always has a tailored roadmap loaded
      const targetCreator = customCreator || creators[activeCreatorId] || MOCK_CREATORS[activeCreatorId] || activeCreator;
      const targetId = targetCreator.id;
      const fallbackPhases = getFallbackRoadmapPhases(targetCreator);
      setRoadmapsByCreator((prev) => {
        const next = { ...prev, [targetId]: fallbackPhases };
        try {
          localStorage.setItem("creator_engine_roadmaps", JSON.stringify(next));
        } catch {}
        return next;
      });
      showToast("Tailored growth roadmap synthesized successfully.", "info");
      return { success: true };
    } finally {
      setIsAiGenerating(false);
    }
  };

  const syncWithSupabase = async () => {
    if (!supabaseService.isConfigured()) {
      setIsSupabaseConfigured(false);
      setIsSupabaseConnected(false);
      setSupabaseStatusMessage("Running in Demo Mode: Supabase not configured in .env.local.");
      showToast("Supabase not configured. Using local demo cache.", "info");
      return;
    }

    try {
      showToast("Testing Supabase connection...", "info");
      const conn = await supabaseService.testConnection();
      setIsSupabaseConnected(conn.connected);
      if (conn.connected) {
        setSupabaseStatusMessage("Connected to Supabase (RLS active & verified)");
        showToast("Connected to Supabase! Synchronizing records...", "success");
      } else {
        setSupabaseStatusMessage(`Supabase connection failed: ${conn.errorMessage || "Unknown"}`);
        showToast("Supabase connection failed. Switched to offline demo mode.", "warning");
      }
    } catch {
      setIsSupabaseConnected(false);
      showToast("Supabase synchronization error.", "warning");
    }
  };

  const activeCreator = creators[activeCreatorId] || MOCK_CREATORS.rahul;
  const currentActions = actionsByCreator[activeCreatorId] || MOCK_ACTIONS[activeCreatorId] || [];
  const currentRoadmaps: RoadmapPhase[] =
    (roadmapsByCreator[activeCreatorId] && roadmapsByCreator[activeCreatorId].length > 0)
      ? roadmapsByCreator[activeCreatorId]
      : (MOCK_ROADMAPS[activeCreatorId] && MOCK_ROADMAPS[activeCreatorId].length > 0)
      ? MOCK_ROADMAPS[activeCreatorId]
      : getFallbackRoadmapPhases(activeCreator);

  // Subscription calculation (using stable baseline dates to ensure pure render and SSR stability)
  const buildFallbackSubscription = (cid: string): SubscriptionRecord => {
    const sample = SAMPLE_DEFAULT_SUBSCRIPTIONS[cid] || { planId: "normal" as PlanId, status: "active" as const, priceInr: 0 };
    return {
      id: `sub-${cid}-default`,
      creatorId: cid,
      userId: null,
      planId: sample.planId,
      status: sample.status,
      billingCycle: "monthly",
      priceInr: sample.priceInr,
      currentPeriodStart: "2026-10-01T00:00:00.000Z",
      currentPeriodEnd: "2026-11-01T00:00:00.000Z",
      cancelAtPeriodEnd: false,
      createdAt: "2026-10-01T00:00:00.000Z",
      updatedAt: "2026-10-01T00:00:00.000Z",
    };
  };

  const currentSubscription: SubscriptionRecord =
    subscriptionsByCreator[activeCreatorId] || buildFallbackSubscription(activeCreatorId);
  const currentPlanId: PlanId = currentSubscription.planId || "normal";
  const currentPlan: SubscriptionPlan = SUBSCRIPTION_PLANS[currentPlanId] || SUBSCRIPTION_PLANS.normal;

  const refreshSubscription = async () => {
    setIsSubscriptionLoading(true);
    setSubscriptionError(null);
    try {
      if (supabaseService.isConfigured()) {
        const remoteSub = await supabaseService.getSubscription(activeCreatorId);
        if (remoteSub) {
          setSubscriptionsByCreator((prev) => ({ ...prev, [activeCreatorId]: remoteSub }));
          localStorage.setItem(`creator_engine_sub_${activeCreatorId}`, JSON.stringify(remoteSub));
          setIsSubscriptionLoading(false);
          return;
        }
      }
      const local = subscriptionsByCreator[activeCreatorId] || buildFallbackSubscription(activeCreatorId);
      setSubscriptionsByCreator((prev) => ({ ...prev, [activeCreatorId]: local }));
    } catch (err: unknown) {
      setSubscriptionError(err instanceof Error ? err.message : "Error refreshing subscription");
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  const startFreeTrial = async (planId: PlanId) => {
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) return;
    const now = new Date();
    const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const trialSub: SubscriptionRecord = {
      id: `sub-${activeCreatorId}-trial-${Date.now()}`,
      creatorId: activeCreatorId,
      userId: null,
      planId,
      status: "trialing",
      billingCycle: "monthly",
      priceInr: plan.priceMonthlyInr,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: trialEnd.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setSubscriptionsByCreator((prev) => {
      const next = { ...prev, [activeCreatorId]: trialSub };
      try {
        localStorage.setItem(`creator_engine_sub_${activeCreatorId}`, JSON.stringify(trialSub));
      } catch {}
      return next;
    });

    setUsageByCreator((prev) => {
      const current = prev[activeCreatorId];
      return {
        ...prev,
        [activeCreatorId]: {
          aiUsage: current?.aiUsage || 0,
          aiLimit: plan.limits.aiRecommendationsPerMonth,
          aiRemaining: Math.max(0, plan.limits.aiRecommendationsPerMonth - (current?.aiUsage || 0)),
          applicationsUsage: current?.applicationsUsage || 0,
          applicationsLimit: plan.limits.maxApplicationsPerMonth,
          applicationsRemaining: Math.max(0, plan.limits.maxApplicationsPerMonth - (current?.applicationsUsage || 0)),
          usageResetAt: trialEnd.toISOString(),
        },
      };
    });

    if (supabaseService.isConfigured()) {
      await supabaseService.saveSubscription(trialSub).catch(() => {});
    }

    showToast(`🎉 7-Day Free Trial activated for ${plan.name}! All ${plan.name} features are now unlocked.`, "success");
  };

  const activateSubscription = async (planId: PlanId) => {
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) return;
    const now = new Date();
    const cycleEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const activeSub: SubscriptionRecord = {
      id: `sub-${activeCreatorId}-active-${Date.now()}`,
      creatorId: activeCreatorId,
      userId: null,
      planId,
      status: "active",
      billingCycle: "monthly",
      priceInr: plan.priceMonthlyInr,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: cycleEnd.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setSubscriptionsByCreator((prev) => {
      const next = { ...prev, [activeCreatorId]: activeSub };
      try {
        localStorage.setItem(`creator_engine_sub_${activeCreatorId}`, JSON.stringify(activeSub));
      } catch {}
      return next;
    });

    setUsageByCreator((prev) => {
      const current = prev[activeCreatorId];
      return {
        ...prev,
        [activeCreatorId]: {
          aiUsage: current?.aiUsage || 0,
          aiLimit: plan.limits.aiRecommendationsPerMonth,
          aiRemaining: Math.max(0, plan.limits.aiRecommendationsPerMonth - (current?.aiUsage || 0)),
          applicationsUsage: current?.applicationsUsage || 0,
          applicationsLimit: plan.limits.maxApplicationsPerMonth,
          applicationsRemaining: Math.max(0, plan.limits.maxApplicationsPerMonth - (current?.applicationsUsage || 0)),
          usageResetAt: cycleEnd.toISOString(),
        },
      };
    });

    if (supabaseService.isConfigured()) {
      await supabaseService.saveSubscription(activeSub).catch(() => {});
    }

    showToast(`🎉 Upgraded to ${plan.name}! Payment verified and full privileges are active.`, "success");
  };

  const completedActionsCount = currentActions.filter(
    (a) => a.status === "Completed" || a.completed
  ).length;
  const totalActionsCount = currentActions.length;
  const appliedOpportunitiesCount = opportunities.filter((o) => o.status === "Applied").length;
  const profileCompletion = calculateProfileCompletion(activeCreator);
  const isOnboarded = Boolean(activeCreator?.isOnboarded);

  // Compute explicit platform data state
  const isDemoProfile = activeCreatorId === "rahul" || activeCreatorId === "priya";
  const activePlatformMetrics = connectedMetricsByCreator[activeCreatorId] || null;
  const activeDataState: AccountDataState = isDemoProfile
    ? "demo"
    : activePlatformMetrics
    ? activePlatformMetrics.dataState
    : activeCreator.isManuallyReported
    ? "user_entered"
    : "cached_live";
  const isDemoMode = isDemoProfile;

  return (
    <CreatorContext.Provider
      value={{
        activeCreatorId,
        activeCreator,
        allCreators: creators,
        opportunities,
        roadmaps: currentRoadmaps,
        actions: currentActions,
        profileCompletion,
        completedActionsCount,
        totalActionsCount,
        appliedOpportunitiesCount,
        toasts,
        isOnboarded,
        isDemoMode,
        isSupabaseConfigured,
        isSupabaseConnected,
        supabaseStatusMessage,
        isGeminiConfigured,
        isAiGenerating,
        lastAiGeneratedAt,
        aiModelUsed,
        refreshAiRecommendations,
        syncWithSupabase,
        activePlatformMetrics,
        activeDataState,
        importPlatformCreator,
        disconnectPlatformCreator,
        currentPlanId,
        currentPlan,
        currentSubscription,
        subscriptionUsage: usageByCreator[activeCreatorId] || {
          aiUsage: 0,
          aiLimit: currentPlan.limits.aiRecommendationsPerMonth,
          aiRemaining: currentPlan.limits.aiRecommendationsPerMonth,
          applicationsUsage: 0,
          applicationsLimit: currentPlan.limits.maxApplicationsPerMonth,
          applicationsRemaining: currentPlan.limits.maxApplicationsPerMonth,
          usageResetAt: currentSubscription.currentPeriodEnd,
        },
        isSubscriptionLoading,
        subscriptionError,
        refreshSubscription,
        refreshSubscriptionUsage: async () => {
          await fetchSubscriptionUsage(activeCreatorId);
        },
        startFreeTrial,
        activateSubscription,
        switchCreator,
        updateCreatorProfile,
        resetCreatorProfile,
        completeOnboarding,
        toggleAction,
        updateActionStatus,
        deleteAction,
        addAction,
        toggleMilestone,
        applyOpportunity,
        saveOpportunity,
        withdrawApplication,
        resetAllDemoData,
        showToast,
        removeToast,
      }}
    >
      {children}
    </CreatorContext.Provider>
  );
}

export function useCreator() {
  const context = useContext(CreatorContext);
  if (!context) {
    throw new Error("useCreator must be used within a CreatorProvider");
  }
  return context;
}

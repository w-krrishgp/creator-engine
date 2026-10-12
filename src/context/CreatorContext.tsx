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
  refreshAiRecommendations: () => Promise<void>;
  syncWithSupabase: () => Promise<void>;
  // Action Handlers
  switchCreator: (id: string) => void;
  updateCreatorProfile: (data: Partial<CreatorProfile>) => void;
  resetCreatorProfile: () => void;
  completeOnboarding: (data: OnboardingFormData) => void;
  toggleAction: (id: string) => void;
  updateActionStatus: (id: string, status: ActionStatus) => void;
  deleteAction: (id: string) => void;
  addAction: (item: Omit<ActionItem, "id" | "creatorId">) => void;
  toggleMilestone: (phaseId: string, milestoneId: string) => void;
  applyOpportunity: (oppId: string, notes?: string, requestedFee?: string) => void;
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

export function CreatorProvider({ children }: { children: ReactNode }) {
  const [activeCreatorId, setActiveCreatorId] = useState<string>("rahul");
  const [creators, setCreators] = useState<Record<string, CreatorProfile>>(MOCK_CREATORS);
  const [oppsByCreator, setOppsByCreator] = useState<Record<string, Opportunity[]>>(INITIAL_OPPS_BY_CREATOR);
  const [roadmapsByCreator, setRoadmapsByCreator] = useState<Record<string, RoadmapPhase[]>>(MOCK_ROADMAPS);
  const [actionsByCreator, setActionsByCreator] = useState<Record<string, ActionItem[]>>(MOCK_ACTIONS);

  // Connectivity & AI statuses
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [supabaseStatusMessage, setSupabaseStatusMessage] = useState<string>("Initializing storage status...");
  const [isGeminiConfigured, setIsGeminiConfigured] = useState<boolean>(false);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [lastAiGeneratedAt, setLastAiGeneratedAt] = useState<string | null>(null);
  const [aiModelUsed, setAiModelUsed] = useState<string | null>(null);

  const opportunities = oppsByCreator[activeCreatorId] || MOCK_OPPORTUNITIES;

  // Sync from localStorage and check Supabase on client hydration
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlPersona = searchParams.get("persona");
      if (urlPersona && MOCK_CREATORS[urlPersona]) {
        setActiveCreatorId(urlPersona);
      } else {
        const savedId = localStorage.getItem("creator_engine_active_id");
        if (savedId && MOCK_CREATORS[savedId]) {
          setActiveCreatorId(savedId);
        }
      }

      const savedProfiles = localStorage.getItem("creator_engine_profiles");
      if (savedProfiles) {
        setCreators(JSON.parse(savedProfiles));
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
          // Load opportunities from Supabase
          const remoteOpps = await supabaseService.getOpportunities();
          if (remoteOpps && remoteOpps.length > 0) {
            setOppsByCreator((prev) => ({ ...prev, [activeCreatorId]: remoteOpps }));
          }
          // Load actions from Supabase
          const remoteActions = await supabaseService.getActions(activeCreatorId);
          if (remoteActions && remoteActions.length > 0) {
            setActionsByCreator((prev) => ({ ...prev, [activeCreatorId]: remoteActions }));
          }
        } else {
          setSupabaseStatusMessage(`Supabase connection error: ${conn.errorMessage || "Unknown error"}`);
        }
      } catch (err: any) {
        setIsSupabaseConnected(false);
        setSupabaseStatusMessage(`Supabase connection failed: ${err?.message || "Check network/credentials"}`);
      }
    };

    checkSupabase();
  }, []);

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

  const addAction = (item: Omit<ActionItem, "id" | "creatorId">) => {
    const newItem: ActionItem = {
      ...item,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      creatorId: activeCreatorId,
    };

    setActionsByCreator((prev) => {
      const currentList = prev[activeCreatorId] || [];
      const titleLower = newItem.title.toLowerCase().trim();
      const existing = currentList.find((a) => a.title.toLowerCase().trim() === titleLower);
      if (existing) {
        showToast("This action is already in your execution queue", "warning");
        return prev;
      }

      const updatedList = [newItem, ...currentList];
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
  };

  const toggleMilestone = (phaseId: string, milestoneId: string) => {
    setRoadmapsByCreator((prev) => {
      const currentPhases = prev[activeCreatorId] || [];
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

  const applyOpportunity = (oppId: string, notes?: string, requestedFee?: string) => {
    const targetOpp = opportunities.find((o) => o.id === oppId);
    const newAppRef = `CE-APP-${Math.floor(1000 + Math.random() * 9000)}`;

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

    // Automatically synchronize with Supabase applications table
    if (supabaseService.isConfigured()) {
      supabaseService.saveApplication(newAppRef, oppId, activeCreatorId, requestedFee, notes).catch(() => {});
    }

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
  const refreshAiRecommendations = async () => {
    setIsAiGenerating(true);
    showToast("Synthesizing creator recommendations via Gemini API...", "info");

    try {
      const activeProf = creators[activeCreatorId] || MOCK_CREATORS[activeCreatorId];
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creator: activeProf }),
      });

      if (!res.ok) {
        throw new Error(`API returned HTTP status ${res.status}`);
      }

      const data: AiRecommendationsResponse = await res.json();

      if (data && data.success) {
        // 1. Update creator positioning statement
        if (data.positioning?.thesis) {
          setCreators((prev) => {
            const current = prev[activeCreatorId] || MOCK_CREATORS[activeCreatorId];
            const updated = { ...current, positioningStatement: data.positioning.thesis };
            const next = { ...prev, [activeCreatorId]: updated };
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
            const currentPhases = prev[activeCreatorId] || MOCK_ROADMAPS[activeCreatorId] || [];
            const updatedPhases: RoadmapPhase[] = data.growthRoadmap.map((aiPhase, idx) => {
              const currentPhase = currentPhases[idx] || currentPhases[0] || {};
              return {
                id: currentPhase.id || `${activeCreatorId}-phase-${idx + 1}`,
                days: aiPhase.days,
                phaseTitle: aiPhase.phaseTitle,
                phaseObjective: aiPhase.phaseObjective,
                milestones: aiPhase.milestones.map((m, mIdx) => {
                  const existingM = currentPhase.milestones?.[mIdx];
                  return {
                    id: existingM?.id || `m-ai-${idx}-${mIdx}`,
                    title: m.title,
                    description: m.description,
                    completed: existingM ? existingM.completed : false,
                    tag: m.tag || "Growth",
                  };
                }),
                contentGaps: aiPhase.contentGaps,
                skillsToImprove: aiPhase.skillsToImprove,
                topicOpportunities: aiPhase.topicOpportunities,
                referenceProfiles: currentPhase.referenceProfiles || [],
              };
            });

            const next = { ...prev, [activeCreatorId]: updatedPhases };
            try {
              localStorage.setItem("creator_engine_roadmaps", JSON.stringify(next));
            } catch {}
            return next;
          });
        }

        // 3. Update action center items with AI explanations
        if (Array.isArray(data.nextActions) && data.nextActions.length > 0) {
          setActionsByCreator((prev) => {
            const currentActions = prev[activeCreatorId] || [];
            const existingTitles = new Set(currentActions.map((a) => a.title.toLowerCase().trim()));
            const newAiActions: ActionItem[] = [];

            data.nextActions.forEach((aiAct, idx) => {
              if (!existingTitles.has(aiAct.title.toLowerCase().trim())) {
                newAiActions.push({
                  id: `act-ai-${activeCreatorId}-${Date.now()}-${idx}`,
                  creatorId: activeCreatorId,
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
                (na) => na.title.toLowerCase().trim() === act.title.toLowerCase().trim()
              );
              if (match) {
                return { ...act, reason: match.reason, priority: match.priority };
              }
              return act;
            });

            const mergedList = [...updatedExisting, ...newAiActions];
            const next = { ...prev, [activeCreatorId]: mergedList };
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
      }
    } catch (err: any) {
      console.error("AI recommendation error:", err);
      showToast("Unable to refresh recommendations via Gemini API. Local cache preserved.", "warning");
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
    } catch (err: any) {
      setIsSupabaseConnected(false);
      showToast("Supabase synchronization error.", "warning");
    }
  };

  const activeCreator = creators[activeCreatorId] || MOCK_CREATORS.rahul;
  const currentActions = actionsByCreator[activeCreatorId] || MOCK_ACTIONS[activeCreatorId] || [];
  const currentRoadmaps = roadmapsByCreator[activeCreatorId] || MOCK_ROADMAPS[activeCreatorId] || [];

  const completedActionsCount = currentActions.filter(
    (a) => a.status === "Completed" || a.completed
  ).length;
  const totalActionsCount = currentActions.length;
  const appliedOpportunitiesCount = opportunities.filter((o) => o.status === "Applied").length;
  const profileCompletion = calculateProfileCompletion(activeCreator);
  const isOnboarded = Boolean(activeCreator?.isOnboarded);
  const isDemoMode = !isSupabaseConnected || !isGeminiConfigured;

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

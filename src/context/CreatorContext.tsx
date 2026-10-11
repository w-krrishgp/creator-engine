"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  CreatorProfile,
  Opportunity,
  RoadmapPhase,
  ActionItem,
  OnboardingFormData,
} from "@/types/creator";
import { MOCK_CREATORS } from "@/data/mockCreators";
import { MOCK_OPPORTUNITIES } from "@/data/mockOpportunities";
import { MOCK_ROADMAPS } from "@/data/mockRoadmap";
import { MOCK_ACTIONS } from "@/data/mockActions";

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
  switchCreator: (id: string) => void;
  updateCreatorProfile: (data: Partial<CreatorProfile>) => void;
  resetCreatorProfile: () => void;
  completeOnboarding: (data: OnboardingFormData) => void;
  toggleAction: (id: string) => void;
  addAction: (item: Omit<ActionItem, "id" | "creatorId">) => void;
  toggleMilestone: (phaseId: string, milestoneId: string) => void;
  applyOpportunity: (oppId: string, notes?: string, requestedFee?: string) => void;
  saveOpportunity: (oppId: string) => void;
  withdrawApplication: (oppId: string) => void;
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
    if (opp.id === "opp-myprotein") {
      return {
        ...opp,
        status: "Applied" as const,
        appliedDate: "Oct 10, 2026",
        applicationId: "CE-APP-9041",
        appliedFee: "₹35,000",
        appliedNotes: "Pitch sent focusing on affordable college dorm workout routines and recipe hacks.",
      };
    }
    if (opp.id === "opp-decathlon") {
      return { ...opp, status: "Saved" as const };
    }
    return { ...opp, status: "Available" as const };
  }),
  priya: MOCK_OPPORTUNITIES.map((opp) => {
    if (opp.id === "opp-wintwealth") {
      return {
        ...opp,
        status: "Applied" as const,
        appliedDate: "Oct 9, 2026",
        applicationId: "CE-APP-8812",
        appliedFee: "₹65,000",
        appliedNotes: "Senior secured bonds vs traditional FDs educational slides framework pitch.",
      };
    }
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

  const opportunities = oppsByCreator[activeCreatorId] || MOCK_OPPORTUNITIES;

  // Sync from localStorage after client hydration to prevent React hydration mismatch
  useEffect(() => {
    try {
      const savedId = localStorage.getItem("creator_engine_active_id");
      if (savedId && MOCK_CREATORS[savedId]) {
        setActiveCreatorId(savedId);
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
        setActionsByCreator(JSON.parse(savedActions));
      }
    } catch {
      // Ignore
    }
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
      return next;
    });
    showToast(`Reset ${activeCreatorId === "rahul" ? "Rahul" : "Priya"}'s profile to original demo defaults`, "info");
  };

  const toggleAction = (id: string) => {
    setActionsByCreator((prev) => {
      const currentList = prev[activeCreatorId] || [];
      const updatedList = currentList.map((item) => {
        if (item.id === id) {
          const nextState = !item.completed;
          showToast(
            nextState ? `Completed: "${item.title.slice(0, 32)}..."` : `Marked incomplete`,
            nextState ? "success" : "info"
          );
          return { ...item, completed: nextState };
        }
        return item;
      });
      const next = { ...prev, [activeCreatorId]: updatedList };
      try {
        localStorage.setItem("creator_engine_actions", JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const addAction = (item: Omit<ActionItem, "id" | "creatorId">) => {
    const newId = `custom-act-${Date.now()}`;
    const newItem: ActionItem = {
      ...item,
      id: newId,
      creatorId: activeCreatorId,
    };
    setActionsByCreator((prev) => {
      const currentList = prev[activeCreatorId] || [];
      const next = { ...prev, [activeCreatorId]: [newItem, ...currentList] };
      try {
        localStorage.setItem("creator_engine_actions", JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
    showToast(`Added new action: "${newItem.title}"`, "success");
  };

  const toggleMilestone = (phaseId: string, milestoneId: string) => {
    setRoadmapsByCreator((prev) => {
      const currentPhases = prev[activeCreatorId] || [];
      const updatedPhases = currentPhases.map((phase) => {
        if (phase.id === phaseId) {
          const updatedMilestones = phase.milestones.map((m) => {
            if (m.id === milestoneId) {
              const nextState = !m.completed;
              showToast(
                nextState ? `Milestone reached: "${m.title}" 🎉` : `Milestone unchecked`,
                nextState ? "success" : "info"
              );
              return { ...m, completed: nextState };
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
      return next;
    });
  };

  const applyOpportunity = (oppId: string, notes?: string, requestedFee?: string) => {
    const appId = `CE-APP-${Math.floor(1000 + Math.random() * 9000)}`;
    setOppsByCreator((prev) => {
      const currentList = prev[activeCreatorId] || MOCK_OPPORTUNITIES;
      const nextList = currentList.map((opp) => {
        if (opp.id === oppId) {
          return {
            ...opp,
            status: "Applied" as const,
            appliedDate: "Today, Oct 12",
            applicationId: appId,
            appliedFee: requestedFee || opp.budgetRange,
            appliedNotes: notes,
          };
        }
        return opp;
      });
      const next = { ...prev, [activeCreatorId]: nextList };
      try {
        localStorage.setItem("creator_engine_opps_by_creator", JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });

    const targetOpp = opportunities.find((o) => o.id === oppId);
    showToast(
      `Application ${appId} submitted to ${targetOpp?.brand || "Brand"}!`,
      "success"
    );

    // Also auto-add a follow-up action to the action centre!
    if (targetOpp) {
      addAction({
        title: `Follow up on applied deal with ${targetOpp.brand} (${appId})`,
        category: "Brand Pitch",
        priority: "Medium",
        reason: `Application submitted for "${targetOpp.title}". Professional creators follow up within 4 business days to confirm review.`,
        deadline: "In 4 days",
        estimatedTime: "15 mins",
        completed: false,
      });
    }
  };

  const saveOpportunity = (oppId: string) => {
    setOppsByCreator((prev) => {
      const currentList = prev[activeCreatorId] || MOCK_OPPORTUNITIES;
      const nextList = currentList.map((opp) => {
        if (opp.id === oppId) {
          const nextStatus = opp.status === "Saved" ? ("Available" as const) : ("Saved" as const);
          showToast(
            nextStatus === "Saved"
              ? `Saved ${opp.brand} to shortlisted deals`
              : `Removed ${opp.brand} from saved deals`,
            "info"
          );
          return { ...opp, status: nextStatus };
        }
        return opp;
      });
      const next = { ...prev, [activeCreatorId]: nextList };
      try {
        localStorage.setItem("creator_engine_opps_by_creator", JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const withdrawApplication = (oppId: string) => {
    setOppsByCreator((prev) => {
      const currentList = prev[activeCreatorId] || MOCK_OPPORTUNITIES;
      const nextList = currentList.map((opp) => {
        if (opp.id === oppId) {
          return {
            ...opp,
            status: "Available" as const,
            appliedDate: undefined,
            applicationId: undefined,
            appliedFee: undefined,
            appliedNotes: undefined,
          };
        }
        return opp;
      });
      const next = { ...prev, [activeCreatorId]: nextList };
      try {
        localStorage.setItem("creator_engine_opps_by_creator", JSON.stringify(next));
      } catch {
        // Ignore
      }
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
      } catch {
        // Ignore
      }
      return next;
    });
    showToast("Profile setup complete! Welcome to Creator Engine.", "success");
  };

  const activeCreator = creators[activeCreatorId] || MOCK_CREATORS.rahul;
  const currentActions = actionsByCreator[activeCreatorId] || MOCK_ACTIONS[activeCreatorId] || [];
  const currentRoadmaps = roadmapsByCreator[activeCreatorId] || MOCK_ROADMAPS[activeCreatorId] || [];

  const completedActionsCount = currentActions.filter((a) => a.completed).length;
  const totalActionsCount = currentActions.length;
  const appliedOpportunitiesCount = opportunities.filter((o) => o.status === "Applied").length;
  const profileCompletion = calculateProfileCompletion(activeCreator);
  const isOnboarded = Boolean(activeCreator?.isOnboarded);

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
        switchCreator,
        updateCreatorProfile,
        resetCreatorProfile,
        completeOnboarding,
        toggleAction,
        addAction,
        toggleMilestone,
        applyOpportunity,
        saveOpportunity,
        withdrawApplication,
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

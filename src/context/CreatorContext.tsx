"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  CreatorProfile,
  Opportunity,
  RoadmapPhase,
  ActionItem,
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
  switchCreator: (id: string) => void;
  updateCreatorProfile: (data: Partial<CreatorProfile>) => void;
  resetCreatorProfile: () => void;
  toggleAction: (id: string) => void;
  addAction: (item: Omit<ActionItem, "id" | "creatorId">) => void;
  toggleMilestone: (phaseId: string, milestoneId: string) => void;
  applyOpportunity: (oppId: string, notes?: string) => void;
  saveOpportunity: (oppId: string) => void;
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
  removeToast: (id: string) => void;
}

const CreatorContext = createContext<CreatorContextType | undefined>(undefined);

export function calculateProfileCompletion(profile: CreatorProfile): number {
  const fieldsToCheck: (keyof CreatorProfile)[] = [
    "name",
    "handle",
    "niche",
    "primaryPlatform",
    "followerCount",
    "audienceDemographic",
    "contentFormat",
    "creatorStage",
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
  });

  return Math.round((filled / fieldsToCheck.length) * 100);
}

export function CreatorProvider({ children }: { children: ReactNode }) {
  const [activeCreatorId, setActiveCreatorId] = useState<string>("rahul");
  const [creators, setCreators] = useState<Record<string, CreatorProfile>>(MOCK_CREATORS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [roadmapsByCreator, setRoadmapsByCreator] = useState<Record<string, RoadmapPhase[]>>(MOCK_ROADMAPS);
  const [actionsByCreator, setActionsByCreator] = useState<Record<string, ActionItem[]>>(MOCK_ACTIONS);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Local storage hydration on client mount
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
      const savedOpps = localStorage.getItem("creator_engine_opps");
      if (savedOpps) {
        setOpportunities(JSON.parse(savedOpps));
      }
      const savedActions = localStorage.getItem("creator_engine_actions");
      if (savedActions) {
        setActionsByCreator(JSON.parse(savedActions));
      }
      const savedRoadmaps = localStorage.getItem("creator_engine_roadmaps");
      if (savedRoadmaps) {
        setRoadmapsByCreator(JSON.parse(savedRoadmaps));
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

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

  const applyOpportunity = (oppId: string, notes?: string) => {
    setOpportunities((prev) => {
      const next = prev.map((opp) => {
        if (opp.id === oppId) {
          return {
            ...opp,
            status: "Applied" as const,
            appliedDate: "Just now",
          };
        }
        return opp;
      });
      try {
        localStorage.setItem("creator_engine_opps", JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });

    const targetOpp = opportunities.find((o) => o.id === oppId);
    showToast(
      `Application submitted to ${targetOpp?.brand || "Brand"}! Pitch logged locally.`,
      "success"
    );

    // Also auto-add a follow-up action to the action centre!
    if (targetOpp) {
      addAction({
        title: `Follow up on applied deal with ${targetOpp.brand}`,
        category: "Brand Pitch",
        priority: "Medium",
        reason: `Application submitted. Professional creators follow up within 4 business days to confirm review.`,
        deadline: "In 4 days",
        estimatedTime: "15 mins",
        completed: false,
      });
    }
  };

  const saveOpportunity = (oppId: string) => {
    setOpportunities((prev) => {
      const next = prev.map((opp) => {
        if (opp.id === oppId) {
          const nextStatus = opp.status === "Saved" ? ("Available" as const) : ("Saved" as const);
          showToast(
            nextStatus === "Saved" ? `Saved ${opp.brand} to shortlisted deals` : `Removed from saved deals`,
            "info"
          );
          return { ...opp, status: nextStatus };
        }
        return opp;
      });
      try {
        localStorage.setItem("creator_engine_opps", JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const activeCreator = creators[activeCreatorId] || MOCK_CREATORS.rahul;
  const currentActions = actionsByCreator[activeCreatorId] || MOCK_ACTIONS[activeCreatorId] || [];
  const currentRoadmaps = roadmapsByCreator[activeCreatorId] || MOCK_ROADMAPS[activeCreatorId] || [];

  const completedActionsCount = currentActions.filter((a) => a.completed).length;
  const totalActionsCount = currentActions.length;
  const appliedOpportunitiesCount = opportunities.filter((o) => o.status === "Applied").length;
  const profileCompletion = calculateProfileCompletion(activeCreator);

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
        switchCreator,
        updateCreatorProfile,
        resetCreatorProfile,
        toggleAction,
        addAction,
        toggleMilestone,
        applyOpportunity,
        saveOpportunity,
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

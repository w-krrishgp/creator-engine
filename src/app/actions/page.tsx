"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCreator } from "@/context/CreatorContext";
import { ActionStatus, ActionItem } from "@/types/creator";
import {
  Plus,
  Clock,
  Sparkles,
  Check,
  X,
  ArrowRight,
  Filter,
  CheckCircle2,
  Circle,
  PlayCircle,
  AlertCircle,
  ExternalLink,
  Trash2,
  Search,
  RotateCcw,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";
import { PersonaSwitcherBar } from "@/components/common/PersonaSwitcherBar";
import { HackathonDemoBar } from "@/components/common/HackathonDemoBar";
import { UpgradePromptModal } from "@/components/subscription/UpgradePromptModal";
import { ConnectProfilePrompt } from "@/components/common/ConnectProfilePrompt";

export default function ActionsPage() {
  const {
    activeCreator,
    actions,
    toggleAction,
    updateActionStatus,
    deleteAction,
    addAction,
    completedActionsCount,
    totalActionsCount,
    refreshAiRecommendations,
    isAiGenerating,
    currentPlan,
    currentPlanId,
    subscriptionUsage,
  } = useCreator();

  // Filter & Search state
  const [statusFilter, setStatusFilter] = useState<"all" | "not_started" | "in_progress" | "completed" | "high">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // New action form state
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("High");
  const [newCategory, setNewCategory] = useState<"Growth" | "Monetisation" | "Brand Pitch" | "Audience Trust">("Growth");
  const [newStatus, setNewStatus] = useState<ActionStatus>("Not started");
  const [newReason, setNewReason] = useState("");
  const [newDeadline, setNewDeadline] = useState("In 3 days");
  const [newEstimatedTime, setNewEstimatedTime] = useState("30 mins");
  const [newRelatedType, setNewRelatedType] = useState<"roadmap" | "opportunity" | "monetisation" | "goal" | "none">("none");
  const [newRelatedTitle, setNewRelatedTitle] = useState("");

  // If no active creator is connected, render the connect profile empty state
  if (!activeCreator) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-2">
        <ConnectProfilePrompt
          feature="actions"
          title="Connect Your Live Profile to Access Your Action Centre"
          subtitle="No active creator profile connected. Link your YouTube channel, Instagram handle, or LinkedIn profile to receive high-impact next steps, platform growth recommendations, and deal execution tasks."
        />
      </div>
    );
  }

  const notStartedCount = actions.filter((a) => (a.status || (a.completed ? "Completed" : "Not started")) === "Not started").length;
  const inProgressCount = actions.filter((a) => (a.status || (a.completed ? "Completed" : "Not started")) === "In progress").length;
  const completedCount = completedActionsCount;
  const highPriorityCount = actions.filter((a) => a.priority === "High").length;

  const progressPercent =
    totalActionsCount > 0
      ? Math.round((completedCount / totalActionsCount) * 100)
      : 0;

  const categories = ["all", "Growth", "Monetisation", "Brand Pitch", "Audience Trust"];

  const filteredActions = actions.filter((act) => {
    const actStatus: ActionStatus = act.status || (act.completed ? "Completed" : "Not started");

    // Status filter
    if (statusFilter === "not_started" && actStatus !== "Not started") return false;
    if (statusFilter === "in_progress" && actStatus !== "In progress") return false;
    if (statusFilter === "completed" && actStatus !== "Completed") return false;
    if (statusFilter === "high" && act.priority !== "High") return false;

    // Category filter
    if (categoryFilter !== "all" && act.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchTitle = act.title.toLowerCase().includes(q);
      const matchReason = act.reason.toLowerCase().includes(q);
      const matchRelated = act.relatedTitle?.toLowerCase().includes(q);
      if (!matchTitle && !matchReason && !matchRelated) return false;
    }

    return true;
  });

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const success = addAction({
      title: newTitle.trim(),
      priority: newPriority,
      category: newCategory,
      reason: newReason.trim() || `Tailored strategic execution step for ${activeCreator.name}.`,
      deadline: newDeadline,
      estimatedTime: newEstimatedTime,
      status: newStatus,
      completed: newStatus === "Completed",
      relatedType: newRelatedType !== "none" ? newRelatedType : undefined,
      relatedTitle: newRelatedTitle.trim() || undefined,
      relatedLink:
        newRelatedType === "roadmap"
          ? "/roadmap"
          : newRelatedType === "opportunity"
          ? "/opportunities"
          : newRelatedType === "monetisation"
          ? "/monetisation"
          : newRelatedType === "goal"
          ? "/profile"
          : undefined,
    });

    if (!success) {
      setIsModalOpen(false);
      setUpgradeModalOpen(true);
      return;
    }

    setNewTitle("");
    setNewReason("");
    setNewRelatedTitle("");
    setIsModalOpen(false);
  };

  const handleCycleStatus = (act: ActionItem) => {
    const current: ActionStatus = act.status || (act.completed ? "Completed" : "Not started");
    let next: ActionStatus = "In progress";
    if (current === "Not started") next = "In progress";
    else if (current === "In progress") next = "Completed";
    else if (current === "Completed") next = "Not started";

    updateActionStatus(act.id, next);
  };

  return (
    <div className="space-y-6">
      {/* Hackathon Demo Assistant */}
      <HackathonDemoBar />

      {/* Top Disclaimer */}
      <DemoDisclaimer text="Actions are prioritized dynamically based on active goals, roadmap gaps, monetisation readiness, and open brand campaigns. Status changes instantly update your execution score." />

      {/* Reusable Persona Switcher Bar */}
      <PersonaSwitcherBar subtitle="Actions, deadlines, and linked opportunities adapt in real-time to the active persona." />

      {/* Header and Add Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Action Centre & Execution Tracker
            </h2>
            <Badge variant="indigo" size="sm">
              {activeCreator.name.split(" ")[0]}&apos;s Priority Queue
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Prioritized strategic actions linked to growth roadmaps, monetisation pathways, and campaign briefs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 text-xs font-mono font-bold">
            <span>Capacity:</span>
            <span className={actions.length >= currentPlan.limits.maxActiveActions ? "text-amber-600 font-extrabold" : "text-[#0870e8]"}>
              {actions.length}/{currentPlan.limits.maxActiveActions}
            </span>
            <span className="text-xs text-slate-500 font-sans uppercase">({currentPlan.name})</span>
          </div>
          <button
            onClick={refreshAiRecommendations}
            disabled={isAiGenerating}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200/80 text-indigo-700 font-bold text-xs sm:text-sm shadow-2xs transition-all disabled:opacity-60 cursor-pointer btn-tactile"
          >
            <Sparkles className={`w-3.5 h-3.5 text-indigo-600 ${isAiGenerating ? "animate-spin" : ""}`} />
            <span>{isAiGenerating ? "Synthesizing AI Actions..." : "AI Prioritize Actions"}</span>
          </button>
          <button
            onClick={() => {
              if (actions.length >= currentPlan.limits.maxActiveActions) {
                setUpgradeModalOpen(true);
                return;
              }
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0870e8] hover:bg-[#0761c9] text-white font-bold text-sm shadow-[0_4px_14px_rgba(8,112,232,0.25)] transition-all cursor-pointer btn-tactile"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Action</span>
          </button>
        </div>
      </div>

      {/* Visual Execution Progress Banner */}
      <Card className="rounded-2xl border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <span className="text-xs sm:text-[13px] font-bold text-[#0870e8] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0870e8]" /> Real-time Execution Velocity
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {completedCount} of {totalActionsCount} Strategic Actions Completed
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {progressPercent === 100
                ? "Phenomenal execution! All prioritized actions have been completed. Check your growth roadmap for next phase milestones."
                : progressPercent >= 50
                ? "Strong execution velocity! Finish remaining high-priority tasks to unlock pipeline opportunities."
                : "Focus on pending high-priority actions to optimize your audience monetization and brand deal flow."}
            </p>

            {/* Quick Status Pill Counters */}
            <div className="flex items-center gap-2.5 pt-2 flex-wrap text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {completedCount} Completed
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80 font-bold">
                <PlayCircle className="w-3.5 h-3.5 text-[#0870e8]" />
                {inProgressCount} In Progress
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 font-bold">
                <Circle className="w-3.5 h-3.5 text-slate-400" />
                {notStartedCount} Not Started
              </span>
            </div>
          </div>

          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 min-w-[220px] text-center space-y-2 shrink-0 shadow-2xs">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Completion Velocity</span>
            <div className="text-3xl sm:text-4xl font-black text-[#0870e8] font-mono">
              {progressPercent}%
            </div>
            <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0870e8] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {totalActionsCount - completedCount} actions remaining
            </p>
          </div>
        </div>
      </Card>

      {/* Filter & Working Search Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search actions by title, strategic reason, or related briefs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/20 focus:border-[#0870e8] bg-slate-50/50"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 shrink-0">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer btn-tactile ${
                statusFilter === "all"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
              }`}
            >
              All ({actions.length})
            </button>
            <button
              onClick={() => setStatusFilter("in_progress")}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer btn-tactile ${
                statusFilter === "in_progress"
                  ? "bg-[#0870e8] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setStatusFilter("not_started")}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer btn-tactile ${
                statusFilter === "not_started"
                  ? "bg-slate-700 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
              }`}
            >
              Not Started ({notStartedCount})
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer btn-tactile ${
                statusFilter === "completed"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setStatusFilter("high")}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer btn-tactile ${
                statusFilter === "high"
                  ? "bg-rose-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
              }`}
            >
              High Priority ({highPriorityCount})
            </button>
          </div>
        </div>

        {/* Category Pills Row */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer btn-tactile ${
                  categoryFilter === cat
                    ? "bg-slate-900 text-white font-bold shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>

          {(searchQuery || statusFilter !== "all" || categoryFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
              className="text-xs sm:text-sm text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer btn-tactile"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Actions List */}
      {filteredActions.length > 0 ? (
        <div className="space-y-3.5">
          {filteredActions.map((action) => {
            const status: ActionStatus = action.status || (action.completed ? "Completed" : "Not started");
            const isCompleted = status === "Completed";
            const isInProgress = status === "In progress";

            return (
              <div
                key={action.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  isCompleted
                    ? "bg-slate-50/60 border-slate-200/70 opacity-85"
                    : isInProgress
                    ? "bg-white border-[#0870e8]/40 shadow-[0_2px_8px_rgba(8,112,232,0.08)] ring-1 ring-[#0870e8]/10"
                    : "bg-white border-slate-200/75 hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Quick Toggle Checkbox */}
                  <button
                    onClick={() => toggleAction(action.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer btn-tactile ${
                      isCompleted
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-2xs"
                        : "border-slate-300 hover:border-[#0870e8] bg-white"
                    }`}
                    title={isCompleted ? "Mark incomplete" : "Mark completed"}
                    aria-label="Toggle action completed"
                  >
                    {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  {/* Main Action Content */}
                  <div className="flex-1 min-w-0 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Priority Badge */}
                        <Badge
                          variant={
                            action.priority === "High"
                              ? "rose"
                              : action.priority === "Medium"
                              ? "amber"
                              : "slate"
                          }
                          size="sm"
                        >
                          {action.priority} Priority
                        </Badge>

                        {/* Category Badge */}
                        <Badge variant="indigo" size="sm">
                          {action.category}
                        </Badge>

                        {/* Linked Entity Pill (Roadmap / Opportunity / Monetisation) */}
                        {action.relatedTitle && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                            <span className="text-slate-400 text-xs uppercase font-bold">
                              {action.relatedType || "Linked"}:
                            </span>
                            <span className="truncate max-w-[200px] font-semibold text-slate-800">
                              {action.relatedTitle}
                            </span>
                            {action.relatedLink && (
                              <Link
                                href={action.relatedLink}
                                className="text-[#0870e8] hover:text-blue-800 ml-0.5"
                                title="Open related item"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Deadline & Time */}
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {action.estimatedTime}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">
                          Due: {action.deadline}
                        </span>
                      </div>
                    </div>

                    {/* Action Title */}
                    <h4
                      className={`text-base sm:text-lg font-bold leading-snug ${
                        isCompleted ? "line-through text-slate-400" : "text-slate-900"
                      }`}
                    >
                      {action.title}
                    </h4>

                    {/* Strategic Reason Box */}
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs sm:text-sm text-slate-700 space-y-1">
                      <span className="font-bold uppercase tracking-wider text-xs text-slate-500 block">
                        Why this matters:
                      </span>
                      <p className="leading-relaxed font-medium text-slate-700">
                        {action.reason}
                      </p>
                    </div>

                    {/* Bottom Status Controls Bar */}
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Status:
                        </span>

                        {/* Working Status Dropdown / Cycle Pill */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCycleStatus(action)}
                            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 border shadow-2xs btn-tactile cursor-pointer ${
                              status === "Completed"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                                : status === "In progress"
                                ? "bg-blue-50 text-[#0870e8] border-blue-300 hover:bg-blue-100"
                                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                            }`}
                            title="Click to cycle status: Not started -> In progress -> Completed"
                          >
                            {status === "Completed" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                            {status === "In progress" && <PlayCircle className="w-3.5 h-3.5 text-[#0870e8] animate-pulse" />}
                            {status === "Not started" && <Circle className="w-3.5 h-3.5 text-slate-400" />}
                            <span>{status}</span>
                          </button>

                          {/* Explicit Direct Select */}
                          <select
                            value={status}
                            onChange={(e) => updateActionStatus(action.id, e.target.value as ActionStatus)}
                            className="text-xs font-semibold text-slate-600 bg-transparent border-0 focus:ring-0 cursor-pointer hover:text-slate-900"
                          >
                            <option value="Not started">Not started</option>
                            <option value="In progress">In progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {action.relatedLink && (
                          <Link
                            href={action.relatedLink}
                            className="text-xs sm:text-sm font-bold text-[#0870e8] hover:text-blue-800 flex items-center gap-1 transition-colors btn-tactile"
                          >
                            <span>Open Related Brief</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <button
                          onClick={() => deleteAction(action.id)}
                          className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete action"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No actions match your filters</h3>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Try resetting your status tab, category selection, or search query to see the active creator&apos;s queue.
          </p>
          <button
            onClick={() => {
              setStatusFilter("all");
              setCategoryFilter("all");
              setSearchQuery("");
            }}
            className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors btn-tactile cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Add Custom Action Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200/80 animate-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Add Strategic Action</h3>
                <p className="text-sm text-slate-500">Log a targeted execution move for {activeCreator.name}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Action Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Follow up on brand deal proposal with sponsor team"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/20 focus:border-[#0870e8]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as "High" | "Medium" | "Low")}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0870e8]/20 focus:border-[#0870e8]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as "Growth" | "Monetisation" | "Brand Pitch" | "Audience Trust")}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0870e8]/20 focus:border-[#0870e8]"
                  >
                    <option value="Growth">Growth</option>
                    <option value="Monetisation">Monetisation</option>
                    <option value="Brand Pitch">Brand Pitch</option>
                    <option value="Audience Trust">Audience Trust</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ActionStatus)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0870e8]/20 focus:border-[#0870e8]"
                  >
                    <option value="Not started">Not started</option>
                    <option value="In progress">In progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Suggested Deadline</label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="e.g. In 2 days"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/20 focus:border-[#0870e8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Est. Time Required</label>
                  <input
                    type="text"
                    value={newEstimatedTime}
                    onChange={(e) => setNewEstimatedTime(e.target.value)}
                    placeholder="e.g. 45 mins"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0870e8]/20 focus:border-[#0870e8]"
                  />
                </div>
              </div>

              {/* Related Item Link */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Link to Related Area</label>
                  <select
                    value={newRelatedType}
                    onChange={(e) =>
                      setNewRelatedType(
                        e.target.value as "roadmap" | "opportunity" | "monetisation" | "goal" | "none"
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                  >
                    <option value="none">None (General Action)</option>
                    <option value="roadmap">Growth Roadmap</option>
                    <option value="opportunity">Brand Opportunity</option>
                    <option value="monetisation">Monetisation Pathway</option>
                    <option value="goal">Creator Goal</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Related Title / Milestone</label>
                  <input
                    type="text"
                    value={newRelatedTitle}
                    onChange={(e) => setNewRelatedTitle(e.target.value)}
                    placeholder="e.g. Phase 1 Roadmap or MyProtein"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Why this matters (Strategic Reason)</label>
                <textarea
                  rows={2}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Explain why executing this action accelerates revenue or audience retention..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#0870e8]/20 focus:border-[#0870e8]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#0870e8] hover:bg-[#0761c9] text-white font-bold text-sm shadow-2xs btn-tactile cursor-pointer"
                >
                  Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Capacity Upgrade Prompt Modal */}
      <UpgradePromptModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        limitType="actions"
        currentUsageCount={actions.length}
        resetDate={subscriptionUsage?.usageResetAt}
      />
    </div>
  );
}

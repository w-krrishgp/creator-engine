"use client";

import React, { useState } from "react";
import { useCreator } from "@/context/CreatorContext";
import { ActionItem } from "@/types/creator";
import {
  CheckSquare,
  Plus,
  Clock,
  Sparkles,
  Check,
  AlertCircle,
  Filter,
  Layers,
  ArrowRight,
  TrendingUp,
  X,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { DemoDisclaimer } from "@/components/common/DemoDisclaimer";

export default function ActionsPage() {
  const {
    activeCreator,
    actions,
    toggleAction,
    addAction,
    completedActionsCount,
    totalActionsCount,
  } = useCreator();

  // Filter & modal state
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "high">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New action form fields
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("High");
  const [newCategory, setNewCategory] = useState<"Growth" | "Monetisation" | "Brand Pitch" | "Audience Trust">("Growth");
  const [newReason, setNewReason] = useState("");
  const [newDeadline, setNewDeadline] = useState("In 3 days");
  const [newEstimatedTime, setNewEstimatedTime] = useState("30 mins");

  const progressPercent =
    totalActionsCount > 0
      ? Math.round((completedActionsCount / totalActionsCount) * 100)
      : 0;

  const filteredActions = actions.filter((act) => {
    if (filter === "pending") return !act.completed;
    if (filter === "completed") return act.completed;
    if (filter === "high") return act.priority === "High";
    return true;
  });

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addAction({
      title: newTitle.trim(),
      priority: newPriority,
      category: newCategory,
      reason: newReason.trim() || `Tailored high-impact action for ${activeCreator.name}'s audience growth.`,
      deadline: newDeadline,
      estimatedTime: newEstimatedTime,
      completed: false,
    });

    setNewTitle("");
    setNewReason("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Disclaimer */}
      <DemoDisclaimer text="Actions are dynamically weighted based on your creator stage and goals. Marking items complete updates your real-time execution score." />

      {/* Header and Progress Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Action Centre & Execution Tracker
            </h2>
            <Badge variant="indigo" size="sm">
              {activeCreator.name.split(" ")[0]}';s Queue
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Prioritised strategic next moves to maximize creator monetization and brand deal flow.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Action</span>
        </button>
      </div>

      {/* Visual Execution Progress Banner */}
      <Card className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-0 p-6 sm:p-7 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Real-time Execution Velocity
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {completedActionsCount} of {totalActionsCount} Strategic Actions Completed
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {progressPercent === 100
                ? "Phenomenal! All high-priority actions for this cycle have been executed. Ready for the next growth roadmap milestone."
                : progressPercent >= 50
                ? "Solid execution momentum! Finish your high-priority items to unlock your target pipeline revenue."
                : "Complete pending high-priority actions to optimize your sponsor conversion rate."}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 min-w-[200px] text-center space-y-2 shrink-0">
            <span className="text-xs text-slate-300 font-medium">Completion Rate</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {progressPercent}%
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        <button
          onClick={() => setFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "all"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          }`}
        >
          All Actions ({actions.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "pending"
              ? "bg-indigo-600 text-white"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          }`}
        >
          Pending ({totalActionsCount - completedActionsCount})
        </button>
        <button
          onClick={() => setFilter("high")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "high"
              ? "bg-rose-600 text-white"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          }`}
        >
          High Priority Only
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "completed"
              ? "bg-emerald-600 text-white"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          }`}
        >
          Completed ({completedActionsCount})
        </button>
      </div>

      {/* Actions List */}
      <div className="space-y-3">
        {filteredActions.map((action) => (
          <div
            key={action.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              action.completed
                ? "bg-slate-50/60 border-slate-200 opacity-60"
                : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Interactive checkbox */}
              <button
                onClick={() => toggleAction(action.id)}
                className={`mt-1 w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                  action.completed
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                    : "border-slate-300 hover:border-indigo-600 bg-white"
                }`}
                aria-label="Toggle action completed"
              >
                {action.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              {/* Action content */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
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
                    <Badge variant="purple" size="sm">
                      {action.category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Est: {action.estimatedTime}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-600">
                      Due: {action.deadline}
                    </span>
                  </div>
                </div>

                <h4
                  className={`text-sm sm:text-base font-bold leading-snug ${
                    action.completed ? "line-through text-slate-500" : "text-slate-900"
                  }`}
                >
                  {action.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-200/70">
                  <strong className="text-slate-800 font-semibold">Strategic Reason: </strong>
                  {action.reason}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Action Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Strategic Action</h3>
                <p className="text-xs text-slate-500">Log a custom growth or deal task for {activeCreator.name}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Action Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Follow up with Gymshark marketing team on pricing proposal"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as "High" | "Medium" | "Low")}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Strategic Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as "Growth" | "Monetisation" | "Brand Pitch" | "Audience Trust")}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="Brand Pitch">Brand Pitch</option>
                    <option value="Monetisation">Monetisation</option>
                    <option value="Growth">Growth</option>
                    <option value="Audience Trust">Audience Trust</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Suggested Deadline</label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="e.g. In 2 days"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Est. Time Required</label>
                  <input
                    type="text"
                    value={newEstimatedTime}
                    onChange={(e) => setNewEstimatedTime(e.target.value)}
                    placeholder="e.g. 45 mins"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Why this matters (Reason)</label>
                <textarea
                  rows={2}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Explain why taking this action improves conversion or audience retention..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  Add Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

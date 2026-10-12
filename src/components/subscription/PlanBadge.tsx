"use client";

import React from "react";
import Link from "next/link";
import { useCreator } from "@/context/CreatorContext";
import { PlanId } from "@/types/subscription";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";
import { Sparkles, Crown, Shield } from "lucide-react";

interface PlanBadgeProps {
  planId?: PlanId;
  size?: "xs" | "sm" | "md";
  showPrice?: boolean;
  linkToPricing?: boolean;
  className?: string;
}

export function PlanBadge({
  planId,
  size = "sm",
  showPrice = false,
  linkToPricing = false,
  className = "",
}: PlanBadgeProps) {
  const { currentPlanId } = useCreator();
  const targetId = planId || currentPlanId;
  const plan = SUBSCRIPTION_PLANS[targetId] || SUBSCRIPTION_PLANS.normal;

  const sizeClasses = {
    xs: "px-2 py-0.5 text-[9.5px]",
    sm: "px-2.5 py-0.5 text-[10.5px]",
    md: "px-3 py-1 text-xs",
  };

  const styleConfigs: Record<
    PlanId,
    { badgeBg: string; text: string; border: string; icon: React.ReactNode; dotColor: string }
  > = {
    normal: {
      badgeBg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-200/90",
      icon: <Shield className="w-3 h-3 text-slate-500" />,
      dotColor: "bg-slate-400",
    },
    pro: {
      badgeBg: "bg-blue-50/90",
      text: "text-[#0870e8]",
      border: "border-blue-200/90",
      icon: <Sparkles className="w-3 h-3 text-[#0870e8]" />,
      dotColor: "bg-[#0870e8]",
    },
    pro_plus: {
      badgeBg: "bg-purple-50",
      text: "text-purple-700 font-extrabold",
      border: "border-purple-200/90",
      icon: <Crown className="w-3 h-3 text-purple-600" />,
      dotColor: "bg-purple-600",
    },
  };

  const cfg = styleConfigs[targetId] || styleConfigs.normal;

  const content = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold border ${cfg.badgeBg} ${cfg.text} ${cfg.border} ${sizeClasses[size]} ${className} shadow-2xs transition-all`}
      title={`${plan.name} Plan: ${plan.priceFormatted}/mo — ${plan.tagline}`}
    >
      {cfg.icon}
      <span>{plan.name}</span>
      {showPrice && (
        <span className="opacity-75 font-normal text-[10px]">
          ({plan.priceFormatted}/mo)
        </span>
      )}
    </span>
  );

  if (linkToPricing) {
    return (
      <Link
        href="/pricing"
        className="hover:opacity-90 inline-flex transition-transform hover:scale-[1.02]"
        title="View all subscription plans"
      >
        {content}
      </Link>
    );
  }

  return content;
}

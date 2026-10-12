import React, { ReactNode } from "react";

export type BadgeVariant =
  | "blue"
  | "violet"
  | "indigo"
  | "purple"
  | "emerald"
  | "amber"
  | "rose"
  | "sky"
  | "slate"
  | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
  icon?: ReactNode;
}

export function Badge({
  children,
  variant = "slate",
  size = "md",
  className = "",
  icon,
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    blue: "bg-blue-50/90 text-[#0870e8] border-blue-200/70 font-semibold",
    violet: "bg-violet-50/90 text-violet-700 border-violet-200/70 font-semibold",
    indigo: "bg-indigo-50/90 text-indigo-700 border-indigo-200/70 font-semibold",
    purple: "bg-purple-50/90 text-purple-700 border-purple-200/70 font-semibold",
    emerald: "bg-emerald-50/90 text-emerald-700 border-emerald-200/70 font-semibold",
    amber: "bg-amber-50/90 text-amber-800 border-amber-200/70 font-semibold",
    rose: "bg-rose-50/90 text-rose-700 border-rose-200/70 font-semibold",
    sky: "bg-sky-50/90 text-sky-700 border-sky-200/70 font-semibold",
    slate: "bg-slate-100 text-slate-700 border-slate-200/80 font-medium",
    outline: "bg-white/80 text-slate-600 border-slate-200 font-medium",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[10.5px] leading-tight",
    md: "px-3 py-1 text-xs leading-tight",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
}

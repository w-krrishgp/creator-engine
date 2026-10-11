import React, { ReactNode } from "react";

export type BadgeVariant =
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
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    purple: "bg-purple-50 text-purple-700 border-purple-200/80",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    amber: "bg-amber-50 text-amber-800 border-amber-200/80",
    rose: "bg-rose-50 text-rose-700 border-rose-200/80",
    sky: "bg-sky-50 text-sky-700 border-sky-200/80",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    outline: "bg-transparent text-slate-600 border-slate-300",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-tight ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

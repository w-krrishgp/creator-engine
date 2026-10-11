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
    blue: "bg-blue-50/90 text-blue-700 border-blue-200/90 font-semibold",
    violet: "bg-violet-50/90 text-violet-700 border-violet-200/90 font-semibold",
    indigo: "bg-blue-50/90 text-blue-700 border-blue-200/90 font-semibold", // maps to electric blue
    purple: "bg-violet-50/90 text-violet-700 border-violet-200/90 font-semibold", // maps to restrained violet
    emerald: "bg-emerald-50/90 text-emerald-700 border-emerald-200/90 font-semibold",
    amber: "bg-amber-50/90 text-amber-800 border-amber-200/90 font-semibold",
    rose: "bg-rose-50/90 text-rose-700 border-rose-200/90 font-semibold",
    sky: "bg-sky-50/90 text-sky-700 border-sky-200/90 font-semibold",
    slate: "bg-slate-100 text-slate-700 border-slate-200/90 font-medium",
    outline: "bg-transparent text-slate-600 border-slate-300 font-medium",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] tracking-tight",
    md: "px-2.5 py-0.5 text-xs tracking-tight",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

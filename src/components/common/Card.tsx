import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({
  children,
  className = "",
  onClick,
  hoverable = false,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/75 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] transition-all duration-200 ${
        hoverable
          ? "hover:border-slate-300 hover:shadow-[0_4px_14px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 cursor-pointer active:scale-[0.99]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-5 py-3.5 bg-slate-50/50 rounded-b-2xl border-t border-slate-100 ${className}`}>
      {children}
    </div>
  );
}

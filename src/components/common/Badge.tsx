import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "sm",
  className = "",
}) => {
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
  };

  const variantStyles = {
    primary: "bg-[#ECFDF5] text-[#008A64] border border-[#008A64]/30",
    secondary: "bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    neutral: "bg-slate-50 text-slate-600 border border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-lg tracking-tight ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

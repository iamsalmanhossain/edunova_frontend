"use client";

import React from "react";
import { CheckCircle2, XCircle, Clock, AlertTriangle, ShieldCheck } from "lucide-react";

export type StatusVariant =
  | "approved"
  | "pending"
  | "rejected"
  | "present"
  | "absent"
  | "late"
  | "active"
  | "inactive";

interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

export default function StatusBadge({
  status,
  label,
  size = "md",
  showIcon = true,
  className = "",
}: StatusBadgeProps) {
  const normalized = (status || "").toLowerCase();

  let bg = "bg-gray-50";
  let text = "text-gray-700";
  let border = "border-gray-200";
  let Icon = AlertTriangle;
  let defaultLabel = status;

  switch (normalized) {
    case "approved":
    case "active":
      bg = "bg-emerald-50";
      text = "text-emerald-700";
      border = "border-emerald-200";
      Icon = ShieldCheck;
      defaultLabel = "Active";
      break;
    case "present":
      bg = "bg-emerald-50";
      text = "text-emerald-800";
      border = "border-emerald-200";
      Icon = CheckCircle2;
      defaultLabel = "Present";
      break;
    case "absent":
    case "rejected":
    case "inactive":
      bg = "bg-red-50";
      text = "text-red-700";
      border = "border-red-200";
      Icon = XCircle;
      defaultLabel = normalized === "absent" ? "Absent" : "Inactive";
      break;
    case "pending":
    case "late":
      bg = "bg-amber-50";
      text = "text-amber-800";
      border = "border-amber-200";
      Icon = Clock;
      defaultLabel = normalized === "late" ? "Late" : "Pending";
      break;
  }

  const sizeClasses =
    size === "sm"
      ? "px-1.5 py-0.5 text-[10px] gap-1"
      : "px-2 py-0.5 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md border ${bg} ${text} ${border} ${sizeClasses} ${className}`}
    >
      {showIcon && <Icon className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />}
      <span>{label || defaultLabel}</span>
    </span>
  );
}

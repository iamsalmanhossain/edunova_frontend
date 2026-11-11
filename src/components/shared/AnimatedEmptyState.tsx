"use client";

import React from "react";
import { FolderSearch, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnimatedEmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function AnimatedEmptyState({
  title,
  description,
  icon: Icon = FolderSearch,
  actionLabel,
  onAction,
  className = "",
}: AnimatedEmptyStateProps) {
  return (
    <div
      className={`p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[#dce3df] bg-[#fcfdfc] flex flex-col items-center justify-center animate-in fade-in duration-200 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0a4b32] flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-[#0a4b32]" />
      </div>
      <h3 className="text-sm sm:text-base font-bold text-[#0f1f17]">{title}</h3>
      <p className="text-xs text-[#5a6b62] mt-1 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          type="button"
          onClick={onAction}
          className="mt-4 bg-[#0a4b32] hover:bg-[#073825] text-white text-xs font-semibold rounded-xl h-8.5 px-4 cursor-pointer"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

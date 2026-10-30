import React from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title = "No records found",
  description = "There is currently no information available in this section.",
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[#dce3df] bg-[#fcfdfc]",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-[#f0f7f3] text-[#0a4b32] flex items-center justify-center mb-4">
        <FolderOpen className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-[#0f1f17]">{title}</h3>
      <p className="mt-1 text-sm text-[#5a6b62] max-w-sm">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 text-sm font-medium text-[#0a4b32] bg-[#f0f7f3] hover:bg-[#e2efe8] rounded-md transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}


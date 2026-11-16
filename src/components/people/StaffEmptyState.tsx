"use client";

import React from "react";
import { Users, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaffEmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
  resetLabel?: string;
}

export default function StaffEmptyState({
  title = "No Staff Members Found",
  message = "No institutional staff members match the selected department, shift, or search criteria.",
  onReset,
  resetLabel = "Reset Filters",
}: StaffEmptyStateProps) {
  return (
    <div className="text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-gray-300 max-w-xl mx-auto shadow-xs my-6">
      <div className="w-14 h-14 rounded-2xl bg-[#f0f7f3] text-[#0a4b32] flex items-center justify-center mx-auto mb-4 border border-[#d2e2d6]">
        <Users className="w-7 h-7" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-[#0f1f17]">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-md mx-auto leading-relaxed">
        {message}
      </p>

      {onReset && (
        <div className="mt-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="inline-flex items-center gap-2 border-[#0a4b32]/30 text-[#0a4b32] hover:bg-[#0a4b32]/10 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{resetLabel}</span>
          </Button>
        </div>
      )}
    </div>
  );
}


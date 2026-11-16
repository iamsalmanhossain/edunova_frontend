"use client";

import React from "react";
import { Users, Building2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export type StaffDirectoryView = "ALL" | "DEPARTMENT" | "OTHER";

interface StaffViewSwitcherProps {
  currentView: StaffDirectoryView;
  onViewChange: (view: StaffDirectoryView) => void;
  counts?: {
    all?: number;
    department?: number;
    other?: number;
  };
}

export default function StaffViewSwitcher({
  currentView,
  onViewChange,
  counts,
}: StaffViewSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-1.5 bg-[#f2f7f4] border border-[#d6e3db] rounded-2xl w-fit mx-auto shadow-xs">
      {/* 1. All Staff Button (Default View) */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => onViewChange("ALL")}
        className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
          currentView === "ALL"
            ? "bg-[#0a4b32] text-white shadow-md hover:bg-[#0a4b32]/90 hover:text-white"
            : "text-gray-700 hover:text-gray-900 hover:bg-white/80"
        }`}
      >
        <Users className="w-4 h-4 shrink-0" />
        <span>All Staff</span>
        {typeof counts?.all === "number" && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ml-0.5 transition-colors ${
              currentView === "ALL"
                ? "bg-white/20 text-white"
                : "bg-gray-200/80 text-gray-700"
            }`}
          >
            {counts.all}
          </span>
        )}
      </Button>

      {/* 2. Department-wise View Button */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => onViewChange("DEPARTMENT")}
        className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
          currentView === "DEPARTMENT"
            ? "bg-[#0a4b32] text-white shadow-md hover:bg-[#0a4b32]/90 hover:text-white"
            : "text-gray-700 hover:text-gray-900 hover:bg-white/80"
        }`}
      >
        <Building2 className="w-4 h-4 shrink-0" />
        <span>Department-wise View</span>
        {typeof counts?.department === "number" && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ml-0.5 transition-colors ${
              currentView === "DEPARTMENT"
                ? "bg-white/20 text-white"
                : "bg-gray-200/80 text-gray-700"
            }`}
          >
            {counts.department}
          </span>
        )}
      </Button>

      {/* 3. Other Staff Members Button */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => onViewChange("OTHER")}
        className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
          currentView === "OTHER"
            ? "bg-[#0a4b32] text-white shadow-md hover:bg-[#0a4b32]/90 hover:text-white"
            : "text-gray-700 hover:text-gray-900 hover:bg-white/80"
        }`}
      >
        <UserCheck className="w-4 h-4 shrink-0" />
        <span>Other Staff Members</span>
        {typeof counts?.other === "number" && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ml-0.5 transition-colors ${
              currentView === "OTHER"
                ? "bg-white/20 text-white"
                : "bg-gray-200/80 text-gray-700"
            }`}
          >
            {counts.other}
          </span>
        )}
      </Button>
    </div>
  );
}

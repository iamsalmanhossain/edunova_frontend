"use client";

import React from "react";
import { Search, X } from "lucide-react";

export const FACILITY_CATEGORIES = [
  { id: "ALL", label: "All Facilities" },
  { id: "LABORATORY", label: "Laboratories" },
  { id: "WORKSHOP", label: "Workshops" },
  { id: "LIBRARY", label: "Central Library" },
  { id: "HOSTEL", label: "Hostels & Campus" },
  { id: "TECHNOLOGY", label: "Technology & IT" },
];

interface FacilitiesFilterBarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filteredCount: number;
}

export default function FacilitiesFilterBar({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  filteredCount,
}: FacilitiesFilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a9a90] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search facility by name, equipment, or category..."
            className="w-full h-11 pl-10 pr-9 rounded-xl border border-[#d2ddd6] bg-white text-sm text-[#0f1f17] placeholder:text-[#8a9a90] focus:outline-none focus:ring-2 focus:ring-[#0a4b32]/25 focus:border-[#0a4b32] transition shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#8a9a90] hover:text-[#0f1f17] hover:bg-black/5"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Count Badge */}
        <div className="text-xs text-[#5a6b62] font-medium self-end sm:self-center">
          Showing <span className="font-bold text-[#0a4b32]">{filteredCount}</span> facilities
        </div>
      </div>

      {/* Category Pills (Touch friendly, overflow-x-auto) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {FACILITY_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 select-none ${
                isActive
                  ? "bg-[#0a4b32] text-white shadow-xs"
                  : "bg-white text-[#47574e] border border-[#d2ddd6] hover:bg-emerald-50/50 hover:text-[#0a4b32] hover:border-emerald-200"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

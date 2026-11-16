"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StaffDirectoryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  visibleCount: number;
  totalCount: number;
  placeholder?: string;
}

export default function StaffDirectoryHeader({
  searchQuery,
  onSearchChange,
  visibleCount,
  totalCount,
  placeholder = "Search by name, designation, department, email...",
}: StaffDirectoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#e2e8e4] shadow-xs">
      {/* Search Input Box */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-9 bg-[#fbfdfb] border-[#d7e2da] focus:border-[#0a4b32] focus:ring-[#0a4b32] text-xs sm:text-sm h-10 rounded-xl"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Counter summary */}
      <div className="text-xs text-gray-500 font-medium px-1 flex items-center justify-between sm:justify-end gap-2">
        <span>
          Showing <strong className="text-gray-900 font-bold">{visibleCount}</strong> of{" "}
          <strong className="text-gray-700">{totalCount}</strong> personnel
        </span>
        {searchQuery && (
          <span className="inline-block max-w-[150px] truncate text-[#0a4b32] font-semibold bg-[#eef4f0] px-2 py-0.5 rounded-md border border-[#d2e2d6]">
            &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>
    </div>
  );
}

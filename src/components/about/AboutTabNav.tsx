"use client";

import React from "react";
import { BookOpen, Layers, History, Image as ImageIcon } from "lucide-react";

export type AboutTabKey = "charter" | "departments" | "history" | "gallery";

interface AboutTabNavProps {
  activeTab: AboutTabKey;
  onTabChange: (tab: AboutTabKey) => void;
  hasHistory: boolean;
  galleryCount: number;
}

export default function AboutTabNav({
  activeTab,
  onTabChange,
  hasHistory,
  galleryCount,
}: AboutTabNavProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[#e2e8e4] pb-2 overflow-x-auto no-scrollbar scroll-smooth">
      <button
        type="button"
        onClick={() => onTabChange("charter")}
        className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
          activeTab === "charter"
            ? "bg-[#0a4b32] text-white shadow-xs"
            : "bg-gray-100/90 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>Academic Charter</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("departments")}
        className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
          activeTab === "departments"
            ? "bg-[#0a4b32] text-white shadow-xs"
            : "bg-gray-100/90 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>4 Departments</span>
      </button>

      {hasHistory && (
        <button
          type="button"
          onClick={() => onTabChange("history")}
          className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "history"
              ? "bg-[#0a4b32] text-white shadow-xs"
              : "bg-gray-100/90 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Legacy &amp; History</span>
        </button>
      )}

      {galleryCount > 0 && (
        <button
          type="button"
          onClick={() => onTabChange("gallery")}
          className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "gallery"
              ? "bg-[#0a4b32] text-white shadow-xs"
              : "bg-gray-100/90 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Gallery ({galleryCount})</span>
        </button>
      )}
    </div>
  );
}

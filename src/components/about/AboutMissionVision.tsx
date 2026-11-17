"use client";

import React from "react";
import { Compass, Sparkles } from "lucide-react";

interface AboutMissionVisionProps {
  mission?: string | null;
  vision?: string | null;
}

export default function AboutMissionVision({
  mission,
  vision,
}: AboutMissionVisionProps) {
  if (!mission && !vision) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {mission && (
        <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-white border border-emerald-200/80 shadow-xs space-y-2.5 sm:space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#0a4b32] text-white flex items-center justify-center shadow-xs">
            <Compass className="w-5 h-5 text-emerald-200" />
          </div>
          <h3 className="text-base sm:text-xl font-bold text-[#0f1f17]">
            Our Institutional Mission
          </h3>
          <p className="text-xs sm:text-sm text-[#47554f] leading-relaxed">
            {mission}
          </p>
        </div>
      )}

      {vision && (
        <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-white border border-amber-200/80 shadow-xs space-y-2.5 sm:space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <h3 className="text-base sm:text-xl font-bold text-[#0f1f17]">
            Our Institutional Vision
          </h3>
          <p className="text-xs sm:text-sm text-[#47554f] leading-relaxed">
            {vision}
          </p>
        </div>
      )}
    </div>
  );
}

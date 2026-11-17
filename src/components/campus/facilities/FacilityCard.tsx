"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Cpu, CheckCircle2 } from "lucide-react";
import { CampusFacility } from "@/types/campus";

interface FacilityCardProps {
  facility: CampusFacility;
  onViewDetails: (facility: CampusFacility) => void;
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  LABORATORY:
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
  WORKSHOP:
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
  LIBRARY:
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop",
  HOSTEL:
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop",
  TECHNOLOGY:
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
};

export default function FacilityCard({ facility, onViewDetails }: FacilityCardProps) {
  const fallbackImg =
    CATEGORY_FALLBACK_IMAGES[facility.category?.toUpperCase()] ||
    CATEGORY_FALLBACK_IMAGES.LABORATORY;

  const [imgSrc, setImgSrc] = useState<string>(facility.imageUrl || fallbackImg);

  return (
    <div className="group flex flex-col rounded-2xl bg-white border border-[#e2e8e4] hover:border-[#0a4b32]/35 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Thumbnail Area */}
      <div
        className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900 cursor-pointer select-none"
        onClick={() => onViewDetails(facility)}
      >
        <Image
          src={imgSrc}
          alt={facility.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          onError={() => setImgSrc(fallbackImg)}
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          {/* Category Pill */}
          <span className="px-3 py-1 rounded-full bg-white/95 text-[#0a4b32] text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs border border-white/40">
            {facility.category}
          </span>

          {/* Operational Shift Pill */}
          <span className="px-2.5 py-1 rounded-full bg-black/60 text-emerald-300 text-[10px] font-semibold backdrop-blur-md border border-white/20">
            Dual Shifts
          </span>
        </div>

        {/* Bottom subtle title hint on hover */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/90 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Lab Specs</span>
          </span>
          <span className="text-[11px] text-white/80">Click to explore</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <h3
            onClick={() => onViewDetails(facility)}
            className="text-base sm:text-lg font-bold text-[#0f1f17] group-hover:text-[#0a4b32] transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {facility.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#5a6b62] line-clamp-2 leading-relaxed font-normal">
            {facility.description}
          </p>

          {/* Modern Compact Feature Badges */}
          {facility.features && facility.features.length > 0 && (
            <div className="pt-1.5 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {facility.features.slice(0, 3).map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-100 text-[#1e4634] text-[11px] font-medium leading-none"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate max-w-[200px]">{feat}</span>
                  </span>
                ))}
              </div>

              {facility.features.length > 3 && (
                <div className="text-[11px] font-semibold text-[#0a4b32] pl-0.5">
                  +{facility.features.length - 3} additional equipment specifications
                </div>
              )}
            </div>
          )}
        </div>

        {/* Clean Single Action CTA */}
        <div className="pt-3 border-t border-[#f0f4f1]">
          <button
            onClick={() => onViewDetails(facility)}
            className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-emerald-50/70 hover:bg-[#0a4b32] text-[#0a4b32] hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 group/btn shadow-2xs"
          >
            <span>View Technical Specifications</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, ArrowRight, Edit, Trash2 } from "lucide-react";
import { CampusFacility } from "@/types/campus";
import { Button } from "@/components/ui/button";

interface FacilityCardProps {
  facility: CampusFacility;
  onViewDetails: (facility: CampusFacility) => void;
  isAdmin?: boolean;
  onEdit?: (facility: CampusFacility) => void;
  onDelete?: (facility: CampusFacility) => void;
}

export default function FacilityCard({
  facility,
  onViewDetails,
  isAdmin,
  onEdit,
  onDelete,
}: FacilityCardProps) {
  const displayImage =
    facility.imageUrl ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="group flex flex-col rounded-2xl bg-white border border-[#e2e8e4] overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
      {/* Thumbnail */}
      <div
        className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => onViewDetails(facility)}
      >
        <Image
          src={displayImage}
          alt={facility.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wider border border-white/20">
            {facility.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <h3
            onClick={() => onViewDetails(facility)}
            className="text-lg font-bold text-[#0f1f17] group-hover:text-[#0a4b32] transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {facility.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#5a6b62] line-clamp-2 leading-relaxed">
            {facility.description}
          </p>

          {/* Feature Pills */}
          {facility.features && facility.features.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {facility.features.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#2c3d33]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
              {facility.features.length > 3 && (
                <span className="text-[11px] font-semibold text-[#0a4b32] pl-5.5 inline-block">
                  +{facility.features.length - 3} more technical specs
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-[#f0f4f1] space-y-2.5">
          <button
            onClick={() => onViewDetails(facility)}
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-emerald-50/60 hover:bg-[#0a4b32] text-[#0a4b32] hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 group/btn"
          >
            <span>Technical Specifications</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(facility)}
                className="flex-1 h-8 text-xs font-medium border-[#cbe0d4] text-[#0a4b32] hover:bg-emerald-50 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Facility</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete?.(facility)}
                className="h-8 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 rounded-lg"
                title="Delete Facility"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

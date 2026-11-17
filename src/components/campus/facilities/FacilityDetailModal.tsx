"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, CheckCircle2, ShieldCheck, Cpu } from "lucide-react";
import { CampusFacility } from "@/types/campus";
import { Button } from "@/components/ui/button";

interface FacilityDetailModalProps {
  facility: CampusFacility | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FacilityDetailModal({
  facility,
  isOpen,
  onClose,
}: FacilityDetailModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !facility) return null;

  const displayImage =
    facility.imageUrl ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#d2ddd6] overflow-hidden my-8">
        {/* Modal Hero Image */}
        <div className="relative h-60 sm:h-72 w-full bg-slate-900">
          <Image
            src={displayImage}
            alt={facility.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Category on Image */}
          <div className="absolute bottom-4 left-5 right-5 space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              {facility.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {facility.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Detailed Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0a4b32]">
              Facility Overview & Scope
            </h3>
            <p className="text-sm text-[#47574e] leading-relaxed">
              {facility.description}
            </p>
          </div>

          {/* Technical Specifications & Features */}
          {facility.features && facility.features.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-[#e2e8e4]">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0a4b32]">
                  Equipped Tooling & Technical Specifications
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {facility.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f7faf8] border border-emerald-100/80 text-xs sm:text-sm text-[#1c2e24]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Institutional Compliance Card */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">BTEB Curriculum & Dual-Shift Practical Standards</span>
              <p className="text-emerald-800/80 leading-normal">
                This facility operates in compliance with Bangladesh Technical Education Board guidelines, offering structured lab schedules across 1st and 2nd academic shifts.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-[#e2e8e4] bg-[#f9fbf9]">
          <Button
            onClick={onClose}
            className="text-xs h-9 px-5 bg-[#0a4b32] hover:bg-[#073624] text-white rounded-xl"
          >
            Close Details
          </Button>
        </div>
      </div>
    </div>
  );
}

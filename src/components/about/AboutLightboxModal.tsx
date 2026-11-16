"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface AboutLightboxModalProps {
  imageUrl: string | null;
  onClose: () => void;
  instituteTitle?: string;
}

export default function AboutLightboxModal({
  imageUrl,
  onClose,
  instituteTitle,
}: AboutLightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (imageUrl) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full max-h-[92vh] bg-[#0c1611] rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3 sm:p-3.5 bg-black/50 border-b border-white/10 text-white text-xs">
          <span className="font-semibold text-emerald-300 truncate">
            {instituteTitle || "Kishoreganj Polytechnic Institute"} • Campus Facility View
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors ml-2 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Image Frame */}
        <div className="relative w-full h-[60vh] sm:h-[70vh] bg-black">
          <Image
            src={imageUrl}
            alt="Enlarged Campus Facility View"
            fill
            unoptimized
            sizes="100vw"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

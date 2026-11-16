"use client";

import React from "react";
import Image from "next/image";
import { Award } from "lucide-react";

interface AboutFeaturedBannerProps {
  title: string;
  instituteName?: string;
  bannerSrc: string;
  onBannerError: () => void;
}

export default function AboutFeaturedBanner({
  title,
  instituteName,
  bannerSrc,
  onBannerError,
}: AboutFeaturedBannerProps) {
  return (
    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-[#e2e8e4] bg-[#e6ede8] group">
      <div className="relative h-56 sm:h-80 lg:h-[420px] w-full">
        <Image
          src={bannerSrc}
          alt={title}
          fill
          priority
          unoptimized
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
          onError={onBannerError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

        {/* Bottom Floating Info Badge */}
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/60 shadow-lg max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#0a4b32] text-white flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-[#ecdcb9]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0a4b32] truncate">
                Academic Campus &amp; Labs
              </p>
              <p className="text-[10px] sm:text-xs text-[#5a6b62] truncate">
                {instituteName || "Kishoreganj Polytechnic Institute"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, CheckCircle2, ArrowUpRight } from "lucide-react";
import { CampusLife } from "@/types/campus";

interface CampusLifeCardProps {
  item: CampusLife;
}

const DEFAULT_CLUB_COVER =
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop";

export default function CampusLifeCard({ item }: CampusLifeCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(item.imageUrl || DEFAULT_CLUB_COVER);

  return (
    <div className="group flex flex-col rounded-2xl bg-white border border-[#e2e8e4] hover:border-[#0a4b32]/35 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900 select-none">
        <Image
          src={imgSrc}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          onError={() => setImgSrc(DEFAULT_CLUB_COVER)}
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Category Pill */}
        <div className="absolute top-3.5 left-3.5">
          <span className="px-3 py-1 rounded-full bg-white/95 text-[#0a4b32] text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs border border-white/40">
            {item.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-[#0f1f17] group-hover:text-[#0a4b32] transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#5a6b62] line-clamp-3 leading-relaxed font-normal">
            {item.description}
          </p>

          {/* Activities Checklist */}
          {item.activities && item.activities.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0a4b32]">
                Key Initiatives & Activities:
              </span>
              <div className="space-y-1">
                {item.activities.map((act, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#2c3d33]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{act}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Contact Action */}
        <div className="pt-3 border-t border-[#f0f4f1]">
          {item.contactEmail ? (
            <a
              href={`mailto:${item.contactEmail}`}
              className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-emerald-50/70 hover:bg-[#0a4b32] text-[#0a4b32] hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 group/btn shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 group-hover/btn:text-white" />
                <span>Contact Club Committee</span>
              </div>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          ) : (
            <div className="text-xs text-[#8a9a90] italic py-2">
              Registration opens each semester
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

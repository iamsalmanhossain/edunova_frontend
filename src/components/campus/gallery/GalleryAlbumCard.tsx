"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, Camera, ArrowRight } from "lucide-react";
import { CampusGallery } from "@/types/campus";

interface GalleryAlbumCardProps {
  album: CampusGallery;
  onExplore: (album: CampusGallery) => void;
}

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop";

export default function GalleryAlbumCard({ album, onExplore }: GalleryAlbumCardProps) {
  const photoCount = (album.images?.length || 0) + (album.coverImage ? 1 : 0);
  const initialCover = album.coverImage || album.images?.[0]?.url || DEFAULT_COVER;
  const [coverUrl, setCoverUrl] = useState<string>(initialCover);

  const formattedDate = album.eventDate
    ? new Date(album.eventDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="group flex flex-col rounded-2xl bg-white border border-[#e2e8e4] hover:border-[#0a4b32]/35 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Cover Image Container */}
      <div
        className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900 cursor-pointer select-none"
        onClick={() => onExplore(album)}
      >
        <Image
          src={coverUrl}
          alt={album.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          onError={() => setCoverUrl(DEFAULT_COVER)}
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          {/* Category Pill */}
          <span className="px-3 py-1 rounded-full bg-white/95 text-[#0a4b32] text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs border border-white/40">
            {album.category || "CAMPUS"}
          </span>

          {/* Photo Count Pill */}
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-bold shadow-xs backdrop-blur-md border border-white/20">
            <Camera className="w-3.5 h-3.5 text-emerald-300" />
            <span>{photoCount} Photos</span>
          </span>
        </div>

        {/* Bottom Date Pill on image */}
        {formattedDate && (
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white/90 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-300" />
            <span>{formattedDate}</span>
          </div>
        )}
      </div>

      {/* Album Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3
            onClick={() => onExplore(album)}
            className="text-base sm:text-lg font-bold text-[#0f1f17] group-hover:text-[#0a4b32] transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {album.title}
          </h3>

          {album.description && (
            <p className="text-xs sm:text-sm text-[#5a6b62] line-clamp-2 leading-relaxed font-normal">
              {album.description}
            </p>
          )}
        </div>

        {/* Explore Button */}
        <div className="pt-3 border-t border-[#f0f4f1]">
          <button
            onClick={() => onExplore(album)}
            className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-emerald-50/70 hover:bg-[#0a4b32] text-[#0a4b32] hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 group/btn shadow-2xs"
          >
            <span>Explore Photo Album</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Maximize2, Calendar, Camera } from "lucide-react";
import { FlatGalleryPhoto } from "@/types/campus";

interface GalleryPhotoCardProps {
  photo: FlatGalleryPhoto;
  index: number;
  onClick: (photo: FlatGalleryPhoto, index: number) => void;
}

const DEFAULT_FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop";

export default function GalleryPhotoCard({
  photo,
  index,
  onClick,
}: GalleryPhotoCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(photo.url || DEFAULT_FALLBACK_PHOTO);

  // Dynamic asymmetric rhythm ("akta coto akta boro eye catching"):
  // Cycle of 8:
  // 0: Large (2x2)
  // 1, 2: Standard (1x1)
  // 3: Tall (1x2)
  // 4: Wide (2x1)
  // 5, 6, 7: Standard (1x1)
  const patternIndex = index % 8;
  const isLarge = patternIndex === 0;
  const isTall = patternIndex === 3;
  const isWide = patternIndex === 4;

  const sizeClasses = isLarge
    ? "sm:col-span-2 sm:row-span-2 min-h-[380px] sm:min-h-[500px]"
    : isTall
    ? "col-span-1 sm:row-span-2 min-h-[320px] sm:min-h-[500px]"
    : isWide
    ? "sm:col-span-2 col-span-1 min-h-[220px] sm:min-h-[250px]"
    : "col-span-1 row-span-1 min-h-[220px] sm:min-h-[250px]";

  const formattedDate = photo.eventDate
    ? new Date(photo.eventDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div
      onClick={() => onClick(photo, index)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-[#e2e8e4]/80 hover:border-[#0a4b32]/40 shadow-xs hover:shadow-2xl transition-all duration-300 select-none ${sizeClasses}`}
    >
      {/* Background High-Res Image */}
      <Image
        src={imgSrc}
        alt={photo.caption || photo.title || "Campus Life Photo"}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        onError={() => setImgSrc(DEFAULT_FALLBACK_PHOTO)}
      />

      {/* Subtle Permanent Dark Gradient at Bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300" />

      {/* Top Left: Category Badge */}
      <div className="absolute top-3.5 left-3.5 z-10">
        <span className="px-3 py-1 rounded-full bg-black/60 text-white text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs border border-white/25">
          {photo.category || "CAMPUS"}
        </span>
      </div>

      {/* Top Right: Expand / Lightbox Button */}
      <div className="absolute top-3.5 right-3.5 z-10 opacity-80 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-white/90 text-[#0a4b32] flex items-center justify-center shadow-md backdrop-blur-xs group-hover:scale-110 group-hover:bg-[#0a4b32] group-hover:text-white transition-all">
          <Maximize2 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 space-y-1.5 text-white">
        {isLarge && (
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>Featured Institutional Snapshot</span>
          </div>
        )}

        <h3
          className={`font-bold leading-snug line-clamp-2 text-white group-hover:text-emerald-300 transition-colors ${
            isLarge
              ? "text-lg sm:text-xl"
              : isTall
              ? "text-base sm:text-lg"
              : "text-sm sm:text-base"
          }`}
        >
          {photo.caption || photo.title || photo.albumTitle}
        </h3>

        {photo.caption && photo.title && photo.caption !== photo.title && (
          <p className="text-xs text-white/80 line-clamp-1 font-light">
            {photo.albumTitle}
          </p>
        )}

        {formattedDate && (
          <div className="flex items-center gap-1.5 text-[11px] text-white/70 pt-0.5">
            <Calendar className="w-3 h-3 text-emerald-400" />
            <span>{formattedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Camera, ArrowRight, PlusCircle, Trash2 } from "lucide-react";
import { CampusGallery } from "@/types/campus";
import { Button } from "@/components/ui/button";

interface GalleryAlbumCardProps {
  album: CampusGallery;
  onExplore: (album: CampusGallery) => void;
  isAdmin?: boolean;
  onAddPhotos?: (album: CampusGallery) => void;
  onDeleteAlbum?: (album: CampusGallery) => void;
}

export default function GalleryAlbumCard({
  album,
  onExplore,
  isAdmin,
  onAddPhotos,
  onDeleteAlbum,
}: GalleryAlbumCardProps) {
  const photoCount = (album.images?.length || 0) + (album.coverImage ? 1 : 0);
  const displayCover =
    album.coverImage ||
    album.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop";

  const formattedDate = album.eventDate
    ? new Date(album.eventDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="group flex flex-col rounded-2xl bg-white border border-[#e2e8e4] overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
      {/* Cover Image Container */}
      <div
        className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => onExplore(album)}
      >
        <Image
          src={displayCover}
          alt={album.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          {/* Category Pill */}
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wider border border-white/20">
            {album.category || "CAMPUS"}
          </span>

          {/* Photo Count Pill */}
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0a4b32] text-xs font-bold shadow-xs">
            <Camera className="w-3.5 h-3.5" />
            <span>{photoCount} Photos</span>
          </span>
        </div>

        {/* Bottom Date Pill on image */}
        {formattedDate && (
          <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-white/90 text-xs font-medium">
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
            className="text-lg font-bold text-[#0f1f17] group-hover:text-[#0a4b32] transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {album.title}
          </h3>

          {album.description && (
            <p className="text-xs sm:text-sm text-[#5a6b62] line-clamp-2 leading-relaxed">
              {album.description}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-[#f0f4f1] space-y-2.5">
          <button
            onClick={() => onExplore(album)}
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-emerald-50/60 hover:bg-[#0a4b32] text-[#0a4b32] hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 group/btn"
          >
            <span>Explore Album</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>

          {/* Admin Quick Controls */}
          {isAdmin && (
            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddPhotos?.(album)}
                className="flex-1 h-8 text-xs font-medium border-[#cbe0d4] text-[#0a4b32] hover:bg-emerald-50 rounded-lg flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Photos</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteAlbum?.(album)}
                className="h-8 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 rounded-lg"
                title="Delete Album"
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

"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Calendar,
  Trash2,
} from "lucide-react";
import { CampusGallery, FlatGalleryPhoto } from "@/types/campus";
import { appConfirm } from "@/store/useConfirmStore";
import { useToastStore } from "@/store/useToastStore";
import { campusService } from "@/services/campus.service";

interface GalleryLightboxModalProps {
  album?: CampusGallery | null;
  photos?: FlatGalleryPhoto[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onImageDeleted?: (albumId: string, imageId: string) => void;
}

export default function GalleryLightboxModal({
  album,
  photos,
  initialIndex = 0,
  isOpen,
  onClose,
  isAdmin,
  onImageDeleted,
}: GalleryLightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const toast = useToastStore();

  // Combine either photos array or album into a unified list
  const allImages: Array<{
    id: string;
    url: string;
    caption?: string;
    title?: string;
    date?: string | null;
    isCover?: boolean;
  }> = React.useMemo(() => {
    if (photos && photos.length > 0) {
      return photos.map((p) => ({
        id: p.id,
        url: p.url,
        caption: p.caption || p.title || p.albumTitle,
        title: p.title || p.albumTitle,
        date: p.eventDate,
        isCover: false,
      }));
    }

    if (!album) return [];
    const list: Array<{
      id: string;
      url: string;
      caption?: string;
      title?: string;
      date?: string | null;
      isCover?: boolean;
    }> = [];
    if (album.coverImage) {
      list.push({
        id: "cover-img",
        url: album.coverImage,
        caption: album.title + " (Cover)",
        title: album.title,
        date: album.eventDate,
        isCover: true,
      });
    }
    if (album.images && album.images.length > 0) {
      album.images.forEach((img) => {
        if (img.url !== album.coverImage) {
          list.push({
            id: img.id,
            url: img.url,
            caption: img.caption,
            title: album.title,
            date: album.eventDate,
            isCover: false,
          });
        }
      });
    }
    return list;
  }, [photos, album]);

  // Synchronize index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoomLevel(1);
    }
  }, [isOpen, initialIndex, album, photos]);

  const handleNext = useCallback(() => {
    if (allImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
    setZoomLevel(1);
  }, [allImages.length]);

  const handlePrev = useCallback(() => {
    if (allImages.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setZoomLevel(1);
  }, [allImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || allImages.length === 0) return null;

  const currentItem = allImages[currentIndex] || allImages[0];

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.3, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.3, 1));
  };

  const handleDownload = () => {
    if (!currentItem?.url) return;
    window.open(currentItem.url, "_blank");
  };

  const handleDeleteImage = async (item: { id: string; url: string; isCover?: boolean }) => {
    if (item.isCover) {
      toast.warning("Cover photo cannot be deleted individually. Update the album cover instead.");
      return;
    }
    if (!album) return;

    const confirmed = await appConfirm({
      title: "Delete Photo",
      message: "Are you sure you want to permanently delete this photo from the album?",
      confirmText: "Delete Photo",
      variant: "destructive",
    });

    if (!confirmed) return;

    try {
      await campusService.removeGalleryImage(album.id, item.id);
      toast.success("Photo removed from album successfully");
      onImageDeleted?.(album.id, item.id);
      if (currentIndex >= allImages.length - 1) {
        setCurrentIndex(Math.max(0, allImages.length - 2));
      }
    } catch {
      toast.error("Failed to delete photo from album");
    }
  };

  const formattedDate = currentItem.date
    ? new Date(currentItem.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex flex-col bg-black/95 text-white backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 shrink-0 bg-black/40">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 overflow-hidden pr-3">
          <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
            {currentItem.title || album?.title || "Institutional Photo Archive"}
          </h2>
          {formattedDate && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/70">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {/* Counter & Close */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-emerald-300">
            Photo {currentIndex + 1} of {allImages.length}
          </span>
          <button
            onClick={onClose}
            aria-label="Close viewer"
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main High-Res Image Display Area */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden select-none">
        {/* Previous Button */}
        {allImages.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-3 sm:left-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        )}

        {/* Next Button */}
        {allImages.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-3 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        )}

        {/* Active Photo */}
        <div
          className="relative max-w-full max-h-[65vh] sm:max-h-[70vh] flex items-center justify-center transition-transform duration-200 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <Image
            src={currentItem.url}
            alt={currentItem.caption || currentItem.title || "Campus photo"}
            width={1600}
            height={1000}
            priority
            className="max-h-[65vh] sm:max-h-[70vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
          />
        </div>
      </div>

      {/* Bottom Bar: Caption, Controls & Filmstrip */}
      <div className="shrink-0 bg-black/75 border-t border-white/10 px-4 sm:px-6 py-3 space-y-3">
        {/* Caption & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-white/80 line-clamp-2 max-w-2xl font-light">
            {currentItem.caption || "Campus Life at Kishoreganj Government Polytechnic Institute"}
          </p>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Zoom Out */}
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              aria-label="Zoom out"
              className="p-1.5 sm:p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Zoom In */}
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2.5}
              aria-label="Zoom in"
              className="p-1.5 sm:p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Download / Open full */}
            <button
              onClick={handleDownload}
              aria-label="Open high-res photo"
              className="p-1.5 sm:p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
              title="Open full resolution"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Admin Delete Photo Button */}
            {isAdmin && album && !currentItem.isCover && (
              <button
                onClick={() => handleDeleteImage(currentItem)}
                aria-label="Delete active photo"
                className="p-1.5 sm:p-2 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 transition"
                title="Delete Photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Thumbnail Filmstrip */}
        {allImages.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {allImages.map((img, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div key={img.id || idx} className="relative group shrink-0">
                  <button
                    onClick={() => {
                      setCurrentIndex(idx);
                      setZoomLevel(1);
                    }}
                    className={`relative w-14 h-12 sm:w-16 sm:h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      isActive
                        ? "border-emerald-400 scale-105 shadow-md shadow-emerald-500/20"
                        : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/50"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.caption || `Thumbnail ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

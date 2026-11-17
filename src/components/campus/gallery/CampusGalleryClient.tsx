"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import Container from "@/components/shared/Container";
import GalleryHero from "./GalleryHero";
import GalleryFilterBar from "./GalleryFilterBar";
import GalleryPhotoCard from "./GalleryPhotoCard";
import GalleryLightboxModal from "./GalleryLightboxModal";
import { CampusGallery, FlatGalleryPhoto } from "@/types/campus";
import { campusService, VERIFIED_CAMPUS_GALLERIES } from "@/services/campus.service";
import { useAuthStore } from "@/store/useAuthStore";
import { Camera, ImageOff, Plus, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampusGalleryClientProps {
  initialGalleries?: CampusGallery[];
}

const PHOTOS_PER_PAGE = 12; // In the requested 10-15 range

export default function CampusGalleryClient({
  initialGalleries = VERIFIED_CAMPUS_GALLERIES,
}: CampusGalleryClientProps) {
  const [galleries, setGalleries] = useState<CampusGallery[]>(initialGalleries);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [, startTransition] = useTransition();

  // Pagination states
  const [visibleCount, setVisibleCount] = useState<number>(PHOTOS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationMode, setPaginationMode] = useState<"loadMore" | "pages">("loadMore");

  // Lightbox full-screen viewer state
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  // Fetch updated galleries
  const fetchGalleries = async () => {
    try {
      const data = await campusService.getGalleries();
      startTransition(() => {
        setGalleries(data);
      });
    } catch {
      // Keep verified fallbacks
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  // Flatten all photos from all albums so users see every photo directly
  const allPhotos: FlatGalleryPhoto[] = useMemo(() => {
    const list: FlatGalleryPhoto[] = [];
    const seenUrls = new Set<string>();

    galleries.forEach((album) => {
      // Add cover image if distinct
      if (album.coverImage && !seenUrls.has(album.coverImage)) {
        seenUrls.add(album.coverImage);
        list.push({
          id: `${album.id}-cover`,
          url: album.coverImage,
          title: album.title,
          caption: album.title,
          category: album.category,
          albumId: album.id,
          albumTitle: album.title,
          eventDate: album.eventDate,
        });
      }

      // Add album images
      if (album.images && album.images.length > 0) {
        album.images.forEach((img) => {
          if (!seenUrls.has(img.url)) {
            seenUrls.add(img.url);
            list.push({
              id: img.id,
              url: img.url,
              title: album.title,
              caption: img.caption || album.title,
              category: album.category,
              albumId: album.id,
              albumTitle: album.title,
              eventDate: album.eventDate,
              uploadedAt: img.uploadedAt,
            });
          }
        });
      }
    });

    return list;
  }, [galleries]);

  // Filtered photos by Category & Search
  const filteredPhotos = useMemo(() => {
    return allPhotos.filter((photo) => {
      const matchCategory =
        activeCategory === "ALL" ||
        photo.category?.toUpperCase() === activeCategory.toUpperCase();
      const matchSearch =
        !searchQuery.trim() ||
        photo.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.albumTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [allPhotos, activeCategory, searchQuery]);

  // Reset pagination on filter or search change
  useEffect(() => {
    setVisibleCount(PHOTOS_PER_PAGE);
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Total pages
  const totalPages = Math.ceil(filteredPhotos.length / PHOTOS_PER_PAGE) || 1;

  // Sliced photos to render based on current mode
  const displayedPhotos = useMemo(() => {
    if (paginationMode === "loadMore") {
      return filteredPhotos.slice(0, visibleCount);
    }
    const start = (currentPage - 1) * PHOTOS_PER_PAGE;
    return filteredPhotos.slice(start, start + PHOTOS_PER_PAGE);
  }, [filteredPhotos, visibleCount, currentPage, paginationMode]);

  // Handle Load More button click
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PHOTOS_PER_PAGE, filteredPhotos.length));
  };

  // Handle open lightbox on specific photo
  const handlePhotoClick = (_photo: FlatGalleryPhoto, idx: number) => {
    // Determine actual index within filteredPhotos
    const actualIndex =
      paginationMode === "loadMore"
        ? idx
        : (currentPage - 1) * PHOTOS_PER_PAGE + idx;
    setLightboxIndex(actualIndex);
    setIsLightboxOpen(true);
  };

  const hasMorePhotos = visibleCount < filteredPhotos.length;

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-16 sm:pb-24">
      {/* Hero Section */}
      <GalleryHero
        totalAlbums={galleries.length}
        totalPhotos={allPhotos.length}
        isAdmin={isAdmin}
      />

      <Container size="wide" className="pt-8 sm:pt-10 space-y-8">
        {/* Filter & Search Bar */}
        <GalleryFilterBar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredCount={filteredPhotos.length}
        />

        {/* Dynamic Eye-Catching Asymmetric Masonry Photo Grid ("akta coto akta boro") */}
        {displayedPhotos.length > 0 ? (
          <div className="space-y-10">
            {/* Bento / Asymmetric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-[220px] sm:auto-rows-[250px]">
              {displayedPhotos.map((photo, index) => (
                <GalleryPhotoCard
                  key={photo.id || index}
                  photo={photo}
                  index={index}
                  onClick={handlePhotoClick}
                />
              ))}
            </div>

            {/* Pagination Controls Section */}
            <div className="pt-6 border-t border-[#e2e8e4] flex flex-col items-center justify-center gap-5">
              {/* Load More Button (Loads Next 10-15 Images) */}
              {paginationMode === "loadMore" ? (
                <div className="flex flex-col items-center gap-3">
                  {hasMorePhotos ? (
                    <Button
                      onClick={handleLoadMore}
                      className="h-12 px-8 rounded-2xl bg-[#0a4b32] hover:bg-[#073624] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group cursor-pointer"
                    >
                      <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                      <span>
                        Load Next {Math.min(PHOTOS_PER_PAGE, filteredPhotos.length - visibleCount)} Photos
                      </span>
                    </Button>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>All {filteredPhotos.length} Photos Displayed</span>
                    </div>
                  )}

                  {/* Photos Progress Indicator */}
                  <div className="flex items-center gap-2 text-xs font-medium text-[#5a6b62]">
                    <span>
                      Showing <strong className="text-[#0a4b32]">{displayedPhotos.length}</strong> of{" "}
                      <strong className="text-[#0a4b32]">{filteredPhotos.length}</strong> photos
                    </span>
                    <span>•</span>
                    <button
                      onClick={() => setPaginationMode("pages")}
                      className="text-[#0a4b32] underline hover:text-[#073624] font-semibold"
                    >
                      Switch to page numbers
                    </button>
                  </div>
                </div>
              ) : (
                /* Traditional Page Buttons Navigation */
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Previous Button */}
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="h-9 px-3 rounded-xl border border-[#d2ddd6] bg-white text-xs font-semibold text-[#1c2e24] hover:bg-emerald-50 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                          currentPage === page
                            ? "bg-[#0a4b32] text-white shadow-xs"
                            : "bg-white text-[#1c2e24] border border-[#d2ddd6] hover:bg-emerald-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      className="h-9 px-3 rounded-xl border border-[#d2ddd6] bg-white text-xs font-semibold text-[#1c2e24] hover:bg-emerald-50 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-[#5a6b62]">
                    <span>
                      Page <strong className="text-[#0a4b32]">{currentPage}</strong> of{" "}
                      <strong className="text-[#0a4b32]">{totalPages}</strong> ({filteredPhotos.length} total photos)
                    </span>
                    <span>•</span>
                    <button
                      onClick={() => setPaginationMode("loadMore")}
                      className="text-[#0a4b32] underline hover:text-[#073624] font-semibold"
                    >
                      Switch to Load More button
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-16 px-4 text-center rounded-2xl border-2 border-dashed border-[#d2ddd6] bg-white max-w-lg mx-auto">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-[#0a4b32] flex items-center justify-center mb-4">
              {searchQuery ? (
                <ImageOff className="w-7 h-7 text-[#5a6b62]" />
              ) : (
                <Camera className="w-7 h-7 text-[#0a4b32]" />
              )}
            </div>
            <h3 className="text-base font-bold text-[#0f1f17]">No Photos Found</h3>
            <p className="text-xs sm:text-sm text-[#5a6b62] mt-1 max-w-xs mx-auto">
              {searchQuery
                ? `No photos match "${searchQuery}". Try a different keyword or category.`
                : "No photos available under this category at the moment."}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("ALL");
                }}
                className="mt-4 text-xs h-8 rounded-lg"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </Container>

      {/* Lightbox Full-Screen Viewer (Navigates through all photos in view) */}
      <GalleryLightboxModal
        photos={filteredPhotos}
        initialIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        isAdmin={false}
      />
    </div>
  );
}

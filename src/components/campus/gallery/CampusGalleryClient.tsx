"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import Container from "@/components/shared/Container";
import GalleryHero from "./GalleryHero";
import GalleryFilterBar from "./GalleryFilterBar";
import GalleryAlbumCard from "./GalleryAlbumCard";
import GalleryLightboxModal from "./GalleryLightboxModal";
import GalleryUploadModal from "./GalleryUploadModal";
import GalleryAddPhotosModal from "./GalleryAddPhotosModal";
import { CampusGallery } from "@/types/campus";
import { campusService, VERIFIED_CAMPUS_GALLERIES } from "@/services/campus.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";
import { appConfirm } from "@/store/useConfirmStore";
import { Camera, ImageOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampusGalleryClientProps {
  initialGalleries?: CampusGallery[];
}

export default function CampusGalleryClient({
  initialGalleries = VERIFIED_CAMPUS_GALLERIES,
}: CampusGalleryClientProps) {
  const [galleries, setGalleries] = useState<CampusGallery[]>(initialGalleries);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();

  // Modals state
  const [selectedAlbum, setSelectedAlbum] = useState<CampusGallery | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [albumForAddPhotos, setAlbumForAddPhotos] = useState<CampusGallery | null>(null);

  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";
  const toast = useToastStore();

  const fetchGalleries = async () => {
    try {
      setIsLoading(true);
      const data = await campusService.getGalleries();
      startTransition(() => {
        setGalleries(data);
      });
    } catch {
      // Keep existing data on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  // Filtered albums
  const filteredGalleries = useMemo(() => {
    return galleries.filter((album) => {
      const matchCategory =
        activeCategory === "ALL" ||
        album.category?.toUpperCase() === activeCategory.toUpperCase();
      const matchSearch =
        !searchQuery.trim() ||
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [galleries, activeCategory, searchQuery]);

  // Total photo count across all albums
  const totalPhotosCount = useMemo(() => {
    return galleries.reduce((acc, curr) => {
      const count = (curr.images?.length || 0) + (curr.coverImage ? 1 : 0);
      return acc + count;
    }, 0);
  }, [galleries]);

  const handleOpenLightbox = (album: CampusGallery) => {
    setSelectedAlbum(album);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedAlbum(null);
  };

  const handleAlbumCreated = (newAlbum: CampusGallery) => {
    setGalleries((prev) => [newAlbum, ...prev]);
  };

  const handlePhotosAdded = (updatedAlbum: CampusGallery) => {
    setGalleries((prev) =>
      prev.map((a) => (a.id === updatedAlbum.id ? updatedAlbum : a))
    );
    if (selectedAlbum?.id === updatedAlbum.id) {
      setSelectedAlbum(updatedAlbum);
    }
  };

  const handleImageDeleted = (albumId: string, imageId: string) => {
    setGalleries((prev) =>
      prev.map((a) => {
        if (a.id === albumId) {
          return {
            ...a,
            images: a.images.filter((img) => img.id !== imageId),
          };
        }
        return a;
      })
    );
    if (selectedAlbum?.id === albumId) {
      setSelectedAlbum((prev) =>
        prev
          ? {
              ...prev,
              images: prev.images.filter((img) => img.id !== imageId),
            }
          : null
      );
    }
  };

  const handleDeleteAlbum = async (album: CampusGallery) => {
    const confirmed = await appConfirm({
      title: "Delete Album",
      message: `Are you sure you want to permanently delete the album "${album.title}"?`,
      confirmText: "Delete Album",
      variant: "destructive",
    });

    if (!confirmed) return;

    try {
      await campusService.deleteGallery(album.id);
      toast.success("Gallery album deleted successfully");
      setGalleries((prev) => prev.filter((a) => a.id !== album.id));
    } catch {
      toast.error("Failed to delete album");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-16 sm:pb-24">
      {/* Hero Section */}
      <GalleryHero
        totalAlbums={galleries.length}
        totalPhotos={totalPhotosCount}
        isAdmin={isAdmin}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      <Container size="wide" className="pt-8 sm:pt-10 space-y-8">
        {/* Filter & Search Bar */}
        <GalleryFilterBar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredCount={filteredGalleries.length}
        />

        {/* Gallery Albums Grid */}
        {filteredGalleries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredGalleries.map((album) => (
              <GalleryAlbumCard
                key={album.id}
                album={album}
                onExplore={handleOpenLightbox}
                isAdmin={isAdmin}
                onAddPhotos={(alb) => setAlbumForAddPhotos(alb)}
                onDeleteAlbum={handleDeleteAlbum}
              />
            ))}
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
            <h3 className="text-base font-bold text-[#0f1f17]">No Albums Found</h3>
            <p className="text-xs sm:text-sm text-[#5a6b62] mt-1 max-w-xs mx-auto">
              {searchQuery
                ? `No albums match "${searchQuery}". Try a different keyword or category.`
                : "No albums available under this category at the moment."}
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

      {/* Lightbox Modal */}
      <GalleryLightboxModal
        album={selectedAlbum}
        isOpen={isLightboxOpen}
        onClose={handleCloseLightbox}
        isAdmin={isAdmin}
        onImageDeleted={handleImageDeleted}
      />

      {/* Admin Upload Album Modal */}
      <GalleryUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAlbumCreated={handleAlbumCreated}
      />

      {/* Admin Add Photos to Existing Album Modal */}
      <GalleryAddPhotosModal
        album={albumForAddPhotos}
        isOpen={!!albumForAddPhotos}
        onClose={() => setAlbumForAddPhotos(null)}
        onPhotosAdded={handlePhotosAdded}
      />
    </div>
  );
}

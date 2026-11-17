"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Wrench,
  Camera,
  Compass,
  Plus,
  Search,
  Edit,
  Trash2,
  PlusCircle,
  ExternalLink,
  ShieldAlert,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  Mail,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthUser } from "@/types/auth";
import { CampusFacility, CampusGallery, CampusLife } from "@/types/campus";
import {
  campusService,
  VERIFIED_CAMPUS_FACILITIES,
  VERIFIED_CAMPUS_GALLERIES,
  VERIFIED_CAMPUS_LIVES,
} from "@/services/campus.service";
import { useToastStore } from "@/store/useToastStore";
import { appConfirm } from "@/store/useConfirmStore";

import FacilityFormModal from "@/components/campus/facilities/FacilityFormModal";
import GalleryUploadModal from "@/components/campus/gallery/GalleryUploadModal";
import GalleryAddPhotosModal from "@/components/campus/gallery/GalleryAddPhotosModal";
import GalleryLightboxModal from "@/components/campus/gallery/GalleryLightboxModal";
import CampusLifeFormModal from "@/components/campus/life/CampusLifeFormModal";

interface AdminCampusManagerProps {
  user: AuthUser;
}

type TabType = "facilities" | "gallery" | "life";

export default function AdminCampusManager({ user }: AdminCampusManagerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("facilities");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();

  // Data states
  const [facilities, setFacilities] = useState<CampusFacility[]>(VERIFIED_CAMPUS_FACILITIES);
  const [galleries, setGalleries] = useState<CampusGallery[]>(VERIFIED_CAMPUS_GALLERIES);
  const [campusLife, setCampusLife] = useState<CampusLife[]>(VERIFIED_CAMPUS_LIVES);

  // Modal states
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<CampusFacility | null>(null);

  const [uploadAlbumModalOpen, setUploadAlbumModalOpen] = useState(false);
  const [addPhotosModalOpen, setAddPhotosModalOpen] = useState(false);
  const [selectedAlbumForPhotos, setSelectedAlbumForPhotos] = useState<CampusGallery | null>(null);

  const [lightboxAlbum, setLightboxAlbum] = useState<CampusGallery | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [lifeModalOpen, setLifeModalOpen] = useState(false);
  const [selectedLifeItem, setSelectedLifeItem] = useState<CampusLife | null>(null);

  const toast = useToastStore();

  const isAuthorized = user.role === "SUPER_ADMIN" || user.role === "ADMIN";

  // Initial fetch
  useEffect(() => {
    if (!isAuthorized) return;

    const loadAllData = async () => {
      try {
        setIsLoading(true);
        const [facs, gals, life] = await Promise.all([
          campusService.getFacilities(),
          campusService.getGalleries(),
          campusService.getCampusLife(),
        ]);
        startTransition(() => {
          setFacilities(facs);
          setGalleries(gals);
          setCampusLife(life);
        });
      } catch {
        // Fallback already pre-populated
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
        <p className="text-sm text-gray-600">
          Only institutional administrators and super administrators can manage campus assets.
        </p>
        <Link href="/dashboard/admin">
          <Button variant="outline">Return to Admin Console</Button>
        </Link>
      </div>
    );
  }

  // Facility handlers
  const handleFacilitySaved = (saved: CampusFacility) => {
    setFacilities((prev) => {
      const idx = prev.findIndex((f) => f.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  };

  const handleDeleteFacility = async (facility: CampusFacility) => {
    const confirmed = await appConfirm({
      title: "Delete Facility",
      message: `Are you sure you want to delete "${facility.title}"?`,
      confirmText: "Delete",
      variant: "destructive",
    });
    if (!confirmed) return;

    try {
      await campusService.deleteFacility(facility.id);
      toast.success("Facility deleted successfully");
      setFacilities((prev) => prev.filter((f) => f.id !== facility.id));
    } catch {
      toast.error("Failed to delete facility");
    }
  };

  // Gallery handlers
  const handleAlbumCreated = (newAlbum: CampusGallery) => {
    setGalleries((prev) => [newAlbum, ...prev]);
  };

  const handlePhotosAdded = (updated: CampusGallery) => {
    setGalleries((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleDeleteAlbum = async (album: CampusGallery) => {
    const confirmed = await appConfirm({
      title: "Delete Gallery Album",
      message: `Permanently delete album "${album.title}" and its photos?`,
      confirmText: "Delete Album",
      variant: "destructive",
    });
    if (!confirmed) return;

    try {
      await campusService.deleteGallery(album.id);
      toast.success("Album deleted successfully");
      setGalleries((prev) => prev.filter((a) => a.id !== album.id));
    } catch {
      toast.error("Failed to delete album");
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
  };

  // Campus Life handlers
  const handleLifeSaved = (saved: CampusLife) => {
    setCampusLife((prev) => {
      const idx = prev.findIndex((l) => l.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  };

  const handleDeleteLife = async (item: CampusLife) => {
    const confirmed = await appConfirm({
      title: "Delete Club / Society",
      message: `Permanently delete "${item.title}"?`,
      confirmText: "Delete",
      variant: "destructive",
    });
    if (!confirmed) return;

    try {
      await campusService.deleteCampusLife(item.id);
      toast.success("Club removed successfully");
      setCampusLife((prev) => prev.filter((l) => l.id !== item.id));
    } catch {
      toast.error("Failed to delete club");
    }
  };

  // Filtered collections
  const filteredFacilities = facilities.filter(
    (f) =>
      !searchQuery.trim() ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGalleries = galleries.filter(
    (g) =>
      !searchQuery.trim() ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLife = campusLife.filter(
    (l) =>
      !searchQuery.trim() ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-[#e2e8e4] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#0a4b32] border border-emerald-200">
              Admin Perimeter
            </span>
            <span className="text-xs text-[#5a6b62]">Full Write Access</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f1f17]">
            Campus Assets & Media Management
          </h1>
          <p className="text-xs sm:text-sm text-[#5a6b62]">
            Register and update laboratories, workshops, photo albums, and co-curricular student clubs.
          </p>
        </div>

        {/* Public view links shortcut */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href="/campus/facilities"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gray-50 hover:bg-gray-100 text-[#0f1f17] border border-[#d2ddd6] transition"
          >
            <span>Public Facilities</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#5a6b62]" />
          </Link>
          <Link
            href="/campus/gallery"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gray-50 hover:bg-gray-100 text-[#0f1f17] border border-[#d2ddd6] transition"
          >
            <span>Public Gallery</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#5a6b62]" />
          </Link>
        </div>
      </div>

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 bg-[#edf3ef] p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => {
              setActiveTab("facilities");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === "facilities"
                ? "bg-white text-[#0a4b32] shadow-xs"
                : "text-[#5a6b62] hover:text-[#0f1f17]"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Facilities ({facilities.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("gallery");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === "gallery"
                ? "bg-white text-[#0a4b32] shadow-xs"
                : "text-[#5a6b62] hover:text-[#0f1f17]"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Photo Albums ({galleries.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("life");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === "life"
                ? "bg-white text-[#0a4b32] shadow-xs"
                : "text-[#5a6b62] hover:text-[#0f1f17]"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Campus Life ({campusLife.length})</span>
          </button>
        </div>

        {/* Search & Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#8a9a90] absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="pl-9 h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>

          {activeTab === "facilities" && (
            <Button
              onClick={() => {
                setSelectedFacility(null);
                setFacilityModalOpen(true);
              }}
              className="h-10 px-4 rounded-xl bg-[#0a4b32] hover:bg-[#073624] text-white text-xs font-semibold shrink-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>New Facility</span>
            </Button>
          )}

          {activeTab === "gallery" && (
            <Button
              onClick={() => setUploadAlbumModalOpen(true)}
              className="h-10 px-4 rounded-xl bg-[#0a4b32] hover:bg-[#073624] text-white text-xs font-semibold shrink-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Upload Album</span>
            </Button>
          )}

          {activeTab === "life" && (
            <Button
              onClick={() => {
                setSelectedLifeItem(null);
                setLifeModalOpen(true);
              }}
              className="h-10 px-4 rounded-xl bg-[#0a4b32] hover:bg-[#073624] text-white text-xs font-semibold shrink-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Register Club</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tab 1: Facilities List */}
      {activeTab === "facilities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="p-5 rounded-2xl bg-white border border-[#e2e8e4] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100">
                  <Image
                    src={fac.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"}
                    alt={fac.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 text-[#0a4b32] shadow-xs">
                      {fac.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0f1f17] line-clamp-1">{fac.title}</h3>
                  <p className="text-xs text-[#5a6b62] line-clamp-2 leading-relaxed">
                    {fac.description}
                  </p>
                </div>

                {fac.features && fac.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {fac.features.slice(0, 3).map((f, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100"
                      >
                        {f}
                      </span>
                    ))}
                    {fac.features.length > 3 && (
                      <span className="text-[10px] font-semibold text-[#0a4b32] self-center">
                        +{fac.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#f0f4f1]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFacility(fac);
                    setFacilityModalOpen(true);
                  }}
                  className="flex-1 h-8 text-xs font-semibold text-[#0a4b32] border-emerald-200 hover:bg-emerald-50 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Facility</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteFacility(fac)}
                  className="h-8 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 rounded-lg"
                  title="Delete facility"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Gallery Albums List */}
      {activeTab === "gallery" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGalleries.map((album) => {
            const photoCount = (album.images?.length || 0) + (album.coverImage ? 1 : 0);
            return (
              <div
                key={album.id}
                className="p-5 rounded-2xl bg-white border border-[#e2e8e4] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100">
                    <Image
                      src={
                        album.coverImage ||
                        album.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
                      }
                      alt={album.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 text-[#0a4b32] shadow-xs">
                        {album.category}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                        📸 {photoCount} Photos
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#0f1f17] line-clamp-1">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="text-xs text-[#5a6b62] line-clamp-2 leading-relaxed">
                        {album.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#f0f4f1]">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLightboxAlbum(album);
                      setIsLightboxOpen(true);
                    }}
                    className="flex-1 h-8 text-xs font-semibold text-[#0a4b32] border-emerald-200 hover:bg-emerald-50 rounded-lg"
                  >
                    Manage Photos
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAlbumForPhotos(album);
                      setAddPhotosModalOpen(true);
                    }}
                    className="h-8 px-2.5 text-xs text-[#0a4b32] hover:bg-emerald-50 border-emerald-200 rounded-lg"
                    title="Add more photos"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAlbum(album)}
                    className="h-8 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 rounded-lg"
                    title="Delete album"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Campus Life List */}
      {activeTab === "life" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLife.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-[#e2e8e4] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100">
                  <Image
                    src={item.imageUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 text-[#0a4b32] shadow-xs">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0f1f17] line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-[#5a6b62] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.contactEmail && (
                  <div className="flex items-center gap-1.5 text-xs text-[#5a6b62]">
                    <Mail className="w-3.5 h-3.5 text-[#0a4b32]" />
                    <span className="truncate">{item.contactEmail}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#f0f4f1]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedLifeItem(item);
                    setLifeModalOpen(true);
                  }}
                  className="flex-1 h-8 text-xs font-semibold text-[#0a4b32] border-emerald-200 hover:bg-emerald-50 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Club</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteLife(item)}
                  className="h-8 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 rounded-lg"
                  title="Delete club"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Facilities Form Modal */}
      <FacilityFormModal
        facility={selectedFacility}
        isOpen={facilityModalOpen}
        onClose={() => {
          setFacilityModalOpen(false);
          setSelectedFacility(null);
        }}
        onSaved={handleFacilitySaved}
      />

      {/* Gallery Upload Album Modal */}
      <GalleryUploadModal
        isOpen={uploadAlbumModalOpen}
        onClose={() => setUploadAlbumModalOpen(false)}
        onAlbumCreated={handleAlbumCreated}
      />

      {/* Gallery Add Photos Modal */}
      <GalleryAddPhotosModal
        album={selectedAlbumForPhotos}
        isOpen={addPhotosModalOpen}
        onClose={() => {
          setAddPhotosModalOpen(false);
          setSelectedAlbumForPhotos(null);
        }}
        onPhotosAdded={handlePhotosAdded}
      />

      {/* Gallery Lightbox (Admin Delete Photo Support) */}
      <GalleryLightboxModal
        album={lightboxAlbum}
        isOpen={isLightboxOpen}
        onClose={() => {
          setIsLightboxOpen(false);
          setLightboxAlbum(null);
        }}
        isAdmin={true}
        onImageDeleted={handleImageDeleted}
      />

      {/* Campus Life Form Modal */}
      <CampusLifeFormModal
        item={selectedLifeItem}
        isOpen={lifeModalOpen}
        onClose={() => {
          setLifeModalOpen(false);
          setSelectedLifeItem(null);
        }}
        onSaved={handleLifeSaved}
      />
    </div>
  );
}

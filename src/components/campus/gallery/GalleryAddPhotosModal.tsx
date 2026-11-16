"use client";

import React, { useState } from "react";
import { X, UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToastStore } from "@/store/useToastStore";
import { campusService } from "@/services/campus.service";
import { CampusGallery } from "@/types/campus";

interface GalleryAddPhotosModalProps {
  album: CampusGallery | null;
  isOpen: boolean;
  onClose: () => void;
  onPhotosAdded: (updatedAlbum: CampusGallery) => void;
}

export default function GalleryAddPhotosModal({
  album,
  isOpen,
  onClose,
  onPhotosAdded,
}: GalleryAddPhotosModalProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToastStore();

  if (!isOpen || !album) return null;

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      setImageFiles(filesArr);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      toast.error("Please select at least one photo to add");
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedAlbum = await campusService.addGalleryImages(album.id, imageFiles);
      toast.success(`${imageFiles.length} photo(s) added to "${album.title}"!`);
      onPhotosAdded(updatedAlbum);
      setImageFiles([]);
      onClose();
    } catch {
      toast.error("Failed to add photos to album");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#d2ddd6] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8e4] bg-[#f9fbf9]">
          <div>
            <h3 className="text-base font-bold text-[#0f1f17]">Add Photos to Album</h3>
            <p className="text-xs text-[#5a6b62] truncate max-w-xs">{album.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5a6b62] hover:text-[#0f1f17] hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#c5d5cb] hover:border-[#0a4b32] rounded-xl cursor-pointer bg-emerald-50/20 transition text-center">
            <UploadCloud className="w-8 h-8 text-[#0a4b32] mb-2" />
            <span className="text-sm font-semibold text-[#1c2e24]">
              {imageFiles.length > 0
                ? `${imageFiles.length} photo(s) selected`
                : "Choose photos to upload"}
            </span>
            <span className="text-xs text-[#718278] mt-1">PNG, JPG, WEBP (multiple allowed)</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
              className="hidden"
            />
          </label>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e2e8e4]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs h-9 px-4 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || imageFiles.length === 0}
              className="text-xs h-9 px-5 bg-[#0a4b32] hover:bg-[#073624] text-white rounded-xl flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <span>Upload Photos</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { X, UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToastStore } from "@/store/useToastStore";
import { campusService } from "@/services/campus.service";
import { CampusGallery } from "@/types/campus";

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAlbumCreated: (album: CampusGallery) => void;
}

const CATEGORIES = ["EVENTS", "ACADEMIC", "LABS", "SPORTS", "CAMPUS"];

export default function GalleryUploadModal({
  isOpen,
  onClose,
  onAlbumCreated,
}: GalleryUploadModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("EVENTS");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToastStore();

  if (!isOpen) return null;

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleMultiImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files).slice(0, 30);
      setImageFiles(filesArr);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter an album title");
      return;
    }

    try {
      setIsSubmitting(true);
      const newAlbum = await campusService.createGallery(
        {
          title: title.trim(),
          category,
          description: description.trim() || undefined,
          eventDate: eventDate ? new Date(eventDate).toISOString() : undefined,
          isPublished: true,
        },
        coverFile,
        imageFiles
      );

      toast.success("New gallery album created successfully!");
      onAlbumCreated(newAlbum);
      onClose();
    } catch {
      toast.error("Failed to create gallery album. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#d2ddd6] overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8e4] bg-[#f9fbf9]">
          <div>
            <h3 className="text-lg font-bold text-[#0f1f17]">Upload New Gallery Album</h3>
            <p className="text-xs text-[#5a6b62]">
              Create an institutional photo collection for campus events or departments
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5a6b62] hover:text-[#0f1f17] hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1c2e24]">
              Album Title <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Polytechnic Innovation Summit & Tech Expo"
              required
              className="h-10 text-sm"
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1c2e24]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#d2ddd6] bg-white text-sm text-[#0f1f17] focus:ring-2 focus:ring-[#0a4b32]/25 focus:border-[#0a4b32]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1c2e24]">Event Date</label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1c2e24]">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief context regarding the event, department highlights, or activities..."
              rows={3}
              className="text-sm resize-none"
            />
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1c2e24]">Cover Photo</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#c5d5cb] hover:border-[#0a4b32] rounded-xl cursor-pointer bg-emerald-50/20 transition text-center">
                <UploadCloud className="w-6 h-6 text-[#0a4b32] mb-1" />
                <span className="text-xs font-medium text-[#1c2e24]">
                  {coverFile ? coverFile.name : "Click to select cover image"}
                </span>
                <span className="text-[10px] text-[#718278]">PNG, JPG, WEBP up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>

              {coverPreview && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#d2ddd6] relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional Photos Upload (Up to 30) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1c2e24]">
              Additional Photos (Up to 30 images)
            </label>
            <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#c5d5cb] hover:border-[#0a4b32] rounded-xl cursor-pointer bg-emerald-50/20 transition text-center">
              <ImageIcon className="w-6 h-6 text-[#0a4b32] mb-1" />
              <span className="text-xs font-medium text-[#1c2e24]">
                {imageFiles.length > 0
                  ? `${imageFiles.length} photos selected`
                  : "Click to select multiple photos"}
              </span>
              <span className="text-[10px] text-[#718278]">
                Select multiple files to populate album slides
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultiImagesChange}
                className="hidden"
              />
            </label>
          </div>

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
              disabled={isSubmitting}
              className="text-xs h-9 px-5 bg-[#0a4b32] hover:bg-[#073624] text-white rounded-xl flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Publish Album</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { X, UploadCloud, Plus, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToastStore } from "@/store/useToastStore";
import { campusService } from "@/services/campus.service";
import { CampusFacility } from "@/types/campus";

interface FacilityFormModalProps {
  facility?: CampusFacility | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (facility: CampusFacility) => void;
}

const CATEGORIES = ["LABORATORY", "WORKSHOP", "LIBRARY", "HOSTEL", "TECHNOLOGY"];

export default function FacilityFormModal({
  facility,
  isOpen,
  onClose,
  onSaved,
}: FacilityFormModalProps) {
  const isEditing = !!facility;
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("LABORATORY");
  const [description, setDescription] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToastStore();

  useEffect(() => {
    if (facility) {
      setTitle(facility.title || "");
      setCategory(facility.category || "LABORATORY");
      setDescription(facility.description || "");
      setFeatures(facility.features || []);
      setImagePreview(facility.imageUrl || null);
    } else {
      setTitle("");
      setCategory("LABORATORY");
      setDescription("");
      setFeatures([]);
      setImageFile(null);
      setImagePreview(null);
    }
  }, [facility, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a facility title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a facility description");
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditing && facility) {
        const updated = await campusService.updateFacility(
          facility.id,
          {
            title: title.trim(),
            category,
            description: description.trim(),
            features,
          },
          imageFile
        );
        toast.success("Facility updated successfully!");
        onSaved(updated);
      } else {
        const created = await campusService.createFacility(
          {
            title: title.trim(),
            category,
            description: description.trim(),
            features,
          },
          imageFile
        );
        toast.success("New facility added successfully!");
        onSaved(created);
      }
      onClose();
    } catch {
      toast.error(isEditing ? "Failed to update facility" : "Failed to create facility");
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8e4] bg-[#f9fbf9]">
          <div>
            <h3 className="text-lg font-bold text-[#0f1f17]">
              {isEditing ? "Edit Facility" : "Add New Facility"}
            </h3>
            <p className="text-xs text-[#5a6b62]">
              Configure engineering laboratory details and technical tooling
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5a6b62] hover:text-[#0f1f17] hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1c2e24]">
              Facility Name <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Computer Software & AI Lab"
              required
              className="h-10 text-sm"
            />
          </div>

          {/* Category */}
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

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1c2e24]">
              Description <span className="text-rose-500">*</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of facility capacity, practical topics, and equipment..."
              rows={3}
              required
              className="text-sm resize-none"
            />
          </div>

          {/* Features / Specifications Tag Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1c2e24]">
              Technical Features & Specifications
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="e.g. 60 High-end Workstations"
                className="h-9 text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddFeature}
                className="h-9 px-3 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </div>

            {features.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-emerald-600 hover:text-rose-600"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1c2e24]">Facility Photo</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#c5d5cb] hover:border-[#0a4b32] rounded-xl cursor-pointer bg-emerald-50/20 transition text-center">
                <UploadCloud className="w-6 h-6 text-[#0a4b32] mb-1" />
                <span className="text-xs font-medium text-[#1c2e24]">
                  {imageFile ? imageFile.name : "Click to select facility photo"}
                </span>
                <span className="text-[10px] text-[#718278]">PNG, JPG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#d2ddd6] relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Facility preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
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
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? "Save Changes" : "Create Facility"}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

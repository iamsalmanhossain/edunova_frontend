"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AboutGalleryUploaderProps {
  existingImages: string[];
  galleryPreviews: string[];
  onSelectFiles: (files: FileList | null) => void;
  onRemoveExisting: (index: number) => void;
  onRemoveNew: (index: number) => void;
}

export default function AboutGalleryUploader({
  existingImages,
  galleryPreviews,
  onSelectFiles,
  onRemoveExisting,
  onRemoveNew,
}: AboutGalleryUploaderProps) {
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const totalCount = existingImages.length + galleryPreviews.length;

  return (
    <Card className="border-[#e2e8e4]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-[#0f1f17] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span>Gallery Images</span>
          </span>
          <span className="text-xs text-gray-500 font-normal">
            {totalCount} / 10
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onSelectFiles(e.target.files)}
        />

        <div className="grid grid-cols-3 gap-2">
          {/* Existing Images */}
          {existingImages.map((img, idx) => (
            <div key={`exist-${idx}`} className="relative h-20 rounded-lg overflow-hidden border border-gray-200 group">
              <Image src={img} alt={`Gallery ${idx}`} fill unoptimized className="object-cover" />
              <button
                type="button"
                onClick={() => onRemoveExisting(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Newly Uploaded Images */}
          {galleryPreviews.map((preview, idx) => (
            <div key={`new-${idx}`} className="relative h-20 rounded-lg overflow-hidden border border-emerald-300 group">
              <Image src={preview} alt={`Upload ${idx}`} fill unoptimized className="object-cover" />
              <span className="absolute bottom-1 left-1 bg-emerald-700 text-white text-[9px] px-1 rounded">
                New
              </span>
              <button
                type="button"
                onClick={() => onRemoveNew(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Upload Trigger Button */}
          {totalCount < 10 && (
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#0a4b32] bg-gray-50 hover:bg-[#f1f7f3] flex flex-col items-center justify-center text-gray-500 hover:text-[#0a4b32] transition-colors"
            >
              <Plus className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-medium">Add Photo</span>
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

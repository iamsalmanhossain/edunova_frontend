"use client";

import React from "react";
import { X, Camera, ShieldCheck } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { AuthUser } from "@/types/auth";
import { Button } from "@/components/ui/button";

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
}

export default function ProfilePhotoModal({
  isOpen,
  onClose,
  user,
}: ProfilePhotoModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in select-none">
      {/* Backdrop click to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Modal Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#e2e8e4] shadow-2xl relative space-y-5 animate-in zoom-in-95">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#5a6b62] hover:text-[#0f1f17] hover:bg-[#f0f4f1] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center mx-auto shadow-xs">
            <Camera className="w-6 h-6 text-[#c48b28]" />
          </div>
          <h3 className="text-lg font-extrabold text-[#0f1f17] tracking-tight">
            Update Institutional Photo
          </h3>
          <p className="text-xs text-[#5a6b62] max-w-xs mx-auto">
            Upload your formal photograph for your official digital identity, attendance records, and institutional profile.
          </p>
        </div>

        {/* Shared ImageUploader in Avatar Mode */}
        <div className="p-4 rounded-2xl bg-[#f7faf8] border border-[#e8efe9] flex flex-col items-center">
          <ImageUploader
            variant="avatar"
            size="xl"
            currentImageUrl={user.avatarUrl}
            fallbackText={user.name}
            autoSaveToProfile={true}
            label="Click circle or drag an image here"
            description="JPG, PNG, WEBP up to 10MB"
          />

          {/* User Details Preview */}
          <div className="mt-4 pt-3 border-t border-[#e2e8e4] w-full text-center space-y-0.5">
            <p className="text-sm font-bold text-[#0f1f17] truncate">{user.name}</p>
            <p className="text-xs text-[#5a6b62] truncate">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </div>

        {/* Recommendations / Guidelines */}
        <div className="space-y-1.5 text-[11px] text-[#5a6b62] bg-[#fcfdfc] p-3 rounded-xl border border-[#dce3df]/70">
          <p className="font-bold text-[#0a4b32] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c48b28]" />
            <span>Official Photo Guidelines:</span>
          </p>
          <ul className="list-disc pl-4 space-y-0.5 text-[10.5px]">
            <li>Clear front-facing portrait with formal attire.</li>
            <li>Plain light or white background recommended.</li>
            <li>Photos are automatically optimized and encrypted on Cloudinary.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            onClick={onClose}
            className="w-full bg-[#0a4b32] hover:bg-[#073825] text-white text-xs font-bold h-10 shadow-xs cursor-pointer"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

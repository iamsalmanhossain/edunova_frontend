"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import {
  Camera,
  UploadCloud,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { uploaderService, CloudinaryUploadResult } from "@/services/uploader.service";

export interface ImageUploaderProps {
  /** Mode: 'avatar' for circular user profile photo, 'dropzone' for rectangular file upload box */
  variant?: "avatar" | "dropzone";
  /** Current active image URL (e.g. user.avatarUrl) */
  currentImageUrl?: string | null;
  /** Fallback text or user initials when no image is present */
  fallbackText?: string;
  /** Avatar dimension: 'sm' (48px), 'md' (64px), 'lg' (96px), 'xl' (128px) */
  size?: "sm" | "md" | "lg" | "xl";
  /** If true, automatically updates user profile via PATCH /users/profile & updates Zustand */
  autoSaveToProfile?: boolean;
  /** Callback on successful upload */
  onUploadSuccess?: (url: string, result: CloudinaryUploadResult) => void;
  /** Callback on error */
  onUploadError?: (errorMsg: string) => void;
  /** Callback on remove */
  onRemove?: () => void;
  /** Title or label */
  label?: string;
  /** Helper subtitle */
  description?: string;
  /** Extra wrapper classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

const sizeClasses = {
  sm: {
    avatar: "w-12 h-12 text-sm",
    dropzone: "h-28",
    icon: "w-3.5 h-3.5",
  },
  md: {
    avatar: "w-16 h-16 text-base",
    dropzone: "h-36",
    icon: "w-4 h-4",
  },
  lg: {
    avatar: "w-24 h-24 text-xl",
    dropzone: "h-48",
    icon: "w-5 h-5",
  },
  xl: {
    avatar: "w-32 h-32 text-3xl",
    dropzone: "h-60",
    icon: "w-6 h-6",
  },
};

export default function ImageUploader({
  variant = "avatar",
  currentImageUrl,
  fallbackText = "U",
  size = "lg",
  autoSaveToProfile = false,
  onUploadSuccess,
  onUploadError,
  onRemove,
  label,
  description = "Supports JPG, PNG, WEBP (Max 10MB)",
  className = "",
  disabled = false,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const activeSize = sizeClasses[size] || sizeClasses.lg;

  const triggerSelect = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const validateAndUpload = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. File Type Validation
    if (!file.type.startsWith("image/")) {
      const err = "Please choose a valid image file (JPEG, PNG, WEBP, GIF).";
      setErrorMessage(err);
      onUploadError?.(err);
      return;
    }

    // 2. File Size Validation (Max 10MB)
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      const err = "Image exceeds maximum allowed size of 10MB.";
      setErrorMessage(err);
      onUploadError?.(err);
      return;
    }

    // 3. Create live local preview immediately for best UX
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      setIsUploading(true);

      // 4. Send to backend Cloudinary uploader endpoint
      const result = await uploaderService.uploadFile(file);
      const uploadedUrl = result.secureUrl || result.url;
      setPreviewUrl(uploadedUrl);

      // 5. Optionally save to profile
      if (autoSaveToProfile) {
        await uploaderService.updateProfileAvatar(uploadedUrl);
        setSuccessMessage("Profile photo updated successfully!");
      } else {
        setSuccessMessage("Image uploaded successfully!");
      }

      onUploadSuccess?.(uploadedUrl, result);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to upload image. Please ensure your backend is reachable.";
      setErrorMessage(msg);
      onUploadError?.(msg);
      // Revert preview on failure
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
    // Reset file input so user can re-select same file if desired
    e.target.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (autoSaveToProfile) {
      uploaderService.updateProfileAvatar("").catch(() => {});
    }
    onRemove?.();
  };

  // ==========================================
  // VARIANT 1: Circular Avatar Mode
  // ==========================================
  if (/* Avatar mode */ variant === "avatar") {
    return (
      <div className={`flex flex-col items-center gap-2.5 ${className}`}>
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {/* Circular Avatar Container */}
        <div className="relative group">
          <div
            onClick={triggerSelect}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-full overflow-hidden border-2 transition-all cursor-pointer shadow-md flex items-center justify-center ${
              activeSize.avatar
            } ${
              isDragging
                ? "border-[#c48b28] scale-105 ring-4 ring-[#c48b28]/20"
                : "border-[#0a4b32]/30 hover:border-[#0a4b32] hover:shadow-lg"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            title="Click or drag to change profile photo"
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile Avatar"
                fill
                sizes="128px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0a4b32] to-[#073825] text-white font-extrabold flex items-center justify-center select-none">
                {fallbackText.slice(0, 2).toUpperCase()}
              </div>
            )}

            {/* Hover / Uploading Overlay */}
            <div
              className={`absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center transition-opacity ${
                isUploading
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-1">
                  <Loader2 className={`${activeSize.icon} animate-spin text-[#c48b28]`} />
                  <span className="text-[9px] font-bold">Uploading</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-0.5">
                  <Camera className={activeSize.icon} />
                  <span className="text-[9px] font-semibold">Change</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Floating Action Badges */}
          {!isUploading && previewUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center shadow-md transition-all cursor-pointer ring-2 ring-white"
              title="Remove photo"
              aria-label="Remove photo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {!isUploading && !previewUrl && (
            <button
              type="button"
              onClick={triggerSelect}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0a4b32] text-white hover:bg-[#073825] flex items-center justify-center shadow-md transition-all cursor-pointer ring-2 ring-white"
              title="Upload photo"
              aria-label="Upload photo"
            >
              <Camera className="w-3.5 h-3.5 text-[#c48b28]" />
            </button>
          )}
        </div>

        {/* Labels & Feedback */}
        <div className="text-center space-y-0.5 max-w-[220px]">
          {label && (
            <p className="text-xs font-bold text-[#0f1f17]">{label}</p>
          )}
          {description && !errorMessage && !successMessage && (
            <p className="text-[10px] text-[#5a6b62] leading-tight">{description}</p>
          )}
          {errorMessage && (
            <p className="text-[10px] font-semibold text-red-600 flex items-center justify-center gap-1 animate-in fade-in">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errorMessage}</span>
            </p>
          )}
          {successMessage && (
            <p className="text-[10px] font-semibold text-emerald-700 flex items-center justify-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>{successMessage}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VARIANT 2: Rectangular Dropzone Box
  // ==========================================
  return (
    <div className={`w-full space-y-2 ${className}`}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {label && (
        <label className="text-xs font-semibold text-[#0f1f17] block">
          {label}
        </label>
      )}

      {/* Main Dropzone Box */}
      <div
        onClick={triggerSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer p-4 sm:p-6 flex flex-col items-center justify-center text-center ${
          activeSize.dropzone
        } ${
          isDragging
            ? "border-[#c48b28] bg-amber-50/40 ring-4 ring-[#c48b28]/10"
            : "border-[#dce3df] hover:border-[#0a4b32] hover:bg-[#f7faf8]"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-[#0a4b32]">
            <Loader2 className="w-8 h-8 animate-spin text-[#c48b28]" />
            <p className="text-xs font-bold">Uploading file to Cloudinary...</p>
            <p className="text-[10px] text-[#5a6b62]">Please keep this window open</p>
          </div>
        ) : previewUrl ? (
          <div className="flex items-center gap-4 w-full h-full">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#e2e8e4] shadow-xs">
              <Image
                src={previewUrl}
                alt="Uploaded Preview"
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 text-left min-w-0">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Image Attached</span>
              </span>
              <p className="text-xs font-semibold text-[#0f1f17] truncate mt-1">
                Image ready for submission
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerSelect();
                  }}
                  className="text-[11px] font-bold text-[#0a4b32] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#5a6b62]">
            <div className="w-10 h-10 rounded-xl bg-[#f0f7f3] text-[#0a4b32] flex items-center justify-center shadow-xs">
              <UploadCloud className="w-5 h-5 text-[#c48b28]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0f1f17]">
                Click to browse or drag and drop image
              </p>
              <p className="text-[10px] text-[#5a6b62] mt-0.5">{description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
}


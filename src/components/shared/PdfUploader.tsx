"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { uploaderService } from "@/services/uploader.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface PdfUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export default function PdfUploader({
  value = "",
  onChange,
  className = "",
}: PdfUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [mode, setMode] = useState<"upload" | "link">(value.startsWith("http") && !value.includes("cloudinary") ? "link" : "upload");
  const [externalUrl, setExternalUrl] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // 1. Validation
    const validExtensions = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".zip", ".png", ".jpg", ".jpeg"];
    const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      setUploadError("Please upload a PDF or document file (.pdf, .docx, .ppt).");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError("File size exceeds 20MB limit.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      setFileName(file.name);

      const result = await uploaderService.uploadFile(file);
      const uploadedUrl = result.secureUrl || result.url;
      onChange(uploadedUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload file.";
      setUploadError(msg);
      setFileName("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClear = () => {
    onChange("");
    setFileName("");
    setExternalUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExternalUrlBlur = () => {
    onChange(externalUrl.trim());
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Mode Toggle Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#0f1f17] flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#0a4b32]" />
          <span>Lecture Notes / PDF Material (Optional)</span>
        </label>
        <div className="flex items-center gap-1 bg-[#f0f4f1] p-0.5 rounded-lg text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              mode === "upload"
                ? "bg-white text-[#0a4b32] shadow-xs"
                : "text-[#5a6b62] hover:text-[#0f1f17]"
            }`}
          >
            Upload PDF
          </button>
          <button
            type="button"
            onClick={() => setMode("link")}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              mode === "link"
                ? "bg-white text-[#0a4b32] shadow-xs"
                : "text-[#5a6b62] hover:text-[#0f1f17]"
            }`}
          >
            Drive Link
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.png,.jpg,.jpeg"
        className="hidden"
      />

      {/* Upload Mode Box */}
      {mode === "upload" && (
        <>
          {value ? (
            /* Uploaded State */
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0a4b32] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#0f1f17] truncate flex items-center gap-1.5">
                    <span>{fileName || "Lecture_Notes.pdf"}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    File uploaded &amp; attached to diary
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-[#0a4b32] hover:bg-emerald-100 rounded-lg transition-colors"
                  title="View / Download file"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Drag and Drop Box */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`p-4 rounded-xl border-2 border-dashed border-[#dce3df] bg-[#fbfdfb] hover:bg-[#f3f8f5] hover:border-[#0a4b32]/40 transition-all cursor-pointer text-center ${
                isUploading ? "opacity-75 cursor-wait" : ""
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-[#0a4b32]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#c48b28]" />
                  <span>Uploading PDF to cloud storage...</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-[#0a4b32]/10 text-[#0a4b32] mx-auto flex items-center justify-center">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-[#0f1f17]">
                    Click to browse or drop lecture note PDF
                  </p>
                  <p className="text-[11px] text-[#5a6b62]">
                    PDF, DOCX, PPT up to 20MB
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Drive Link Mode Box */}
      {mode === "link" && (
        <div className="relative">
          <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          <Input
            type="url"
            placeholder="Paste Google Drive, OneDrive, or document URL..."
            value={externalUrl}
            onChange={(e) => {
              setExternalUrl(e.target.value);
              onChange(e.target.value);
            }}
            onBlur={handleExternalUrlBlur}
            className="h-10 pl-9 text-xs rounded-xl border-[#dce3df]"
          />
        </div>
      )}

      {uploadError && (
        <p className="text-[11px] text-rose-600 font-semibold">{uploadError}</p>
      )}
    </div>
  );
}


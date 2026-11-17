"use client";

import React, { useRef } from "react";
import { FileText, Upload, FileCheck, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AboutReadmeDropzoneProps {
  readmeInfo: { name: string; size: number } | null;
  onSelectFile: (file: File) => void;
  onRemoveFile: () => void;
}

export default function AboutReadmeDropzone({
  readmeInfo,
  onSelectFile,
  onRemoveFile,
}: AboutReadmeDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Card className="border-[#e2e8e4]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-[#0f1f17] flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Upload README.md File</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Drag and drop a local markdown file to auto-populate the editor and preview.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,text/markdown"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onSelectFile(file);
          }}
        />

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) onSelectFile(file);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#cfe0d5] hover:border-[#0a4b32] bg-[#f9fbf9] hover:bg-[#f1f7f3] transition-all rounded-xl p-4 text-center cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#eef5f1] group-hover:bg-[#d6e6db] text-[#0a4b32] flex items-center justify-center mx-auto mb-2 transition-colors">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-gray-800">
            Click to upload or drag .md file
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Supports README.md, documentation, or syllabus files (up to 10MB)
          </p>
        </div>

        {readmeInfo && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-emerald-900 truncate">
                {readmeInfo.name}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFile();
              }}
              className="text-emerald-700 hover:text-emerald-900 ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Image as ImageIcon, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AboutBannerUploaderProps {
  bannerUrl: string;
  bannerPreview: string;
  onChangeBannerUrl: (val: string) => void;
  onSelectFile: (file: File) => void;
  onRemoveBanner: () => void;
}

export default function AboutBannerUploader({
  bannerUrl,
  bannerPreview,
  onChangeBannerUrl,
  onSelectFile,
  onRemoveBanner,
}: AboutBannerUploaderProps) {
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Card className="border-[#e2e8e4]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-[#0f1f17] flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-emerald-600" />
          <span>Banner Image</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onSelectFile(file);
          }}
        />

        {bannerPreview ? (
          <div className="relative h-32 rounded-xl overflow-hidden border border-gray-200 group bg-gray-100">
            <Image
              src={bannerPreview}
              alt="Banner preview"
              fill
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => bannerInputRef.current?.click()}
                className="text-xs h-7 px-2"
              >
                Change
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={onRemoveBanner}
                className="text-xs h-7 px-2"
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => bannerInputRef.current?.click()}
            className="border-2 border-dashed border-[#cfe0d5] hover:border-[#0a4b32] bg-[#f9fbf9] hover:bg-[#f1f7f3] transition-all rounded-xl p-4 text-center cursor-pointer"
          >
            <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-gray-700">Select Banner Image</p>
            <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WEBP (1200x500 recommended)</p>
          </div>
        )}

        <div>
          <Label htmlFor="banner-url" className="text-[11px] text-gray-500">
            Or provide direct Image URL
          </Label>
          <Input
            id="banner-url"
            value={bannerUrl}
            onChange={(e) => onChangeBannerUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1 h-7 text-xs"
          />
        </div>
      </CardContent>
    </Card>
  );
}

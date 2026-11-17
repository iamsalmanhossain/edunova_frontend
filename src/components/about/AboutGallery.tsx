"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface AboutGalleryProps {
  images: string[];
  onSelectImage: (url: string) => void;
}

export default function AboutGallery({ images, onSelectImage }: AboutGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="bg-white p-4 sm:p-8 rounded-2xl border border-[#e2e8e4] shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-lg font-bold text-[#0f1f17]">
            Campus Facilities &amp; Student Laboratories
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500">
            Tap any photo to view full screen
          </p>
        </div>
        <Badge variant="outline" className="text-xs text-gray-600">
          {images.length} Photos
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            onClick={() => onSelectImage(imgUrl)}
            className="relative h-36 sm:h-48 rounded-xl overflow-hidden border border-[#e2e8e4] shadow-xs group cursor-pointer bg-gray-100"
          >
            <Image
              src={imgUrl}
              alt={`Campus facility ${idx + 1}`}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/40">
                View
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

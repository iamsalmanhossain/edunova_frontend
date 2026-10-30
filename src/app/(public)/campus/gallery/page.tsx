import React from "react";
import type { Metadata } from "next";
import GallerySection from "@/components/home/GallerySection";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Institutional photo gallery showcasing campus life, laboratories, and seminars at Kishoreganj Polytechnic Institute.",
};

export default function CampusGalleryPage() {
  return (
    <div>
      <GallerySection />
    </div>
  );
}

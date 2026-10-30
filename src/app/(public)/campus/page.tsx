import React from "react";
import type { Metadata } from "next";
import FacilitiesSection from "@/components/home/FacilitiesSection";
import GallerySection from "@/components/home/GallerySection";

export const metadata: Metadata = {
  title: "Campus Environment & Facilities",
  description:
    "Explore the campus grounds, laboratories, library, and facilities at Kishoreganj Polytechnic Institute.",
};

export default function CampusPage() {
  return (
    <div>
      <FacilitiesSection />
      <GallerySection />
    </div>
  );
}

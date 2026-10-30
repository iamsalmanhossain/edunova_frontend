import React from "react";
import type { Metadata } from "next";
import FacilitiesSection from "@/components/home/FacilitiesSection";

export const metadata: Metadata = {
  title: "Campus Facilities & Workshops",
  description:
    "Comprehensive engineering workshops, computing centers, and technical laboratories.",
};

export default function CampusFacilitiesPage() {
  return (
    <div>
      <FacilitiesSection />
    </div>
  );
}

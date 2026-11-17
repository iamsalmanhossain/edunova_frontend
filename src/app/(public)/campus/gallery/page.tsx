import React from "react";
import type { Metadata } from "next";
import CampusGalleryClient from "@/components/campus/gallery/CampusGalleryClient";
import { campusService } from "@/services/campus.service";

export const metadata: Metadata = {
  title: "Photo Gallery | Kishoreganj Government Polytechnic Institute",
  description:
    "Explore the visual archive of Kishoreganj Government Polytechnic Institute (KIGPI) featuring modern laboratories, workshops, tech exhibitions, and campus life.",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function CampusGalleryPage() {
  const initialGalleries = await campusService.getGalleries();

  return <CampusGalleryClient initialGalleries={initialGalleries} />;
}

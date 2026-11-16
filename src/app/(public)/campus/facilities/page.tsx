import React from "react";
import type { Metadata } from "next";
import CampusFacilitiesClient from "@/components/campus/facilities/CampusFacilitiesClient";
import { campusService } from "@/services/campus.service";

export const metadata: Metadata = {
  title: "Campus Facilities & Workshops | Kishoreganj Polytechnic Institute",
  description:
    "Comprehensive engineering workshops, computer software laboratories, digital library, and technical training infrastructure.",
};

export const revalidate = 60;

export default async function CampusFacilitiesPage() {
  const initialFacilities = await campusService.getFacilities();

  return <CampusFacilitiesClient initialFacilities={initialFacilities} />;
}

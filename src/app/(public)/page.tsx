import React from "react";
import HeroSection from "@/components/home/HeroSection";
import HighlightsStrip from "@/components/home/HighlightsStrip";
import InstituteOverview from "@/components/home/InstituteOverview";
import DepartmentsSection from "@/components/home/DepartmentsSection";
import LeadershipSection from "@/components/home/LeadershipSection";
import AcademicsSection from "@/components/home/AcademicsSection";
import FacilitiesSection from "@/components/home/FacilitiesSection";
import GallerySection from "@/components/home/GallerySection";
import PortalCTA from "@/components/home/PortalCTA";
import DeveloperSection from "@/components/home/DeveloperSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HighlightsStrip />
      <InstituteOverview />
      <DepartmentsSection />
      <LeadershipSection />
      <AcademicsSection />
      <FacilitiesSection />
      <GallerySection />
      <PortalCTA />
      <DeveloperSection />
    </>
  );
}


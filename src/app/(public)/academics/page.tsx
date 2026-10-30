import React from "react";
import type { Metadata } from "next";
import AcademicsSection from "@/components/home/AcademicsSection";

export const metadata: Metadata = {
  title: "Academic System & Regulations",
  description:
    "Comprehensive academic system, semester structure, and regulations at Kishoreganj Polytechnic Institute.",
};

export default function AcademicsPage() {
  return (
    <div>
      <AcademicsSection />
    </div>
  );
}

import React from "react";
import type { Metadata } from "next";
import DepartmentsSection from "@/components/home/DepartmentsSection";

export const metadata: Metadata = {
  title: "Engineering Departments",
  description:
    "Explore our 4 accredited engineering departments at Kishoreganj Polytechnic Institute.",
};

export default function DepartmentsPage() {
  return (
    <div>
      <DepartmentsSection />
    </div>
  );
}

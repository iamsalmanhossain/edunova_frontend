import React from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { departmentService, VERIFIED_DEPARTMENTS } from "@/services/department.service";
import DepartmentCard from "./DepartmentCard";

export default async function DepartmentsSection() {
  const departments = await departmentService.getDepartments();
  const rawList = departments.length >= 4 ? departments : VERIFIED_DEPARTMENTS;

  // Enforce exact order: CST -> FOOD -> ENT -> RAC
  const TARGET_CODES = ["CST", "FOOD", "ENT", "RAC"];
  const displayDepartments = TARGET_CODES.map((code) => {
    return (
      rawList.find((d) => d.code.toUpperCase() === code) ||
      VERIFIED_DEPARTMENTS.find((d) => d.code.toUpperCase() === code)!
    );
  }).filter(Boolean);

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#fbfdfb] via-white to-[#f8faf8] border-b border-[#e2e8e4]/70 relative overflow-hidden">
      {/* Subtle Background Glow Shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <Container size="wide" className="relative z-10">
        <SectionHeading
          badge="Academic Engineering Disciplines"
          title="Our 4 Core Engineering Departments"
          subtitle="Kishoreganj Polytechnic Institute offers 4 specialized 4-year Diploma in Engineering departments equipped with state-of-the-art laboratories, modern workshops, and dual-shift instruction."
          className="mb-10 sm:mb-14"
        />

        {/* 4-Column Responsive Grid with Smooth Hover & 3D Tilt Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch">
          {displayDepartments.map((dept, index) => (
            <DepartmentCard key={dept.code} dept={dept} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}

"use client";

import React from "react";
import { InstitutionStaff } from "@/types/staff";
import StaffCard from "@/components/shared/StaffCard";

interface StaffGridProps {
  staffList: InstitutionStaff[];
  centeredIfSingle?: boolean;
}

export default function StaffGrid({ staffList, centeredIfSingle = false }: StaffGridProps) {
  if (staffList.length === 0) return null;

  // Single card centering (e.g. for single Chief Instructor or single Instructor)
  if (centeredIfSingle && staffList.length === 1) {
    return (
      <div className="flex justify-center w-full my-2">
        <div className="w-full max-w-sm">
          <StaffCard staff={staffList[0]} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {staffList.map((staff) => (
        <StaffCard key={staff.id} staff={staff} />
      ))}
    </div>
  );
}

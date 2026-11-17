"use client";

import React from "react";
import { InstitutionStaff } from "@/types/staff";
import StaffCard from "@/components/shared/StaffCard";

interface StaffGridProps {
  staffList: InstitutionStaff[];
  centeredIfSingle?: boolean;
}

export default function StaffGrid({ staffList }: StaffGridProps) {
  if (staffList.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-6 w-full">
      {staffList.map((staff) => (
        <div
          key={staff.id}
          className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-sm flex"
        >
          <StaffCard staff={staff} />
        </div>
      ))}
    </div>
  );
}

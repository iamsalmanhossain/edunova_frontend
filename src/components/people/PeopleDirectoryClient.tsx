"use client";

import React from "react";
import { InstitutionStaff } from "@/types/staff";
import StaffDirectory from "./StaffDirectory";

interface PeopleDirectoryClientProps {
  initialStaff: InstitutionStaff[];
  activeCategory?: string;
}

export default function PeopleDirectoryClient({
  initialStaff,
  activeCategory = "ALL",
}: PeopleDirectoryClientProps) {
  // If activeCategory is FACULTY, default to DEPARTMENT or ALL; otherwise ALL
  const defaultView = activeCategory === "FACULTY" ? "DEPARTMENT" : "ALL";

  return (
    <StaffDirectory
      initialStaff={initialStaff}
      defaultView={defaultView}
      activeCategory={activeCategory}
    />
  );
}

export { StaffDirectory };

"use client";

import React from "react";
import { InstitutionStaff, InstitutionStaffRole, ROLE_LABELS } from "@/types/staff";
import StaffRoleSection from "./StaffRoleSection";
import StaffEmptyState from "./StaffEmptyState";
import { OTHER_STAFF_ROLES } from "./OtherStaffRoleFilter";

interface OtherStaffSectionProps {
  staffList: InstitutionStaff[];
  selectedRole: string; // "ALL" or specific role
  onResetFilter?: () => void;
}

export default function OtherStaffSection({
  staffList,
  selectedRole,
  onResetFilter,
}: OtherStaffSectionProps) {
  // Determine which roles to display in exact hierarchical order
  const rolesToDisplay = (
    selectedRole === "ALL"
      ? OTHER_STAFF_ROLES
      : OTHER_STAFF_ROLES.filter((r) => r === selectedRole)
  );

  // Group staff by role
  const staffByRole = new Map<InstitutionStaffRole, InstitutionStaff[]>();
  OTHER_STAFF_ROLES.forEach((r) => staffByRole.set(r, []));

  staffList.forEach((staff) => {
    const list = staffByRole.get(staff.role);
    if (list) {
      list.push(staff);
    }
  });

  // Check if any role to display actually has staff
  const visibleRolesWithStaff = rolesToDisplay.filter((role) => {
    const count = staffByRole.get(role)?.length || 0;
    return count > 0;
  });

  if (visibleRolesWithStaff.length === 0) {
    return (
      <StaffEmptyState
        title="No other staff members found"
        message={
          selectedRole !== "ALL"
            ? `There are currently no staff members listed under ${
                ROLE_LABELS[selectedRole as InstitutionStaffRole] || selectedRole
              }.`
            : "No institutional officers or non-instructional personnel match your current search criteria."
        }
        onReset={onResetFilter}
      />
    );
  }

  return (
    <div className="space-y-10">
      {rolesToDisplay.map((role) => {
        const staffInRole = staffByRole.get(role) || [];
        if (staffInRole.length === 0) return null;

        return (
          <StaffRoleSection
            key={role}
            role={role}
            staffList={staffInRole}
          />
        );
      })}
    </div>
  );
}


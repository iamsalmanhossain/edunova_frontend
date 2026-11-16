"use client";

import React from "react";
import { InstitutionStaff, InstitutionStaffRole, ROLE_LABELS } from "@/types/staff";
import StaffGrid from "./StaffGrid";
import {
  GraduationCap,
  Building2,
  Shield,
  Briefcase,
  Compass,
  BookOpen,
  Award,
  Users,
} from "lucide-react";

interface StaffRoleSectionProps {
  role: InstitutionStaffRole;
  staffList: InstitutionStaff[];
  customTitle?: string;
  customSubtitle?: string;
  centeredIfSingle?: boolean;
}

export default function StaffRoleSection({
  role,
  staffList,
  customTitle,
  customSubtitle,
  centeredIfSingle = false,
}: StaffRoleSectionProps) {
  if (staffList.length === 0) return null;

  const title = customTitle || ROLE_LABELS[role] || role;

  const getRoleIcon = () => {
    switch (role) {
      case "PRINCIPAL":
        return <Award className="w-4 h-4 text-amber-600" />;
      case "CHIEF_INSTRUCTOR":
        return <GraduationCap className="w-4 h-4 text-emerald-700" />;
      case "INSTRUCTOR":
      case "JUNIOR_INSTRUCTOR":
        return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      case "JOB_PLACEMENT_CELL":
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case "ROVER_SCOUT_UNIT":
        return <Compass className="w-4 h-4 text-purple-600" />;
      case "LIBRARY":
        return <BookOpen className="w-4 h-4 text-teal-600" />;
      case "SECURITY_SECTION":
        return <Shield className="w-4 h-4 text-rose-600" />;
      default:
        return <Building2 className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <section className="space-y-4 pt-4 border-t border-[#e2e8e4]/70 first:border-t-0 first:pt-0">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#eef5f1] flex items-center justify-center shrink-0 border border-[#d6e6db]">
            {getRoleIcon()}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0f1f17] flex items-center gap-2">
              <span>{title}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef4f0] text-[#0a4b32] font-extrabold border border-[#d2e2d6]">
                {staffList.length}
              </span>
            </h3>
            {customSubtitle && (
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {customSubtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <StaffGrid staffList={staffList} centeredIfSingle={centeredIfSingle} />
    </section>
  );
}

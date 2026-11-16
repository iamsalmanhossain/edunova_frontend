"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Building2,
  Shield,
  Briefcase,
  GraduationCap,
  Award,
  Compass,
  BookOpen,
  Clock,
} from "lucide-react";
import { InstitutionStaff, ROLE_LABELS, InstitutionStaffRole } from "@/types/staff";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const DEFAULT_AVATAR = "/images/default-avatar.svg";

interface StaffCardProps {
  staff: InstitutionStaff;
  featured?: boolean;
}

export default function StaffCard({ staff, featured = false }: StaffCardProps) {
  const [imageError, setImageError] = useState(false);

  const name = staff.resolvedName || staff.name || "Unnamed Personnel";
  const rawAvatarUrl = staff.resolvedAvatarUrl || staff.avatarUrl;
  const { designation, role, shift, department, institute } = staff;

  const getRoleIcon = (staffRole: InstitutionStaffRole) => {
    switch (staffRole) {
      case "PRINCIPAL":
        return <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case "CHIEF_INSTRUCTOR":
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-700 shrink-0" />;
      case "INSTRUCTOR":
      case "JUNIOR_INSTRUCTOR":
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case "JOB_PLACEMENT_CELL":
        return <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case "ROVER_SCOUT_UNIT":
        return <Compass className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
      case "LIBRARY":
        return <BookOpen className="w-3.5 h-3.5 text-teal-600 shrink-0" />;
      case "SECURITY_SECTION":
        return <Shield className="w-3.5 h-3.5 text-rose-600 shrink-0" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />;
    }
  };

  const getRoleBadgeVariant = (staffRole: InstitutionStaffRole) => {
    switch (staffRole) {
      case "PRINCIPAL":
        return "bg-amber-100 text-amber-900 border-amber-300 font-bold";
      case "CHIEF_INSTRUCTOR":
        return "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold";
      case "INSTRUCTOR":
      case "JUNIOR_INSTRUCTOR":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 font-medium";
      case "ADMINISTRATIVE_SECTION":
      case "ACCOUNTS_SECTION":
        return "bg-blue-50 text-blue-800 border-blue-200 font-medium";
      case "JOB_PLACEMENT_CELL":
      case "ROVER_SCOUT_UNIT":
      case "LIBRARY":
        return "bg-purple-50 text-purple-800 border-purple-200 font-medium";
      case "SECURITY_SECTION":
        return "bg-rose-50 text-rose-800 border-rose-200 font-medium";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 font-medium";
    }
  };

  const hasValidImage = Boolean(rawAvatarUrl) && !imageError;

  // 1. Featured card (for Principal or prominent view)
  if (featured) {
    return (
      <Card className="group relative overflow-hidden border border-[#0a4b32]/25 rounded-2xl shadow-md hover:shadow-2xl hover:shadow-[#0a4b32]/15 hover:-translate-y-1.5 transition-all duration-300 ease-out bg-gradient-to-br from-white via-white to-[#f0f7f3]">
        {/* Top Glowing Shimmer Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#0a4b32] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 items-center">
          <div className="md:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-40 h-40 xs:w-48 xs:h-48 sm:w-52 sm:h-52 rounded-2xl overflow-hidden ring-4 ring-[#0a4b32]/15 shadow-md bg-gradient-to-b from-[#f8faf9] to-[#edf3ef]">
              {hasValidImage ? (
                <Image
                  src={rawAvatarUrl!}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 192px, 208px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center p-6">
                  <div className="relative w-28 h-28 xs:w-36 xs:h-36 sm:w-40 sm:h-40 transition-transform duration-500 ease-out group-hover:scale-108 group-hover:-translate-y-0.5">
                    <Image
                      src={DEFAULT_AVATAR}
                      alt={name}
                      fill
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border shadow-xs transition-transform duration-200 group-hover:scale-105 ${getRoleBadgeVariant(
                  role
                )}`}
              >
                {getRoleIcon(role)}
                <span>{ROLE_LABELS[role] || role}</span>
              </span>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col justify-center min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <Badge variant="secondary" className="text-xs bg-[#eef4f0] text-[#0a4b32] font-semibold border border-[#d2e2d6]">
                {institute?.name || "Kishoreganj Polytechnic Institute"}
              </Badge>
              {shift && (
                <Badge variant="outline" className="text-[11px] bg-white border-[#d2e2d6] text-gray-700 inline-flex items-center gap-1 shadow-2xs">
                  <Clock className="w-3 h-3 text-[#c48b28]" />
                  <span>{shift === "FIRST_SHIFT" ? "1st Shift" : "2nd Shift"}</span>
                </Badge>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f1f17] tracking-tight break-words group-hover:text-[#0a4b32] transition-colors duration-200">
              {name}
            </h3>
            <p className="text-base sm:text-lg font-semibold text-[#0a4b32] mt-1">
              {designation}
            </p>

            {department && (
              <p className="text-sm text-[#4a5b52] mt-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#c48b28] shrink-0" />
                <span className="font-medium">{department.name}</span>
                {department.code && (
                  <span className="text-xs text-gray-400">({department.code})</span>
                )}
              </p>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // 2. Standard Grid Profile Card with Modern Hover Animation
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-[#e2e8e4] bg-white flex flex-col justify-between w-full transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[#0a4b32]/50 hover:shadow-[0_22px_40px_-12px_rgba(10,75,50,0.18)] cursor-default">
      {/* Top Glowing Shimmer Accent Line on Hover */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#0a4b32] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none" />

      {/* Profile Image / Avatar container */}
      <div className="relative h-56 xs:h-60 w-full overflow-hidden bg-gradient-to-b from-[#f8faf9] to-[#edf3ef]">
        {hasValidImage ? (
          <>
            <Image
              src={rawAvatarUrl!}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
              loading="lazy"
              onError={() => setImageError(true)}
            />
            {/* Ambient vignette on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
          </>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-6">
            <div className="relative w-28 h-28 xs:w-32 xs:h-32 transition-transform duration-500 ease-out group-hover:scale-108 group-hover:-translate-y-0.5">
              <Image
                src={DEFAULT_AVATAR}
                alt={name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-contain"
                loading="lazy"
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Top Badges (Shift indicator) */}
        {shift && (
          <div className="absolute top-3 right-3 z-20">
            <Badge
              variant="secondary"
              className="text-[10px] bg-white/95 backdrop-blur-md font-semibold shadow-xs border border-gray-200/90 text-gray-700 px-2.5 py-0.5 rounded-full transition-all group-hover:bg-white group-hover:shadow-sm"
            >
              {shift === "FIRST_SHIFT" ? "1st Shift" : "2nd Shift"}
            </Badge>
          </div>
        )}

        {/* Bottom Badge (Role designation) */}
        <div className="absolute bottom-3 left-3 max-w-[88%] z-20">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] border shadow-xs backdrop-blur-md transition-all duration-200 group-hover:shadow-sm ${getRoleBadgeVariant(
              role
            )}`}
          >
            {getRoleIcon(role)}
            <span className="truncate">{ROLE_LABELS[role] || role}</span>
          </span>
        </div>
      </div>

      {/* Profile Details */}
      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4 min-w-0">
        <div>
          <h4
            className="text-base font-bold text-[#0f1f17] group-hover:text-[#0a4b32] transition-colors duration-200 leading-snug break-words line-clamp-2"
            title={name}
          >
            {name}
          </h4>
          <p className="text-xs sm:text-sm font-semibold text-[#0a4b32] mt-1 line-clamp-1" title={designation}>
            {designation}
          </p>

          {department && (
            <p className="text-xs text-[#5a6b62] mt-2 flex items-center gap-1.5 truncate group-hover:text-gray-800 transition-colors">
              <Building2 className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
              <span className="truncate" title={department.name}>
                {department.name}
              </span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
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

const DEFAULT_AVATAR = "/images/default-avatar.png";

interface StaffCardProps {
  staff: InstitutionStaff;
  featured?: boolean;
}

export default function StaffCard({ staff, featured = false }: StaffCardProps) {
  const [imageError, setImageError] = useState(false);

  const name = staff.resolvedName || staff.name || "Unnamed Personnel";
  const email = staff.resolvedEmail || staff.email;
  const phone = staff.resolvedPhone || staff.phone;
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
      <Card className="overflow-hidden border border-[#0a4b32]/25 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white via-white to-[#f0f7f3]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 items-center">
          <div className="md:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-40 h-40 xs:w-48 xs:h-48 sm:w-52 sm:h-52 rounded-2xl overflow-hidden ring-4 ring-[#0a4b32]/15 shadow-md bg-white">
              {hasValidImage ? (
                <Image
                  src={rawAvatarUrl!}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 192px, 208px"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="relative w-full h-full bg-[#f8faf9] flex items-center justify-center p-3">
                  <Image
                    src={DEFAULT_AVATAR}
                    alt={name}
                    fill
                    className="object-contain p-4"
                    priority
                  />
                </div>
              )}
            </div>
            <div className="mt-3.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border shadow-xs ${getRoleBadgeVariant(
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
                <Badge variant="outline" className="text-[11px] bg-white border-[#d2e2d6] text-gray-700 inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#c48b28]" />
                  <span>{shift === "FIRST_SHIFT" ? "1st Shift" : "2nd Shift"}</span>
                </Badge>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f1f17] tracking-tight break-words">
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

            <div className="mt-6 pt-5 border-t border-[#e2e8e4] flex flex-wrap gap-4 text-xs sm:text-sm text-[#5a6b62]">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#e2e8e4] hover:border-[#0a4b32] hover:text-[#0a4b32] transition-colors break-all shadow-xs"
                >
                  <Mail className="w-4 h-4 text-[#0a4b32] shrink-0" />
                  <span>{email}</span>
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#e2e8e4] hover:border-[#0a4b32] hover:text-[#0a4b32] transition-colors shadow-xs"
                >
                  <Phone className="w-4 h-4 text-[#0a4b32] shrink-0" />
                  <span>{phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // 2. Standard Grid Profile Card
  return (
    <Card className="group overflow-hidden border border-[#e2e8e4] hover:border-[#0a4b32]/40 hover:shadow-lg transition-all duration-300 bg-white flex flex-col min-w-0 rounded-xl w-full">
      {/* Profile Image / Avatar container */}
      <div className="relative h-52 xs:h-56 w-full overflow-hidden bg-white">
        {hasValidImage ? (
          <Image
            src={rawAvatarUrl!}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="relative w-full h-full bg-[#f8faf9] flex items-center justify-center p-3">
            <Image
              src={DEFAULT_AVATAR}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        {/* Top Badges (Shift indicator) */}
        {shift && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <Badge
              variant="secondary"
              className="text-[10px] bg-white/95 backdrop-blur-xs font-semibold shadow-xs border border-gray-200 text-gray-700 px-2 py-0.5"
            >
              {shift === "FIRST_SHIFT" ? "1st Shift" : "2nd Shift"}
            </Badge>
          </div>
        )}

        {/* Bottom Badge (Role designation) */}
        <div className="absolute bottom-2.5 left-2.5 max-w-[88%] z-10">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] border shadow-xs backdrop-blur-xs ${getRoleBadgeVariant(
              role
            )}`}
          >
            {getRoleIcon(role)}
            <span className="truncate">{ROLE_LABELS[role] || role}</span>
          </span>
        </div>
      </div>

      {/* Profile Details */}
      <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 min-w-0">
        <div>
          <h4
            className="text-base font-bold text-[#0f1f17] group-hover:text-[#0a4b32] transition-colors leading-snug break-words line-clamp-2"
            title={name}
          >
            {name}
          </h4>
          <p className="text-xs sm:text-sm font-medium text-[#0a4b32] mt-0.5 line-clamp-1" title={designation}>
            {designation}
          </p>

          {department && (
            <p className="text-xs text-[#5a6b62] mt-2 flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
              <span className="truncate" title={department.name}>
                {department.name}
              </span>
            </p>
          )}
        </div>

        {/* Contact Links */}
        <div className="pt-2.5 border-t border-[#e2e8e4]/80 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5a6b62]">
          {email ? (
            <a
              href={`mailto:${email}`}
              className="hover:text-[#0a4b32] transition-colors inline-flex items-center gap-1 text-[11px] truncate max-w-[170px]"
              title={email}
            >
              <Mail className="w-3 h-3 shrink-0 text-[#0a4b32]" />
              <span className="truncate">{email}</span>
            </a>
          ) : (
            <span className="text-[10px] text-gray-400">Institutional Staff</span>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="hover:text-[#0a4b32] transition-colors inline-flex items-center gap-1 text-[11px] shrink-0 ml-auto"
              title={phone}
            >
              <Phone className="w-3 h-3 shrink-0 text-[#0a4b32]" />
              <span>{phone}</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

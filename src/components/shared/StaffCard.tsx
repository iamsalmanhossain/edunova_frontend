import React from "react";
import Image from "next/image";
import { Mail, Phone, Building2, Shield, Briefcase, GraduationCap, Award, Compass, BookOpen } from "lucide-react";
import { InstitutionStaff, ROLE_LABELS } from "@/types/staff";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface StaffCardProps {
  staff: InstitutionStaff;
  featured?: boolean;
}

export default function StaffCard({ staff, featured = false }: StaffCardProps) {
  const name = staff.resolvedName || staff.name || "Unnamed Staff";
  const email = staff.resolvedEmail || staff.email;
  const phone = staff.resolvedPhone || staff.phone;
  const avatarUrl = staff.resolvedAvatarUrl || staff.avatarUrl;
  const { designation, role, shift, department, institute } = staff;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const getRoleIcon = () => {
    switch (role) {
      case "PRINCIPAL":
        return <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case "CHIEF_INSTRUCTOR":
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
        return <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
    }
  };

  const getRoleBadgeVariant = () => {
    switch (role) {
      case "PRINCIPAL":
        return "bg-amber-100 text-amber-900 border-amber-300 font-bold";
      case "CHIEF_INSTRUCTOR":
        return "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold";
      case "INSTRUCTOR":
      case "JUNIOR_INSTRUCTOR":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "ADMINISTRATIVE_SECTION":
      case "ACCOUNTS_SECTION":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "JOB_PLACEMENT_CELL":
      case "ROVER_SCOUT_UNIT":
      case "LIBRARY":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "SECURITY_SECTION":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (featured) {
    return (
      <Card className="overflow-hidden border border-[#0a4b32]/30 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-white via-white to-[#f0f7f3]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 p-5 sm:p-8 items-center">
          <div className="md:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-36 h-36 xs:w-44 xs:h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden ring-4 ring-[#0a4b32]/10 shadow-md bg-[#e6ede8]">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 180px, 208px"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#0a4b32] text-white text-3xl font-bold">
                  {initials}
                </div>
              )}
            </div>
            <div className="mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${getRoleBadgeVariant()}`}>
                {getRoleIcon()}
                <span>{ROLE_LABELS[role] || role}</span>
              </span>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col justify-center min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {institute?.name || "Kishoreganj Polytechnic Institute"}
              </Badge>
              {shift && (
                <Badge variant="outline" className="text-[11px] bg-white">
                  {shift === "FIRST_SHIFT" ? "1st Shift" : "2nd Shift"}
                </Badge>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-[#0f1f17] break-words">
              {name}
            </h3>
            <p className="text-base sm:text-lg font-semibold text-[#0a4b32] mt-1">
              {designation}
            </p>

            <div className="mt-6 pt-5 border-t border-[#e2e8e4] flex flex-wrap gap-4 text-xs sm:text-sm text-[#5a6b62]">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 hover:text-[#0a4b32] transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-[#0a4b32] shrink-0" />
                  <span>{email}</span>
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 hover:text-[#0a4b32] transition-colors"
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

  return (
    <Card className="group overflow-hidden border border-[#e2e8e4] hover:border-[#0a4b32]/40 hover:shadow-md transition-all duration-200 bg-white flex flex-col min-w-0">
      <div className="relative h-48 xs:h-56 w-full overflow-hidden bg-[#e6ede8]">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f0f7f3] to-[#e1ece5] text-[#0a4b32] text-2xl font-bold">
            {initials}
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
          {shift && (
            <Badge variant="secondary" className="text-[10px] bg-white/95 backdrop-blur-xs font-semibold shadow-xs">
              {shift === "FIRST_SHIFT" ? "1st Shift" : "2nd Shift"}
            </Badge>
          )}
        </div>

        <div className="absolute bottom-2.5 left-2.5 max-w-[85%]">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] border shadow-xs backdrop-blur-xs ${getRoleBadgeVariant()}`}>
            {getRoleIcon()}
            <span className="truncate">{ROLE_LABELS[role] || role}</span>
          </span>
        </div>
      </div>

      <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 min-w-0">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-[#0f1f17] group-hover:text-[#0a4b32] transition-colors leading-snug break-words">
            {name}
          </h4>
          <p className="text-xs sm:text-sm font-semibold text-[#0a4b32] mt-0.5">
            {designation}
          </p>
          {department && (
            <p className="text-xs text-[#5a6b62] mt-1.5 flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
              <span className="truncate">{department.name}</span>
            </p>
          )}
        </div>

        <div className="pt-2.5 border-t border-[#e2e8e4]/80 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5a6b62]">
          {email ? (
            <a
              href={`mailto:${email}`}
              className="hover:text-[#0a4b32] transition-colors inline-flex items-center gap-1 text-[11px] truncate"
              title={email}
            >
              <Mail className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[140px]">{email}</span>
            </a>
          ) : (
            <span className="text-[10px] text-gray-400">Institutional Staff</span>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="hover:text-[#0a4b32] transition-colors inline-flex items-center gap-1 text-[11px]"
              title={phone}
            >
              <Phone className="w-3 h-3 shrink-0" />
              <span>{phone}</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

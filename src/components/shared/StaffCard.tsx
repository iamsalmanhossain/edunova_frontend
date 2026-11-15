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

  return (
    <Card className="p-4">
      <h4>{name}</h4>
      <p>{designation}</p>
    </Card>
  );
}

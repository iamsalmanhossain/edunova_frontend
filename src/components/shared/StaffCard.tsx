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
  return (
    <Card className="p-4">
      <h4>{name}</h4>
      <p>{designation}</p>
    </Card>
  );
}

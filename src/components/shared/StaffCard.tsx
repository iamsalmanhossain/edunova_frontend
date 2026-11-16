"use client";

import React, { useState, useRef, useCallback } from "react";
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
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { InstitutionStaff, ROLE_LABELS, InstitutionStaffRole } from "@/types/staff";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { isValidImageUrl } from "@/lib/utils";

const DEFAULT_AVATAR = "/images/default-avatar.svg";

interface StaffCardProps {
  staff: InstitutionStaff;
  featured?: boolean;
}

export default function StaffCard({ staff, featured = false }: StaffCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 150, y: 150 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [copiedEmail, setCopiedEmail] = useState(false);

  const name = staff.resolvedName || staff.name || staff.user?.name || "Unnamed Personnel";
  const email = staff.user?.email || null;
  const phone = staff.user?.phone || null;
  const rawAvatarUrl = staff.resolvedAvatarUrl || staff.avatarUrl || staff.user?.avatarUrl;
  const { designation, role, shift, department, institute } = staff;

  // Track cursor position for dynamic 3D perspective tilt & interactive spotlight
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Subtle 3D tilt (-5deg to +5deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4.5;
    const rotateY = ((x - centerX) / centerX) * 4.5;
    setRotate({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const copyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 1800);
  };

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
        return "bg-amber-100/90 text-amber-900 border-amber-300/80 font-bold shadow-2xs";
      case "CHIEF_INSTRUCTOR":
        return "bg-emerald-100/90 text-emerald-900 border-emerald-300/80 font-semibold shadow-2xs";
      case "INSTRUCTOR":
      case "JUNIOR_INSTRUCTOR":
        return "bg-emerald-50/90 text-emerald-800 border-emerald-200/80 font-medium shadow-2xs";
      case "ADMINISTRATIVE_SECTION":
      case "ACCOUNTS_SECTION":
        return "bg-blue-50/90 text-blue-800 border-blue-200/80 font-medium shadow-2xs";
      case "JOB_PLACEMENT_CELL":
      case "ROVER_SCOUT_UNIT":
      case "LIBRARY":
        return "bg-purple-50/90 text-purple-800 border-purple-200/80 font-medium shadow-2xs";
      case "SECURITY_SECTION":
        return "bg-rose-50/90 text-rose-800 border-rose-200/80 font-medium shadow-2xs";
      default:
        return "bg-slate-100/90 text-slate-700 border-slate-200/80 font-medium shadow-2xs";
    }
  };

  const hasValidImage = isValidImageUrl(rawAvatarUrl) && !imageError;

  // --------------------------------------------------------------------------
  // 1. Featured card (Executive layout for Principal)
  // --------------------------------------------------------------------------
  if (featured) {
    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full relative"
        style={{
          perspective: 1200,
        }}
      >
        <Card
          className="group relative overflow-hidden rounded-3xl border border-[#0a4b32]/20 bg-gradient-to-br from-white via-white to-[#f0f7f3] p-0 shadow-lg transition-all"
          style={{
            transform: isHovered
              ? `rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) translateY(-6px) scale3d(1.01, 1.01, 1.01)`
              : "rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)",
            transformStyle: "preserve-3d",
            transition: isHovered
              ? "transform 0.12s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out"
              : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease-out, border-color 0.5s ease-out",
            boxShadow: isHovered
              ? "0 28px 50px -15px rgba(10, 75, 50, 0.22), 0 0 0 1px rgba(10, 75, 50, 0.3)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(226, 232, 228, 0.8)",
          }}
        >
          {/* Interactive Mouse Spotlight Gradient */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-10"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(10, 75, 50, 0.14), transparent 70%)`,
            }}
          />

          {/* Top Moving Laser Light Shimmer */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#c48b28] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 items-center relative z-20">
            {/* Left Photo Column with 3D elevation */}
            <div
              className="md:col-span-4 flex flex-col items-center text-center"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="relative w-40 h-40 xs:w-48 xs:h-48 sm:w-52 sm:h-52 rounded-2xl overflow-hidden ring-4 ring-[#0a4b32]/15 shadow-xl bg-gradient-to-b from-[#f8faf9] to-[#edf3ef]">
                {hasValidImage ? (
                  <Image
                    src={rawAvatarUrl!}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 192px, 208px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    priority
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-6">
                    <div className="relative w-28 h-28 xs:w-36 xs:h-36 sm:w-40 sm:h-40 transition-transform duration-700 ease-out group-hover:scale-110">
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
                {/* Soft ambient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              <div className="mt-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs border backdrop-blur-md transition-all duration-300 group-hover:scale-105 ${getRoleBadgeVariant(
                    role
                  )}`}
                >
                  {getRoleIcon(role)}
                  <span>{ROLE_LABELS[role] || role}</span>
                </span>
              </div>
            </div>

            {/* Right Details Column with 3D elevation */}
            <div
              className="md:col-span-8 flex flex-col justify-center min-w-0"
              style={{ transform: "translateZ(20px)" }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <Badge
                  variant="secondary"
                  className="text-xs bg-[#eef4f0] text-[#0a4b32] font-semibold border border-[#d2e2d6] shadow-2xs"
                >
                  <Sparkles className="w-3 h-3 mr-1 text-[#c48b28]" />
                  {institute?.name || "Kishoreganj Polytechnic Institute"}
                </Badge>
                {shift && (
                  <Badge
                    variant="outline"
                    className="text-[11px] bg-white border-[#d2e2d6] text-gray-700 inline-flex items-center gap-1 shadow-2xs"
                  >
                    <Clock className="w-3 h-3 text-[#c48b28]" />
                    <span>{shift === "FIRST_SHIFT" ? "1st Shift" : "2nd Shift"}</span>
                  </Badge>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#0f1f17] tracking-tight break-words group-hover:text-[#0a4b32] transition-colors duration-300">
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

              <div className="mt-6 pt-5 border-t border-[#e2e8e4]/80 flex flex-wrap gap-3 text-xs sm:text-sm text-[#5a6b62]">
                {email && (
                  <div className="inline-flex items-center gap-1 rounded-xl bg-white border border-[#e2e8e4] p-1 shadow-xs hover:border-[#0a4b32]/40 transition-colors">
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 px-3 py-1 text-gray-700 hover:text-[#0a4b32] transition-colors break-all"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#0a4b32] shrink-0" />
                      <span>{email}</span>
                    </a>
                    <button
                      type="button"
                      onClick={copyEmail}
                      title="Copy email address"
                      className="p-1.5 rounded-lg hover:bg-[#eef4f0] text-gray-400 hover:text-[#0a4b32] transition-colors cursor-pointer"
                    >
                      {copiedEmail ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#e2e8e4] hover:border-[#0a4b32] hover:text-[#0a4b32] hover:bg-[#0a4b32]/5 transition-all duration-200 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#0a4b32] shrink-0" />
                    <span>{phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. Standard Grid Profile Card (Advanced 3D Tilt + Cursor Spotlight + Aurora Glow)
  // --------------------------------------------------------------------------
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full relative h-full flex"
      style={{
        perspective: 1000,
      }}
    >
      <Card
        className="group relative overflow-hidden rounded-2xl border bg-white flex flex-col justify-between w-full cursor-default select-none p-0"
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`
            : "rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)",
          transformStyle: "preserve-3d",
          transition: isHovered
            ? "transform 0.12s ease-out, box-shadow 0.25s ease-out, border-color 0.25s ease-out"
            : "transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.45s ease-out, border-color 0.45s ease-out",
          boxShadow: isHovered
            ? "0 24px 45px -12px rgba(10, 75, 50, 0.24), 0 0 0 1px rgba(10, 75, 50, 0.4)"
            : "0 4px 15px -2px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(226, 232, 228, 0.85)",
          borderColor: isHovered ? "rgba(10, 75, 50, 0.4)" : "#e2e8e4",
        }}
      >
        {/* Dynamic Cursor Spotlight Radial Glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-10"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(360px circle at ${mousePos.x}px ${mousePos.y}px, rgba(10, 75, 50, 0.12), transparent 75%)`,
          }}
        />

        {/* Top Shimmer Gradient Laser Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#0a4b32] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none" />

        {/* Media Container with 3D Depth Layer */}
        <div
          className="relative h-56 xs:h-60 w-full overflow-hidden bg-gradient-to-b from-[#f8faf9] to-[#edf3ef]"
          style={{ transform: "translateZ(15px)" }}
        >
          {hasValidImage ? (
            <>
              <Image
                src={rawAvatarUrl!}
                alt={name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
                onError={() => setImageError(true)}
              />
              {/* Subtle ambient vignette on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
            </>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-6">
              {/* Ambient radial aurora backglow on hover */}
              <div className="absolute w-36 h-36 rounded-full bg-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative w-28 h-28 xs:w-32 xs:h-32 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-1">
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

          {/* Top Shift Badge with Glassmorphism */}
          {shift && (
            <div className="absolute top-3 right-3 z-20">
              <Badge
                variant="secondary"
                className="text-[10px] bg-white/95 backdrop-blur-md font-bold shadow-xs border border-gray-200/90 text-gray-700 px-2.5 py-0.5 rounded-full transition-transform duration-300 group-hover:scale-105"
              >
                {shift === "FIRST_SHIFT" ? "1st Shift" : "2nd Shift"}
              </Badge>
            </div>
          )}

          {/* Bottom Role Badge with Floating Glass Style */}
          <div className="absolute bottom-3 left-3 max-w-[88%] z-20">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] border backdrop-blur-md transition-all duration-300 group-hover:scale-105 ${getRoleBadgeVariant(
                role
              )}`}
            >
              {getRoleIcon(role)}
              <span className="truncate">{ROLE_LABELS[role] || role}</span>
            </span>
          </div>
        </div>

        {/* Card Details with 3D Depth Layer */}
        <CardContent
          className="p-5 flex-1 flex flex-col justify-between space-y-4 min-w-0 bg-white relative z-20"
          style={{ transform: "translateZ(20px)" }}
        >
          <div>
            <h4
              className="text-base font-extrabold text-[#0f1f17] group-hover:text-[#0a4b32] transition-colors duration-300 leading-snug break-words line-clamp-2"
              title={name}
            >
              {name}
            </h4>
            <p
              className="text-xs sm:text-sm font-semibold text-[#0a4b32] mt-1 line-clamp-1"
              title={designation}
            >
              {designation}
            </p>

            {department && (
              <p className="text-xs text-[#5a6b62] mt-2.5 flex items-center gap-1.5 truncate group-hover:text-gray-800 transition-colors">
                <Building2 className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
                <span className="truncate font-medium" title={department.name}>
                  {department.name}
                </span>
              </p>
            )}
          </div>

          {/* Interactive Contact Actions Toolbar */}
          <div className="pt-3 border-t border-[#e2e8e4]/80 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5a6b62]">
            {email ? (
              <div className="inline-flex items-center gap-1 rounded-lg bg-[#f8faf9] border border-[#e2e8e4]/70 p-0.5 group/btn hover:border-[#0a4b32]/30 hover:bg-[#eef4f0] transition-all duration-200">
                <a
                  href={`mailto:${email}`}
                  className="px-2 py-0.5 inline-flex items-center gap-1 text-[11px] text-gray-700 hover:text-[#0a4b32] truncate max-w-[150px]"
                  title={email}
                >
                  <Mail className="w-3 h-3 shrink-0 text-[#0a4b32] group-hover/btn:scale-110 transition-transform" />
                  <span className="truncate">{email}</span>
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  title="Copy email address"
                  className="p-1 rounded-md text-gray-400 hover:text-[#0a4b32] hover:bg-white transition-colors cursor-pointer"
                >
                  {copiedEmail ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            ) : (
              <span className="text-[10px] text-gray-400 font-medium">Institutional Personnel</span>
            )}

            {phone && (
              <a
                href={`tel:${phone}`}
                className="hover:text-[#0a4b32] hover:bg-[#eef4f0] px-2.5 py-1 rounded-lg border border-[#e2e8e4]/70 hover:border-[#0a4b32]/30 transition-all duration-200 inline-flex items-center gap-1 text-[11px] font-medium text-gray-700 shrink-0 ml-auto group/phone"
                title={phone}
              >
                <Phone className="w-3 h-3 shrink-0 text-[#0a4b32] group-hover/phone:rotate-12 transition-transform duration-200" />
                <span>{phone}</span>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

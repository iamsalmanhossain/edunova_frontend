import React from "react";
import Image from "next/image";
import { Mail, Phone, Award, Building2 } from "lucide-react";
import { TeacherProfile } from "@/types/teacher";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileCardProps {
  teacher: TeacherProfile;
  featured?: boolean;
}

export default function ProfileCard({
  teacher,
  featured = false,
}: ProfileCardProps) {
  const { user, designation, qualification, department, shift, bio } = teacher;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (featured) {
    return (
      <Card className="overflow-hidden border border-[#0a4b32]/20 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-white via-white to-[#f0f7f3]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 p-4 sm:p-8 items-center">
          <div className="md:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-32 h-32 xs:w-40 xs:h-40 sm:w-52 sm:h-52 rounded-2xl overflow-hidden ring-4 ring-[#0a4b32]/10 shadow-md bg-[#e6ede8]">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  fill
                  sizes="(max-width: 768px) 160px, 208px"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#0a4b32] text-white text-2xl sm:text-3xl font-bold">
                  {initials}
                </div>
              )}
            </div>
            <div className="mt-2.5 sm:mt-3">
              <Badge variant="gold" className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold">
                Principal &amp; Head of Institute
              </Badge>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col justify-center min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2">
              <Badge variant="secondary" className="text-[11px] sm:text-xs truncate max-w-full">
                {teacher.institute?.name || "Kishoreganj Polytechnic Institute"}
              </Badge>
            </div>

            <h3 className="text-xl sm:text-3xl font-bold text-[#0f1f17] break-words">
              {user.name}
            </h3>
            <p className="text-sm sm:text-base font-semibold text-[#0a4b32] mt-0.5 sm:mt-1">
              {designation || "Principal & Institutional Head"}
            </p>
            {qualification && (
              <p className="text-xs sm:text-sm text-[#5a6b62] mt-0.5 flex items-center gap-1.5 break-words">
                <Award className="w-4 h-4 text-[#c48b28] shrink-0" />
                <span>{qualification}</span>
              </p>
            )}

            {bio && (
              <p className="mt-3 sm:mt-4 text-xs sm:text-base text-[#47554f] leading-relaxed line-clamp-3 break-words">
                &ldquo;{bio}&rdquo;
              </p>
            )}

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-[#e2e8e4] flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-[#5a6b62]">
              {user.email && (
                <a
                  href={`mailto:${user.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-[#0a4b32] transition-colors break-all"
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0a4b32] shrink-0" />
                  <span>{user.email}</span>
                </a>
              )}
              {user.phone && (
                <a
                  href={`tel:${user.phone}`}
                  className="inline-flex items-center gap-1.5 hover:text-[#0a4b32] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0a4b32] shrink-0" />
                  <span>{user.phone}</span>
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
      <div className="relative h-48 xs:h-60 w-full overflow-hidden bg-[#e6ede8]">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#f0f7f3] text-[#0a4b32] text-2xl font-bold">
            {initials}
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {shift && (
            <Badge variant="secondary" className="text-[10px] bg-white/90 backdrop-blur-xs font-semibold shadow-xs">
              {shift === "FIRST_SHIFT" ? "1st Shift" : "2nd Shift"}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 min-w-0">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-[#0f1f17] group-hover:text-[#0a4b32] transition-colors leading-snug break-words">
            {user.name}
          </h4>
          <p className="text-xs sm:text-sm font-semibold text-[#0a4b32] mt-0.5">
            {designation || "Instructor"}
          </p>
          {department && (
            <p className="text-xs text-[#5a6b62] mt-1 flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
              <span className="truncate">{department.name}</span>
            </p>
          )}
        </div>

        {qualification && (
          <div className="pt-2 border-t border-[#e2e8e4] text-xs text-[#5a6b62] flex items-center gap-1.5 truncate">
            <Award className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
            <span className="truncate">{qualification}</span>
          </div>
        )}

        <div className="pt-2 border-t border-[#e2e8e4]/70 flex items-center justify-between text-xs text-[#5a6b62]">
          {user.email && (
            <a
              href={`mailto:${user.email}`}
              className="hover:text-[#0a4b32] transition-colors inline-flex items-center gap-1 text-[11px] truncate"
            >
              <Mail className="w-3 h-3 shrink-0" />
              <span className="truncate">{user.email}</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
